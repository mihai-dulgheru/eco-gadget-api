import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import validator from 'validator';

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: function (value) {
        // Ensure password has numbers, letters, and special characters
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,}$/.test(value);
      },
      message: () =>
        'Password must contain at least one number, one lowercase and one uppercase letter, and one special character.',
    },
  },
});

// Hashing the password before saving it to the database
schema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', schema);

export default User;
