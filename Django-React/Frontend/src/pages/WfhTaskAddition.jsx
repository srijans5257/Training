import React, { useState, useEffect } from "react";
import api from "../api";
import { useParams,useNavigate } from "react-router-dom";
import { Button,Box, Heading } from "@chakra-ui/react";
function WfhTaskAddition() {
    const [task, setTask] = useState(null);  // Initialize with null to check task existence
    const [tasks_completed, setTasks_completed] = useState("");
    const [hours_requested, setHours_requested] = useState("");
    const { noteId } = useParams();
    const [isTaskLoaded, setIsTaskLoaded] = useState(false);
    const navigate=useNavigate()
    useEffect(() => {
        // Fetch task for the given noteId
        api.get(`/api/taskaddition/${noteId}/`)
            .then(response => {
                if (response.data.length > 0) {
                    setTask(response.data[0]);  // Assuming only one task per note
                    setIsTaskLoaded(true);  // Task exists
                }
            })
            .catch(error => {
                console.error("Error fetching task:", error);
            });
    }, [noteId]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!task) {
            // If no task exists, create a new task
           api.post(`/api/taskaddition/${noteId}/`, {
                tasks_completed,
                hours_requested
            })
                .then(response => {
                    setTask(response.data);  // Set the new task
                    setIsTaskLoaded(true);   // Task is now loaded
                })
                .catch(error => {
                    console.error("Error creating task:", error);
                });
        } else {
            // Update existing task
             api.put(`/api/tasks/${task.id}/`, {
                tasks_completed,
                hours_requested
            })
                .then(response => {
                    setTask(response.data);  // Update task details
                })
                .catch(error => {
                    console.error("Error updating task:", error);
                });
        }
    };

    // Delete task
    const handleDelete = () => {
        api.delete(`/api/tasks/${task.id}/`)
            .then(() => {
                setTask(null);  // Reset task state
                setIsTaskLoaded(false);  // Task no longer exists
            })
            .catch(error => {
                console.error("Error deleting task:", error);
            });
    };
    const redirecthome=()=>{
        navigate("/")
    }
    return (
        <Box bg="black" h="100vh">
            {!isTaskLoaded ? (
                // Show the task creation form if no task exists
                <div>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Tasks Completed</label>
                            <input
                                type="text"
                                name="task_completed"
                                value={tasks_completed}
                                onChange={(e) => setTasks_completed(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Hours Requested</label>
                            <input
                                type="text"
                                name="hours_requested"
                                value={hours_requested}
                                onChange={(e) => setHours_requested(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" >Create Task</Button>
                    </form>
                    <br/>
                    <Button bg="teal" onClick={redirecthome}>Back to Home Page</Button>
                </div>
            ) : (
                // Show the task details with options to modify or delete if task exists
                <>
                    <div>
                        <Heading color="white">Task for Note {noteId}</Heading>
                        <p>Tasks Completed: {task.tasks_completed}</p>
                        <p>Hours Requested: {task.hours_requested}</p>
                        <p>Status: {task.status}</p>
                        {task.status==='pending'&& <Button onClick={handleDelete}>Delete Task</Button>}
                    </div>
                    <br/>
                    <Button onClick={redirecthome}>Back to Home Page</Button>
                </>
            )}
        </Box>
    );
}

export default WfhTaskAddition;


