import React from 'react';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const TodoItem = ({ item, onDelete, toggleCompleteTask, formatDate }) => {
  return (
    <Col xs={12} sm={6} md={4}>
      <Card className="mb-3" bg={item.isComplete ? 'success' : ''}>
        <Card.Body>
          <Card.Title>{item.task}</Card.Title>
          <Card.Subtitle className="mt-3 mb-3">
            {formatDate(item.dueStartDate)} ~ {formatDate(item.dueEndDate)}
          </Card.Subtitle>
          <Card.Text>{item.geminiMessage}</Card.Text>

          <Card.Body className="d-flex justify-content-between">
            <Button
              variant="danger"
              className="p-2"
              onClick={() => onDelete(item._id)}
            >
              삭제
            </Button>
            <Button
              variant={item.isComplete ? 'outline-warning' : 'outline-success'}
              className="p-2"
              onClick={() => toggleCompleteTask(item._id)}
            >
              {item.isComplete ? '미완료' : '완료'}
            </Button>
          </Card.Body>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default TodoItem;
