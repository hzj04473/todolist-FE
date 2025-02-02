import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { Link, useNavigate } from 'react-router-dom';

import api from '../utils/api';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigate();
  const [user, setUser] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      if (!email) {
        throw new Error('이매알을 입력해 주세요.');
      }
      if (!password) {
        throw new Error('패스워드를 입력해 주세요.');
      }

      // api
      const response = await api.post('/user/login', { email, password });
      // console.log(response);

      if (response.status === 200) {
        setUser(response.data.user);
        sessionStorage.setItem('token', response.data.token);
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

  return (
    <div className="display-center">
      {error && <div className="red-error">{error}</div>}
      <Form className="login-box" onSubmit={handleLogin}>
        <h1>로그인</h1>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={(event) => setEmail(event.target.value)}
            value={email}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(event) => setPassword(event.target.value)}
            value={password}
          />
        </Form.Group>
        <div className="button-box">
          <Button type="submit" className="button-primary">
            Login
          </Button>
          <span>
            계정이 없다면? <Link to="/register">회원가입 하기</Link>
          </span>
        </div>
      </Form>
    </div>
  );
}

export default LoginPage;
