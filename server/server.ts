import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import Razorpay from 'razorpay';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database('borrowing_system.db');

// Initialize Database Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_id INTEGER,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    price_per_day REAL,
    security_deposit REAL,
    image_url TEXT,
    FOREIGN KEY(owner_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS borrow_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER,
    borrower_id INTEGER, -- Optional for manual entries
    borrower_name TEXT, -- For manual entries
    duration_days INTEGER,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected, paid, lent, returned
    total_amount REAL,
    rating INTEGER,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    returned_at DATETIME,
    FOREIGN KEY(item_id) REFERENCES items(id),
    FOREIGN KEY(borrower_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id INTEGER,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    amount REAL,
    status TEXT,
    FOREIGN KEY(request_id) REFERENCES borrow_requests(id)
  );
`);

// Seed some initial data if empty
const userCount = db.prepare('SELECT count(*) as count FROM users').get() as { count: number };
if (userCount.count === 0) {
  db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run('Admin User', 'admin@example.com', 'password123');
  db.prepare('INSERT INTO items (owner_id, name, description, category, price_per_day, security_deposit, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
    1, 'Canon EOS R5', 'Professional mirrorless camera for high-quality photography.', 'Electronics', 50, 500, 'https://picsum.photos/seed/camera/800/600'
  );
  db.prepare('INSERT INTO items (owner_id, name, description, category, price_per_day, security_deposit, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
    1, 'Mountain Bike', 'Sturdy mountain bike for off-road adventures.', 'Sports', 20, 150, 'https://picsum.photos/seed/bike/800/600'
  );
  db.prepare('INSERT INTO items (owner_id, name, description, category, price_per_day, security_deposit, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
    1, 'Power Drill Set', 'Complete power drill set with various bits.', 'Tools', 15, 100, 'https://picsum.photos/seed/drill/800/600'
  );
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Auth Endpoints
  app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    try {
      const result = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(name, email, password);
      res.json({ id: result.lastInsertRowid, name, email });
    } catch (e) {
      res.status(400).json({ error: 'Email already exists' });
    }
  });

  app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, password) as any;
    if (user) {
      res.json({ id: user.id, name: user.name, email: user.email });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  // Items Endpoints
  app.get('/api/items', (req, res) => {
    const items = db.prepare(`
      SELECT items.*, users.name as owner_name 
      FROM items 
      JOIN users ON items.owner_id = users.id
    `).all();
    res.json(items);
  });

  app.get('/api/items/:id', (req, res) => {
    const item = db.prepare(`
      SELECT items.*, users.name as owner_name 
      FROM items 
      JOIN users ON items.owner_id = users.id
      WHERE items.id = ?
    `).get(req.params.id);
    res.json(item);
  });

  app.post('/api/items', (req, res) => {
    const { owner_id, name, description, category, price_per_day, security_deposit, image_url } = req.body;
    const result = db.prepare(`
      INSERT INTO items (owner_id, name, description, category, price_per_day, security_deposit, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(owner_id, name, description, category, price_per_day, security_deposit, image_url);
    res.json({ id: result.lastInsertRowid });
  });

  app.delete('/api/items/:id', (req, res) => {
    const { id } = req.params;
    try {
      // Start a transaction for safe deletion
      const deleteTx = db.transaction(() => {
        // 1. Delete associated payments
        db.prepare(`
          DELETE FROM payments 
          WHERE request_id IN (SELECT id FROM borrow_requests WHERE item_id = ?)
        `).run(id);
        
        // 2. Delete associated borrow requests
        db.prepare('DELETE FROM borrow_requests WHERE item_id = ?').run(id);
        
        // 3. Finally delete the item
        db.prepare('DELETE FROM items WHERE id = ?').run(id);
      });

      deleteTx();
      res.json({ success: true });
    } catch (e) {
      console.error('Delete error:', e);
      res.status(500).json({ error: 'Failed to delete item. It might be in use.' });
    }
  });

  // Borrow Endpoints
  app.post('/api/borrow', (req, res) => {
    const { item_id, borrower_id, duration_days, total_amount } = req.body;
    const result = db.prepare(`
      INSERT INTO borrow_requests (item_id, borrower_id, duration_days, total_amount)
      VALUES (?, ?, ?, ?)
    `).run(item_id, borrower_id, duration_days, total_amount);
    res.json({ id: result.lastInsertRowid });
  });

  app.get('/api/dashboard/:userId', (req, res) => {
    const userId = req.params.userId;
    const myItems = db.prepare('SELECT * FROM items WHERE owner_id = ?').all(userId);
    const borrowedItems = db.prepare(`
      SELECT borrow_requests.*, items.name as item_name, items.image_url
      FROM borrow_requests
      JOIN items ON borrow_requests.item_id = items.id
      WHERE borrow_requests.borrower_id = ?
    `).all(userId);
    const lendRequests = db.prepare(`
      SELECT borrow_requests.*, items.name as item_name, users.name as borrower_name
      FROM borrow_requests
      JOIN items ON borrow_requests.item_id = items.id
      JOIN users ON borrow_requests.borrower_id = users.id
      WHERE items.owner_id = ? AND borrow_requests.status = 'pending'
    `).all(userId);
    const activeLoans = db.prepare(`
      SELECT borrow_requests.*, items.name as item_name, users.name as borrower_name
      FROM borrow_requests
      JOIN items ON borrow_requests.item_id = items.id
      LEFT JOIN users ON borrow_requests.borrower_id = users.id
      WHERE items.owner_id = ? AND borrow_requests.status IN ('paid', 'lent')
    `).all(userId);
    const lendingHistory = db.prepare(`
      SELECT borrow_requests.*, items.name as item_name, users.name as borrower_name
      FROM borrow_requests
      JOIN items ON borrow_requests.item_id = items.id
      LEFT JOIN users ON borrow_requests.borrower_id = users.id
      WHERE items.owner_id = ? AND borrow_requests.status = 'returned'
    `).all(userId);
    res.json({ myItems, borrowedItems, lendRequests, activeLoans, lendingHistory });
  });

  app.post('/api/borrow/return', (req, res) => {
    const { requestId } = req.body;
    db.prepare("UPDATE borrow_requests SET status = 'returned', returned_at = CURRENT_TIMESTAMP WHERE id = ?").run(requestId);
    res.json({ success: true });
  });

  app.post('/api/borrow/review', (req, res) => {
    const { requestId, rating, comment } = req.body;
    db.prepare("UPDATE borrow_requests SET rating = ?, comment = ? WHERE id = ?").run(rating, comment, requestId);
    res.json({ success: true });
  });

  app.post('/api/borrow/status', (req, res) => {
    const { requestId, status } = req.body;
    db.prepare('UPDATE borrow_requests SET status = ? WHERE id = ?').run(status, requestId);
    res.json({ success: true });
  });

  // Payment Endpoints
  app.post('/api/payments/create-order', async (req, res) => {
    const { amount, requestId } = req.body;
    try {
      const options = {
        amount: Math.round(amount * 100), // amount in smallest currency unit
        currency: "INR",
        receipt: `receipt_${requestId}`,
      };
      const order = await razorpay.orders.create(options);
      res.json(order);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.post('/api/payments/verify', (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, requestId, amount } = req.body;
    // In a real app, verify signature here
    db.prepare(`
      INSERT INTO payments (request_id, razorpay_order_id, razorpay_payment_id, amount, status)
      VALUES (?, ?, ?, ?, ?)
    `).run(requestId, razorpay_order_id, razorpay_payment_id, amount, 'success');
    
    db.prepare("UPDATE borrow_requests SET status = 'paid' WHERE id = ?").run(requestId);
    
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
      root: path.join(__dirname, '../client'),
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
