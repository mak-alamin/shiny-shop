// axios.ts or auth.ts
import axios from "axios";

axios.defaults.baseURL = "http://green-shop.test"; // 'http://green-shop.test'; // Change to your Laravel API
axios.defaults.withCredentials = true; // Send cookies with requests

export default axios;
