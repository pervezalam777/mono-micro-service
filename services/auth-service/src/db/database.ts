import mongoose, { Connection } from 'mongoose';

interface DatabaseConfig {
  uri: string;
  name: string;
}

class DatabaseService {
  private connection: Connection | null = null;
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    try {
      await mongoose.connect(this.config.uri, {
        dbName: this.config.name,
        maxPoolSize: 10,
        minPoolSize: 5,
      });
      this.connection = mongoose.connection;
      console.log(`Connected to MongoDB: ${this.config.name}`);
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await mongoose.disconnect();
      this.connection = null;
      console.log('Disconnected from MongoDB');
    }
  }

  getConnection(): Connection | null {
    return this.connection;
  }
}

export const dbService = new DatabaseService({
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  name: process.env.MONGODB_NAME || 'auth-db',
});
