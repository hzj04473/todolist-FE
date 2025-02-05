import React from 'react';
import TodoItem from './TodoItem';
import Row from 'react-bootstrap/Row';
const TodoBoard = ({ todoList, onDelete, toggleCompleteTask, formatDate }) => {
  return (
    <div>
      <h2>Todo List</h2>

      <Row>
        {todoList.length > 0 ? (
          todoList.map((item, index) => (
            <TodoItem
              key={index}
              item={item}
              onDelete={onDelete}
              toggleCompleteTask={toggleCompleteTask}
              formatDate={formatDate}
            />
          ))
        ) : (
          <div>There is no Item to show</div>
        )}
      </Row>
    </div>
  );
};

export default TodoBoard;
