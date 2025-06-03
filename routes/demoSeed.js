const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');


// Seed demo customers
router.post('/', async (req, res) => {
  try {
    await Customer.deleteMany(); // Optional: clean slate
    
    const moreCustomers = [
  {
    customer_id: "CUST1006",
    name: "Priya Nair",
    email: "priya@example.com",
    age: 35,
    gender: "Female",
    location: "Hyderabad",
    total_spent: 15000,
    visits: 7,
    last_order_date: new Date("2025-01-10")
  },
  {
    customer_id: "CUST1007",
    name: "Arjun Mehta",
    email: "arjun@example.com",
    age: 28,
    gender: "Male",
    location: "Pune",
    total_spent: 8000,
    visits: 4,
    last_order_date: new Date("2024-11-05")
  },
  {
    customer_id: "CUST1008",
    name: "Meera Joshi",
    email: "meera@example.com",
    age: 31,
    gender: "Female",
    location: "Ahmedabad",
    total_spent: 9500,
    visits: 5,
    last_order_date: new Date("2025-04-10")
  },
  {
    customer_id: "CUST1009",
    name: "Karan Singh",
    email: "karan@example.com",
    age: 45,
    gender: "Male",
    location: "Jaipur",
    total_spent: 11000,
    visits: 6,
    last_order_date: new Date("2024-10-21")
  },
  {
    customer_id: "CUST1010",
    name: "Anjali Desai",
    email: "anjali@example.com",
    age: 26,
    gender: "Female",
    location: "Surat",
    total_spent: 4000,
    visits: 2,
    last_order_date: new Date("2025-03-01")
  },
  {
    customer_id: "CUST1011",
    name: "Vikram Chauhan",
    email: "vikram@example.com",
    age: 38,
    gender: "Male",
    location: "Lucknow",
    total_spent: 6000,
    visits: 3,
    last_order_date: new Date("2024-12-02")
  },
  {
    customer_id: "CUST1012",
    name: "Nisha Rao",
    email: "nisha@example.com",
    age: 30,
    gender: "Female",
    location: "Bhopal",
    total_spent: 5000,
    visits: 3,
    last_order_date: new Date("2025-05-15")
  },
  {
    customer_id: "CUST1013",
    name: "Rohit Das",
    email: "rohit@example.com",
    age: 27,
    gender: "Male",
    location: "Guwahati",
    total_spent: 3000,
    visits: 2,
    last_order_date: new Date("2025-02-18")
  },
  {
    customer_id: "CUST1014",
    name: "Ishita Ghosh",
    email: "ishita@example.com",
    age: 23,
    gender: "Female",
    location: "Patna",
    total_spent: 2000,
    visits: 1,
    last_order_date: new Date("2025-01-25")
  },
  {
    customer_id: "CUST1015",
    name: "Siddharth Iyer",
    email: "siddharth@example.com",
    age: 36,
    gender: "Male",
    location: "Nagpur",
    total_spent: 8500,
    visits: 4,
    last_order_date: new Date("2024-08-30")
  },
  {
    customer_id: "CUST1016",
    name: "Tanya Bhatia",
    email: "tanya@example.com",
    age: 34,
    gender: "Female",
    location: "Chandigarh",
    total_spent: 9500,
    visits: 5,
    last_order_date: new Date("2024-07-15")
  },
  {
    customer_id: "CUST1017",
    name: "Manav Sethi",
    email: "manav@example.com",
    age: 29,
    gender: "Male",
    location: "Coimbatore",
    total_spent: 7200,
    visits: 3,
    last_order_date: new Date("2025-03-28")
  },
  {
    customer_id: "CUST1018",
    name: "Divya Reddy",
    email: "divya@example.com",
    age: 33,
    gender: "Female",
    location: "Vijayawada",
    total_spent: 6700,
    visits: 3,
    last_order_date: new Date("2025-04-22")
  },
  {
    customer_id: "CUST1019",
    name: "Rakesh Kumar",
    email: "rakesh@example.com",
    age: 41,
    gender: "Male",
    location: "Kanpur",
    total_spent: 10000,
    visits: 5,
    last_order_date: new Date("2024-09-18")
  },
  {
    customer_id: "CUST1020",
    name: "Neha Singh",
    email: "neha@example.com",
    age: 22,
    gender: "Female",
    location: "Indore",
    total_spent: 1500,
    visits: 1,
    last_order_date: new Date("2025-05-01")
  },
  {
    customer_id: "CUST1021",
    name: "Deepak Menon",
    email: "deepak@example.com",
    age: 37,
    gender: "Male",
    location: "Trivandrum",
    total_spent: 9200,
    visits: 4,
    last_order_date: new Date("2025-01-19")
  },
  {
    customer_id: "CUST1022",
    name: "Pooja Arora",
    email: "pooja@example.com",
    age: 27,
    gender: "Female",
    location: "Amritsar",
    total_spent: 5800,
    visits: 3,
    last_order_date: new Date("2024-10-12")
  },
  {
    customer_id: "CUST1023",
    name: "Nikhil Raut",
    email: "nikhil@example.com",
    age: 39,
    gender: "Male",
    location: "Nashik",
    total_spent: 8700,
    visits: 4,
    last_order_date: new Date("2025-02-05")
  },
  {
    customer_id: "CUST1024",
    name: "Kavya Pillai",
    email: "kavya@example.com",
    age: 31,
    gender: "Female",
    location: "Mysore",
    total_spent: 7900,
    visits: 4,
    last_order_date: new Date("2025-04-14")
  },
  {
    customer_id: "CUST1025",
    name: "Aditya Narayan",
    email: "aditya@example.com",
    age: 24,
    gender: "Male",
    location: "Rajkot",
    total_spent: 3200,
    visits: 2,
    last_order_date: new Date("2025-03-08")
  }
];


    await Customer.insertMany(moreCustomers);
    res.status(200).json({ message: 'Demo customers seeded successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Seeding failed', error: err.message });
  }
});

module.exports = router;
