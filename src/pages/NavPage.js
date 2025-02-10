import React from 'react';

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
  // console.log('navi user >>>>', user);
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
                {user ? (
                  <Nav.Link as={Link} to="/">
                    나의 할일
                  </Nav.Link>
                ) : (
                  <Nav.Link as={Link} to="/login">
                    로그인
                  </Nav.Link>
                )}

                <NavDropdown
                  title="마이페이지"
                  id={`offcanvasNavbarDropdown-expand-md`}
                  onSelect={(eventKey) => {
                    if (eventKey === 'logout') handleLogout();
                  }}
                >
                  {user ? (
                    <>
                      <NavDropdown.Header>
                        환영합니다.
                        <span style={{ color: 'orange' }}>{user.name}</span>
                      </NavDropdown.Header>
                    </>
                  ) : (
                    ''
                  )}
                  <NavDropdown.Item as={Link} to="/register">
                    {user ? '회원정보' : '회원가입'}
                  </NavDropdown.Item>

                  {/* <NavDropdown.Item href="/register">
                    {user ? '회원정보' : '회원가입'}
                  </NavDropdown.Item> */}
                  {user ? (
                    <NavDropdown.Item eventKey="logout" onClick={handleLogout}>
                      로그아웃
                    </NavDropdown.Item>
                  ) : (
                    ''
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
