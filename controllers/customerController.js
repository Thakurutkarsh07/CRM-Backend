// controllers/customerController.js
const Customer = require('../models/Customer');

// Create a new customer
exports.createCustomer = async (req, res) => {
  const { customer_id, name, email, age, gender, location, total_spent, visits, last_order_date } = req.body;
  
  try {
    const newCustomer = new Customer({
      customer_id,
      name,
      email,
      age,
      gender,
      location,
      total_spent,
      visits,
      last_order_date
    });

    await newCustomer.save();
    res.status(201).json({ message: 'Customer created successfully', customer: newCustomer });
  } catch (err) {
    res.status(500).json({ message: 'Error creating customer', error: err.message });
  }
};


// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching customers', error: err.message });
  }
};
