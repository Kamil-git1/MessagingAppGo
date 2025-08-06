import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // Adjust the URL as needed

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const sendMessage = async (messageData) => {
    try {
        const response = await axios.post(`${API_URL}/messages`, messageData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const fetchMessages = async (chatId) => {
    try {
        const response = await axios.get(`${API_URL}/messages/${chatId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};