import React, { useState, useEffect } from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SolicitarPedido from "./SolicitarPedido";
import MisPedidos from "./MisPedidos";
import "../App.css";

function Menu() {
  // Manejo de los estados en 
  const [vista, setVista] = useState(
    localStorage.getItem("vista") || "solicitar"
  );

  useEffect(() => {
    localStorage.setItem("vista", vista);
  }, [vista]);

  return (
    <div className="App">
      <main>
        {vista === "solicitar" ? <SolicitarPedido /> : <MisPedidos />}
      </main>

      {/* Barra de navegación inferior */}
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          value={vista}
          onChange={(event, newValue) => {
            setVista(newValue);
          }}
          showLabels
        >
          <BottomNavigationAction
            label="Solicitar"
            value="solicitar"
            icon={<RequestPageIcon />}
          />
          <BottomNavigationAction
            label="Mis Pedidos"
            value="mis-pedidos"
            icon={<ListAltIcon />}
          />
        </BottomNavigation>
      </Paper>
    </div>
  );
}

export default Menu;
