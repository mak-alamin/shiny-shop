// axios.ts or auth.ts
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000"; // 'http://localhost:8000'; // Change to your Laravel API
axios.defaults.withCredentials = true; // Send cookies with requests

export default axios;
