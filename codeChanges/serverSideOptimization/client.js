// Redis client setup
const redis = require('redis');
const client = redis.createClient({
  host: 'localhost',
  port: 6379,
  retry_strategy: (options) => Math.min(options.attempt * 100, 3000)
});

// Cache middleware with TTL management
const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    const key = `cache:${req.method}:${req.originalUrl}`;
    
    try {
      const cached = await client.get(key);
      if (cached) {
        console.log(`Cache hit for ${key}`);
        return res.json(JSON.parse(cached));
      }
      
      // Intercept response to cache it
      const originalJson = res.json;
      res.json = function(data) {
        if (res.statusCode === 200) {
          client.setex(key, duration, JSON.stringify(data));
          console.log(`Cached response for ${key} (TTL: ${duration}s)`);
        }
        return originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      console.error('Cache error:', error);
      next(); // Continue without caching on error
    }
  };
};

// Apply caching to API routes
app.get('/api/products', cacheMiddleware(600), async (req, res) => {
  const products = await Product.find({ active: true })
    .select('name price category image rating')
    .lean();
  res.json(products);
});

app.get('/api/users/profile/:id', cacheMiddleware(300), async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password')
    .populate('orders', 'total status createdAt')
    .lean();
  res.json(user);
});