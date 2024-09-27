import React from 'react';
import Form from '../components/Form';
import { useNavigate } from 'react-router-dom';
import { Box,Button,Image } from '@chakra-ui/react';
import "../styles/Register.css"
function Register() {
  const navigate=useNavigate()
  const redirectlogin=()=>{
    navigate("/login")
  }
  return (
    <Box bg="linear-gradient(to bottom right, #1d253c, #12182a)" h="100vh" className='main'>
      <Box className="NavBar" display="flex" justifyContent="space-between" alignItems="center" bg="gray.800">
        <span>
        <Image src="https://beesheetsv2.beehyv.com/assets/images/logo.png" alt="Logo" />
        </span>

      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" h="80%">
        <Form route="/api/user/register/" method="register"/> 
      </Box>
      <br/>
      <p className='to_login'>Already a User? <Button onClick={redirectlogin} bg="#568bf1">Log In</Button></p>
    </Box>
    
  );
}

export default Register;
