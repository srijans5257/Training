import React, {useEffect} from "react";
import "../styles/Note.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button,Box,Select } from "@chakra-ui/react";
import api from "../api";
function Note({ note, onDelete, role }) {
    const [profiledata, setProfiledata] = useState(null);
    const username = localStorage.getItem('username');
    const created_at = new Date(note.created_at);
    const from_date = new Date(note.from_date);
    const to_date = new Date(note.to_date);
    const [isemployee,setIsemployee]=useState(false)
    const isValidDate = (date) => date instanceof Date && !isNaN(date);

    const formattedCreatedAt = isValidDate(created_at) ? created_at.toLocaleDateString("en-US") : "Invalid Date";
    const formattedFromDate = isValidDate(from_date) ? from_date.toLocaleDateString("en-US") : "Invalid Date";
    const formattedToDate = isValidDate(to_date) ? to_date.toLocaleDateString("en-US") : "Invalid Date";
    const navigate=useNavigate()
    const [selectedDate, setSelectedDate] = useState("");
    const getDateRange = (startDate, endDate) => {
        const dateArray = [];
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            dateArray.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dateArray;
    };
    const dateRange = getDateRange(from_date, to_date);
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };
    const clickHandler=()=>{
        navigate(`/wfhtaskaddition/${note.id}?date=${selectedDate}`)
    }
    const fetchUser=async()=>{
        if (username) {
            const response=await api.get(`/api/profile/${username}/`)
            setProfiledata(response.data)
            if(response.data.role==="employee"){
                    setIsemployee(true);
                }
            // else if(response.data==="manager")
      }}
     useEffect(() => {
       fetchUser()
       }, [username]);
    
    return (<>
        {isemployee&& <Box className="note-container">
            <p className="note-reason">Reason: {note.reason}</p>
            <p className="note-description">Description: {note.description}</p>

            <p className="note-from-date">From: {formattedFromDate}</p>
            <p className="note-to-date">To: {formattedToDate}</p>

            {note.status !== "accepted" && <p className="note-status">Status: {note.status}</p>}
            {note.status === "accepted" && (
                <>
                    <p className="note-status">Status: {note.status}</p>
                    <Select placeholder="Select Date" onChange={handleDateChange} color="white">
                        {dateRange.map((date, idx) => (
                            <option key={idx} value={date.toISOString().split("T")[0]}>
                                {date.toLocaleDateString()}
                            </option>
                        ))}
                    </Select>
                    <Button onClick={clickHandler} colorScheme="blue" size="sm" disabled={!selectedDate}>
                        Add Task for Selected Date
                    </Button>
                </>
            )}

            <p className="note-date">{formattedCreatedAt}</p>
            {note.status === "pending" && (
                <Button className="delete-button" onClick={() => onDelete(note.id)} colorScheme="red">
                    Delete
                </Button>
            )}
        </Box>}
        </>
    );
}

export default Note