import React from "react";
import "../styles/Note.css";
import { useNavigate } from "react-router-dom";
import { Button,Box } from "@chakra-ui/react";
function Note({ note, onDelete }) {
    const formattedDate = new Date(note.created_at).toLocaleDateString("en-US")
    const from_date=new Date(note.from_date).toLocaleDateString("en-US")
    const to_date=new Date(note.to_date).toLocaleDateString("en-US")
    const navigate=useNavigate()
    const clickHandler=()=>{
        navigate(`/wfhtaskaddition/${note.id}`)
    }
    return (
        <Box className="note-container">
            <p className="note-reason">Reason: {note.reason}</p>
            <p className="note-description">Description: {note.description}</p>
            
            <p className="note-from-date">From: {from_date}</p>
            <p className="note-to-date">To: {to_date}</p>
            {note.status!="accepted" && <p className="note-status">Status: {note.status}</p>}
            {note.status==="accepted" && <><p className="note-status">Status: {note.status}</p>
            <Button onClick={clickHandler} colorScheme="blue" size='sm'>Add Task</Button></>
            }
            <p className="note-date">{formattedDate}</p>
            {note.status==="pending" && <Button className="delete-button" onClick={() => onDelete(note.id)} colorScheme="red">
                Delete
            </Button>}
        </Box>
    );
}

export default Note