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
function TodoPage() {
  const [todoList, setTodoList] = useState([]);

  const [todoValue, setTodoValue] = useState({
    task: '',
    isComplete: false,
    dueStartDate: new Date().toISOString().substring(0, 10),
    dueEndDate: new Date().toISOString().substring(0, 10),
  });

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString); // '2025-01-27T07:09:25.203Z' 형식의 문자열을 Date 객체로 변환
    // console.log(date);
    const year = date.getFullYear(); // 연도
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월 (0부터 시작하므로 +1 해주고, 2자리로 만들기 위해 padStart 사용)
    const day = date.getDate().toString().padStart(2, '0'); // 일 (2자리로 맞추기)

    return `${year}.${month}.${day}`; // 원하는 형식으로 반환
  }, []);

  const getTask = useCallback(async () => {
    try {
      const response = await api.get('/tasks');
      console.log('처음 데이터 >>>', response.data.data);
      if (response.status === 200) {
        setTodoList(response.data.data);
      } else {
        throw new Error('task can not be lists');
      }
    } catch (err) {
      console.error('error : ', err);
    }
  }, []);

  const addTask = useCallback(async () => {
    // console.log(todoValue.dueStartDate.trim());
    // console.log(todoValue.dueEndDate.trim());
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
        // console.log('성공');
        // 1. 입력한 값이 안 사라짐
        setTodoValue({
          task: '',
          dueStartDate: new Date().toISOString().substring(0, 10),
          dueEndDate: new Date().toISOString().substring(0, 10),
        });
        // 2. 추가한 값이 안 보임
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
        // console.log('isComplete Button Click', itemId);

        const response = await api.put(`/tasks/${itemId}`, {});

        if (response.status === 200) {
          // console.log('isComplete response', response);
          // console.log('update success');
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
      if (window.confirm('이 Tddo list 를 삭제하시겠습니까?')) {
        try {
          // console.log('isDelete Button Click', itemId);
          const response = await api.delete(`/tasks/${itemId}`, {});
          // console.log('isDelete response', response);
          if (response.status === 200) {
            // console.log('delete success');
            getTask();
          } else {
            throw new Error('task can not be update');
          }
        } catch (error) {
          console.error('isDelete Error : ', error);
        }
      } else {
        alert('이 Tddo list 삭제가 취소되었습니다.');
      }
    },
    [getTask]
  );

  // 앱이 딱 시작이 될떄 실행 : useEffect()
  useEffect(() => {
    getTask();
  }, [getTask]);

  return (
    <>
      <Helmet>
        <title>Todo List</title>
        <title>{`Todo List`}</title>
        <meta
          name="description"
          content={`React로 만든 Todo 리스트 애플리케이션입니다.`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${process.env.PUBLIC_URL}`} />
        <meta name="og:title" content={`Todo List`} />
        <meta
          name="og:description"
          content={`React로 만든 Todo 리스트 애플리케이션입니다.`}
        />
        <meta name="keywords" content="todo, react, 할일 목록" />
      </Helmet>

      <Container className="mt-5">
        <NavPage />
        <Row className="add-item-row">
          <Col xs={12} sm={10}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <FloatingLabel
                  controlId="floatingStartDate"
                  label="시작 일자를 입력을 해 주세요."
                  className="mb-3"
                >
                  <Form.Control
                    type="date"
                    placeholder="date"
                    className="input-box"
                    value={todoValue.dueStartDate}
                    onChange={(event) => {
                      // console.log('todoValue', todoValue);
                      setTodoValue({
                        ...todoValue,
                        dueStartDate: event.target.value,
                        dueEndDate: event.target.value,
                      });
                    }}
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group as={Col} controlId="formGridEmail">
                <FloatingLabel
                  controlId="floatingEndDate"
                  label="종료 일자를 입력을 해 주세요."
                  className="mb-3"
                >
                  <Form.Control
                    type="date"
                    placeholder="date"
                    className="input-box"
                    value={
                      !todoValue.dueEndDate
                        ? todoValue.dueStartDate
                        : todoValue.dueEndDate
                    }
                    onChange={(event) => {
                      // console.log('todoValue', todoValue);
                      setTodoValue({
                        ...todoValue,
                        dueEndDate: event.target.value,
                      });
                    }}
                  />
                </FloatingLabel>
              </Form.Group>
            </Row>
            <FloatingLabel
              controlId="floatingInput"
              label="할일을 입력하세요"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="할일을 입력하세요"
                className="input-box"
                value={todoValue.task}
                onChange={(event) => {
                  console.log('todoValue', todoValue);
                  setTodoValue({ ...todoValue, task: event.target.value });
                }}
              />
            </FloatingLabel>
          </Col>
          <Col xs={12} sm={2}>
            <button className="button-add mb-1 mt-1" onClick={addTask}>
              추가
            </button>
          </Col>
        </Row>

        <TodoBoard
          todoList={todoList}
          onDelete={deleteTask}
          toggleCompleteTask={toggleCompleteTask}
          formatDate={formatDate}
        />
      </Container>
    </>
  );
}

export default TodoPage;
