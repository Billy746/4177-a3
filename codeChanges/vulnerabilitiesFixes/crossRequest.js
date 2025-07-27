const csrf = require('csurf');
const cookieParser = require('cookie-parser');

// CSRF protection setup
app.use(cookieParser());
const csrfProtection = csrf({ 
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
});

// Apply CSRF protection to state-changing routes
app.use('/api/users/update', csrfProtection);
app.use('/api/orders', csrfProtection);
app.use('/api/products', csrfProtection);

// Provide CSRF token to client
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Client-side implementation
// Frontend code to include CSRF token in requests
const getCsrfToken = async () => {
  const response = await fetch('/api/csrf-token');
  const data = await response.json();
  return data.csrfToken;
};

const updateUserProfile = async (userData) => {
  const csrfToken = await getCsrfToken();
  
  const response = await fetch('/api/users/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken
    },
    body: JSON.stringify(userData)
  });
  
  return response.json();
};