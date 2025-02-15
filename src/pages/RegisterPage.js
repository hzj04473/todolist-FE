import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, Row, Col, Container, Alert } from 'react-bootstrap'; // Alert 추가
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Helmet } from 'react-helmet-async';
import { NavPage } from './NavPage';

function RegisterPage({ user, setUser, snsLoginType }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sns, setSns] = useState({
    snsType: '',
    snsId: '',
  });
  const [secPassword, setSecpassword] = useState('');
  const [error, setError] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isMath, setIsMath] = useState(false);
  // const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 카카오로 요청보낸 페이지에서 인가코드를 뽑아옵니다.
  const getKakaoToken = useCallback(
    async (code) => {
      try {
        if (snsLoginType) {
          // 🔹 1️⃣ 카카오 토큰 요청
          const data = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: process.env.REACT_APP_KAKAO_CLIENT_ID,
            redirect_uri: process.env.REACT_APP_KAKAO_REDIRECT_URI,
            code: code,
          });

          const kakaoTokenResponse = await axios.post(
            'https://kauth.kakao.com/oauth/token',
            data,
            {
              headers: {
                'Content-Type':
                  'application/x-www-form-urlencoded;charset=utf-8',
              },
            }
          );

          const accessToken = kakaoTokenResponse.data.access_token;

          // 🔹 2️⃣ 카카오 사용자 정보 요청
          const userInfoResponse = await axios.get(
            'https://kapi.kakao.com/v2/user/me',
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type':
                  'application/x-www-form-urlencoded;charset=utf-8',
              },
            }
          );

          if (userInfoResponse.data.id) {
            setName(userInfoResponse.data.properties.nickname);
            setSns({
              snsType: 'kakao',
              snsId: userInfoResponse.data.id,
            });
          }
        }
      } catch (error) {
        console.error(
          '카카오 로그인 에러:',
          error.response?.data || error.message
        );

        window.location.href = '/login'; // 에러 발생 시 로그인 페이지로 리다이렉트
      }
    },
    [snsLoginType]
  );

  // console.log(code);
  const clickPasswordcheck = async () => {
    try {
      if (user) {
        if (passwordConfirm.length === 0) {
          throw new Error('비밀번호를 확인하여 주세요.');
        }
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

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem('token');
      const response = await api.post('/user/logout');
      if (response.status === 200) {
        setUser(null);
        navigate('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (password !== secPassword) {
        throw new Error('패스워드가 일치하지 않습니다. 다시 입력해 주세요.');
      }
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
            name: name,
          }));
          setPasswordConfirm('');
          setPassword('');
          setSecpassword('');
          setIsMath(false);
          navigate('/register');
        } else {
          throw new Error(response.data.error);
        }
      } else {
        const response = await api.post('/user', {
          name,
          email,
          password,
          sns,
        });
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

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');
    if (snsLoginType) {
      // 🔹 code가 없거나 유효하지 않으면 로그인 페이지로 리다이렉트
      if (!code) {
        window.location.href = '/login';
        return;
      }
    }

    getKakaoToken(code); // 유효한 code가 있을 때만 토큰 요청
  }, [snsLoginType, getKakaoToken]);

  return (
    <>
      <Helmet>
        <title>
          {user
            ? 'Todo List | 회원정보 수정 페이지'
            : 'Todo List | 회원가입 페이지'}
        </title>
        <meta name="description" content="Todo List | 회원가입 페이지" />
        <meta property="og:url" content={window.location.href} />
        {user ? (
          <meta
            property="og:title"
            content="Todo List | 회원정보 수정 페이지"
          />
        ) : (
          <meta property="og:title" content="Todo List | 회원가입 페이지" />
        )}

        <meta property="og:description" content="Todo List | 회원가입 페이지" />
      </Helmet>

      <Container fluid className="vh-100 p-0 bg-light">
        <NavPage user={user} setUser={setUser} />
        <Row className="justify-content-center align-items-center h-75 mx-0 mt-4">
          <Col xs={12} sm={8} md={6} lg={5}>
            <div className="bg-white p-4 rounded shadow-sm">
              {error && <Alert variant="danger">{error}</Alert>}{' '}
              {/* Alert로 변경 */}
              <Form onSubmit={handleSubmit}>
                <h1 className="h3 mb-4 fw-bold text-center">
                  {user ? '회원정보 수정' : '회원가입'}
                </h1>

                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label className="fw-semibold">이름</Form.Label>
                  <Form.Control
                    type="text"
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
                    disabled={user && `true`}
                    className="py-2"
                  />
                </Form.Group>

                {user && (
                  <Form.Group className="mb-3" controlId="formConfirmPassword">
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
