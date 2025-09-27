import { Request, Response } from 'express';
import { users, User } from '../models/User';
import { posts } from '../models/Post';

export class UserController {
    // GET /users/age-range
    static getUsersByAgeRange(req: Request, res: Response) {
        const minAge = parseInt(req.query.min as string);
        const maxAge = parseInt(req.query.max as string);

        if (isNaN(minAge) || isNaN(maxAge)) {
            return res.status(400).send("Parâmetros inválidos");
        }
        const filteredUsers = users.filter(user => user.age >= minAge && user.age <= maxAge);

        return res.json(filteredUsers);
    }

    // GET /users/:id
    static getUserById(req: Request, res: Response) {
        const userId = parseInt(req.params.id);
        const user = users.find(u => u.id === userId);

        if (!user) {
            return res.status(404).send("Usuário não encontrado");
        }

        return res.json(user);
    }

    // PUT /users/:id
    static updateUser(req: Request, res: Response) {
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
    }

    // DELETE /users/cleanup-inactive
    static cleanupInactiveUsers(req: Request, res: Response) {
        const confirm = req.query.confirm;

        if(confirm !== 'true'){
            return res.status(400).send("Para confirmar a limpeza, envie 'true' no parâmetro de consulta 'confirm'");
        }   

        const usersToRemove = users.filter( user => {
            const hasPosts = posts.some( post => post.authorId === user.id);
            return !hasPosts && user.role !== "admin";
        })

        users.splice(0, users.length, ...users.filter( user => !usersToRemove.includes(user)));

        return res.status(200).json(usersToRemove);
    }
}
