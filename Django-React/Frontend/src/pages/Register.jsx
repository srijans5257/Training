import React from 'react';
import Form from '../components/Form';
import { useNavigate } from 'react-router-dom';
import { Box,Button,Image } from '@chakra-ui/react';
import "../styles/Login.css"
function Register() {
  const navigate=useNavigate()
  const redirectlogin=()=>{
    navigate("/login")
  }
  return (
    <Box bg='black' h="100vh" className='main'>
      <Box className="NavBar" display="flex" justifyContent="space-between" alignItems="center">
        <span>
        <Image src="https://beesheetsv2.beehyv.com/assets/images/logo.png" alt="Logo" />
        </span>

      </Box>
      <Form route="/api/user/register/" method="register"/> 
      <br/>
      <p className='to_login'>Already a User? <Button onClick={redirectlogin}>Log In</Button></p>
    </Box>
    
  );
}

export default Register;
