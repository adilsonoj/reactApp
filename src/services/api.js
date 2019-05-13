import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8080/api/',
    withCredentials: true,
    headers: {'Access-Control-Allow-Origin': '*'},
   
   
});

export default api;