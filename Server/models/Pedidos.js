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
      type: String,
    },
    time: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Pedidos", PedidosSchema);
