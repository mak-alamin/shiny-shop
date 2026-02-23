import { useEffect, useState } from "react";
import axios from "../auth/axios";

const useUsers = (route = "users") => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Call Sanctum CSRF endpoint first
                await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
                    withCredentials: true,
                });

                const response = await axios.get(
                    "http://localhost:8000/api/" + route,
                    {
                        withCredentials: true,
                    },
                );
                setUsers(response.data.data || response.data);
            } catch (error) {
                console.error("Failed to fetch Users:", error);
            }
        };
        fetchUsers();
    }, []);

    return [users, setUsers];
};

export default useUsers;
