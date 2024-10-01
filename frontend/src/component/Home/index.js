import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from "../Navbar";
import TodoItem from "../TodoItem";
import CompletedTodos from "../CompletedTodos";
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the toastify CSS
import { FaTrash } from 'react-icons/fa'; // Importing a trash icon from react-icons
import './index.css';

const Api = "https://todo-app-backend-m713.onrender.com";

// API status constants for better readability
const apiConstrains = {
  onSuccess: "SUCCESS",
  onFailure: "FAILURE",
  onLoading: "LOADING",
  noData: "NODATA"
};

const Home = () => {
  const [todos, setTodos] = useState([]); // State for storing todos
  const [todoText, setTodoText] = useState(''); // State for new todo text input
  const [apiStatus, setApiStatus] = useState(apiConstrains.onLoading); // State for API status

  // Fetch todos from the backend when the component mounts
  const fetchTodos = async () => {
    const userId = Cookies.get('user_id');
    try {
      const response = await fetch(`${Api}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (response.ok) {
        const data = await response.json();
        setTodos(data);
        data.length === 0 ? setApiStatus(apiConstrains.noData) : setApiStatus(apiConstrains.onSuccess);
      } else {
        console.error('Failed to fetch todos');
        setApiStatus(apiConstrains.onFailure);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
      setApiStatus(apiConstrains.onFailure);
    }
  };

  // useEffect to fetch todos on component mount
  useEffect(() => {
    setApiStatus(apiConstrains.onLoading);
    fetchTodos();
  }, []);

  // Function to change the status of a todo
  const onChangeStatus = async (id, status) => {
    try {
      const response = await fetch(`${Api}/change-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "todo_id": id,
          status: !status
        }),
      });

      if (response.ok) {
        console.log("Status updated");
        fetchTodos(); // Refetch todos after status update
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Event handler for updating the todoText state when the input changes
  const onChangeTodo = (event) => {
    setTodoText(event.target.value);
  };

  // Event handler for adding a new todo
  const onClickAddBtn = async (event) => {
    event.preventDefault(); // Prevent form default submission
    if (todoText.trim() !== '') {
      const userId = Cookies.get('user_id');
      const newTodo = {
        user_id: userId,
        todo: todoText,
        is_completed: false,
      };

      try {
        const response = await fetch(`${Api}/add-todo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTodo),
        });

        if (response.ok) {
          setTodoText(''); // Clear input field after adding the todo
          fetchTodos(); // Refetch the todos
          toast.success('Todo added successfully!'); // Show success toast
        } else {
          console.error('Failed to add todo');
        }
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  // Event handler for deleting a todo with custom icon
  const onClickDeleteBtn = async (id) => {
    // Optimistically update the UI before the API call
    const new_todos = todos.filter((todo) => todo.id !== id);
    setTodos(new_todos);
    new_todos.length === 0 && setApiStatus(apiConstrains.noData); // Update API status if no todos left

    try {
      const response = await fetch(`${Api}/delete-todo`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "todo_id": id
        })
      });

      if (response.ok) {
        // Show success toast with a custom delete icon (trash icon)
        toast.success('Todo deleted successfully!', {
          icon: <FaTrash color="red" />, // Custom icon with red color
        });
      } else {
        console.error('Failed to delete todo');
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // Function to render todos based on API status
  const renderTodos = () => {
    const activeTodos = todos.filter(todo => todo.is_completed === "false");
    const completedTodos = todos.filter(todo => todo.is_completed === "true");

    switch (apiStatus) {
      case apiConstrains.onSuccess:
        return (
          <>
            {activeTodos.length !== 0 && (
              <>
                <h1 className="todo-items-heading">
                  My <span className="todo-items-heading-subpart">Tasks</span>
                </h1>
                <ul className="todo-items-container p-0 p-md-3">
                  {activeTodos.map((todo) => (
                    <TodoItem key={todo.id} item={todo} onChangeStatus={onChangeStatus} onClickDeleteBtn={onClickDeleteBtn} />
                  ))}
                </ul>
              </>
            )}

            {/* Show CompletedTodos component */}
            {completedTodos.length !== 0 && <CompletedTodos completedTodos={completedTodos} onChangeStatus={onChangeStatus} onClickDeleteBtn={onClickDeleteBtn} />}
          </>
        );

      case apiConstrains.onLoading:
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        );

      case apiConstrains.noData:
        return (
          <div className='no-data-card'>
            <img src='https://todoist.b-cdn.net/assets/images/f6fa2d79a28b6cf1c08d55511fee0c5b.png' alt='img' />
            <b>Your peace of mind is priceless</b>
            <p>Well done! All your tasks are organized in the right place.</p>
          </div>
        );

      default:
        return <p>Something went wrong, please try again later.</p>;
    }
  };

  // Check for JWT token to handle authentication
  const jwtToken = Cookies.get('jwt_token');
  if (jwtToken === undefined) {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }

  return (
    <div className='home'>
      <Navbar />
      <div className="todos-bg-container">
        <div className="main-card">
          <form onSubmit={onClickAddBtn}>
            <input
              type="text"
              value={todoText}
              id="todoUserInput"
              className="todo-user-input"
              placeholder="What needs to be done?"
              onChange={onChangeTodo}
            />
            <button className="button" type="submit">
              Add
            </button>
          </form>
          {renderTodos()} {/* Render todos based on API status */}
        </div>
      </div>
      <ToastContainer /> {/* Add ToastContainer to render toasts */}
    </div>
  );
};

export default Home;
