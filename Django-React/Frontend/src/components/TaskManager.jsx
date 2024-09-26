import React from 'react'
import "../styles/Note.css"
import { useState } from 'react';
import { Input } from '@chakra-ui/react';
function TaskManager({task,onStatusChange,onHoursChange}) {
  const [hoursRequested, setHoursRequested] = useState(task.hours_requested);

  const handleHoursChange = (e) => {
    const newHours = e.target.value;
    setHoursRequested(newHours); // Update local state
    onHoursChange(task.author, task.id, newHours); // Trigger the function to handle hours change
  };
  return (
    <div className='note-container'>
      <p>Author: {task.author}</p>
      <p>Tasks Completed: {task.tasks_completed}</p>
      <p>Date: {task.date}</p>
      <p>
            {task.status === "pending" ? (
                    // If the status is pending, render a dropdown
                    <>
                 <p>
                  Hours Requested: 
                  <Input
                    type="number"
                    className="hours-input"
                    value={hoursRequested}
                    onChange={handleHoursChange}
                    // Handle changes to hours_requested
                  />
                </p>
                <select
                    className="select"
                    value={task.status}
                    onChange={(e) => onStatusChange(task.author,task.id, e.target.value)} // Trigger the status change function
                >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                </select></>
                ) : (
                    // If the status is accepted or rejected, just display the status
                    <>
                      <p>Hours Requested: {task.hours_requested}</p>
                      <p>Status: {task.status.charAt(0).toUpperCase() + task.status.slice(1)}</p>
                    </>
                )}
            </p>
    </div>
  )
}

export default TaskManager
