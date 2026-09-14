import { Schema, model, Model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserDocument } from '../types';

export interface UserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles?: string[];
}

export interface UserRepository {
  findById(id: string): Promise<UserDocument | null>;
  findByEmail(email: string): Promise<UserDocument | null>;
  create(data: UserInput): Promise<UserDocument>;
  update(id: string, data: Partial<UserInput>): Promise<UserDocument | null>;
  delete(id: string): Promise<boolean>;
}

class User {
  private model: Model<UserDocument>;

  constructor() {
    const schema = new Schema<UserDocument>(
      {
        email: {
          type: String,
          required: true,
          unique: true,
          lowercase: true,
          trim: true,
        },
        password: {
          type: String,
          required: true,
          select: false,
        },
        firstName: {
          type: String,
          required: true,
          trim: true,
        },
        lastName: {
          type: String,
          required: true,
          trim: true,
        },
        roles: {
          type: [String],
          default: ['user'],
        },
        isActive: {
          type: Boolean,
          default: true,
        },
        lastLoginAt: {
          type: Date,
          default: null,
        },
      },
      {
        timestamps: true,
      }
    );

    schema.pre('save', async function (next) {
      // Hash password before saving
      console.log(`Pre-save hook: hashing password for user ${this.isModified('password')}`);
      if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
        console.log(`Password hashed for user ${this.password}`);
      }
      next();
    });

    this.model = model<UserDocument>('User', schema);
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.model.findById(id).select('+password').lean();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.model
      .findOne({ email, isActive: true })
      .select('+password')
      .lean();
  }

  async create(data: UserInput): Promise<UserDocument> {
    const user = new this.model({
      ...data,
      roles: data.roles || ['user'],
    });
    return user.save();
  }

  async update(id: string, data: Partial<UserInput>): Promise<UserDocument | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndUpdate(id, { isActive: false });
    return result !== null;
  }
}

export const userRepository = new User();
