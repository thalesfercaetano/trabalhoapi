import cors from "cors";
import express from "express";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Tafunfando");
});


app.use("/users", userRoutes);
app.use("/posts", postRoutes);


app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});