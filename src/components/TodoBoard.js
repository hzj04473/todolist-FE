import React from 'react';
import TodoItem from './TodoItem';
const TodoBoard = ({ todoList, onDelete, toggleCompleteTask, formatDate }) => {
  return (
    <div>
      <h2>Todo List</h2>
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
      {/* <TodoItem/> will be here once we get the todoList */}
    </div>
  );
};

export default TodoBoard;
