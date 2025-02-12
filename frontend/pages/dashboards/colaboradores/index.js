import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Container, Button, Card, Table, Modal, Form, Alert } from "react-bootstrap";
import Navbar from "../../../components/Navbar";
import Colaboradores from "../../../components/Colaboradores";
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
                <h3> <i class="bi bi-person"></i> Colaboradores  </h3>
                <hr></hr>
                <Colaboradores />

                <Button variant="danger" onClick={handleLogout}>
                    Sair
                </Button>
            </Card>
        </Container >
    )

}