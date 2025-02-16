import express from "express";
import upload from "../middlewares/multerConfig.js";
import {
  createPedido,
  getAllPedidos,
  getPedidoById,
  updatePedido,
  deletePedido,
} from "../controllers/pedidosController.js";

const router = express.Router();

router.post("/pedidos", upload.array("images", 5), createPedido);
router.get("/pedidos", getAllPedidos);
router.get("/pedidos/:id", getPedidoById);
router.put("/pedidos/:id", upload.array("images", 5), updatePedido);
router.delete("/pedidos/:id", deletePedido);

export default router;
