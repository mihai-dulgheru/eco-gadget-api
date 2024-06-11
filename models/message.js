import { Schema, model } from 'mongoose';
import validator from 'validator';

const messageSchema = new Schema(
  {
    locationId: {
      type: Schema.Types.ObjectId,
      ref: 'RecyclingLocation',
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    message: { type: String, required: true },
    name: { type: String, required: true },
    read: { type: Boolean, default: false },
    response: { type: String },
  },
  { timestamps: true }
);

const Message = model('Message', messageSchema);

export default Message;
