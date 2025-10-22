const express = require('express');
const passport = require('passport');

const OrderService = require('../services/order.service');
const UserService = require('../services/user.service');
const CustomerService = require('../services/customers.service');

const router = express.Router();
const orderService = new OrderService();
const userService = new UserService();
const customerService = new CustomerService();

router.get('/my-orders',
  passport.authenticate('jwt', {session: false}),
  async (req, res, next) => {
    try {
      const user = req.user;
      const orders = await orderService.findByUser(user.sub);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/my-user',
  passport.authenticate('jwt', {session: false}),
  async (req, res, next) => {
    try {
      const userPayload = req.user;
      const user = await userService.findOne(userPayload.sub);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/create-customer',
  passport.authenticate('jwt', {session: false}),
  async (req, res, next) => {
    try {
      const userPayload = req.user;
      const { name, lastName, phone } = req.body;
      
      // Verificar si ya tiene un customer
      const user = await userService.findOne(userPayload.sub);
      if (user.customer) {
        return res.json({ message: 'User already has a customer profile', customer: user.customer });
      }
      
      // Crear customer
      const customerData = {
        name,
        lastName,
        phone,
        userId: userPayload.sub
      };
      
      const customer = await customerService.create(customerData);
      res.status(201).json(customer);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
