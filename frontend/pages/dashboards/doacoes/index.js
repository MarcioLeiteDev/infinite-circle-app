import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Container, Button, Card, Table, Modal, Form, Alert } from "react-bootstrap";
import Navbar from "../../../components/Navbar";
import LevelDad from "../../../components/LevelDad";
import LevelOne from "../../../components/LevelOne";
import LevelTwo from "../../../components/LevelTwo";
import LevelThree from "../../../components/LevelThree";
import LevelFour from "../../../components/LevelFour";
import LevelFive from "../../../components/LevelFive";
import LevelSix from "../../../components/LevelSix";
import LevelSeven from "../../../components/LevelSeven";
import LevelEight from "../../../components/LevelEight";
import LevelNine from "../../../components/LevelNine";
import LevelTen from "../../../components/LevelTen";

export default function Doacoes() {

    const handleLogout = () => {
        Cookies.remove("token");
        router.push("/auth/login");
    };

    return (
        < Container className="mt-5" >
            <Navbar />
            <Card className="p-4 shadow">
                <h3>Minha Lista de Doações  </h3>

                <hr></hr>
                <hr></hr>
                <LevelDad />
                <LevelOne />
                <LevelTwo />
                <LevelThree />
                <LevelFour />
                <LevelFive />
                <LevelSix />
                <LevelSeven />
                <LevelEight />
                <LevelNine />
                <LevelTen />

                <Button variant="danger" onClick={handleLogout}>
                    Sair
                </Button>
            </Card>
        </Container >
    )

}