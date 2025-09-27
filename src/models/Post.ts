export type Post = {    
    id: number,
    title: string,
    content: string,
    authorId: number,
    createdAt: Date,
    published: boolean,
};

export let posts: Post[] = [];
