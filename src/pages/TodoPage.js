import React, { useCallback, useEffect, useState } from 'react';
import TodoBoard from '../components/TodoBoard';
import api from '../utils/api';
import {
  Container,
  Row,
  Col,
  Form,
  FloatingLabel,
  Button,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { NavPage } from './NavPage';
import { useNavigate, useParams } from 'react-router-dom';

function TodoPage({ user, setUser }) {
  // URL에서 검색어 파라미터 가져오기
  const { keyword } = useParams();

  const navigate = useNavigate();

  const [todoList, setTodoList] = useState([]);
  const [keywordSearchLists, setkeywordSearchLists] = useState('');
  const [todoValue, setTodoValue] = useState({
    task: '',
    isComplete: false,
    dueStartDate: new Date().toISOString().substring(0, 10),
    dueEndDate: new Date().toISOString().substring(0, 10),
  });
  // console.log('keywordSearchLists >>> ', keywordSearchLists);
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().substring(2, 4);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}.${month}.${day}`;
  }, []);

  const getTask = useCallback(async () => {
    try {
      if (keywordSearchLists) {
        setTodoList(keywordSearchLists);
      } else {
        const response = await api.get('/tasks');
        if (response.status === 200) {
          setTodoList(response.data.data);
        } else {
          throw new Error('task can not be lists');
        }
      }

      // const response = await api.get('/tasks');
      // if (response.status === 200) {
      //   setTodoList(response.data.data);
      // } else {
      //   throw new Error('task can not be lists');
      // }
    } catch (err) {
      console.error('error : ', err);
    }
  }, [keywordSearchLists]);

  const addTask = useCallback(async () => {
    if (!todoValue.dueStartDate.trim()) {
      alert('시작 일자를 입력하여 주세요.');
      return;
    }
    if (!todoValue.dueEndDate.trim()) {
      alert('종료 일자를 입력하여 주세요.');
      return;
    }
    if (!todoValue.task.trim()) {
      alert('할일을 입력하여 주세요.');
      return;
    }

    try {
      const response = await api.post('/tasks', {
        task: todoValue.task,
        dueStartDate: todoValue.dueStartDate,
        dueEndDate: todoValue.dueEndDate,
        isComplete: false,
      });

      if (response.status === 201) {
        setTodoValue({
          task: '',
          dueStartDate: new Date().toISOString().substring(0, 10),
          dueEndDate: new Date().toISOString().substring(0, 10),
        });
        getTask();
      } else {
        throw new Error('task can not be added');
      }
    } catch (err) {
      console.log('error : ', err);
    }
  }, [getTask, todoValue]);

  const toggleCompleteTask = useCallback(
    async (itemId) => {
      try {
        const response = await api.put(`/tasks/${itemId}`, {});
        if (response.status === 200) {
          getTask();
        } else {
          throw new Error('task can not be update');
        }
      } catch (error) {
        console.error('isComplete Error : ', error);
      }
    },
    [getTask]
  );

  const deleteTask = useCallback(
    async (itemId) => {
      if (window.confirm('이 Todo list를 삭제하시겠습니까?')) {
        try {
          const response = await api.delete(`/tasks/${itemId}`, {});
          if (response.status === 200) {
            getTask();
          } else {
            throw new Error('task can not be update');
          }
        } catch (error) {
          console.error('isDelete Error : ', error);
        }
      } else {
        alert('이 Todo list 삭제가 취소되었습니다.');
      }
    },
    [getTask]
  );
  const handleSearch = (searchKeyword) => {
    setkeywordSearchLists(searchKeyword);
  };

  // 검색 초기화 함수
  const resetSearch = useCallback(() => {
    setkeywordSearchLists(null);
    navigate('/'); // 홈으로 이동
    getTask();
  }, [getTask, navigate]);

  useEffect(() => {
    getTask();
  }, [getTask]);

  return (
    <>
      <Helmet>
        <title>
          {keyword ? `검색: ${keyword} - Todo List` : 'Todo List 메인페이지'}
        </title>
        <meta
          name="description"
          content={keyword ? `${keyword} 검색 결과` : 'Todo List 메인페이지'}
        />
        <meta property="og:url" content={window.location.href} />
        <meta
          property="og:title"
          content={
            keyword ? `검색: ${keyword} - Todo List` : 'Todo List 메인페이지'
          }
        />
        <meta
          property="og:description"
          content={keyword ? `${keyword} 검색 결과` : 'Todo List 메인페이지'}
        />
      </Helmet>

      <Container fluid className="p-0">
        <NavPage user={user} setUser={setUser} onSearch={handleSearch} />
        <Container className="mt-4">
          {/* 검색 결과 표시 */}
          {keyword && (
            <Row className="mb-3">
              <Col>
                <h4 className="mb-3">'{keyword}' 검색 결과</h4>
                <Button
                  variant="outline-secondary"
                  onClick={resetSearch}
                  className="mb-3"
                >
                  전체 목록으로 돌아가기
                </Button>
              </Col>
            </Row>
          )}

          {/* 검색 중이 아닐 때만 입력 폼 표시 */}
          {!keyword && (
            <>
              {/* 기존 입력 폼 컴포넌트들 */}
              <Row className="mb-3">
                {/* 시작 일자 및 종료 일자 입력 필드 */}
                <Col xs={12} md={6}>
                  <FloatingLabel
                    controlId="floatingStartDate"
                    label="시작 일자"
                    className="mb-3"
                  >
                    <Form.Control
                      type="date"
                      value={todoValue.dueStartDate}
                      onChange={(event) =>
                        setTodoValue({
                          ...todoValue,
                          dueStartDate: event.target.value,
                          dueEndDate: event.target.value,
                        })
                      }
                    />
                  </FloatingLabel>
                </Col>
                <Col xs={12} md={6}>
                  <FloatingLabel
                    controlId="floatingEndDate"
                    label="종료 일자"
                    className="mb-3"
                  >
                    <Form.Control
                      type="date"
                      value={todoValue.dueEndDate}
                      onChange={(event) =>
                        setTodoValue({
                          ...todoValue,
                          dueEndDate: event.target.value,
                        })
                      }
                    />
                  </FloatingLabel>
                </Col>
              </Row>
              <Row className="mb-4">
                <Col xs={12} md={10}>
                  <FloatingLabel
                    controlId="floatingTask"
                    label="할일을 입력하세요"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      placeholder="할일을 입력하세요"
                      value={todoValue.task}
                      onChange={(event) =>
                        setTodoValue({ ...todoValue, task: event.target.value })
                      }
                    />
                  </FloatingLabel>
                </Col>
                <Col xs={12} md={2}>
                  <Button
                    variant="primary"
                    onClick={addTask}
                    className="w-100 py-2"
                    style={{ height: '58px' }}
                  >
                    추가
                  </Button>
                </Col>
              </Row>
            </>
          )}

          <TodoBoard
            todoList={todoList}
            onDelete={deleteTask}
            toggleCompleteTask={toggleCompleteTask}
            formatDate={formatDate}
          />
        </Container>
      </Container>
    </>
  );
}

export default TodoPage;
