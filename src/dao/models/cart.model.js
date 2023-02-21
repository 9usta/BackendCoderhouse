import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: String,
      },
      quantity: {
        type: Number,
      },
    },
  ],
});

export const cartModel = mongoose.model("Cart", cartSchema);
