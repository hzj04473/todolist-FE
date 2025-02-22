import React, { useState } from 'react';
import { Button, Form, Row, Col, Container, Alert } from 'react-bootstrap'; // Alert 추가
import { Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import { Helmet } from 'react-helmet-async';
import { NavPage } from './NavPage';
// import { FaComment } from 'react-icons/fa'; // FontAwesome 아이콘 import
import { getSEOData } from '../utils/seoConfig';

function LoginPage({ user, setUser }) {
  const [email, setEmail] = useState('hzj04473@todo.com');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState('');
  const navigation = useNavigate();
  const location = useLocation();

  const seoData = getSEOData(location.pathname, {
    title: 'Todo List | 로그인페이지',
    description:
      'Todo List 로그인 페이지입니다. 이메일과 비밀번호로 로그인하거나 카카오 계정으로 로그인할 수 있습니다.',
  });

  // 아래 코드에서 client_id는 발급받은 REST_API_KEY값을 넣어준다.
  // redirect_uri는 여기에선 프론트의 REDIRECT_URI를 사용한다.
  // const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_KAKAO_REDIRECT_URI}&response_type=code`;
  // console.log(KAKAO_AUTH_URL);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      if (!email) throw new Error('이메일을 입력해 주세요.');
      if (!password) throw new Error('비밀번호를 입력해 주세요.');

      const response = await api.post('/user/login', { email, password });
      if (response.status === 200) {
        setUser(response.data.user);
        sessionStorage.setItem('token', response.data.token);
        api.defaults.headers['authorization'] = 'Bearer ' + response.data.token;
        setError('');
        navigation('/');
      }
      throw new Error(response);
    } catch (error) {
      setError(error.message);
    }
  };

  // const handleLoginWithKakao = () => {
  //   window.location.href = KAKAO_AUTH_URL;
  // };

  if (user) return <Navigate to="/" />;

  return (
    <>
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />

        {/* Open Graph 태그 */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Todo List" />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:url" content={seoData.currentUrl} />
        <meta property="og:image" content={seoData.defaultImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* 추가 SEO 태그 */}
        <link rel="canonical" href={seoData.currentUrl} />
        <meta name="robots" content="index,follow" />
      </Helmet>

      <Container fluid className="vh-100 p-0 bg-light">
        <NavPage user={user} setUser={setUser} />
        <Row className="justify-content-center align-items-center h-75 mx-0 mt-4">
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className="bg-white p-4 rounded shadow-sm">
              {error && <Alert variant="danger">{error}</Alert>}{' '}
              {/* Alert로 변경 */}
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
                    className="mb-3 fw-bold"
                  >
                    로그인
                  </Button>
                  {/* 카카오 로그인 버튼 */}
                  {/* <Button
                    href={KAKAO_AUTH_URL} // OAuth 인증 URL
                    variant="warning"
                    size="lg"
                    className="mb-3 fw-bold text-dark"
                    style={{
                      backgroundColor: '#FEE500',
                      borderColor: '#FEE500',
                    }}
                    onClick={handleLoginWithKakao}
                  >
                    <FaComment className="me-2" /> 카카오 로그인
                  </Button> */}
                  <p className="text-center mb-0">
                    계정이 없다면?
                    <Link
                      to="/register"
                      className="text-decoration-none fw-semibold"
                    >
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
