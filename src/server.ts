import cors from "cors";
import express from "express";

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Tafunfando");
});

type users = {
    id: number;
    name: string;
    email: string;
    senha: string;
    age: number;
}

const users: users[] = [

    { id: 1, name: "Flávio", email: "flavio@flavio.com", senha: "flavio", age: 25 },
    { id: 2, name: "Thales", email: "thales@teste.com", senha: "thales123", age: 22 },
    { id: 3, name: "Mariana", email: "mariana@teste.com", senha: "mari2025", age: 28 },
    { id: 4, name: "João", email: "joao@teste.com", senha: "joao321", age: 30 },
    { id: 5, name: "Carla", email: "carla@teste.com", senha: "carla456", age: 27 },
    { id: 6, name: "Lucas", email: "lucas@teste.com", senha: "lucas789", age: 24 }

];

type post  = {    
    id: number,
    title: string,
    content: string,
    authorId: number,
    createdAt: Date,
    published: boolean,

};

app.get("/users/age-range", (req, res) => {
    const minAge = parseInt(req.query.min as string);
    const maxAge = parseInt(req.query.max as string);

    if (isNaN(minAge) || isNaN(maxAge)) {
        return res.status(400).send("Parâmetros inválidos");
    }
    const filteredUsers = users.filter(user => user.age >= minAge && user.age <= maxAge);

    return res.json(filteredUsers);

});

app.get("/users/:id", (req, res) => {

    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).send("Usuário não encontrado");
    }

    return res.json(user);


});





app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});