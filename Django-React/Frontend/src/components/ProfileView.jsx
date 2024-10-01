import { Button } from '@chakra-ui/react'
import React from 'react'
import "../styles/Note.css";
function ProfileView({profile}) {
  return (
    <div className='note-container'>
      <p>UserName: {profile.username}</p>
      <p>FirstName: {profile.firstname}</p>
      <p>LastName: {profile.lastname}</p>
      <p>Email: {profile.email}</p>
      <p>Phone No: {profile.phone}</p>
      <p>Role: {profile.role}</p>
      <p>Project: {profile.project_name}</p>
    </div>
  )
}

export default ProfileView
