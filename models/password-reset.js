import { Schema, model } from 'mongoose';

const passwordResetSchema = new Schema({
  email: { type: String, required: true },
  code: { type: Number, required: true },
  expiresAt: { type: Date, required: true },
});

const PasswordReset = model('PasswordReset', passwordResetSchema);

export default PasswordReset;
