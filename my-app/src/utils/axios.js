import axios from "axios";

const axiosAPI = axios.create({
     baseURL: "http://localhost:8080"
     
});

export default axiosAPI;
