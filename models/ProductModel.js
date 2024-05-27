import mongoose, { Types } from "mongoose";
const productSchema = new mongoose.Schema(
  {
    place: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    bedroom: {
      type: Number,
      required: true,
    },
    bathroom: {
      type: Number,
      required: true,
    },
    hospital: {
      type: Number,
      required: false,
    },
    school: {
      type: Number,
      required: false,
    },
    likes: {
    type: Number,
    default: 0
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Products', productSchema)