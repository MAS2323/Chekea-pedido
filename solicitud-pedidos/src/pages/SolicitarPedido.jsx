import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000";

function SolicitarPedido() {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [time, setTime] = useState("");
  const [images, setImages] = useState([]);

  // Manejo de cambio de imagen
  const handleImagenChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  // Función para enviar datos al backend
  const enviarSolicitud = async (e) => {
    e.preventDefault();

    if (!description || !quantity || !time || images.length === 0) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const formData = new FormData();
    formData.append("description", description);
    formData.append("quantity", quantity);
    formData.append("time", time);
    images.forEach((img) => formData.append("images", img));

    try {
      await axios.post(`${API_URL}/pedidos`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Pedido solicitado correctamente.");
      setDescription("");
      setQuantity(1);
      setTime("");
      setImages([]);
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      alert("Hubo un error al enviar el pedido.");
    }
  };
  const handleSubmit = () => {
    console.log("submit");
  };
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Solicitar Pedido</h2>
      <form onSubmit={enviarSolicitud} style={styles.form}>
        <textarea
          type="text"
          placeholder="Descripción del Pedido"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={styles.input}
        ></textarea>

        <input
          type="number"
          placeholder="Cantidad"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="1"
          required
          style={styles.input}
        />

        <input
          type="number"
          placeholder="Tiempo Estimado (días)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          min="1"
          required
          style={styles.input}
        />

        {/* Botón de imagen interactivo */}
        <label style={styles.imageLabel}>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagenChange}
            style={styles.fileInput}
          />
          {images.length > 0 ? (
            <img
              src={URL.createObjectURL(images[0])}
              alt="Seleccionar"
              style={styles.avatar}
            />
          ) : (
            <div style={styles.avatarPlaceholder}>+</div>
          )}
        </label>

        <button type="submit" style={styles.submitButton}>
          Enviar Solicitud
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    width: "90%",
    maxWidth: "400px",
    margin: "20px auto",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  imageLabel: {
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    backgroundColor: "#f0f0f0",
    border: "2px dashed #ccc",
    marginBottom: "10px",
    overflow: "hidden",
  },
  fileInput: {
    display: "none",
  },
  avatar: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "50%",
  },
  avatarPlaceholder: {
    fontSize: "40px",
    color: "#aaa",
    fontWeight: "bold",
  },
  imagePreviewContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "center",
    marginTop: "10px",
  },
  imagePreview: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "10px",
    border: "1px solid #ddd",
  },
  textarea: {
    width: "100%",
    minHeight: "100px",
    maxHeight: "200px",
    overflowY: "auto",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
    resize: "vertical",
  },
  submitButton: {
    marginTop: "10px",
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default SolicitarPedido;
