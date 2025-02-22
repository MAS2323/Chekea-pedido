import express from "express";
import upload from "../middlewares/multerConfig.js";
import pedidosController from "../controllers/pedidosController.js";
import authenticateToken from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post(
  "/pedidos",
  authenticateToken,
  upload.array("images", 5),
  pedidosController.createPedido
);
router.get("/pedidos", pedidosController.getAllPedidos);
router.get(
  "/pedidos/user",
  authenticateToken,
  pedidosController.getPedidosByUserId
);
router.put(
  "/pedidos/:id",
  upload.array("images", 5),
  authenticateToken,
  pedidosController.updatePedido
);
router.delete(
  "/pedidos/:id",
  authenticateToken,
  pedidosController.deletePedido
);

export default router;
