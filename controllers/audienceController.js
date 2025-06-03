const Customer = require('../models/Customer');
const dayjs = require('dayjs');

const operatorMap = {
  '>': '$gt',
  '>=': '$gte',
  '<': '$lt',
  '<=': '$lte',
  '=': '$eq',
  '!=': '$ne'
};

exports.getSegmentedAudience = async (req, res) => {
  try {
    const { rules, logic } = req.body;

    const filters = rules.map(rule => {
      let field = rule.field;
      let value = rule.value;

      if (field === 'last_order_date' && typeof value === 'number') {
        // Convert "90 days ago" into an actual date
        value = dayjs().subtract(value, 'day').toDate();
      }

      return {
        [field]: { [operatorMap[rule.operator]]: value }
      };
    });

    // If logic is OR, use $or; otherwise use $and for AND logic
    const query = logic === 'OR' ? { $or: filters } : { $and: filters };

    const users = await Customer.find(query); // Apply the filter query
    res.json({ count: users.length, users });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
