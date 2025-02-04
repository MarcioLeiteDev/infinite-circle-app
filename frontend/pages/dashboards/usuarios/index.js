import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Container, Button, Card, Table } from "react-bootstrap";
import Navbar from "../../../components/Navbar";

export default function Usuarios() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState("");
    const [users, setUsers] = useState([]); // Estado para armazenar os usuários
    const [loading, setLoading] = useState(true); // Estado para controle de loading
    const [error, setError] = useState(""); // Estado para controle de erro

    useEffect(() => {
        const token = Cookies.get("token");

        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUsername(decoded.name || "Usuário");
                setUserId(decoded.sub || "null");
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
            }
        } else {
            router.push("/auth/login");
        }

        // Função para buscar usuários
        const fetchUsers = async () => {
            try {
                const response = await fetch("http://localhost:3000/user", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`, // Enviar o token no cabeçalho, se necessário
                    },
                });
                if (!response.ok) {
                    throw new Error("Erro ao buscar usuários");
                }
                const data = await response.json();
                setUsers(data); // Armazenar os usuários no estado
            } catch (error) {
                setError("Erro ao carregar os usuários.");
                console.error(error);
            } finally {
                setLoading(false); // Finaliza o loading
            }
        };

        fetchUsers();
    }, [router]);

    const handleLogout = () => {
        Cookies.remove("token");
        router.push("/auth/login");
    };

    return (
        <Container className="mt-5">
            <Navbar />
            <Card className="p-4 shadow">
                <h2>Listagem de Usuários</h2>
                <hr />
                <Button variant="danger" onClick={handleLogout}>
                    Sair
                </Button>

                {loading ? (
                    <p>Carregando...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <Table striped bordered hover className="mt-4">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Editar</th>
                                <th>Deletar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>Editar</td>
                                    <td>Excluir</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Card>
        </Container>
    );
}
