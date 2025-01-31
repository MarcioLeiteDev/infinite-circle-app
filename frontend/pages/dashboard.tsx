import { useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { Container, Button, Card } from "react-bootstrap";

export default function Dashboard() {
    const router = useRouter();


    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            router.push("/auth/login");
        }
    }, []);

    const handleLogout = () => {
        Cookies.remove("token");
        router.push("/auth/login");
    };

    return (
        <Container className="mt-5">
            <Card className="p-4 shadow">
                <h3>Bem-vindo, Usuário</h3>
                <Button variant="danger" onClick={handleLogout}>
                    Sair
                </Button>
            </Card>
        </Container>
    );
}
