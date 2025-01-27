import React from 'react';
import { Col, Row } from 'react-bootstrap';

const TodoItem = ({ item, onDelete, toggleCompleteTask, formatDate }) => {
  return (
    <Row>
      <Col xs={12}>
        <div className={`todo-item  ${item.isComplete ? 'item-complete' : ''}`}>
          <div className="todo-content">{item.task}</div>
          <div>
            <button
              className="button-delete"
              onClick={() => {
                onDelete(item._id);
              }}
            >
              삭제
            </button>
            <button
              className="button-delete"
              onClick={() => {
                toggleCompleteTask(item._id);
              }}
            >
              {item.isComplete ? '미완료' : '완료'}
            </button>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default TodoItem;
