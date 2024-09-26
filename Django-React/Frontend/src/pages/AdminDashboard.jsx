import React, { useState } from 'react'
import api from "../api";
import NoteAdmin from '../components/NoteAdmin';
import Sidebar from '../components/Sidebar';
import TaskAdmin from '../components/TaskAdmin';
import ProfileView from '../components/ProfileView';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button,Popover,PopoverTrigger,PopoverContent,PopoverArrow,PopoverCloseButton,PopoverHeader,PopoverBody,VStack,Flex,Box, Heading, Menu, MenuButton, MenuList, MenuItem, Avatar, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure, Text, Image, HStack } from "@chakra-ui/react";
import { HamburgerIcon } from '@chakra-ui/icons';
import { BellIcon } from '@chakra-ui/icons';
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
    const getTasks=()=>{
        api.get("/api/tasks/")
        .then((res) => res.data)
            .then((data) => {
                setTasks(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };
    const getNotes = () => {
        
        api
            .get("/api/notes_manager/")
            .then((res) => res.data)
            .then((data) => {
                setNotes(data);
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
            .patch(`/api/notes/${noteId}/`, { status: newStatus })  // Call the API to update the note status
            .then(() => {
                // Update the note status in the state
                setNotes((prevNotes) =>
                    prevNotes.map((note) =>
                        note.id === noteId ? { ...note, status: newStatus } : note
                    )
                );
            })
            .catch((err) => alert("Failed to update status."));
            createNotification({
              project: profiledata.project_name,  // Example project ID
              to: noteAuthor,  // The user receiving the notification
              from_manager: username,  // The manager creating the notification
              status: 'Unread',  // Notification status
              message: `Application ${newStatus} by ${username}!`,  // Custom message
            });
    };
    const updateTaskStatus = (taskAuthor,taskId, newStatus) => {
        api
            .patch(`/api/tasks/${taskId}/`, { status: newStatus })  // Call the API to update the note status
            .then(() => {
                // Update the note status in the state
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task.id === taskId ? { ...task, status: newStatus } : task
                    )
                );
            })
            .catch((err) => alert("Failed to update status."));
            createNotification({
              project: profiledata.project_name,  // Example project ID
              to: taskAuthor,  // The user receiving the notification
              from_manager: username,  // The manager creating the notification
              status: 'Unread',  // Notification status
              message: `Task ${newStatus} by ${username}!`,  // Custom message
            });
    };
    const updateTaskHours_requested = (taskAuthor,taskId, newHours) => {
      api
          .patch(`/api/tasks/${taskId}/`, { hours_requested:newHours })  
          .then(() => {
              // Update the note status in the state
              setTasks((prevTasks) =>
                  prevTasks.map((task) =>
                      task.id === taskId ? { ...task, hours_requested:newHours } : task
                  )
              );
          })
          .catch((err) => alert("Failed to update status."));
  };
    const updateRole=(username,newRole)=>{
      api.patch(`/api/update/role/${username}`,{role: newRole})
      .then(()=>{
        setProfiles((prevProfiles)=>prevProfiles.map((profile)=>profile.username===username?{...profile,role:newRole}:profile))
      });
    }
    useEffect(() => {
        getNotes();
        getTasks();
        getProfiles();
        getNotifications();
    }, []);
    useEffect(() => {
        if (username) {
          api.get(`/api/profile/${username}/`)
            .then(response => setProfiledata(response.data))
            .catch(err =>console.log(err));
        }
      }, [username]);
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
                // Update the note status in the state
                setNotif((prevNotifs) =>
                    prevNotifs.map((notif) =>
                        notif.id === notifId ? { ...notif, status:newStatus } : notif
                    )
                );
            })
            .catch((err) => alert("Failed to update status."));
    }
  return (
    <Box>
      <Sidebar isOpen={isSidebarOpen} onDashboardClick={onDashboardClick}
        onApplicationsClick={onApplicationsClick}
        onTasksClick={onTasksClick} 
        onEmployeesClick={onEmployeesClick}/>
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
          <ModalBody >
            {profiledata ? (
              <Box color="black">
                <Text color="black"><strong>Username:</strong> {profiledata.username}</Text>
                <Text color="black"><strong>Role:</strong> {profiledata.role}</Text>
                <Text color="black"><strong>Project:</strong> {profiledata.project_name}</Text>
              </Box>
            ) : (
              <Text color="black">Loading profile data...</Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
  {viewDashboard && (
    <Box bg="Black">
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

     {viewApplications&& <Box bg="black" h="100vh">
        <Heading color="white">Applications</Heading>
        {notes.map((note) => (
            <NoteAdmin note={note} onDelete={deleteNote} onStatusChange={updateNoteStatus} key={note.id} />
        ))}
    </Box>}
    {viewTasks&&<Box bg="black" h="100vh">
        <Heading color="white">Tasks</Heading>
        {tasks.map((task) => (
            <TaskAdmin task={task} onStatusChange={updateTaskStatus} key={task.id} onHoursChange={updateTaskHours_requested}/>
        ))}
    </Box>}
    {viewEmployees&&<Box bg="black" h="100vh">
      <Heading color='white'>All Employees in Project</Heading>
      {profiles.map((profile)=>(
        <ProfileView profile={profile} onRoleChange={updateRole} key={profile.username}/>
      ))}
    </Box>}
    </Box>
  )
}

export default ManagerDashboard;
