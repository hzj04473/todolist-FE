import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import { Link, useNavigate, Navigate } from 'react-router-dom';

import api from '../utils/api';

import { Helmet } from 'react-helmet-async';
import { NavPage } from './NavPage';

function LoginPage({ user, setUser }) {
  const [email, setEmail] = useState('hzj04473@todo.com');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState('');
  const navigation = useNavigate();
  // const [user, setUser] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      if (!email) {
        throw new Error('이메일을 입력해 주세요.');
      }
      if (!password) {
        throw new Error('비밀번호를 입력해 주세요.');
      }

      // api
      const response = await api.post('/user/login', { email, password });
      // console.log(response);

      if (response.status === 200) {
        // console.log(response.data.user, user);
        setUser(response.data.user);
        // sessionStorage 사용하여, token 저장
        sessionStorage.setItem('token', response.data.token);
        // 저장된 토큰을 header에 값을 넣어서 보냄.
        // headers {authorization : Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx}
        api.defaults.headers['authorization'] = 'Bearer ' + response.data.token;
        setError('');
        navigation('/');
      }
      // console.log(response);
      throw new Error(response);
    } catch (error) {
      setError(error.message);
    }
  };

  if (user) {
    return <Navigate to="/" />;
  }
  return (
    <>
      <Helmet>
        <title>Todo List</title>
        <title>{`Todo List | 로그인페이지`}</title>
        <meta
          name="description"
          content={`React로 만든 Todo 리스트 애플리케이션입니다.`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${process.env.PUBLIC_URL}/login`} />
        <meta name="og:title" content={`Todo List | 로그인페이지`} />
        <meta
          name="og:description"
          content={`React로 만든 Todo 리스트 애플리케이션입니다.`}
        />
        <meta name="keywords" content="todo, react, 할일 목록" />
      </Helmet>

      <Container fluid className="vh-100 p-0 bg-light">
        <NavPage user={user} setUser={setUser} />
        <Row className="justify-content-center align-items-center h-75 mx-0">
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className="bg-white p-4 rounded shadow-sm">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <Form onSubmit={handleLogin}>
                <h1 className="h3 mb-4 fw-bold text-center">로그인</h1>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className="fw-semibold">이메일</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="이메일을 입력해 주세요."
                    onChange={(event) => setEmail(event.target.value)}
                    value={email}
                    className="py-2"
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formBasicPassword">
                  <Form.Label className="fw-semibold">비밀번호</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="비밀번호를 입력해 주세요."
                    onChange={(event) => setPassword(event.target.value)}
                    value={password}
                    className="py-2"
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    className="mb-3"
                  >
                    로그인
                  </Button>
                  <p className="text-center mb-0">
                    계정이 없다면?{' '}
                    <Link to="/register" className="text-decoration-none">
                      회원가입 하기
                    </Link>
                  </p>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default LoginPage;
