import React from 'react';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const TodoItem = ({ item, onDelete, toggleCompleteTask, formatDate }) => {
  // console.log(item.author.name || 'undefined');
  return (
    <Col xs={12} sm={6} md={4}>
      <Card className="mb-3" bg={item.isComplete ? 'success' : ''}>
        <Card.Body>
          <Card.Title>{item.task}</Card.Title>
          <Card.Subtitle className="mt-3 mb-3">
            {formatDate(item.dueStartDate)} ~ {formatDate(item.dueEndDate)}
          </Card.Subtitle>
          <Card.Text>작성자 : {item.author?.name || '-'}</Card.Text>
          <Card.Text
            style={{ opacity: 0.5 }}
            className="p-2 mb-1 bg-primary text-white"
          >
            Ai Gemini
          </Card.Text>
          <Card.Text className="flex-grow-1 mt-3 text-truncate-multiline">
            {item.geminiMessage}
          </Card.Text>

          <Card.Body className="d-flex gap-2">
            <Button
              variant="danger"
              className="flex-grow-2"
              onClick={() => onDelete(item._id)}
            >
              삭제
            </Button>
            <Button
              variant={item.isComplete ? 'outline-warning' : 'outline-success'}
              className="flex-grow-1"
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
