/* eslint-disable react/prop-types */

const Todo = ({ todo, deleteTodo, completeTodo }) => {
  const onClickDelete = () => {
    deleteTodo(todo)
  }

  const onClickComplete = () => {
    completeTodo(todo)
  }

  const doneInfo = (
    <>
      <span>This todo is done</span>
      <span>
        <button onClick={onClickDelete}> Delete </button>
      </span>
    </>
  )

  const notDoneInfo = (
    <>
      <span>This todo is not done</span>
      <span>
        <button onClick={onClickDelete}> Delete </button>
        <button onClick={onClickComplete}> Set as done </button>
      </span>
    </>
  )

  return (
    <div 
      data-testid={`todo-${todo._id}`}
      style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        maxWidth: '70%', 
        margin: 'auto' 
      }}
    >
      <span data-testid="todo-text">
        {todo.text}
      </span>
      {todo.done ? doneInfo : notDoneInfo}
    </div>
  )
}

export default Todo