import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

export default function LevelDad() {
    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState("");
    const [users, setUsers] = useState([]);
    const [userData, setUserData] = useState(null);

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
        async function fetchUserHierarchy() {
            try {
                const token = Cookies.get("token");
                const response = await fetch(`http://localhost:3000/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Erro ao buscar usuário");
                }

                const data = await response.json();
                setUserData(data); // Salva os dados do usuário
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        }

        if (userId) {
            fetchUserHierarchy();
        }
    }, [userId]);


    const handleLogout = () => {
        Cookies.remove("token");
        router.push("/auth/login");
    };

    return (
        <div>
            <h2>Colaboradores Ascendentes</h2>
            {userData ? (
                <div class="row">
                    {Object.keys(userData)
                        .filter((key) => key.startsWith("n") && userData[key] && userData[key].id) // Remove valores nulos, vazios e sem ID
                        .map((key) => (
                            <div class="col-sm-4 mb-3 mt-3 mb-sm-0">
                                <div class="card" key={userData[key].id} >
                                    <div class="card-body" >
                                        <strong>{key.toUpperCase()}:</strong>
                                        <p>{userData[key].name} ({userData[key].email})</p>
                                        <p>Chave {userData[key].tipo} ({userData[key].chave})</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            ) : (
                <p>Carregando...</p>
            )
            }
        </div >
    );


}
