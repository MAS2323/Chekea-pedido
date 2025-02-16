import mongoose from "mongoose";

const PedidosSchema = mongoose.Schema(
  {
    description: {
      type: String,
    },
    image: [
      {
        url: String,
        public_id: String,
      },
    ],
    quantity: {
      type: Number,
    },
    time: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Pedidos", PedidosSchema);
