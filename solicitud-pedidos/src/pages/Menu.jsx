import React, { useState } from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import RequestPageIcon from "@mui/icons-material/RequestPage"; 
import ListAltIcon from "@mui/icons-material/ListAlt"; 
import SolicitarPedido from "./SolicitarPedido";
import MisPedidos from "./MisPedidos";
import "../App.css";

function Menu() {
  const [vista, setVista] = useState("solicitar");
  return (
    <div className="App">
      {/* <header className="App-header">
      <h1>Solicitud de Pedidos</h1>
    </header> */}

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
          onChange={(event, newValue) => setVista(newValue)}
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
