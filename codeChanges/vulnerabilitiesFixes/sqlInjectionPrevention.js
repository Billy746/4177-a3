// Before: Vulnerable to SQL injection
app.get('/api/products/search', async (req, res) => {
  const searchTerm = req.query.q;
  // DANGEROUS: Direct string concatenation
  const query = `SELECT * FROM products WHERE name LIKE '%${searchTerm}%'`;
  const results = await db.query(query);
  res.json(results);
});

// After: Secure parameterized queries with input validation
const joi = require('joi');

const searchSchema = joi.object({
  q: joi.string().alphanum().min(1).max(50).required(),
  category: joi.string().valid('electronics', 'clothing', 'books').optional(),
  limit: joi.number().integer().min(1).max(100).default(20)
});

app.get('/api/products/search', async (req, res) => {
  try {
    // Validate input
    const { error, value } = searchSchema.validate(req.query);
    if (error) {
      return res.status(400).json({ 
        error: 'Invalid input parameters',
        details: error.details 
      });
    }

    const { q, category, limit } = value;
    
    // MongoDB parameterized query (safe from injection)
    const searchConditions = {
      $and: [
        { active: true },
        {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } }
          ]
        }
      ]
    };

    if (category) {
      searchConditions.$and.push({ category: category });
    }

    const products = await Product.find(searchConditions)
      .select('name price category image rating')
      .limit(limit)
      .exec();

    res.json({
      products,
      count: products.length,
      searchTerm: q
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});