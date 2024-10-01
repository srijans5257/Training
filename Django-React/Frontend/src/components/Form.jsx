import { useState , useEffect} from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";
import { useToast,Select,Button,Heading, Input} from "@chakra-ui/react";
function Form({ route, method }) {
    const toast = useToast()
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState(""); 
    const [project, setProject] = useState(""); 
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";
    
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get("/api/projects/"); 
                setProjects(res.data); 
            } catch (error) {
                console.error("Error fetching projects:", error);
                alert("Failed to load projects.");
            }
        };
    
        if (method === "register") {
            fetchProjects();
        }
    }, [method]);

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            const res = await api.post(route, { username, password, role,project });  // Send role in the request
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                const profileRes = await api.get("/api/user/profile/", {
                    headers: {
                        Authorization: `Bearer ${res.data.access}`,
                    },
                });
                const username = profileRes.data.username;
                localStorage.setItem('username', username);
                const userRole = profileRes.data.role;  // Fetch the user's role from profile
                if (userRole === "manager") {
                    toast({
                        title: 'Login Successful',
                        // description: "We've created your account for you.",
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                      })
                    navigate("/managerdashboard");
                }
                else if (userRole === "Admin") {
                    toast({
                        title: 'Login Successful',
                        // description: "We've created your account for you.",
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                      })
                    navigate("/admindashboard");
                }
                else {
                    toast({
                        title: 'Login Successful',
                        // description: "We've created your account for you.",
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                      })
                    navigate("/");
                }
                
            } else {
                toast({
                    title: 'Account created.',
                    description: "We've created your account for you.",
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                  })
                navigate("/admindashboard");
            }
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <Heading color="#ffffff">{name}</Heading>
            <Input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                bg="#f5f5f5"
                color="black"
                _placeholder={{color:"black"}}
            />
            <Input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                bg="#f5f5f5"
                color="black"
                _placeholder={{color:"black"}}
            />
            <br/>
            {method === "register" && (
                <>
                    <Select
                        className="form-input"
                        value={role}
                        onChange={(e) => setRole(e.target.value)} 
                        bg="#f5f5f5"
                        color="black"
                    >
                        <option value="">Select Role</option>
                        <option value="manager">Manager</option>
                        <option value="employee">Employee</option>
                        <option value="Admin">Admin</option>
                    </Select>
                    <br/>
                    <Select
                    size="md"
                        className="form-input"
                        value={project}
                        onChange={(e) => setProject(e.target.value)} 
                        bg="#f5f5f5"
                        color="black"
                        marginTop="20px"
                    >
                        <option value="">Select Project</option>  
                        {projects.length > 0 ? (  
                            projects.map((proj) => (
                                <option key={proj.id} value={proj.id}>
                                    {proj.name}
                                </option>
                            ))
                        ) : (
                            <option value="" disabled>No Projects Available</option> 
                        )}
                    </Select>
                </>
            )}
            <br/>
            {loading && <LoadingIndicator />}
            <Button className="form-button" type="submit" bg="#568bf1" color="#f5f5f5">
                {name}
            </Button>
        </form>
    );
}

export default Form;
