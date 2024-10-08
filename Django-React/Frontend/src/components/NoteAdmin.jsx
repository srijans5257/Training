import React from "react";
import "../styles/Note.css"

function NoteAdmin({ note, onDelete ,onStatusChange}) {
    const formattedDate = new Date(note.created_at).toLocaleDateString("en-US")
    const from_date=new Date(note.from_date).toLocaleDateString("en-US")
    const to_date=new Date(note.to_date).toLocaleDateString("en-US")
    
    return (
        <div className="note-container">
            <p className="note-author">Author: {note.author}</p>
            <p className="note-reason">Reason: {note.reason}</p>
            <p className="note-description">Description: {note.description}</p>
            
            <p className="note-from-date">From: {from_date}</p>
            <p className="note-to-date">To: {to_date}</p>
            <p className="note-status">
                <select
                    className="select"
                    value={note.status}
                    onChange={(e) => onStatusChange(note.author,note.id, e.target.value)}
                >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                </select>
            </p>
            <p className="note-date">{formattedDate}</p>
        </div>
    );
}

export default NoteAdmin