import { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode"; // Certifique-se de que a biblioteca está instalada

export default function LevelDad() {
    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState("");
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get("token");

        if (token) {
            try {
                // Decodifica o token
                const decodedToken = jwtDecode(token);
                console.log("Decoded Token:", decodedToken); // Verifique no console

                // Atualiza o estado com as informações do usuário
                setUsername(decodedToken.name || "Usuário desconhecido");
                setUserId(decodedToken.sub || "ID não disponível");
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
                // Redireciona para a página de login em caso de erro
                router.push("/auth/login");
            }
        } else {
            // Se não houver token, redireciona para a página de login
            router.push("/auth/login");
        }
    }, [router]);

    const handleLogout = () => {
        Cookies.remove("token");
        router.push("/auth/login");
    };

    return (
        <div>
            <h2>Level Dad</h2>

            <p>O seu ID é {userId}</p>

        </div>
    );
}