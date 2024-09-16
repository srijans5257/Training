import React, {  useEffect, useState } from 'react';
import axios from 'axios';

function ManagerDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all WFH applications
    axios.get('http://localhost:8000/api/wfh-applications/')
      .then(res => {
        console.log(res.data);
        setApplications(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load WFH applications');
        setLoading(false);
      });
  }, []);

  // Handle Approve
  const handleApprove = (id) => {
    axios.patch(`http://localhost:8000/api/wfh-applications/${id}/`, { status: 'APPROVED' })
      .then(res => {
        // Update the application status locally
        setApplications(applications.map(app => 
          app.id === id ? { ...app, status: 'APPROVED' } : app
        ));
      })
      .catch(err => console.error('Error approving application:', err));
  };

  // Handle Reject
  const handleReject = (id) => {
    axios.patch(`http://localhost:8000/api/wfh-applications/${id}/`, { status: 'REJECTED' })
      .then(res => {
        // Update the application status locally
        setApplications(applications.map(app => 
          app.id === id ? { ...app, status: 'REJECTED' } : app
        ));
      })
      .catch(err => console.error('Error rejecting application:', err));
  };

  if (loading) {
    return <div>Loading applications...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>WFH Applications for Approval</h1>
      {applications.length === 0 ? (
        <p>No WFH applications available.</p>
      ) : (
        applications.map(app => (
          <div key={app.id} className="application-card">
            <p>Employee: {app.employee.user.username}</p>
            <p>Project: {app.project.name}</p>
            <p>Status: {app.status}</p>

            {app.status === 'PENDING' && (
              <div>
                <button onClick={() => handleApprove(app.id)}>Approve</button>
                <button onClick={() => handleReject(app.id)}>Reject</button>
              </div>
            )}

            {app.status !== 'PENDING' && (
              <p>Application is {app.status.toLowerCase()}.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default ManagerDashboard;
