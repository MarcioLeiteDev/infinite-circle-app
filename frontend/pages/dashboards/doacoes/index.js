import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Container, Button, Card, Table, Modal, Form, Alert } from "react-bootstrap";
import Navbar from "../../../components/Navbar";
import LevelDad from "../../../components/LevelDad";
import LevelOne from "../../../components/LevelOne";


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


                <Button variant="danger" onClick={handleLogout}>
                    Sair
                </Button>
            </Card>
        </Container >
    )

}