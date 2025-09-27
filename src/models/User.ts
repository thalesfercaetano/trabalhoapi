export type User = {
    id: number;
    name: string;
    email: string;
    senha: string;
    age: number;
    role: string;
};

export let users: User[] = [
    { id: 1, name: "Flávio", email: "flavio@flavio.com", senha: "flavio", age: 25, role: "admin" },
    { id: 2, name: "Thales", email: "thales@teste.com", senha: "thales123", age: 20, role: "user" },
    { id: 3, name: "Mariana", email: "mariana@teste.com", senha: "mari2025", age: 28, role: "user" },
    { id: 4, name: "João", email: "joao@teste.com", senha: "joao321", age: 30, role: "user" },
    { id: 5, name: "Carla", email: "carla@teste.com", senha: "carla456", age: 27, role: "user" },
    { id: 6, name: "Lucas", email: "lucas@teste.com", senha: "lucas789", age: 24, role: "user" }
];
