import React from 'react'
import Form from '../components/Form'
import { useNavigate } from 'react-router-dom'
import { Button,Box,Image } from '@chakra-ui/react'
import "../styles/Login.css"
function Login() {
  const navigate=useNavigate()
  const redirectregister=()=>{

    navigate("/register")
  }
  return (
    <Box bg="black" h='100vh'className='main'>
      <Box className="NavBar" display="flex" justifyContent="space-between" alignItems="center">
        <span>
        <Image src="https://beesheetsv2.beehyv.com/assets/images/logo.png" alt="Logo" />
        </span>

      </Box>
      <Form route="/api/token/" method="login"/>
      <p className='to_signup'><strong>New User?</strong> <Button onClick={redirectregister}>Sign up</Button></p>
    </Box>
  )
}

export default Login
