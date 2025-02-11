import React from 'react';
import { Col, Card, Button } from 'react-bootstrap';

const TodoItem = ({ item, onDelete, toggleCompleteTask, formatDate }) => {
  return (
    <Col>
      <Card className="mb-3 shadow-sm">
        <Card.Body>
          <Card.Title className="text-truncate-title fw-bold">
            {item.task}
          </Card.Title>
          <Card.Text className="text-muted">
            {formatDate(item.dueStartDate)} ~ {formatDate(item.dueEndDate)}
          </Card.Text>
          <Card.Text>작성자: {item.author?.name || '-'}</Card.Text>
          <Card.Text className="text-truncate-summary bg-light p-2 rounded">
            {item.geminiMessage}
          </Card.Text>
          <div className="d-grid gap-2 mt-3">
            <Button
              variant="danger"
              onClick={() => onDelete(item._id)}
              className="w-100"
            >
              삭제
            </Button>
            <Button
              variant={item.isComplete ? 'warning' : 'success'}
              onClick={() => toggleCompleteTask(item._id)}
              className="w-100"
            >
              {item.isComplete ? '미완료' : '완료'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default TodoItem;
