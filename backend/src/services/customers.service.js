const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const { models } = require('../db/sequelize');

class CustomerService {

  constructor() {}

  async find() {
    const rta = await models.Customer.findAll({
      include: ['user']
    });
    return rta;
  }

  async findOne(id) {
    const user = await models.Customer.findByPk(id);
    if (!user) {
      throw boom.notFound('customer not found');
    }
    return user;
  }

  async create(data) {
    // Si viene con user data, crear usuario también
    if (data.user) {
      const hash = await bcrypt.hash(data.user.password, 10);
      const newData = {
        ...data,
        user: {
          ...data.user,
          password: hash
        }
      }
      const newCustomer = await models.Customer.create(newData, {
        include: ['user']
      });
      delete newCustomer.dataValues.user.dataValues.password;
      return newCustomer;
    } else {
      // Si solo viene customer data, crear solo customer
      const newCustomer = await models.Customer.create(data);
      return newCustomer;
    }
  }

  async update(id, changes) {
    const model = await this.findOne(id);
    const rta = await model.update(changes);
    return rta;
  }

  async delete(id) {
    const model = await this.findOne(id);
    await model.destroy();
    return { rta: true };
  }

}

module.exports = CustomerService;
