import react from "react"
import { BrowserRouter,Routes,Route,Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import ManagerDashboard from "./pages/ManagerDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import WfhTaskAddition from "./pages/WfhTaskAddition"
import { ChakraProvider } from '@chakra-ui/react'
import { useState,useEffect } from "react"
import api from "./api"
function Logout(){
  localStorage.clear()
  return <Navigate to="/login"/>
}
function RegisterAndLogout(){
  return <Register />
}
function App() {
  const username = localStorage.getItem('username');
  const [profiledata, setProfiledata] = useState(null);
  useEffect(() => {
    if (username) {
      api.get(`/api/profile/${username}/`)
        .then(response => setProfiledata(response.data))
        .catch(err => setError('Error fetching profile data'));
    }
  }, [username]);
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
        <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home/>
              </ProtectedRoute>
            }
          />
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
          <Route path="/admindashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
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
