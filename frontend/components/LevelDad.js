import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

export default function LevelDad() {
    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    // Verifica o token e decodifica para obter informações do usuário
    useEffect(() => {
        const token = Cookies.get("token");

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUsername(decodedToken.name || "Usuário desconhecido");
                setUserId(decodedToken.sub || "ID não disponível");
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
                setError("Erro ao autenticar. Redirecionando para login...");
                router.push("/auth/login");
            }
        } else {
            setError("Token não encontrado. Redirecionando para login...");
            router.push("/auth/login");
        }
    }, [router]);

    // Busca os usuários descendentes
    useEffect(() => {
        if (!userId) return;

        async function fetchUsers() {
            setLoading(true);
            setError("");

            try {
                const token = Cookies.get("token");

                const response = await fetch(`http://localhost:3000/user/${userId}/hierarchydesc`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Erro ao buscar usuários");
                }

                const data = await response.json();

                // Verifica se a resposta contém um array de usuários
                if (data && Array.isArray(data.data)) {
                    setUsers(data.data);
                } else {
                    throw new Error("Dados inválidos recebidos da API");
                }
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
                setError("Erro ao carregar usuários. Tente novamente mais tarde.");
                setUsers([]);
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, [userId]);

    // Função para logout
    const handleLogout = () => {
        Cookies.remove("token");
        router.push("/auth/login");
    };

    return (
        <div>
            <h2>Descendentes</h2>

            {/* Exibe mensagem de erro se houver */}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Exibe o estado de carregamento */}
            {loading ? (
                <p>Carregando...</p>
            ) : (
                <div className="row">
                    {/* Verifica se `users` é um array antes de mapear */}
                    {Array.isArray(users) && users.length > 0 ? (
                        users.map((user, index) => (
                            <div className="col-sm-4 mb-3 mt-3 mb-sm-0" key={user.id || index}>
                                <div className="card">
                                    <div className="card-body">
                                        <p><strong>{user.name}</strong> - {user.email}</p>
                                        <p><strong>Tipo: {user.type}</strong> - Chave: {user.key}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Nenhum usuário encontrado.</p>
                    )}
                </div>
            )}


        </div>
    );
}