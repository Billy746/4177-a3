// MongoDB index creation script
const createIndexes = async () => {
  const db = client.db('ecommerce');
  
  // Products collection indexes
  await db.collection('products').createIndex(
    { category: 1, price: 1 }, 
    { name: 'category_price_idx', background: true }
  );
  
  await db.collection('products').createIndex(
    { name: 'text', description: 'text' },
    { name: 'text_search_idx', background: true }
  );
  
  await db.collection('products').createIndex(
    { active: 1, createdAt: -1 },
    { name: 'active_created_idx', background: true }
  );
  
  // Users collection indexes
  await db.collection('users').createIndex(
    { email: 1 }, 
    { name: 'email_idx', unique: true, background: true }
  );
  
  // Orders collection indexes
  await db.collection('orders').createIndex(
    { userId: 1, createdAt: -1 },
    { name: 'user_orders_idx', background: true }
  );
  
  await db.collection('orders').createIndex(
    { status: 1, createdAt: -1 },
    { name: 'status_date_idx', background: true }
  );
  
  console.log('All indexes created successfully');
};