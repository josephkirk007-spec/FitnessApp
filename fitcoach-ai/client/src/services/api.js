import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api/v1', // Replace with your backend API URL
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        let savedUser = null;

        try {
            savedUser = JSON.parse(
                localStorage.getItem("user") || "null"
            );
        } catch (error) {
            console.error("Unable to read saved user:", error);
        }

        const token = 
           localStorage.getItem("token") ||
           savedUser?.token ||
           savedUser?.accessToken;

           console.log(
            "Auth Header Being Added:",
            Boolean(token)
           );

           if (token) {
            config.headers.Authorization = `Bearer ${token}`;
           }

           return config;
    },

    (error) => {
        return Promise.reject(error)
    }
);

export default api;