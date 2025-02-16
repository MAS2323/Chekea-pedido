import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import userRouter from "./routers/userRouter.js";
import pedidosRouter from "./routers/pedidosRouter.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Servir archivos estáticos desde el directorio de "uploads"
app.use(express.static(path.join(__dirname, "public/uploads")));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", userRouter);
app.use("/", pedidosRouter);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Bases de datos conetada"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT || port, () => {
  console.log(`Node js server started. ${process.env.PORT || port}!`);
});
