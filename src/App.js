import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import TodoPage from './pages/TodoPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import { useCallback, useEffect, useState } from 'react';
import PrivateRoute from './route/PrivateRoute';
import api from './utils/api';
import { Container } from 'react-bootstrap'; // 추가
import { HelmetProvider } from 'react-helmet-async'; // ✅ HelmetProvider 추가

function App() {
  const [user, setUser] = useState(null);
  const getUser = useCallback(async () => {
    try {
      const storedToken = sessionStorage.getItem('token');
      if (storedToken) {
        const response = await api.get('/user/me');
        setUser(response.data.user);
      }
    } catch (error) {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <HelmetProvider>
      <Container fluid className="p-0">
        {/* 추가: 전체 레이아웃을 Container로 감싸기 */}
        <Routes>
          {/* Private Router */}
          {/* 메인페이지 */}
          <Route
            path="/"
            element={
              <PrivateRoute user={user}>
                <TodoPage user={user} setUser={setUser} />
              </PrivateRoute>
            }
          />
          {/* 검색할떄 */}
          <Route
            path="/search/:keyword"
            element={
              <PrivateRoute user={user}>
                <TodoPage user={user} setUser={setUser} />
              </PrivateRoute>
            }
          />
          {/* 회원가입 / 수정 */}
          <Route
            path="/register"
            element={<RegisterPage user={user} setUser={setUser} />}
          />

          {/* 로그인페이지 */}
          <Route
            path="/login"
            element={<LoginPage user={user} setUser={setUser} />}
          />

          {/* 카카오톡 Redirect_url */}
          <Route
            path="/auth/kakao/callback"
            element={<RegisterPage snsLoginType={`kakao`} />}
          />

          <Route
            path="*"
            element={
              <PrivateRoute user={user}>
                <TodoPage user={user} setUser={setUser} />
              </PrivateRoute>
            }
          />
        </Routes>
      </Container>
    </HelmetProvider>
  );
}

export default App;
