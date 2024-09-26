import react from "react"
import { BrowserRouter,Routes,Route,Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import ManagerDashboard from "./pages/ManagerDashboard"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import WfhTaskAddition from "./pages/WfhTaskAddition"
import { ChakraProvider } from '@chakra-ui/react'
function Logout(){
  localStorage.clear()
  return <Navigate to="/login"/>
}
function RegisterAndLogout(){
  localStorage.clear()
  return <Register />
}
function App() {

  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Home></Home>
            </ProtectedRoute>
          }/>
          <Route path="/login" element={
            <Login />
          }/>
          <Route path="/logout" element={
            <Logout/>
          }/>
          <Route path="/register" element={
            <RegisterAndLogout/>
          }/>
          <Route path="/managerdashboard" element={
            <ProtectedRoute>
              <ManagerDashboard />
            </ProtectedRoute>
            
          }/>
          <Route path="/wfhtaskaddition/:noteId" element={
            <ProtectedRoute>
              <WfhTaskAddition />
            </ProtectedRoute>
          }/>
          <Route path="*" element={
            <NotFound/>
          }/>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  )
}

export default App
