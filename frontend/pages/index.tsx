import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { Container, Form, Button, Card } from "react-bootstrap";
import Image from 'next/image';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:3000/auth/login",
        { email, password },
        {
          withCredentials: true, // Garante o envio e recebimento de cookies/tokens
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Armazena o token em um cookie
      Cookies.set("token", data.token, { expires: 1 });

      // Notificação de sucesso
      toast.success("Login realizado com sucesso!");

      // Redireciona para o dashboard
      router.push("/dashboards");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error("Erro ao fazer login. Verifique suas credenciais.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "350px" }} className="p-4 shadow">
        {/* Centralizando a imagem corretamente */}
        <div className="d-flex justify-content-center">
          <Image src="/image/logo.jpg" alt="Logo" width={200} height={200} />
        </div>

        <h3 className="text-center">Infinity Circle</h3>
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
    </Container >
  );
}
