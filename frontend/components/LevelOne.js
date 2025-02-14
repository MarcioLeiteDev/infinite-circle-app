import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

export default function LevelDad() {
    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState("");
    const [users, setUsers] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get("token");

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUsername(decodedToken.name || "Usuário desconhecido");
                setUserId(decodedToken.sub || "ID não disponível");
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
                router.push("/auth/login");
            }
        } else {
            router.push("/auth/login");
        }
    }, [router]);

    useEffect(() => {
        if (!userId) return;

        async function fetchUsers() {
            try {
                const token = Cookies.get("token");

                const response = await fetch(`http://localhost:3000/user/${userId}/hierarchy`, {
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
                setUsers(data);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        }
        fetchUsers();
    }, [userId]);

    const handleLogout = () => {
        Cookies.remove("token");
        router.push("/auth/login");
    };

    return (
        <div>
            <h2>Descendentes</h2>
            <div class="row">
                {users.map((user) => (
                    <div class="col-sm-4 mb-3 mt-3 mb-sm-0">
                        <div class="card" key={user.id} >
                            <div class="card-body" >
                                <p><strong>{user.name}</strong> - {user.email}</p>
                                <p><strong>Tipo: {user.type}</strong> - Chave: {user.key}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
