import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Container, Button, Card, Table, Modal, Form, Alert } from "react-bootstrap";
import Navbar from "../../../components/Navbar";

export default function Usuarios() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [newUser, setNewUser] = useState({ name: "", email: "", tipo: "", chave: "" });
    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState("");
    const [apiMessage, setApiMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("success");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);



    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const fetchUsers = async (page = 1) => {
        setLoading(true);
        try {
            const token = Cookies.get("token");
            const response = await fetch(`http://localhost:3000/user?page=${page}&limit=10`, {
                headers: { "Authorization": `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Erro ao buscar usuários");
            const data = await response.json();
            setUsers(data.data);
            setTotalPages(Math.ceil(data.total / data.limit)); // Calcula total de páginas
            setCurrentPage(page);
        } catch (error) {
            setError("Erro ao carregar os usuários.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        Cookies.remove("token");
        router.push("/auth/login");
    };

    const handleShowModal = (user = null) => {
        setEditingUser(user);
        setNewUser(user ? { name: user.name, email: user.email, password: "" } : { name: "", email: "", password: "" });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setEditingUser(null);
        setShowModal(false);
    };

    const handleInputChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        const token = Cookies.get("token");
        const method = editingUser ? "PUT" : "POST";
        const url = editingUser ? `http://localhost:3000/user/${editingUser.id}` : "http://localhost:3000/user";
        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ ...newUser, n1: userId }),
            });
            const responseData = await response.json();
            if (response.ok) {
                setAlertVariant("success");
                setApiMessage(responseData.message || "Operação realizada com sucesso!");
                handleCloseModal();
                fetchUsers();
            } else {
                setAlertVariant("danger");
                setApiMessage(responseData.message || "Erro ao processar solicitação.");
            }
        } catch (error) {
            setAlertVariant("danger");
            setApiMessage("Erro ao processar solicitação.");
        }
    };

    const handleDeleteUser = async (id) => {
        if (!confirm("Tem certeza que deseja excluir este usuário?")) return;
        const token = Cookies.get("token");
        try {
            const response = await fetch(`http://localhost:3000/user/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` },
            });
            if (response.ok) {
                setApiMessage("Usuário removido com sucesso!");
                setAlertVariant("success");
                fetchUsers();
            } else {
                setApiMessage("Erro ao remover usuário.");
                setAlertVariant("danger");
            }
        } catch (error) {
            setApiMessage("Erro ao remover usuário.");
            setAlertVariant("danger");
        }
    };

    return (
        <Container className="mt-5">
            <Navbar />
            <Card className="p-4 shadow">
                <h2>Cadastro de Novos Usuários</h2>
                <hr />
                {apiMessage && <Alert variant={alertVariant} onClose={() => setApiMessage("")} dismissible>{apiMessage}</Alert>}
                <div className="d-flex justify-content-end">
                    <Button variant="primary" onClick={() => handleShowModal()} className="mb-3">+ Cadastrar Usuário</Button>
                </div>
                {loading ? (
                    <p>Carregando...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <Table striped bordered hover>
                        {/* <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <Button variant="success" className="me-2" onClick={() => handleShowModal(user)}>Editar</Button>
                                        <Button variant="danger" onClick={() => handleDeleteUser(user.id)}>Remover</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody> */}
                    </Table>


                )}



                <hr></hr>
                <Button variant="danger" onClick={handleLogout} className="mb-3">Sair</Button>
            </Card>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingUser ? "Editar Usuário" : "Cadastrar Usuário"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUserSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control type="text" name="name" value={newUser.name} onChange={handleInputChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" value={newUser.email} onChange={handleInputChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Tipo de Chave</Form.Label>
                            <Form.Select
                                name="tipo"
                                value={newUser.tipo}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Selecione o tipo de chave</option>
                                <option value="email">E-mail</option>
                                <option value="celular">Celular</option>
                                <option value="aleatoria">Aleatória</option>
                                <option value="cnpj">CNPJ</option>
                                <option value="cpf">CPF</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Chave Pix</Form.Label>
                            <Form.Control type="chave" name="chave" value={newUser.chave} onChange={handleInputChange} required />
                        </Form.Group>
                        <Button variant="primary" type="submit">Salvar</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}
