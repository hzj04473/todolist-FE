import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import api from '../utils/api';
import { useNavigate, Navigate } from 'react-router-dom';

export const NavPage = ({ user, setUser }) => {
  console.log('navi user >>>>', user);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      sessionStorage.removeItem('token');
      const response = await api.post('/user/logout');

      if (response.status === 200) {
        setUser(null);
        navigate('/'); // 로그아웃 후 '/' 경로로 리디렉션
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <Navbar key={`md`} expand={`md`} className="bg-body-tertiary mb-3">
        <Container fluid>
          <Navbar.Brand href="/">Todo List</Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-md`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-md`}
            aria-labelledby={`offcanvasNavbarLabel-expand-md`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-md`}>
                Todo List
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1">
                <Nav.Link href="/">나의 할일</Nav.Link>

                <NavDropdown
                  title="마이페이지"
                  id={`offcanvasNavbarDropdown-expand-md`}
                  onSelect={(eventKey) => {
                    if (eventKey === 'logout') handleLogout();
                  }}
                >
                  <NavDropdown.Item href="/register">회원정보</NavDropdown.Item>
                  <NavDropdown.Item eventKey="logout" onClick={handleLogout}>
                    로그아웃
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>

              <Form className="d-flex">
                <Form.Control
                  type="search"
                  placeholder="할일 검색"
                  className="me-2"
                  aria-label="Search"
                />
                <Button variant="outline-dark">🔎</Button>
              </Form>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};
