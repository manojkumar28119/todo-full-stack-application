import React from "react";
import { MdDeleteOutline } from "react-icons/md"; // Importing the delete icon from react-icons
import './index.css'; // Add your styles for completed todos

const CompletedTodos = ({ completedTodos, onClickDeleteBtn, onChangeStatus }) => {

  // Helper function to format time spent into a human-readable string
  const formatTimeSpent = (seconds) => {
    if (!seconds || isNaN(seconds)) {
      return 0; // Handle invalid or undefined total_time_spent
    }

    // Calculate hours, minutes, and seconds from total seconds
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    // Return formatted time string
    return `${hrs > 0 ? `${hrs} hr ` : ""}${mins > 0 ? `${mins} min ` : ""}${secs > 0 ? `${secs} sec` : ""}`;
  };

  return (
    <div className="completed-todos-container">
      <h2 className="completed-todos-heading">Completed Tasks</h2>
      {completedTodos.length === 0 ? (
        // Display a message if there are no completed tasks
        <p className="no-completed-todos">No completed tasks yet!</p>
      ) : (
        <ul className="completed-todos-list p-0 p-md-3">
          {completedTodos.map((todo) => {
            // Destructure properties from the todo item
            let { is_completed, start_time, total_time_spent } = todo;

            // Function to handle checkbox status change
            const onChangeCheckBox = () => {
              onChangeStatus(todo.id, is_completed); // Call the function passed via props to change status
            };

            // Parsing the boolean value for 'is_completed' if it's stored as a string
            if (is_completed === "false") {
              is_completed = false;
            } else if (is_completed === "true") {
              is_completed = true;
            }

            // Convert start_time to Date object and calculate end time
            const startTime = new Date(start_time);
            const endTime = new Date(startTime.getTime() + total_time_spent * 1000); // Assuming total_time_spent is in seconds

            return (
              <div className="label-container d-flex flex-column" key={todo.id}>
                <div className="d-flex w-100 justify-content-between align-items-center mb-3">
                  <label
                    htmlFor={`checkbox${todo.id}`}
                    className={`checkbox-label ${todo.is_completed && 'checked'}`} // Add 'checked' class if the item is checked
                  >
                    {todo.todo} {/* This is where the task name/description is displayed */}
                  </label>
                  <input
                    type="checkbox"
                    id={`checkbox${todo.id}`}
                    className="checkbox-input"
                    checked={todo.is_completed} // Control the checkbox state based on isChecked
                    onChange={onChangeCheckBox} // Handle checkbox change
                  />
                </div>
                <div className="todo-details align-self-start">
                  <p className="completion-time">
                    <b>Task started on:</b> {startTime.toLocaleString()} {/* Display start time */}
                  </p>
                  <p className="total-time">
                    <b>Total time spent:</b> {formatTimeSpent(total_time_spent)} {/* Display total time spent */}
                  </p>
                  <p className="end-time">
                    <b>Task ended on:</b> {endTime.toLocaleString()} {/* Display end time */}
                  </p>
                </div>
                <div className="delete-icon-container" onClick={() => onClickDeleteBtn(todo.id)}>
                  <MdDeleteOutline size={30} /> {/* Delete icon */}
                </div>
              </div>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CompletedTodos;
