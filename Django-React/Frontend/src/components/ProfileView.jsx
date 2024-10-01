import { Button } from '@chakra-ui/react'
import React from 'react'
import "../styles/Note.css";
function ProfileView({profile,onRoleChange}) {
  return (
    <div className='note-container'>
      <p>UserName: {profile.username}</p>
      <p>FirstName: {profile.firstname}</p>
      <p>LastName: {profile.lastname}</p>
      <p>Email: {profile.email}</p>
      <p>Phone No: {profile.phone}</p>
      <p>Role: {profile.role}</p>
      <p>Project: {profile.project_name}</p>
      {/* {profile.role==='employee' && <select
            className="select"
            value={profile.role}
            onChange={(e) => onRoleChange(profile.username, e.target.value)} // Trigger the status change function
        >
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
        </select>}
      <Button>Change Project</Button> */}
    </div>
  )
}

export default ProfileView
