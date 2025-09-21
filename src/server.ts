import cors from "cors";
import express from "express";

import { users } from "./bd";

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Tafunfando");
});

app.get("/users/:id", (req, res) => {

    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).send("Usuário não encontrado");
    }

});


app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});