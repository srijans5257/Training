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
    <Box bg="linear-gradient(to bottom right, #1d253c, #12182a)" h='100vh'className='main' color="#f5f5f5">
      <Box className="NavBar" display="flex" justifyContent="space-between" alignItems="center" bg="gray.800">
        <span>
        <Image src="https://beesheetsv2.beehyv.com/assets/images/logo.png" alt="Logo" />
        </span>

      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" h="80%">
        <Form route="/api/token/" method="login" />
      </Box>
      {/* <p className='to_signup'><strong>New User?</strong> <Button onClick={redirectregister} bg="#568bf1">Sign up</Button></p> */}
    </Box>
  )
}

export default Login
