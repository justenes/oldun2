import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:5000/tasks"  
});

export default instance;
