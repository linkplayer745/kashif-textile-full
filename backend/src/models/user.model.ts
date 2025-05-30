import mongoose, { Document, Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import toJSON from './plugins/toJSON.plugin';
export interface IUser {
  name?: string;
  email: string;
  password: string;
  isBlocked: boolean;
  details: {
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
}

export interface IUserDocument extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDocument> {
  isEmailTaken(email: string, excludeUserId?: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUserDocument, IUserModel>(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
    details: {
      type: Object,
      properties: {
        phone: { type: String },
        address: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
        postalCode: { type: String },
      },
    },
  },
  {
    timestamps: true,
  },
);

// 5. Static method definition
userSchema.statics.isEmailTaken = async function (
  email: string,
  excludeUserId?: string,
): Promise<boolean> {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.methods.isPasswordMatch = async function (password: string) {
  const user = this;
  return bcrypt.compare(password, user.password);
};
userSchema.plugin(toJSON);
const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);

export default User;
