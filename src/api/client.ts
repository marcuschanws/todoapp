import axios from 'axios';
import { logger } from '../utility/logger';

export const apiClient = axios.create({
  baseURL: 'https://localhost:7121',
  //import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
apiClient.interceptors.request.use(config => {
  logger.info(`Request: ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  response => {
    logger.info(`Response: ${response.status} ${response.config.url}`);
    return response;
  },
  error => {
    logger.error('API Error', error);
    return Promise.reject(error);
  }
);