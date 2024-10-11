import React, { useState } from 'react'
import api from "../api";
import NoteAdmin from '../components/NoteAdmin';
import Sidebar from '../components/Sidebar';
import TaskAdmin from '../components/TaskAdmin';
import ProfileView from '../components/ProfileView';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {Input, Button,Popover,PopoverTrigger,PopoverContent,PopoverArrow,PopoverCloseButton,PopoverHeader,PopoverBody,VStack,Flex,Box, Heading, Menu, MenuButton, MenuList, MenuItem, Avatar, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure, Text, Image, HStack } from "@chakra-ui/react";
import { HamburgerIcon } from '@chakra-ui/icons';
import { BellIcon } from '@chakra-ui/icons';
import SidebarAdmin from '../components/SidebarAdmin';
function ManagerDashboard() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [profiledata, setProfiledata] = useState({}); 
    const [profiles,setProfiles]=useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const username = localStorage.getItem('username');
    const navigate = useNavigate();
    const [viewDashboard, setViewDashboard]=useState(true);
    const [viewApplications, setViewApplications]=useState(false);
    const [viewTasks, setViewTasks]=useState(false);
    const [viewEmployees, setViewEmployees]=useState(false);
    const [notif,setNotif]=useState([]);
    const [err,setError]=useState("");
    const [viewAcceptedApplications, setViewAcceptedApplications]=useState(false);
    const [viewRejectedApplications, setViewRejectedApplications]=useState(false);
    const [viewPendingApplications, setViewPendingApplications]=useState(true);
    const [notesPending, setNotesPending] = useState([]);
    const [notesAccepted, setNotesAccepted] = useState([]);
    const [notesRejected, setNotesRejected] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [updatedData, setUpdatedData] = useState({});
    function Logout(){
        localStorage.clear()
        navigate("/login")
      }
    const [notes, setNotes] = useState([]);
    const [tasks,setTasks]=useState([])
    const getProfiles=()=>{
      api.get("/api/get/allprofilesadmin/")
      .then((res)=>res.data)
        .then((data)=>{
          setProfiles(data);
          console.log(data);
        })
        .catch((err)=>alert(err));
    }
    const onAcceptedClick=()=>{
        setViewAcceptedApplications(true);
        setViewPendingApplications(false);
        setViewRejectedApplications(false);
      }
      const onRejectedClick=()=>{
        setViewAcceptedApplications(false);
        setViewPendingApplications(false);
        setViewRejectedApplications(true);
      }
      const onPendingClick=()=>{
        setViewAcceptedApplications(false);
        setViewPendingApplications(true);
        setViewRejectedApplications(false);
      }
    const onDashboardClick=()=>{
      setViewDashboard(true);
      setViewApplications(false);
      setViewTasks(false);
      setViewEmployees(false);
    }
    const onApplicationsClick=()=>{
      setViewApplications(true);
      setViewDashboard(false);
      setViewTasks(false);
      setViewEmployees(false);
    }
    const onTasksClick=()=>{
      setViewTasks(true);
      setViewApplications(false);
      setViewDashboard(false);
      setViewEmployees(false);
    }
    const onEmployeesClick=()=>{
      setViewEmployees(true);
      setViewApplications(false);
      setViewTasks(false);
      setViewDashboard(false);
    }
    const onRegisterClick=()=>{
      navigate('/register')
    }
    const fetchUser = async () => {
      if (username) {
        try {
          const response = await api.get(`/api/profile/${username}/`);
          setProfiledata(response.data);
          setUpdatedData(response.data)
          if (response.data.role === "employee") {
            navigate("/");
          }
          else if(response.data.role==="manager"){
            navigate("/managerdashboard")
          }
        } catch (err) {
          setError("Error fetching profile data");
        }
      }
    };
    const getTasks=()=>{
        api.get("/api/tasks/")
        .then((res) => res.data)
            .then((data) => {
                setTasks(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };
    const getNotesPending = () => {
        
        api
            .get("/api/notes_manager_pending/")
            .then((res) => res.data)
            .then((data) => {
                setNotesPending(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };
    const getNotesAccepted = () => {
        api
            .get("/api/notes_manager_accepted/")
            .then((res) => res.data)
            .then((data) => {
                setNotesAccepted(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };
  const getNotesRejected = () => {
        api
            .get("/api/notes_manager_rejected/")
            .then((res) => res.data)
            .then((data) => {
                setNotesRejected(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };
    const getNotifications=()=>{
      api.get("/api/get/notificationsmanager")
      .then(response=>setNotif(response.data))
      .catch(err=>setError(err))
    }
    const createNotification = (notificationData) => {
      api.post('/api/post/notifications/', notificationData)
        .then(response => {
          console.log('Notification created:', response.data);
        })
        .catch(error => {
          console.error('Error creating notification:', error);
        });
    };
    const updateNoteStatus = (noteAuthor,noteId, newStatus) => {
        api
            .patch(`/api/notes/${noteId}/`, { status: newStatus }) 
            .then(() => {
                if(newStatus==="accepted")
                  {setNotesAccepted((prevNotes) =>
                      prevNotes.map((note) =>
                          note.id === noteId ? { ...note, status: newStatus } : note
                      )
                  );}
                  else if(newStatus==="rejected"){
                    setNotesRejected((prevNotes) =>
                      prevNotes.map((note) =>
                          note.id === noteId ? { ...note, status: newStatus } : note
                      )
                  );
                  }
                  else{
                    setNotesPending((prevNotes) =>
                      prevNotes.map((note) =>
                          note.id === noteId ? { ...note, status: newStatus } : note
                      )
                  );
                  }
                  getNotesAccepted()
                  getNotesPending()
                  getNotesRejected()
                  getTasks()
            })
            .catch((err) => alert("Failed to update status."));
            createNotification({
              project: profiledata.project_name, 
              to: noteAuthor,  
              from_manager: username, 
              status: 'Unread',  
              message: `Application ${newStatus} by ${username}!`, 
            });
    };
    const updateTaskStatus = (taskAuthor,taskId, newStatus) => {
        api
            .patch(`/api/tasks/${taskId}/`, { status: newStatus })  
            .then(() => {

                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task.id === taskId ? { ...task, status: newStatus } : task
                    )
                );
            })
            .catch((err) => alert("Failed to update status."));
            createNotification({
              project: profiledata.project_name,  
              to: taskAuthor,  
              from_manager: username,  
              status: 'Unread', 
              message: `Task ${newStatus} by ${username}!`, 
            });
    };
    const updateTaskHours_requested = (taskAuthor,taskId, newHours) => {
      api
          .patch(`/api/tasks/${taskId}/`, { hours_requested:newHours })  
          .then(() => {
 
              setTasks((prevTasks) =>
                  prevTasks.map((task) =>
                      task.id === taskId ? { ...task, hours_requested:newHours } : task
                  )
              );
          })
          .catch((err) => alert("Hours_requested is not valid"));
  };
    const updateRole=(username,newRole)=>{
      api.patch(`/api/update/role/${username}`,{role: newRole})
      .then(()=>{
        setProfiles((prevProfiles)=>prevProfiles.map((profile)=>profile.username===username?{...profile,role:newRole}:profile))
      });
    }
    useEffect(() => {
        getNotesPending();
        getNotesAccepted();
        getNotesRejected();
        getTasks();
        getProfiles();
        getNotifications();
        fetchUser();
        const notificationInterval=setInterval(getNotifications,10000);
        return ()=>clearInterval(notificationInterval)
    }, []);
    const deleteNote = (id) => {
        api
            .delete(`/api/notes/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Application deleted!");
                else alert("Failed to delete application.");
                getNotes();
            })
            .catch((error) => alert(error));
    };
    const notifmarkasread=async(notifId,newStatus)=>{
      await api
            .patch(`/api/update/notif/${notifId}/`, { status:newStatus })  
            .then(() => {
                setNotif((prevNotifs) =>
                    prevNotifs.map((notif) =>
                        notif.id === notifId ? { ...notif, status:newStatus } : notif
                    )
                );
            }).then(()=>getNotifications())
            .catch((err) => alert("Failed to update status."));
    }
    const handleEditClick = () => {
      setEditMode(!editMode);
    };
  
    const handleChange = (event) => {
      const { name, value } = event.target;
      let updatedValue = value;
      if (name === 'role') {
        updatedValue = value.charAt(0).toLowerCase() + value.slice(1);
      }

      setUpdatedData({ ...updatedData, [name]: updatedValue });
    };
    const handleSave = async () => {
      const response = await api.put(`/api/update-profile/${username}/`, updatedData);
  
      if (response) {
        setProfiledata(updatedData);
        setEditMode(!editMode);
        onClose();
      } else {
        console.error('Error updating profile:', response.statusText);
      }
    };
  return (
    <Box>
      <SidebarAdmin isOpen={isSidebarOpen} onDashboardClick={onDashboardClick}
        onApplicationsClick={onApplicationsClick}
        onTasksClick={onTasksClick} 
        onEmployeesClick={onEmployeesClick}
        onRegisterClick={onRegisterClick}/>
      <Box className="NavBar" display="flex" justifyContent="space-between" alignItems="center" position="sticky"
        top="0" bg="gray.800">
        <IconButton
          aria-label="Toggle Sidebar"
          icon={<HamburgerIcon boxSize={0} />}
          onClick={() => setIsSidebarOpen(true)}
          bg="transparent"
        />
        <span>
          <Image src="https://beesheetsv2.beehyv.com/assets/images/logo.png" alt="Logo" />
        </span>
        <HStack>
        <Popover>
            <PopoverTrigger>
              <IconButton
                aria-label="Notifications"
                icon={<BellIcon boxSize={8} />}
                variant="ghost"
                size="lg"
                colorScheme="teal"
              />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Notifications</PopoverHeader>
              <PopoverBody >
                {notif.length > 0 ? (
                  <VStack align="start">
                    {notif.map((notification, index) => (
                      <Box key={index} p={2} borderWidth={1} borderRadius="md" w="100%" >
                        <Text color="black"><strong>Message:</strong> {notification.message}</Text>
                        <Text color="black"><strong>Status:</strong> {notification.status}</Text>
                        <Button onClick={()=>notifmarkasread(notification.id,"Read")}>Mark as Read</Button>
                      </Box>
                    ))}
                  </VStack>
                ) : (
                  <Text color="black">No notifications available.</Text>
                )}
              </PopoverBody>
            </PopoverContent>
          </Popover>

          <Menu>
            <MenuButton bg=""as={IconButton} icon={<Avatar size="md" />} aria-label="Profile Menu" />
            <MenuList>
              <MenuItem onClick={onOpen}>Profile</MenuItem>
              <MenuItem onClick={Logout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Box>
      

      <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {profiledata  
        ? (
            <Box color="black">
              <Text color="black">
                <strong>Username:</strong> {profiledata.username}
              </Text>
              {editMode ? (
                <>
                  <Input
                    name="firstname"
                    value={updatedData.firstname}
                    onChange={handleChange}
                    placeholder="First Name"
                    mb={2}
                  />
                  <Input
                    name="lastname"
                    value={updatedData.lastname}
                    onChange={handleChange}
                    placeholder="Last Name"
                    mb={2}
                  />
                  <Input
                    name="email"
                    value={updatedData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    mb={2}
                  />
                  <Input
                    name="phone"
                    value={updatedData.phone}
                    onChange={handleChange}
                    placeholder="Phone No"
                    mb={2}
                  />
                </>
              ) : (
                <>
                  <Text color="black">
                    <strong>First Name:</strong> {profiledata.firstname || "N/A"}
                  </Text>
                  <Text color="black">
                    <strong>Last Name:</strong> {profiledata.lastname || "N/A"}
                  </Text>
                  <Text color="black">
                    <strong>Email:</strong> {profiledata.email || "N/A"}
                  </Text>
                  <Text color="black">
                    <strong>Phone No:</strong> {profiledata.phone || "N/A"}
                  </Text>
                </>
              )}
              <Text color="black">
                <strong>Role:</strong> {profiledata.role}
              </Text>
              <Text color="black">
                <strong>Project:</strong> {profiledata.project_name}
              </Text>
              <Button bg="black" color="white" onClick={editMode ? handleSave : handleEditClick}>
                {editMode ? 'Save' : 'Add/Edit Details'}
              </Button>
            </Box>
          ) : (
            <Text color="black">Loading profile data...</Text>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  {viewDashboard && (
    <Box bg="linear-gradient(to bottom right, #1d253c, #12182a)" h='100vh'>
      <Flex
      alignItems="center"
      justifyContent="center"
      h="100vh"
      w="100%"
    >
      <Box 
        bg="gray.700" 
        p={8} 
        borderRadius="md" 
        textAlign="center"
        boxShadow="lg"
      >
        <Heading color="white">Welcome {profiledata.username}!!</Heading>
      </Box>
    </Flex>
    </Box>
  )}

{viewApplications&&<Box bg="linear-gradient(to bottom right, #1d253c, #12182a)" h='100vh'><Box display="flex" justifyContent="center" marginTop="10px">
  {viewPendingApplications&&<Heading color="white">Pending Applications</Heading>}
  {viewAcceptedApplications&&<Heading color="white">Accepted Applications</Heading>}
  {viewRejectedApplications&&<Heading color="white">Rejected Applications</Heading>}
        </Box>
        <Box display="flex" justifyContent="center" marginTop="10px">
          <Button marginRight="20px" onClick={onAcceptedClick}>Accepted</Button>
          <Button marginRight="20px" onClick={onRejectedClick}>Rejected</Button>
          <Button onClick={onPendingClick} zIndex="0" >Pending</Button>
        </Box>
        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap="20px">
        {viewPendingApplications && notesPending.map((note) => (
            <NoteAdmin note={note} onDelete={deleteNote} onStatusChange={updateNoteStatus} key={note.id} />
        ))}
        {viewAcceptedApplications && notesAccepted.map((note) => (
            <NoteAdmin note={note} onDelete={deleteNote} onStatusChange={updateNoteStatus} key={note.id} />
        ))}
        {viewRejectedApplications && notesRejected.map((note) => (
            <NoteAdmin note={note} onDelete={deleteNote} onStatusChange={updateNoteStatus} key={note.id} />
        ))}
        </Box>
        
    </Box>}
    {viewTasks&&<Box bg="linear-gradient(to bottom right, #1d253c, #12182a)" h='100vh'><Box display="flex" justifyContent="center" >
          <Heading color="white">Tasks</Heading>
        </Box>
        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap="20px">
        {tasks.map((task) => (
            <TaskAdmin task={task} onStatusChange={updateTaskStatus} key={task.id} onHoursChange={updateTaskHours_requested}/>
        ))}</Box>
    </Box>}
    {viewEmployees&&<Box bg="linear-gradient(to bottom right, #1d253c, #12182a)" h='100vh'><Box display="flex" justifyContent="center" >
          <Heading color="white">All Employees in Project</Heading>
        </Box>
        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap="20px">
      {profiles.map((profile)=>(
        <ProfileView profile={profile} key={profile.username}/>
      ))}</Box>
    </Box>}
    </Box>
  )
}

export default ManagerDashboard;
