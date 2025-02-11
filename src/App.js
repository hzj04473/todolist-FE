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
    <Container fluid className="p-0">
      {/* 추가: 전체 레이아웃을 Container로 감싸기 */}
      <Routes>
        {/* Private Router */}
        <Route
          path="/"
          element={
            <PrivateRoute user={user}>
              <TodoPage user={user} setUser={setUser} />
            </PrivateRoute>
          }
        />
        <Route
          path="/register"
          element={<RegisterPage user={user} setUser={setUser} />}
        />
        <Route
          path="/login"
          element={<LoginPage user={user} setUser={setUser} />}
        />
      </Routes>
    </Container>
  );
}

export default App;
