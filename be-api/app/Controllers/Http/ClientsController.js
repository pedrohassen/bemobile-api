'use strict';

const Client = use('App/Models/Client');
const Sale = use('App/Models/Sale');
const Address = use('App/Models/Address');
const PhoneNumber = use('App/Models/PhoneNumber');

class ClientsController {
  async index({ response }) {
    try {

      const clients = await Client.query()
        .with('address')
        .with('phoneNumber')
        .orderBy('id', 'asc')
        .fetch();

      const formattedClients = clients.toJSON().map(client => ({
        id: client.id,
        name: client.name,
        cpf: client.cpf,
        address: client.address ? {
          address: client.address.address,
          number: client.address.number,
          complement: client.address.complement,
          city: client.address.city,
          neighborhood: client.address.neighborhood,
          state: client.address.state,
          country: client.address.country,
        } : null,
        phoneNumber: client.phoneNumber ? client.phoneNumber.number : null,
      }));

      return response.json(formattedClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      return response.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch clients',
      });
    }
  }

  async show({ params, request, response }) {
    try {
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
      console.error('Error fetching client details:', error);
      return response.status(404).json({
        error: 'Client not found',
        message: 'Failed to fetch client details',
      });
    }
  }

  async store({ request, response }) {
    try {
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
        console.log('Duplicate entry found:', existingClient.toJSON());
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

      console.log('Client Address created:', clientAddress.toJSON());

      const client = await Client.create({
        name,
        cpf,
        address_id: clientAddress.id,
      });

      console.log('Client created:', client.toJSON());

      const clientPhoneNumber = await PhoneNumber.create({
        number: phoneNumber,
        client_id: client.id,
      });
  
      console.log('Client Phone Number created:', clientPhoneNumber.toJSON());
  
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
      console.error('Error creating client:', error);
      return response.status(400).json({
        error: error.message,
        message: 'Failed to create client',
      });
    }
  }

  async update({ params, request, response }) {
    try {
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
      console.error('Error updating client:', error);
      return response.status(400).json({
        error: error.message,
        message: 'Failed to update client',
      });
    }
  }

  async detail({ params, request, response }) {
    try {
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
      console.error('Error fetching client details:', error);
      return response.status(404).json({
        error: 'Client not found',
        message: 'Failed to fetch client details',
      });
    }
  }

  async destroy({ params, response }) {
    try {
      const client = await Client.findOrFail(params.id);

      await Sale.query().where('client_id', client.id).delete();

      await client.delete();

      return response.status(200).json({
        message: 'Client deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting client:', error);

      return response.status(404).json({
        error: 'Client not found',
        message: 'Failed to delete client',
      });
    }
  }
}

module.exports = ClientsController;
