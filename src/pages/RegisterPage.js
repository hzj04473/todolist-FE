import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import api from '../utils/api';
import { Helmet } from 'react-helmet-async';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secPassword, setSecpassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (password !== secPassword) {
        throw new Error('패스워드가 일치 하지 않습니다. 다시 입력해 주세요.');
      }
      // api
      const response = await api.post('/user', {
        name,
        email,
        password,
      });
      // console.log(response);
      if (response.status === 201) {
        navigate('/login');
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>Todo List</title>
        <title>{`Todo List | 회원가입 페이지`}</title>
        <meta
          name="description"
          content={`React로 만든 Todo 리스트 애플리케이션입니다.`}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`${process.env.PUBLIC_URL}/register`}
        />
        <meta name="og:title" content={`Todo List | 회원가입 페이지`} />
        <meta
          name="og:description"
          content={`React로 만든 Todo 리스트 애플리케이션입니다.`}
        />
        <meta name="keywords" content="todo, react, 할일 목록" />
      </Helmet>
      <Container>
        <Row>
          <Col>
            <div className="display-center">
              {error && <div className="red-error">{error}</div>}
              <Form className="login-box" onSubmit={handleSubmit}>
                <h1>회원가입</h1>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>이름</Form.Label>
                  <Form.Control
                    type="string"
                    placeholder="이름을 입력해 주세요"
                    onChange={(event) => setName(event.target.value)}
                    value={name}
                    autoComplete="off"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>이메일</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="이메일을 입력해 주세요."
                    onChange={(event) => setEmail(event.target.value)}
                    value={email}
                    autoComplete="off"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>비밀번호</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="비밀번호를 입력해 주세요."
                    onChange={(event) => setPassword(event.target.value)}
                    value={password}
                    autoComplete="off"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>비밀번호 확인</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="비밀번호를 다시 한번 입력해 주세요."
                    onChange={(event) => setSecpassword(event.target.value)}
                    value={secPassword}
                    autoComplete="off"
                  />
                </Form.Group>
                <div className="button-box">
                  <Button className="button-primary" type="submit">
                    회원가입
                  </Button>
                  <span>
                    <Link to="/login">로그인 페이지로 이동</Link>
                  </span>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default RegisterPage;
