import axios from 'axios';
import { store } from './redux/store';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (token) => {
    refreshSubscribers.map((callback) => callback(token));
};

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
        const { config, response: { status } } = error;
        const originalRequest = config;

        if (status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve) => {
                    addRefreshSubscriber((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
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

                const response = await axiosInstance.post(refreshEndpoint);
                const { accessToken } = response.data;
                localStorage.setItem('accessToken', accessToken);
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                onRefreshed(accessToken);
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh error:', refreshError);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
                refreshSubscribers = [];
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
