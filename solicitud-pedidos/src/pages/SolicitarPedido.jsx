import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://169.254.192.108:3000";

function SolicitarPedido() {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [time, setTime] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleImagenChange = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      setErrorMessage("Solo puedes subir un máximo de 5 imágenes.");
      return;
    }

    setImages((prevImages) => [...prevImages, ...files]);
    setErrorMessage(""); // Limpiar el mensaje de error si la selección es válida
  };

  const eliminarImagen = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const enviarSolicitud = async (e) => {
    e.preventDefault();

    if (!description || !quantity || !time || images.length === 0) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);

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
      setQuantity("");
      setTime("");
      setImages([]);
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      alert("Hubo un error al enviar el pedido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Solicitar Pedido</h2>
      {loading && <p style={styles.loadingText}>Cargando...</p>}
      {errorMessage && <p style={styles.errorText}>{errorMessage}</p>}

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
          type="text"
          placeholder="Cantidad"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Tiempo Estimado (días)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          style={styles.input}
        />

        {/* Selector de imágenes con avatar */}
        <label style={styles.imageLabel}>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagenChange}
            style={styles.fileInput}
          />
          <div style={styles.avatarPlaceholder}>+</div>
        </label>

        {/* Previsualización de imágenes con opción de eliminar */}
        {images.length > 0 && (
          <div style={styles.imageGrid}>
            {images.map((image, index) => (
              <div key={index} style={styles.imageContainer}>
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Imagen ${index + 1}`}
                  style={styles.imagePreview}
                />
                <button
                  type="button"
                  onClick={() => eliminarImagen(index)}
                  style={styles.deleteButton}
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        )}

        <button type="submit" style={styles.submitButton} disabled={loading}>
          {loading ? "Enviando..." : "Enviar Solicitud"}
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
  fileInput: {
    display: "none",
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
    position: "relative",
  },
  avatarPlaceholder: {
    fontSize: "40px",
    color: "#aaa",
    fontWeight: "bold",
  },
  imageGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "center",
    marginBottom: "10px",
  },
  imageContainer: {
    position: "relative",
    display: "inline-block",
  },
  imagePreview: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "50%",
    border: "2px solid #ccc",
  },
  deleteButton: {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    cursor: "pointer",
    fontSize: "14px",
    lineHeight: "16px",
    textAlign: "center",
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
  loadingText: {
    fontSize: "16px",
    color: "#ff6600",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  errorText: {
    fontSize: "14px",
    color: "red",
    fontWeight: "bold",
    marginBottom: "10px",
  },
};

export default SolicitarPedido;
