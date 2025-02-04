'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Container } from 'react-bootstrap';
import Cookies from "js-cookie";
import { useRouter } from "next/router";

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
                <Navbar.Brand href="#">Navbar</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-nav" onClick={() => setExpanded(expanded ? false : "expanded")} />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="me-auto">
                        <Link className="nav-link" href="/">Home</Link>

                        <NavDropdown title="Usuarios" id="nav-dropdown">
                            <NavDropdown.Item href="#">Cadastrar</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#">Editar</NavDropdown.Item>
                            <NavDropdown.Divider />

                        </NavDropdown>
                        <Button variant="danger" onClick={handleLogout}>
                            Sair
                        </Button>
                    </Nav>

                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
