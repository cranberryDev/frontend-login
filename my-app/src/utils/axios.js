import axios from "axios";

const axiosAPI = axios.create({
    // baseURL: "http://localhost:8080"
     baseURL: process.env.REACT_APP_prod
});

export default axiosAPI;
