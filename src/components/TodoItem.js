import React from 'react';
import { Col, Card, Button } from 'react-bootstrap';

const TodoItem = ({ item, onDelete, toggleCompleteTask, formatDate }) => {
  // 완료된 항목일 경우 카드 배경색과 텍스트 색상 변경
  const cardStyle = {
    backgroundColor: item.isComplete ? '#e8f5e9' : 'white', // 완료 시 연한 초록색, 미완료 시 흰색
    color: item.isComplete ? '#2e7d32' : 'inherit', // 완료 시 진한 초록색, 미완료 시 기본 색상
  };

  return (
    <Col>
      <Card className="mb-3 shadow-sm" style={cardStyle}>
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
