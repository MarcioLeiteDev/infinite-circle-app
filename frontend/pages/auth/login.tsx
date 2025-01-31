import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { Container, Form, Button, Card } from "react-bootstrap";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                "http://127.0.0.1:3000/auth/login", // Certifique-se de que sua API está no local correto
                { email, password },
                { withCredentials: true } // Permite envio de cookies/tokens entre domínios
            );

            // Armazena o token em um cookie
            Cookies.set("token", data.token, { expires: 1 });

            // Notificação de sucesso
            toast.success("Login realizado com sucesso!");

            // Redireciona para o dashboard
            router.push("/dashboard");
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            toast.error("Erro ao fazer login. Verifique suas credenciais.");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card style={{ width: "350px" }} className="p-4 shadow">
                <h3 className="text-center">Login</h3>
                <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Digite seu email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Senha</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Digite sua senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100">
                        Entrar
                    </Button>
                </Form>
            </Card>
        </Container>
    );
}
