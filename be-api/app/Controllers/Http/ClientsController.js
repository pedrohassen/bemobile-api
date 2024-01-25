'use strict';

const Client = use('App/Models/Client');
const Sale = use('App/Models/Sale');
const Address = use('App/Models/Address');
const PhoneNumber = use('App/Models/PhoneNumber');
const BaseController = use('App/Controllers/Http/BaseController');
const InvalidJwtToken = use('App/Exceptions/InvalidJwtToken');

class ClientsController extends BaseController {
  async index({ response, auth }) {
    try {
      await auth.check();

      const clients = await Client.query()
        .with('address')
        .with('phoneNumber')
        .orderBy('id', 'asc')
        .fetch();

      const formattedClients = clients.toJSON().map(client => ({
        id: client.id,
        name: client.name,
        cpf: client.cpf,
        address: client.address ? { ...client.address } : null,
        phoneNumber: client.phoneNumber ? client.phoneNumber.number : null,
      }));

      return response.json(formattedClients);
    } catch (error) {
      if (error instanceof InvalidJwtToken) {
        throw error;
      } else {
        return this.handleErrorResponse(response, error, 401, 'Unauthorized');
      }
    }
  }

  async show({ params, request, response, auth }) {
    try {
      await auth.check();

      const client = await Client.query()
        .with('address')
        .with('phoneNumber')
        .where('id', params.id)
        .firstOrFail();

      const { month, year } = request.only(['month', 'year']);

      const salesQuery = Sale.query().where('client_id', client.id);
      if (month && year) {
        salesQuery.whereRaw('EXTRACT(MONTH FROM date) = ? AND EXTRACT(YEAR FROM date) = ?', [month, year]);
      }

      const sales = await salesQuery.orderBy('date', 'desc').fetch();

      const addressData = client.getRelated('address') || {};
      const phoneNumberData = client.getRelated('phoneNumber') || {};

      return response.json({
        client: {
          id: client.id,
          name: client.name,
          cpf: client.cpf,
          address: addressData.address,
          number: addressData.number,
          complement: addressData.complement,
          city: addressData.city,
          neighborhood: addressData.neighborhood,
          state: addressData.state,
          country: addressData.country,
          phoneNumber: phoneNumberData.number,
          created_at: client.created_at,
          updated_at: client.updated_at,
        },
        sales,
      });
    } catch (error) {
      if (error instanceof InvalidJwtToken) {
        throw error;
      } else {
        return this.handleErrorResponse(response, error, 401, 'Unauthorized');
      }
    }
  }

  async store({ request, response, auth }) {
    try {
      await auth.check();

      const {
        name,
        cpf,
        address,
        number,
        complement,
        city,
        neighborhood,
        state,
        country,
        phoneNumber,
      } = request.only([
        'name',
        'cpf',
        'address',
        'number',
        'complement',
        'city',
        'neighborhood',
        'state',
        'country',
        'phoneNumber',
      ]);

      const existingClient = await Client.query()
        .where('name', name)
        .orWhere('cpf', cpf)
        .first();

      if (existingClient) {
        return response.status(400).json({
          error: 'Duplicate entry',
          message: 'A client with the provided data already exists.',
        });
      }

      const clientAddress = await Address.create({
        address,
        number,
        complement,
        city,
        neighborhood,
        state,
        country,
      });

      const client = await Client.create({
        name,
        cpf,
        address_id: clientAddress.id,
      });

      const clientPhoneNumber = await PhoneNumber.create({
        number: phoneNumber,
        client_id: client.id,
      });

      return response.status(201).json({
        message: 'Client created successfully',
        client: {
          id: client.id,
          name: client.name,
          cpf: client.cpf,
          address: clientAddress.address,
          number: clientAddress.number,
          complement: clientAddress.complement,
          city: clientAddress.city,
          neighborhood: clientAddress.neighborhood,
          state: clientAddress.state,
          country: clientAddress.country,
          phoneNumber: clientPhoneNumber.number,
        },
      });
    } catch (error) {
      if (error instanceof InvalidJwtToken) {
        throw error;
      } else {
        return this.handleErrorResponse(response, error, 401, 'Unauthorized');
      }
    }
  }

  async update({ params, request, response, auth }) {
    try {
      await auth.check();

      const client = await Client.findOrFail(params.id);

      const updatedData = {};

      const clientData = request.only(['name']);
      if (Object.keys(clientData).length > 0) {
        client.merge(clientData);
        await client.save();
        updatedData.name = client.name;
      }

      const addressData = request.only(['address', 'number', 'complement', 'city', 'neighborhood', 'state', 'country']);
      if (Object.keys(addressData).length > 0) {
        const clientAddress = await Address.findOrFail(client.address_id);
        clientAddress.merge(addressData);
        await clientAddress.save();
        Object.assign(updatedData, addressData);
      }

      const phoneNumberData = request.only(['phoneNumber']);
      if (Object.keys(phoneNumberData).length > 0) {
        const clientPhoneNumber = await PhoneNumber.findBy('client_id', client.id);
        if (clientPhoneNumber) {
          clientPhoneNumber.merge({ number: phoneNumberData.phoneNumber });
          await clientPhoneNumber.save();
          updatedData.phoneNumber = clientPhoneNumber.number;
        }
      }

      return response.json({
        message: 'Client updated successfully',
        id: client.id,
        name: updatedData.name,
        cpf: client.cpf,
        address: updatedData.address,
        number: updatedData.number,
        complement: updatedData.complement,
        neighborhood: updatedData.neighborhood,
        city: updatedData.city,
        state: updatedData.state,
        country: updatedData.country,
        phoneNumber: updatedData.phoneNumber,
      });
    } catch (error) {
      if (error instanceof InvalidJwtToken) {
        throw error;
      } else {
        return this.handleErrorResponse(response, error, 401, 'Unauthorized');
      }
    }
  }

  async detail({ params, request, response, auth }) {
    try {
      await auth.check();

      const client = await Client.query()
        .with('address')
        .with('phoneNumber')
        .where('id', params.id)
        .firstOrFail();

      const { month, year } = request.only(['month', 'year']);

      const salesQuery = Sale.query().where('client_id', client.id);
      if (month && year) {
        salesQuery.whereRaw('EXTRACT(MONTH FROM date) = ? AND EXTRACT(YEAR FROM date) = ?', [month, year]);
      }

      const sales = await salesQuery.orderBy('date', 'desc').fetch();

      const addressData = client.getRelated('address');
      const phoneNumberData = client.getRelated('phoneNumber');

      return response.json({
        client: {
          id: client.id,
          name: client.name,
          cpf: client.cpf,
          address: addressData.address,
          number: addressData.number,
          complement: addressData.complement,
          city: addressData.city,
          neighborhood: addressData.neighborhood,
          state: addressData.state,
          country: addressData.country,
          phoneNumber: phoneNumberData.number,
          created_at: client.created_at,
          updated_at: client.updated_at,
        },
        sales,
      });
    } catch (error) {
      if (error instanceof InvalidJwtToken) {
        throw error;
      } else {
        return this.handleErrorResponse(response, error, 401, 'Unauthorized');
      }
    }
  }

  async destroy({ params, response, auth }) {
    try {
      await auth.check();

      const client = await Client.findOrFail(params.id);

      await Sale.query().where('client_id', client.id).delete();

      await client.delete();

      return response.status(200).json({
        message: 'Client deleted successfully',
      });
    } catch (error) {
      if (error instanceof InvalidJwtToken) {
        throw error;
      } else {
        return this.handleErrorResponse(response, error, 401, 'Unauthorized');
      }
    }
  }
}

module.exports = ClientsController;
