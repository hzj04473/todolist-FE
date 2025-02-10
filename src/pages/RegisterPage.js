import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';

import { Row, Col, Container } from 'react-bootstrap';

import api from '../utils/api';
import { Helmet } from 'react-helmet-async';
import { NavPage } from './NavPage';

function RegisterPage({ user, setUser, keyword }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secPassword, setSecpassword] = useState('');
  const [error, setError] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  // 비밀번호 체크 유무
  const [isMath, setIsMath] = useState(false);
  const navigate = useNavigate();

  const clickPasswordcheck = async () => {
    try {
      if (user) {
        if (passwordConfirm.length === 0) {
          throw new Error('비밀번호를 확인하여 주세요.');
        }
        // console.log('비밀번호 체크');
        const response = await api.post('/user/passwordConfirm', {
          email,
          passwordConfirm,
        });
        if (response.status === 200) {
          setIsMath(response.data.isMath);
        }
      } else {
        throw new Error('현재 로그인이 되어 있지 않습니다.');
      }
    } catch (error) {
      setError(error.message);
    }
  };
  // console.log('비밀번호가 맞나요 >>> ', isMath);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (password !== secPassword) {
        throw new Error('패스워드가 일치 하지 않습니다. 다시 입력해 주세요.');
      }
      // api
      if (user) {
        const response = await api.post('/user/edit', {
          name,
          email,
          password,
          isMath,
        });

        if (response.status === 200) {
          setUser((prevUser) => ({
            ...prevUser,
            name: name, // 수정된 이름 반영
          }));

          // console.log('edit success', user);
          setPasswordConfirm('');
          setPassword('');
          setSecpassword('');
          setIsMath(false);

          // handleLogout();
          navigate('/register');
        } else {
          throw new Error(response.data.error);
        }
      } else {
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
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setError('');
    }
  }, [user]);

  useEffect(() => {
    setIsMath(false);
    setError('');
  }, [passwordConfirm]);

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
      <Container fluid className="vh-100 p-0 bg-light">
        <NavPage user={user} setUser={setUser} />
        <Row className="justify-content-center align-items-center h-75 mx-0">
          <Col xs={12} sm={8} md={6} lg={5}>
            <div className="bg-white p-4 rounded shadow-sm">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <Form onSubmit={handleSubmit}>
                <h1 className="h3 mb-4 fw-bold text-center">
                  {user ? '회원정보 수정' : '회원가입'}
                </h1>

                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label className="fw-semibold">이름</Form.Label>
                  <Form.Control
                    type="string"
                    placeholder="이름을 입력해 주세요"
                    onChange={(event) => setName(event.target.value)}
                    value={name}
                    autoComplete="off"
                    className="py-2"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className="fw-semibold">이메일</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="이메일을 입력해 주세요."
                    onChange={(event) => setEmail(event.target.value)}
                    value={email}
                    autoComplete="off"
                    disabled={user && !isMath}
                    className="py-2"
                  />
                </Form.Group>

                {user && (
                  <Form.Group className="mb-3" controlId="formConfirnPassword">
                    <Form.Label className="fw-semibold">
                      현재 비밀번호 확인
                    </Form.Label>
                    <div className="d-flex gap-2">
                      <Form.Control
                        type="password"
                        placeholder="현재 비밀번호를 입력해 주세요."
                        onChange={(event) =>
                          setPasswordConfirm(event.target.value)
                        }
                        value={passwordConfirm}
                        autoComplete="off"
                        className="py-2"
                      />
                      <Button
                        type="button"
                        variant={isMath ? 'secondary' : 'danger'}
                        className="text-nowrap px-3"
                        onClick={clickPasswordcheck}
                      >
                        {isMath ? '비밀번호 체크 완료' : '비밀번호 확인'}
                      </Button>
                    </div>
                  </Form.Group>
                )}

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label className="fw-semibold">
                    {user ? '새로운 비밀번호' : '비밀번호'}
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="비밀번호를 입력해 주세요."
                    onChange={(event) => setPassword(event.target.value)}
                    value={password}
                    autoComplete="off"
                    disabled={user && !isMath}
                    className="py-2"
                  />
                </Form.Group>

                <Form.Group
                  className="mb-4"
                  controlId="formBasicPasswordConfirm"
                >
                  <Form.Label className="fw-semibold">비밀번호 확인</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="비밀번호를 다시 한번 입력해 주세요."
                    onChange={(event) => setSecpassword(event.target.value)}
                    value={secPassword}
                    autoComplete="off"
                    disabled={user && !isMath}
                    className="py-2"
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  {user ? (
                    <>
                      <Button
                        variant="primary"
                        type="submit"
                        size="lg"
                        disabled={!isMath}
                      >
                        회원정보 수정
                      </Button>
                      <Button
                        variant="outline-danger"
                        onClick={handleLogout}
                        size="lg"
                      >
                        로그아웃
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="primary" type="submit" size="lg">
                        회원가입
                      </Button>
                      <Link
                        to="/login"
                        className="btn btn-outline-secondary btn-lg text-decoration-none"
                      >
                        로그인 페이지로 이동
                      </Link>
                    </>
                  )}
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
