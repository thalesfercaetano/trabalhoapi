import cors from "cors";
import express from "express";

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Tafunfando");
});

app.get("/posts", (req, res) => {
    return res.json(posts);
});

//BD

type users = {
    id: number;
    name: string;
    email: string;
    senha: string;
    age: number;
    role: string;
}

let users: users[] = [

    { id: 1, name: "Flávio", email: "flavio@flavio.com", senha: "flavio", age: 25, role: "admin" },
    { id: 2, name: "Thales", email: "thales@teste.com", senha: "thales123", age: 22, role: "user" },
    { id: 3, name: "Mariana", email: "mariana@teste.com", senha: "mari2025", age: 28, role: "user" },
    { id: 4, name: "João", email: "joao@teste.com", senha: "joao321", age: 30, role: "user" },
    { id: 5, name: "Carla", email: "carla@teste.com", senha: "carla456", age: 27, role: "user" },
    { id: 6, name: "Lucas", email: "lucas@teste.com", senha: "lucas789", age: 24, role: "user" }

];


type post  = {    
    id: number,
    title: string,
    content: string,
    authorId: number,
    createdAt: Date,
    published: boolean,

};

let posts: post[] = [];

//questao 2

app.get("/users/age-range", (req, res) => {
    const minAge = parseInt(req.query.min as string);
    const maxAge = parseInt(req.query.max as string);

    if (isNaN(minAge) || isNaN(maxAge)) {
        return res.status(400).send("Parâmetros inválidos");
    }
    const filteredUsers = users.filter(user => user.age >= minAge && user.age <= maxAge);

    return res.json(filteredUsers);

});

//questao 1

app.get("/users/:id", (req, res) => {

    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).send("Usuário não encontrado");
    }

    return res.json(user);


});

//questao 3


app.post("/posts", (req, res) => {

    const { title, content, authorId } = req.body;

    if (typeof title !== 'string') {
        return res.status(400).json({ error: 'Título não pode ser apenas números, deve ser compostos com caracteres.' });
    }
    if (title.length < 3) {
        return res.status(400).json({ error: 'Título deve ter pelo menos 3 caracteres.' });
    }

    if (typeof content !== 'string' || content.length < 10) {
        return res.status(400).json({ error: 'Conteúdo deve ter pelo menos 10 caracteres.' });
    }
    if (!users.some(user => user.id === authorId)) {
        return res.status(400).json({ error: 'Autor não existe.' });
    }

    if (!title || !content || !authorId) {
        return res.status(400).send("Dados incompletos");
    }   

    const newPost: post = {
        id: Date.now(),
        title,          
        content,
        authorId,
        createdAt: new Date(),
        published: false,
    };

    posts.push(newPost);

    return res.status(201).json(newPost);

});

//questao 4

app.put("/users/:id", (req, res) => {

    const { name, email, senha, age, role} = req.body;
    const userId = parseInt(req.params.id);
    
    if(!userId){
        return res.status(400).send("ID inválido");
    }

    const user = users.find(u => u.id === userId);

    if(!user){
        return res.status(404).send("Usuário não encontrado");
    }

    if (!name || !email || !role || !age || !senha) {
        return res.status(400).json({ error: 'Todos os campos devem ser fornecidos.' });
    }

    if (users.some(user => user.email === email && user.id !== userId)) {
        return res.status(409).json({ error: 'Conflito de email: já existe um usuário com esse email.' });
    }

    user.name = name;
    user.email = email;
    user.senha = senha;
    user.age = age;
    user.role = role;

    return res.json(user);

});

//questao 5

app.patch("/posts/:id", (req, res) => {

    const { title, content, published} = req.body;
    const postId = parseInt(req.params.id);

    const postVerify = posts.find(p => p.id === postId)

    if(!postId){
        return res.status(400).send("ID inválido");
    }

    console.log("essa bomba de id ta registrando?" + postId);

    if(!postVerify){
            return res.status(404).send("Post não encontrado");
    }


    if(req.body.id !== undefined || req.body.authorId !== undefined || req.body.createdAt !== undefined){

        return res.status(400).json({ error: 'Não é possível atualizar os campos id, authorId ou createdAt.' });

    }

    if (title !== undefined) {
        if (typeof title !== 'string' || title.length < 3) {
            return res.status(400).json({ error: 'Título deve ter pelo menos 3 caracteres.' });
        }

    postVerify.title = title;

    }

    if (content !== undefined) {
        if (typeof content !== 'string' || content.length < 10) {
            return res.status(400).json({ error: 'Conteúdo deve ter pelo menos 10 caracteres.' });
        }
        postVerify.content = content;
    }

    if (published !== undefined) {
        if (typeof published !== 'boolean') {
            return res.status(400).json({ error: 'O campo published deve ser booleano.' });
        }   
        postVerify.published = published;
    }

    return res.json(postVerify);

});


//questao 6

app.delete("/posts/:id", (req, res) => {

     const postId = parseInt(req.params.id);
     const userId =parseInt(req.headers['user-id'] as string);


     const postVerify = posts.find(p => p.id === postId);

    if(!postId){
        return res.status(400).send("ID inválido");
     }

     if(!postVerify){
        return res.status(404).send("Post não encontrado");
     }

     if(postVerify.authorId !== userId && users.find(u => u.id === userId)?.role !== "admin"){
        return res.status(403).send("Apenas o autor ou um admin podem deletar esse post");
     }

    posts = posts.filter(p => p.id !== postId);
    return res.status(200).json({ message: "Post foi deletado com sucesso"});

});

//questao 7
app.delete("/users/cleanup-inactive", (req, res) => {

    const confirm = req.query.confirm;

    if(confirm !== 'true'){
        return res.status(400).send("Para confirmar a limpeza, envie 'true' no parâmetro de consulta 'confirm'");
    }   

    const usersToRemove = users.filter( user => {
        const hasPosts = posts.some( post => post.authorId === user.id);
        return !hasPosts && user.role !== "admin";
    })

    users = users.filter( user => !usersToRemove.includes(user));

    return res.status(200).json({ message: `${usersToRemove.length} usuários foram removidos.`});
});


app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});