/* eslint-disable react/prop-types */
import Todo from './Todo'

const TodoList = ({ todos, deleteTodo, completeTodo }) => {
  if (!todos || !Array.isArray(todos)) {
    return <div>Loading todos...</div>
  }

  if (todos.length === 0) {
    return <div>No todos yet. Add one above!</div>
  }

  return (
    <>
      {todos.map((todo, index) => (
        <div key={todo._id}>
          <Todo 
            todo={todo} 
            deleteTodo={deleteTodo} 
            completeTodo={completeTodo} 
          />
          {index < todos.length - 1 && <hr />}
        </div>
      ))}
    </>
  )
}

export default TodoList
