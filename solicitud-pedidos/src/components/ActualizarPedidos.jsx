import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:3000";

function ActualizarPedidos() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState({
    description: "",
    time: "",
    quantity: "",
    image: [],
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const response = await axios.get(`${API_URL}/pedidos/${id}`);
        setPedido(response.data);
        setImagePreviews(response.data.image.map((img) => img.url));
      } catch (error) {
        console.error("Error al obtener el pedido:", error);
      }
    };
    fetchPedido();
  }, [id]);

  const handleChange = (e) => {
    setPedido({ ...pedido, [e.target.name]: e.target.value });
  };

  // Manejar la selección de nuevas imágenes
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = async (index, publicId) => {
    if (publicId) {
      try {
        // Eliminar la imagen de Cloudinary
        await axios.delete(`${API_URL}/cloudinary/delete`, {
          data: { public_id: publicId },
        });
      } catch (error) {
        console.error("Error al eliminar la imagen de Cloudinary:", error);
      }
    }

    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Manejar la actualización del pedido
  const handleActualizar = async () => {
    try {
      const formData = new FormData();
      formData.append("description", pedido.description);
      formData.append("time", pedido.time);
      formData.append("quantity", pedido.quantity);

      // Agregar las imágenes seleccionadas al FormData
      selectedImages.forEach((file) => {
        formData.append("images", file);
      });

      // Enviar la solicitud al servidor
      await axios.put(`${API_URL}/pedidos/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Pedido actualizado correctamente");
      navigate("/");
    } catch (error) {
      console.error("Error al actualizar el pedido:", error);
    }
  };

  // Manejar la eliminación del pedido
  const handleEliminar = async () => {
    try {
      await axios.delete(`${API_URL}/pedidos/${id}`);
      alert("Pedido eliminado correctamente");
      navigate("/");
    } catch (error) {
      console.error("Error al eliminar el pedido:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Actualizar Pedido</h2>
      <div style={styles.card}>
        {/* Sección de imágenes */}
        <div style={styles.imageSection}>
          <label style={styles.imageLabel}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              style={styles.fileInput}
            />
            <p style={styles.addImageText}>+ Añadir imágenes</p>
          </label>
          <div style={styles.imageGrid}>
            {imagePreviews.map((preview, index) => (
              <div key={index} style={styles.imageWrapper}>
                <img src={preview} alt="Preview" style={styles.image} />
                <button
                  style={styles.removeImageButton}
                  onClick={() =>
                    handleRemoveImage(index, pedido.image[index]?.public_id)
                  }
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Detalles del pedido */}
        <div style={styles.details}>
          <input
            type="text"
            name="description"
            value={pedido.description}
            onChange={handleChange}
            placeholder="Descripción"
            style={styles.input}
          />
          <input
            type="text"
            name="time"
            value={pedido.time}
            onChange={handleChange}
            placeholder="Tiempo"
            style={styles.input}
          />
          <input
            type="number"
            name="quantity"
            value={pedido.quantity}
            onChange={handleChange}
            placeholder="Cantidad"
            style={styles.input}
          />
          <div style={styles.buttonContainer}>
            <button style={styles.updateButton} onClick={handleActualizar}>
              Actualizar Pedido
            </button>
            <button style={styles.deleteButton} onClick={handleEliminar}>
              Eliminar Pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "90%",
    maxWidth: "500px",
    margin: "20px auto",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    background: "#f9f9f9",
  },
  imageSection: {
    width: "100%",
    textAlign: "center",
  },
  imageLabel: {
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "120px",
    height: "120px",
    border: "2px dashed #ccc",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  addImageText: {
    color: "#888",
    fontSize: "14px",
  },
  fileInput: {
    display: "none",
  },
  imageGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "center",
  },
  imageWrapper: {
    position: "relative",
    width: "80px",
    height: "80px",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "10px",
  },
  removeImageButton: {
    position: "absolute",
    top: "5px",
    right: "5px",
    background: "rgba(0, 0, 0, 0.7)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    fontSize: "12px",
    cursor: "pointer",
  },
  details: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  input: {
    width: "90%",
    padding: "8px",
    margin: "5px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    marginTop: "10px",
  },
  updateButton: {
    flex: 1,
    padding: "10px",
    marginRight: "5px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  deleteButton: {
    flex: 1,
    padding: "10px",
    marginLeft: "5px",
    backgroundColor: "#ff4d4d",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default ActualizarPedidos;
