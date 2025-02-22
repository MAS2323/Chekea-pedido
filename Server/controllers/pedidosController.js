import mongoose from "mongoose";
import Pedidos from "../models/Pedidos.js";
import { uploadImage, deleteImage } from "../middlewares/cloudinary.js";
import fs from "node:fs";

// Función para crear un nuevo pedido
const createPedido = async (req, res) => {
  try {
    const { description, quantity, time } = req.body;

    // Verificar si el usuario está autenticado
    const userId = req.user?._id; 
    if (!userId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    // Validar campos obligatorios
    if (!description || !quantity || !time) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    // Subir imágenes a Cloudinary
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "Debes subir al menos una imagen." });
    }

    const folderName = "pedidos_chekea";
    const images = [];
    for (const file of req.files) {
      try {
        const result = await uploadImage(file.path, folderName);
        images.push({
          url: result.url,
          public_id: result.public_id,
        });
        fs.unlinkSync(file.path); // Eliminar archivo temporal
      } catch (error) {
        console.error("Error al subir la imagen:", error);
        // Eliminar imágenes ya subidas
        if (images.length > 0) {
          for (const image of images) {
            await deleteImage(image.public_id).catch((err) =>
              console.error("Error al eliminar imagen de Cloudinary:", err)
            );
          }
        }
        return res.status(500).json({
          error: "Error al subir la imagen a Cloudinary",
          details: error.message,
        });
      }
    }

    // Crear el pedido asociado al usuario
    const newPedido = await Pedidos.create({
      description,
      quantity,
      time,
      image: images,
      user: userId, // Asociar el pedido al usuario autenticado
    });

    res.status(201).json(newPedido);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear el pedido" });
  }
};

// Función para obtener todos los pedidos
const getAllPedidos = async (req, res) => {
  try {
    const pedidos = await Pedidos.find().sort({ _id: -1 }); 
    res.status(200).json(pedidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los pedidos" });
  }
};

const getPedidosByUserId = async (req, res) => {
  try {
    const userId = req.user?._id; // Obtener el ID del usuario autenticado
    if (!userId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    // Buscar pedidos asociados al usuario
    const pedidos = await Pedidos.find({ user: userId }).sort({ _id: -1 }); 

    res.status(200).json(pedidos);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener los pedidos del usuario" });
  }
};
// Función para actualizar un pedido
const updatePedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, quantity, time } = req.body;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de pedido no válido" });
    }

    // Obtener el pedido actual
    const existingPedido = await Pedidos.findById(id);
    if (!existingPedido) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    // Verificar que el pedido pertenezca al usuario autenticado
    if (existingPedido.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para actualizar este pedido" });
    }

    // Manejar imágenes (igual que antes)
    let updatedImages = existingPedido.image;
    if (req.files && req.files.length > 0) {
      await Promise.all(
        existingPedido.image.map(async (image) => {
          try {
            await deleteImage(image.public_id);
          } catch (error) {
            console.error(
              `Error al eliminar la imagen con public_id: ${image.public_id}`,
              error
            );
          }
        })
      );

      const folderName = "pedidos_chekea";
      updatedImages = await Promise.all(
        req.files.map(async (file) => {
          const uploadResult = await uploadImage(file.path, folderName);
          fs.unlinkSync(file.path);
          return {
            url: uploadResult.url,
            public_id: uploadResult.public_id,
          };
        })
      );
    }

    // Construir datos de actualización
    const updateData = { description, quantity, time, image: updatedImages };

    // Actualizar pedido
    const updatedPedido = await Pedidos.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    res.status(200).json(updatedPedido);
  } catch (error) {
    console.error("Error al actualizar el pedido:", error.message);
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};

// Función para eliminar un pedido
const deletePedido = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de pedido no válido" });
    }

    const pedido = await Pedidos.findById(id);
    if (!pedido) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    // Verificar que el pedido pertenezca al usuario autenticado
    if (pedido.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para eliminar este pedido" });
    }

    // Eliminar imágenes de Cloudinary
    await Promise.all(
      pedido.image.map(async (image) => {
        await deleteImage(image.public_id);
      })
    );

    // Eliminar el pedido de la base de datos
    await Pedidos.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "Pedido y sus imágenes eliminados correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el pedido" });
  }
};

export default {
  createPedido,
  getAllPedidos,
  updatePedido,
  deletePedido,
  getPedidosByUserId,
};
