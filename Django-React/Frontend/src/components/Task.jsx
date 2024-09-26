import React from "react";
import "../styles/Note.css";
import { useNavigate } from "react-router-dom";

function Task({ task, onDelete }) {
    return (
        <div className="note-container">
            <p className="note-reason">Tasks Completed: {task.tasks_completed}</p>
            <p className="note-description">Hours Requested: {task.hours_requested}</p>
            <button className="delete-button" onClick={() => onDelete(task.id)}>
                Delete
            </button>
        </div>
    );
}

export default Task