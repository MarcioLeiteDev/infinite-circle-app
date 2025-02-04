"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Container, Button, Card } from "react-bootstrap";
import Navbar from "../../components/Navbar";


export default function Dashboards() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState("");

    useEffect(() => {
        const token = Cookies.get("token");

        console.log(Cookies.get("token"));

        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log("Token decodificado:", decoded);
                setUsername(decoded.name || "Usuário");
                setUserId(decoded.sub || "null");
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
            }
        } else {
            console.warn("Nenhum token encontrado!");
            router.push("/auth/login");
        }


    }, []);

    const handleLogout = () => {
        Cookies.remove("token");
        router.push("/auth/login");
    };

    return (

        < Container className="mt-5" >
            <Navbar />
            <Card className="p-4 shadow">
                <h3>Bem-vindo {username}! </h3>
                <p>O seu ID é {userId} </p>
                <Button variant="danger" onClick={handleLogout}>
                    Sair
                </Button>
            </Card>
        </Container >
    );
}
