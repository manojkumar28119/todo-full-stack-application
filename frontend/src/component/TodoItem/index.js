import { MdDeleteOutline } from "react-icons/md"; // Import delete icon
import "./index.css"; // Import component styles
import { useState } from "react";

let timerId;

const TodoItem = (props) => {
  const { item, onClickDeleteBtn, onChangeStatus } = props;
  let { todo, is_completed, id, total_time_spent } = item;

  const [seconds, setSeconds] = useState(total_time_spent);

  // Event handler for changing checkbox state
  const onChangeCheckBox = () => {
    onChangeStatus(id, is_completed);
  };

  // Convert string to boolean
  is_completed = is_completed === "true";

  // Format time as MM:SS
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Start timer and make API call
  const onClickStartTimer = async () => {
    const startTime = new Date().toISOString(); // Current time

    if (!timerId) {
      timerId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }

    await fetch("https://todo-app-backend-m713.onrender.com/start-timer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        todo_id: id,
        start_time: startTime
      }),
    });
  };

  // Pause timer and make API call
  const onClickPauseBtn = async () => {
    try {
      const response = await fetch("https://todo-app-backend-m713.onrender.com/pause-timer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todo_id: id }),
      });

      if (response.ok) {
        clearInterval(timerId);
        timerId = null;
      }
    } catch (error) {
      console.error("Error pausing timer:", error);
    }
  };

  // Reset timer and make API call
  const onClickResetTime = async () => {
    try {
      const response = await fetch("https://todo-app-backend-m713.onrender.com/reset-timer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todo_id: id }),
      });

      if (response.ok) {
        clearInterval(timerId);
        timerId = null;
        setSeconds(0);
      }
    } catch (error) {
      console.error("Error resetting timer:", error);
    }
  };

  return (
    <li className="todo-item-container">
      <div className="label-container d-flex flex-column align-items-start">
        <div className="d-flex w-100 justify-content-between align-items-center mb-3">
          <label
            htmlFor={`checkbox${id}`}
            className={`checkbox-label ${is_completed && 'checked'}`} // Highlight if checked
          >
            {todo}
          </label>
          <input
            type="checkbox"
            id={`checkbox${id}`}
            className="checkbox-input"
            checked={is_completed}
            onChange={onChangeCheckBox}
          />
        </div>
        <div className="d-flex flex-column timer-card align-items-center">
          <div className="btns-container w-100 d-flex justify-content-center align-items-center flex-wrap">
            <button type="button" className="btn btn-primary mb-2" onClick={onClickStartTimer}>Start Timer</button>
            <button type="button" className="btn btn-secondary mb-2" onClick={onClickPauseBtn}>Pause Timer</button>
            <button type="button" className="btn btn-danger mb-2" onClick={onClickResetTime}>Reset Timer</button>
          </div>
          <p className="fw-bold timer">{formatTime(seconds)}</p>
        </div>
        <div className="delete-icon-container" onClick={() => onClickDeleteBtn(id)}>
            <MdDeleteOutline size={30} /> {/* Delete icon */}
        </div>
      </div>
    </li>
  );
};

export default TodoItem;
