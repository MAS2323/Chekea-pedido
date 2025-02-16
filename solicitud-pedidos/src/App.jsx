import React from "react";
import { Route, Routes } from "react-router-dom";
import Menu from "./pages/Menu";
import ActualizarPedidos from "./components/ActualizarPedidos";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/actualizar-pedido/:id" element={<ActualizarPedidos />} />
      </Routes>
    </>
  );
}

export default App;
