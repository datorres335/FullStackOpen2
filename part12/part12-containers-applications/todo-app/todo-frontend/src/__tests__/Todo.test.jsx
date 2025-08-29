import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Todo from '../Todos/Todo'

const mockTodo = {
  _id: '123',
  text: 'Test todo',
  done: false
}

const mockTodoDone = {
  _id: '456',
  text: 'Completed todo',
  done: true
}

describe('Todo Component', () => {
  it('renders todo text correctly', () => {
    const mockDelete = vi.fn()
    const mockComplete = vi.fn()

    render(
      <Todo 
        todo={mockTodo} 
        deleteTodo={mockDelete} 
        completeTodo={mockComplete} 
      />
    )

    expect(screen.getByTestId('todo-text')).toHaveTextContent('Test todo')
  })

  it('shows "not done" status for incomplete todos', () => {
    const mockDelete = vi.fn()
    const mockComplete = vi.fn()

    render(
      <Todo 
        todo={mockTodo} 
        deleteTodo={mockDelete} 
        completeTodo={mockComplete} 
      />
    )

    expect(screen.getByText('This todo is not done')).toBeInTheDocument()
    expect(screen.getByText('Set as done')).toBeInTheDocument()
  })

  it('shows "done" status for completed todos', () => {
    const mockDelete = vi.fn()
    const mockComplete = vi.fn()

    render(
      <Todo 
        todo={mockTodoDone} 
        deleteTodo={mockDelete} 
        completeTodo={mockComplete} 
      />
    )

    expect(screen.getByText('This todo is done')).toBeInTheDocument()
    expect(screen.queryByText('Set as done')).not.toBeInTheDocument()
  })

  it('calls deleteTodo when delete button is clicked', () => {
    const mockDelete = vi.fn()
    const mockComplete = vi.fn()

    render(
      <Todo 
        todo={mockTodo} 
        deleteTodo={mockDelete} 
        completeTodo={mockComplete} 
      />
    )

    fireEvent.click(screen.getByText('Delete'))
    expect(mockDelete).toHaveBeenCalledWith(mockTodo)
  })

  it('calls completeTodo when "Set as done" button is clicked', () => {
    const mockDelete = vi.fn()
    const mockComplete = vi.fn()

    render(
      <Todo 
        todo={mockTodo} 
        deleteTodo={mockDelete} 
        completeTodo={mockComplete} 
      />
    )

    fireEvent.click(screen.getByText('Set as done'))
    expect(mockComplete).toHaveBeenCalledWith(mockTodo)
  })

  it('has correct test id', () => {
    const mockDelete = vi.fn()
    const mockComplete = vi.fn()

    render(
      <Todo 
        todo={mockTodo} 
        deleteTodo={mockDelete} 
        completeTodo={mockComplete} 
      />
    )

    expect(screen.getByTestId('todo-123')).toBeInTheDocument()
  })
})