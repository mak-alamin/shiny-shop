import axios from "./axios";

const LogoutButton = () => {
    const handleLogout = async () => {
        try {
            await axios.get("/sanctum/csrf-cookie");
            await axios.post("/api/logout");

            // Remove any local storage/session storage tokens if used
            // localStorage.removeItem('token');

            // Redirect using react-router if available, fallback to window.location
            window.location.replace("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="py-2 px-3 block rounded leading-none bg-red-500 hover:bg-red-700 text-white"
        >
            Logout
        </button>
    );
};

export default LogoutButton;
