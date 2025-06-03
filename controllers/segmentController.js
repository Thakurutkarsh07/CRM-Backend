const Customer = require('../models/Customer');

const applyRules = (customer, rules, logic) => {
  const conditions = rules.map(rule => {
    const value = customer[rule.field];

    switch (rule.operator) {
      case '>': return value > rule.value;
      case '<': return value < rule.value;
      case '>=': return value >= rule.value;
      case '<=': return value <= rule.value;
      case '==': return value == rule.value;
      case '!=': return value != rule.value;
      default: return false;
    }
  });

  return logic === 'AND' ? conditions.every(Boolean) : conditions.some(Boolean);
};

exports.previewSegment = async (req, res) => {
  const { rules, logic } = req.body;

  if (!rules || !Array.isArray(rules) || !logic) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    const customers = await Customer.find({});
    const matched = customers.filter(cust => applyRules(cust, rules, logic));

    res.status(200).json({
      count: matched.length,
      users: matched
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
