import mongoose from "mongoose";
import Pedidos from "../models/Pedidos.js";
import { uploadImage, deleteImage } from "../middlewares/cloudinary.js";
import fs from "node:fs";

// Función para crear un nuevo pedido
export const createPedido = async (req, res) => {
  try {
    const { description, quantity, time } = req.body;

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

        // Eliminar el archivo temporal
        fs.unlinkSync(file.path);
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

    if (!description || !quantity || !time) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const newPedido = await Pedidos.create({
      description,
      quantity,
      time,
      image: images,
    });

    res.status(201).json(newPedido);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear el pedido" });
  }
};

// Función para obtener todos los pedidos
export const getAllPedidos = async (req, res) => {
  try {
    const pedidos = await Pedidos.find().sort({ _id: -1 }); // Ordenar por más reciente
    res.status(200).json(pedidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los pedidos" });
  }
};

// Función para obtener un pedido por ID
export const getPedidoById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de pedido no válido" });
    }

    const pedido = await Pedidos.findById(id);

    if (!pedido) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    res.status(200).json(pedido);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el pedido" });
  }
};

// Función para actualizar un pedido
export const updatePedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, quantity, time } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de pedido no válido" });
    }

    // Obtener el pedido actual
    const existingPedido = await Pedidos.findById(id);
    if (!existingPedido) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    // Manejar imágenes
    let updatedImages = existingPedido.image;
    if (req.files && req.files.length > 0) {
      // Eliminar imágenes antiguas
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

      // Subir nuevas imágenes
      const folderName = "pedidos_chekea";
      updatedImages = await Promise.all(
        req.files.map(async (file) => {
          const uploadResult = await uploadImage(file.path, folderName);
          fs.unlinkSync(file.path); // Eliminar archivo local
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
export const deletePedido = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de pedido no válido" });
    }

    // Obtener el pedido actual
    const pedido = await Pedidos.findById(id);

    if (!pedido) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    // Eliminar las imágenes de Cloudinary
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
