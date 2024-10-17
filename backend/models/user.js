const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: Number,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      // default: "", // You can set a default profile picture URL if needed
    },
    dateOfBirth: {
      type: Date,
    },
    address: [
      {
        type: Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    role: {
      type: String,
      default: "customer",
    },
    cart: [
      {
        type: Schema.Types.ObjectId,
        ref: "Cart",
      },
    ],
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Wishlist",
      },
    ],
    review: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    order: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    payment: [
      {
        type: Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],
    discount: [
      {
        type: Schema.Types.ObjectId,
        ref: "Discount",
      },
    ],
    twoFactorAuth: {
      enabled: {
        type: Boolean,
        default: false,
      },
      secret: String,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
