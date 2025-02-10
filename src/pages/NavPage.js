import React, { useState } from 'react';
import {
  Button,
  Container,
  Form,
  Nav,
  Navbar,
  NavDropdown,
  Offcanvas,
} from 'react-bootstrap';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';

export const NavPage = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem('token');
      const response = await api.post('/user/logout');

      if (response.status === 200) {
        setUser(null);
        navigate('/');
        handleCloseOffcanvas(); // 로그아웃 후 메뉴 닫기
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <Navbar expand="md" className="bg-body-tertiary mb-3">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            Todo List
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="offcanvasNavbar"
            onClick={handleShowOffcanvas}
          />
          <Navbar.Offcanvas
            show={showOffcanvas}
            onHide={handleCloseOffcanvas}
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel">
                Todo List
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1">
                {user ? (
                  <Nav.Link as={Link} to="/" onClick={handleCloseOffcanvas}>
                    나의 할일
                  </Nav.Link>
                ) : (
                  <Nav.Link
                    as={Link}
                    to="/login"
                    onClick={handleCloseOffcanvas}
                  >
                    로그인
                  </Nav.Link>
                )}

                <NavDropdown
                  title="마이페이지"
                  id="offcanvasNavbarDropdown"
                  onSelect={(eventKey) => {
                    if (eventKey === 'logout') handleLogout();
                  }}
                >
                  {user && (
                    <NavDropdown.Header>
                      환영합니다.{' '}
                      <span style={{ color: 'orange' }}>{user.name}</span>
                    </NavDropdown.Header>
                  )}

                  <NavDropdown.Item
                    as={Link}
                    to="/register"
                    onClick={handleCloseOffcanvas}
                  >
                    {user ? '회원정보' : '회원가입'}
                  </NavDropdown.Item>

                  {user && (
                    <NavDropdown.Item eventKey="logout" onClick={handleLogout}>
                      로그아웃
                    </NavDropdown.Item>
                  )}
                </NavDropdown>
              </Nav>

              <Form className="d-flex">
                <Form.Control
                  type="search"
                  placeholder="할일 검색"
                  className="me-2"
                  aria-label="Search"
                />
                <Button variant="outline-dark">🔍</Button>
              </Form>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};
