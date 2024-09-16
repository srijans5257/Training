import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ManagerDashboard from './components/ManagerDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import { AuthProvider } from './components/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/employee" element={<EmployeeDashboard />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
