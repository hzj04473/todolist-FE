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

export const NavPage = ({ user, setUser, onSearch }) => {
  const navigate = useNavigate();
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [keyword, setKeyword] = useState('');
  // const [error, setError] = useState();
  // console.log(keyword);

  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (keyword) {
      try {
        const response = await api.post(`/tasks/${keyword}`);
        if (response.status === 200) {
          onSearch(response.data.data);
          setKeyword('');
          handleCloseOffcanvas();
        } else {
          console.error('검색결과가 없습니다.');
        }
      } catch (error) {
        console.error('서버 에러');
      }
    } else {
      console.error('검색어를 입력하세요');
    }
  };

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem('token');
      const response = await api.post('/user/logout');
      if (response.status === 200) {
        setUser(null);
        navigate('/');
        handleCloseOffcanvas();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Navbar expand="md" className="bg-white shadow-sm py-3">
      <Container fluid className="px-3">
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
          Todo List
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="offcanvasNavbar"
          onClick={handleShowOffcanvas}
          className="border-0"
        />
        <Navbar.Offcanvas
          show={showOffcanvas}
          onHide={handleCloseOffcanvas}
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="end"
          className="w-75"
        >
          <Offcanvas.Header closeButton className="border-bottom">
            <Offcanvas.Title id="offcanvasNavbarLabel" className="fw-bold">
              Todo List
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="pt-3">
            <Nav className="justify-content-end flex-grow-1 gap-2 align-items-center">
              {user ? (
                <Nav.Link
                  as={Link}
                  to="/"
                  onClick={handleCloseOffcanvas}
                  className="text-dark fw-semibold"
                >
                  나의 할일
                </Nav.Link>
              ) : (
                <Nav.Link
                  as={Link}
                  to="/login"
                  onClick={handleCloseOffcanvas}
                  className="text-dark fw-semibold"
                >
                  로그인
                </Nav.Link>
              )}
              <NavDropdown
                title="마이페이지"
                id="offcanvasNavbarDropdown"
                align="end"
                className="text-dark fw-semibold"
                onSelect={(eventKey) => {
                  if (eventKey === 'logout') handleLogout();
                }}
              >
                {user && (
                  <NavDropdown.Header className="py-2">
                    환영합니다.{' '}
                    <span className="text-primary fw-semibold">
                      {user.name}
                    </span>
                  </NavDropdown.Header>
                )}
                <NavDropdown.Item
                  as={Link}
                  to="/register"
                  onClick={handleCloseOffcanvas}
                  className="py-2"
                >
                  {user ? '회원정보' : '회원가입'}
                </NavDropdown.Item>
                {user && (
                  <NavDropdown.Item
                    eventKey="logout"
                    onClick={handleLogout}
                    className="py-2 text-danger fw-semibold"
                  >
                    로그아웃
                  </NavDropdown.Item>
                )}
              </NavDropdown>
            </Nav>
            {user && (
              <>
                <Form className="d-flex mt-3 mt-md-0" onSubmit={handleSubmit}>
                  <Form.Control
                    type="search"
                    placeholder="할일 검색"
                    className="me-2 rounded-pill border-secondary-subtle"
                    aria-label="Search"
                    onChange={(event) =>
                      // setUser({ ...user, searchKeyword: event.target.value })
                      setKeyword(event.target.value)
                    }
                    value={keyword}
                  />
                  <Button
                    variant="primary"
                    type="submit"
                    className="rounded-pill px-3 fw-bold"
                  >
                    🔍
                  </Button>
                </Form>
                {/* {error && (
                  <Alert className="mt-1" variant="danger">
                    {error}
                  </Alert>
                )} */}
              </>
            )}
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};
