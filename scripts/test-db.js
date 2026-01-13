// scripts/test-db.js
import { connectDB } from '@/lib/mongodb';

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    const conn = await connectDB();
    console.log('✅ MongoDB connected successfully!');
    console.log('Database:', conn.connection.db.databaseName);
    console.log('Host:', conn.connection.host);
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testConnection();