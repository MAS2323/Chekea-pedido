import mongoose from "mongoose";

const PedidosSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true, 
    },
    image: [
      {
        url: String,
        public_id: String,
      },
    ],
    quantity: {
      type: String,
      required: true, 
    },
    time: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Pedidos", PedidosSchema);
