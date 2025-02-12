'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar, Nav, NavDropdown, Button, Container } from 'react-bootstrap';
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Image from 'next/image';

export default function NavigationBar() {
    const [expanded, setExpanded] = useState(false);
    const router = useRouter();

    const handleLogout = () => {
        Cookies.remove("token");
        router.push("/");
    };

    return (
        <Navbar expanded={expanded} expand="lg" bg="light" variant="light" className="shadow-sm">
            <Container>
                <Navbar.Brand href="#">
                    <Image src="/image/logo.jpg" alt="Descrição da imagem" width={75} height={75} /></Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-nav" onClick={() => setExpanded(expanded ? false : "expanded")} />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="me-auto">
                        {/* Link para a página inicial */}
                        <Link href="/dashboards" passHref legacyBehavior>
                            <Nav.Link>Home</Nav.Link>
                        </Link>
                        <Link href="/dashboards/usuarios" passHref legacyBehavior>
                            <Nav.Link>Usuarios</Nav.Link>
                        </Link>
                        <Link href="/dashboards/doacoes" passHref legacyBehavior>
                            <Nav.Link>Doações</Nav.Link>
                        </Link>

                        {/* Botão de Sair */}
                        <Button variant="danger" onClick={handleLogout}>
                            Sair
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}