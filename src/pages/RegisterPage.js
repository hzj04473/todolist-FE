import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';

import { Row, Col, Container } from 'react-bootstrap';

import api from '../utils/api';
import { Helmet } from 'react-helmet-async';

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
      <Container className="mt-2">
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
                    disabled={user && !isMath}
                  />
                </Form.Group>
                {user ? (
                  <>
                    <Form.Group
                      className="mb-3"
                      controlId="formConfirnPassword"
                    >
                      <Form.Label>비밀번호 확인</Form.Label>
                      <div className="d-flex align-items-center">
                        <Form.Control
                          type="password"
                          placeholder="비밀번호를 입력해 주세요."
                          onChange={(event) =>
                            setPasswordConfirm(event.target.value)
                          }
                          value={passwordConfirm}
                          autoComplete="off"
                          className="me-2 flex-grow-1" // 버튼과 간격 추가
                        />

                        {isMath ? (
                          <>
                            <Button
                              type="button"
                              style={{
                                backgroundColor: '#efefef',
                                color: 'white',
                                border: 'none',
                              }}
                              className="button-primary text-nowrap px-3"
                              onClick={() => clickPasswordcheck()}
                            >
                              비밀번호 체크 완료
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              type="button"
                              style={{
                                backgroundColor: '#ff5733',
                                color: 'white',
                                border: 'none',
                              }}
                              className="button-primary text-nowrap px-3"
                              onClick={() => clickPasswordcheck()}
                            >
                              비밀번호 확인
                            </Button>
                          </>
                        )}
                      </div>
                    </Form.Group>
                  </>
                ) : (
                  ''
                )}

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>새로운 비밀번호</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="비밀번호를 입력해 주세요."
                    onChange={(event) => setPassword(event.target.value)}
                    value={password}
                    autoComplete="off"
                    disabled={user && !isMath}
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
                    disabled={user && !isMath}
                  />
                </Form.Group>
                <div className="button-box">
                  {user ? (
                    <>
                      <Button
                        className="custom-button"
                        type="submit"
                        disabled={!isMath}
                      >
                        회원정보 수정
                      </Button>
                      <span>
                        <Link
                          onClick={() => {
                            handleLogout();
                          }}
                        >
                          로그아웃
                        </Link>
                      </span>
                    </>
                  ) : (
                    <>
                      <Button type="submit">회원가입</Button>
                      <span>
                        <Link to="/login">로그인 페이지로 이동</Link>
                      </span>
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
