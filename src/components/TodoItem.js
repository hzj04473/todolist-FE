import React from 'react';
import { Col, Card, Button } from 'react-bootstrap';

const TodoItem = ({ item, onDelete, toggleCompleteTask, formatDate }) => {
  // geminiMessage를 줄바꿈 기준으로 분리하여 배열로 변환
  const geminiMessageLines = item.geminiMessage
    ? item.geminiMessage.split('\n')
    : [];

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
          <Card.Text>{item.author?.name || '-'}</Card.Text>
          {/* 요약문 영역 */}
          <Card className="bg-light p-2 rounded">
            <Card.Header className="bg-gray text-dark">Ai Prompt</Card.Header>
            <Card.Body>
              {geminiMessageLines.map((line, index) => (
                <p key={index} className="mb-1 small">
                  {line}
                </p>
              ))}
            </Card.Body>
          </Card>

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
