import axios from 'axios';

const { API_URL } = process.env;

const instance = axios.create({
  baseURL: 'http://localhost:8080/geoserver',
});



export default instance;
