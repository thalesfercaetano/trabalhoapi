import { Request, Response } from 'express';
import { posts, Post } from '../models/Post';
import { users } from '../models/User';

export class PostController {
    // GET /posts
    static getPosts(req: Request, res: Response) {
        return res.json(posts);
    }

    // POST /posts
    static createPost(req: Request, res: Response) {
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

        const newPost: Post = {
            id: Date.now(),
            title,          
            content,
            authorId,
            createdAt: new Date(),
            published: false,
        };

        posts.push(newPost);

        return res.status(201).json(newPost);
    }

    // PATCH /posts/:id
    static updatePost(req: Request, res: Response) {
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
    }

    // DELETE /posts/:id
    static deletePost(req: Request, res: Response) {
        const postId = parseInt(req.params.id);
        const userId = parseInt(req.headers['user-id'] as string);

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

        const postIndex = posts.findIndex(p => p.id === postId);
        posts.splice(postIndex, 1);
        
        return res.status(200).json({ message: "Post foi deletado com sucesso"});
    }
}
