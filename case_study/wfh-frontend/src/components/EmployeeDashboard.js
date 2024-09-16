import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EmployeeDashboard() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [hoursRequested, setHoursRequested] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch all projects and employee's applications
  useEffect(() => {
    // Fetch projects to populate dropdown
    axios.get('http://localhost:8000/api/projects/')
      .then(res => setProjects(res.data))
      .catch(err => console.error('Error fetching projects:', err));

    // Fetch employee's past WFH applications
    axios.get('http://localhost:8000/api/wfh-applications/')
      .then(res => {
        setApplications(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching applications:', err);
        setError('Failed to load WFH applications');
        setLoading(false);
      });
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const newApplication = {
      project: selectedProject,
      task_description: taskDescription,
      hours_requested: hoursRequested,
    };

    axios.post('http://localhost:8000/api/wfh-applications/', newApplication)
      .then((res) => {
        setSuccessMessage('WFH application submitted successfully!');
        setApplications([...applications, res.data]);
        // Reset form fields
        setSelectedProject('');
        setTaskDescription('');
        setHoursRequested('');
      })
      .catch((err) => {
        console.error('Error submitting WFH application:', err);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Apply for WFH</h1>

      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        {/* Project Selection */}
        <div>
          <label htmlFor="project">Select Project:</label>
          <select
            id="project"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            required
          >
            <option value="">--Select Project--</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {/* Task Description */}
        <div>
          <label htmlFor="taskDescription">Task Description:</label>
          <textarea
            id="taskDescription"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            required
          />
        </div>

        {/* Hours Requested */}
        <div>
          <label htmlFor="hoursRequested">Hours Requested:</label>
          <input
            type="number"
            id="hoursRequested"
            value={hoursRequested}
            onChange={(e) => setHoursRequested(e.target.value)}
            required
            min="1"
          />
        </div>

        <button type="submit">Submit WFH Application</button>
      </form>

      <h2>Your Past WFH Applications</h2>
      {applications.length === 0 ? (
        <p>No WFH applications yet.</p>
      ) : (
        applications.map(app => (
          <div key={app.id} className="application-card">
            <p>Project: {app.project.name}</p>
            <p>Status: {app.status}</p>
            <p>Task: {app.task_description}</p>
            <p>Hours Requested: {app.hours_requested}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default EmployeeDashboard;
