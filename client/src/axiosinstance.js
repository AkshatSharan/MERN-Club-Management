import axios from 'axios';
import { store } from './redux/store';
import { signinFailure } from './redux/userSlice'; // Ensure correct import path

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api', // Adjust according to your backend API base URL
    withCredentials: true, // Ensure credentials (cookies) are sent with requests
});

let isRefreshing = false;
let refreshSubscribers = [];

// Function to notify all subscribers with the new token
const onRefreshed = (accessToken) => {
    refreshSubscribers.forEach((callback) => callback(accessToken));
    refreshSubscribers = [];
};

// Function to add a subscriber to the queue
const addRefreshSubscriber = (callback) => {
    refreshSubscribers.push(callback);
};

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { config, response: { status } = {} } = error;
        const originalRequest = config;

        if (status === 401 && !originalRequest._retry) {
            // If the error is during sign-in, dispatch signinFailure directly
            if (originalRequest.url.includes('/signin')) {
                store.dispatch(signinFailure(error.response?.data?.error || 'Incorrect credentials'));
                return Promise.reject(error);
            }

            // If the error is not during sign-in, handle token refresh
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    addRefreshSubscriber((accessToken) => {
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        resolve(axiosInstance(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const state = store.getState();
                const userType = state.user.userType;

                const refreshEndpoint = userType === 'club' ? '/auth/club/refresh' : '/auth/user/refresh';

                const response = await axiosInstance.post(refreshEndpoint, {}, { withCredentials: true });
                const { accessToken } = response.data;

                localStorage.setItem('accessToken', accessToken);
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                onRefreshed(accessToken)
                return axiosInstance(originalRequest)
            } catch (refreshError) {
                console.error('Token refresh error:', refreshError)
                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    }
)

export default axiosInstance;