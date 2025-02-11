import React from 'react';
import TodoItem from './TodoItem';
import { Row, Col } from 'react-bootstrap';

const TodoBoard = ({ todoList, onDelete, toggleCompleteTask, formatDate }) => {
  return (
    <div>
      <h2 className="mb-4 fw-bold">Todo List</h2>
      <Row>
        {todoList.length > 0 ? (
          todoList.map((item, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-3">
              <TodoItem
                item={item}
                onDelete={onDelete}
                toggleCompleteTask={toggleCompleteTask}
                formatDate={formatDate}
              />
            </Col>
          ))
        ) : (
          <Col>
            <div className="text-muted">There is no Item to show</div>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default TodoBoard;
