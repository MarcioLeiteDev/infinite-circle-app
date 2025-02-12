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
                <h3>Bem-vindo {username}!</h3>

                <h5>Seja bem-vindo à maior comunidade colaborativa da atualidade</h5>
                <hr />
                <h4>Apresentação: Benefícios de uma Sociedade Colaborativa Baseada em Doações Financeiras Mútuas</h4>
                <p>Uma sociedade colaborativa onde as pessoas doam dinheiro umas para as outras promove a solidariedade, a sustentabilidade financeira e o crescimento coletivo. Esse modelo fortalece laços comunitários e cria um sistema de apoio mútuo, permitindo que todos prosperem juntos.</p>

                <h5>Como Funciona</h5>
                <p>Cada participante indica 3 pessoas e doa R$ 5 mensais para esses novos cadastrados. Esses novos membros, por sua vez, cadastram mais 3 amigos, criando uma rede progressiva de colaboração. Seu nome entrará na lista dos indicados no segundo nível, e esse ciclo continuará até o 10º nível.</p>
                <p>As doações são voluntárias e feitas diretamente via PIX, sem intermediários. Com essa progressão geométrica, a projeção é que em 10 meses você tenha 88.543 pessoas na sua rede, garantindo um sistema sustentável e colaborativo de apoio financeiro mútuo.</p>

                <h5>Benefícios Principais</h5>
                <ul>
                    <li><strong>Solidariedade e Cooperação:</strong> Estimula um espírito de união e apoio entre os participantes. Promove a cultura da generosidade e do compartilhamento de recursos.</li>
                    <li><strong>Inclusão Financeira:</strong> Permite que pessoas sem acesso a crédito bancário recebam apoio financeiro. Reduz a dependência de empréstimos com juros altos.</li>
                    <li><strong>Desenvolvimento Sustentável:</strong> Possibilita que indivíduos e pequenos empreendedores financiem projetos. Estimula o crescimento econômico local e a autonomia financeira.</li>
                    <li><strong>Fortalecimento da Comunidade:</strong> Cria redes de apoio onde os participantes se ajudam mutuamente. Gera confiança e conexões mais profundas entre as pessoas.</li>
                    <li><strong>Modelo Simples e Acessível:</strong> Dispensa intermediários financeiros e burocracias. Facilita transações rápidas e transparentes.</li>
                </ul>

                <h5>Conclusão</h5>
                <p>Uma sociedade baseada na colaboração financeira mútua permite que mais pessoas alcancem estabilidade econômica e qualidade de vida. Ao contribuir e receber apoio, cada indivíduo participa ativamente da construção de um sistema mais justo e solidário. Juntos, podemos transformar a economia e fortalecer comunidades!</p>

                <Button variant="danger" onClick={handleLogout}>
                    Sair
                </Button>
            </Card>
        </Container >
    );
}
