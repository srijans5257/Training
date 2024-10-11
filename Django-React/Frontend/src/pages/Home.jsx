import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import "../styles/Home.css";
import SidebarHome from "../components/SidebarHome"
import { useNavigate } from "react-router-dom";
import {Input,Popover,PopoverTrigger,PopoverContent,PopoverArrow,PopoverCloseButton,PopoverHeader,PopoverBody,VStack,Flex,Box, Heading, Menu, MenuButton, MenuList, MenuItem, Avatar, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure, Text, Image, HStack,Button, Spinner } from "@chakra-ui/react";
import { BellIcon,HamburgerIcon } from "@chakra-ui/icons";
import { Navigate } from "react-router-dom";
function Home() {
  const navigate = useNavigate();
  const [profiledata, setProfiledata] = useState(null);
    // const userRole = profiledata.role;
  const { isOpen, onOpen, onClose } = useDisclosure(); 
  const [notes, setNotes] = useState([]);
  const [description, setDescription] = useState("");
  const [reason, setReason] = useState("");
  const [from_date, setFrom_date] = useState("");
  const [to_date, setTo_date] = useState("");
  const [error, setError] = useState(null);
  const [viewDashboard, setViewDashboard]=useState(true);
  const [viewApplications, setViewApplications]=useState(false);
  const [viewApplicationsCreation, setViewApplicationsCreation]=useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const username = localStorage.getItem('username');
  const [notif,setNotif]=useState([]);
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  useEffect(() => {
    getNotes();
    getNotifications();
    const notificationInterval=setInterval(getNotifications,10000);
    return ()=>clearInterval(notificationInterval)
  }, []);
   const fetchUser=async()=>{
     if (username) {
      try{
         const response=await api.get(`/api/profile/${username}/`)
         setProfiledata(response.data)
         setUpdatedData(response.data)
         if (response.data.role === 'manager') {
           navigate("/managerdashboard")
         }
         else if(response.data.role==='admin'){
          navigate("/admindashboard")
         }
      }catch(err){
        setError('Error fetching profile data')
      };
    }
   }
  useEffect(() => {
    fetchUser()
    }, [username]);
    
  const createNotification = async (notificationData) => {
    await api.post('/api/post/notifications/', notificationData)
    .then(response => {
      console.log('Notification created:', response.data);
      })
      .catch(error => {
        console.error('Error creating notification:', error);
      });
  };
  const getNotifications=async()=>{
    await api.get("/api/get/notificationsemployee")
    .then(response=>{setNotif(response.data)})
    .catch(err=>console.log(err))
  }
  const getNotes = () => {
    api
      .get("/api/notes/")
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
      })
      .catch((err) => alert(err));
  };

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

  const createNote = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/notes/", {
        reason,
        description,
        from_date,
        to_date,
      });
      alert("Application created successfully");
      createNotification({
        project: profiledata.project_name,  
        to: "managers", 
        from_manager: username,  
        status: 'Unread',  
        message: `Application Created by ${username}! Pending for approval.`, 
      });
      setReason("");
      setDescription("")
      setFrom_date("")
      setTo_date("")
      setError(null);
      getNotes();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.non_field_errors[0]);
        alert(`${error.response.data.non_field_errors[0]}`);
      } else {
        alert("Failed to create note.");
      }
    }
  };

  const Logout = () => {
    localStorage.clear();
    navigate("/login");
  };
  const onDashboardClick=()=>{
    setViewDashboard(true);
    setViewApplications(false);
    setViewApplicationsCreation(false);
  }
  const onApplicationsClick=()=>{
    setViewApplications(true);
    setViewDashboard(false);
    setViewApplicationsCreation(false);

  }
  const onApplicationsCreationClick=()=>{
    setViewApplicationsCreation(true);
    setViewApplications(false);
    setViewDashboard(false);

  }
  const notifmarkasread=async(notifId,newStatus)=>{
    await api
          .patch(`/api/update/notif/${notifId}/`, { status:newStatus })  
          .then(() => {
              setNotif((prevNotifs) =>
                  prevNotifs.map((notif) =>
                      notif.id === notifId ? { ...notif, status:newStatus } : notif
                  )
              );
              
          }).then(()=>{getNotifications();})
          .catch((err) => alert("Failed to update status."));
    
  }
  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  const handleChange = (event) => {
    setUpdatedData({ ...updatedData, [event.target.name]: event.target.value });
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
    <Box bg="linear-gradient(to bottom right, #1d253c, #12182a)" h="100vh">
      <Box className="NavBar" display="flex" justifyContent="space-between" alignItems="center" position="sticky" top="0" zIndex="1000" bg="gray.800">
      <SidebarHome isOpen={isSidebarOpen} onDashboardClick={onDashboardClick}
        onApplicationsClick={onApplicationsClick}
        onApplicationCreationClick={onApplicationsCreationClick}/>
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
              <PopoverHeader color="black">Notifications</PopoverHeader>
              <PopoverBody>
                {notif.length > 0 ? (
                  <VStack align="start">
                    {notif.map((notification, index) => (
                      <Box key={index} p={2} borderWidth={1} borderRadius="md" w="100%">
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

      {/* Modal for Profile */}
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
            <Text color="black">Loading profile data... <Spinner></Spinner></Text>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
      {viewDashboard && (
        <Box>
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
            <Heading color="white">Welcome {username}!!</Heading>
          </Box>
        </Flex>
        </Box>
      )}
      {viewApplications&&<Box bg="linear-gradient(to bottom right, #1d253c, #12182a)" h='100vh'><Box display="flex" justifyContent="center" marginTop="10px">
          <Heading color="white">Applications</Heading>
        </Box>
        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap="20px">
          {notes.map((note) => (
            <Note note={note} onDelete={deleteNote} key={note.id}/>
          ))}
        </Box>
      </Box>}
      {viewApplicationsCreation&&<Box bg="linear-gradient(to bottom right, #1d253c, #12182a)" h='100vh'>
        <Box display="flex" justifyContent="center" marginTop="40px">
          <Heading color="white">Create an Application</Heading>
        </Box>
        
        <form onSubmit={createNote} className="application-creation">
          <label htmlFor="reason">Reason:</label>
          <br />
          <input
            type="text"
            id="reason"
            name="reason"
            required
            onChange={(e) => setReason(e.target.value)}
            value={reason}
          />
          <label htmlFor="description">Description:</label>
          <br />
          <textarea
            id="description"
            name="description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <br />
          <label htmlFor="from_date">From:</label>
          <input
            type="date"
            id="from_date"
            name="from_date"
            value={from_date}
            required
            onChange={(e) => setFrom_date(e.target.value)}
          />
          <br />
          <label htmlFor="to_date">To:</label>
          <input
            type="date"
            id="to_date"
            name="to_date"
            value={to_date}
            required
            onChange={(e) => setTo_date(e.target.value)}
          />
          <br />
          <input type="submit" value="Submit" />
          {error && <p>{error}</p>}
        </form>
      </Box>}
    </Box>
  );
}

export default Home;

