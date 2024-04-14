import axios, { type AxiosInstance } from 'axios';
import { baseApiUrl } from '../expressions/apiExp';

import useAuth from '../store/useAuth';

const privateAxios: AxiosInstance = axios.create({
  baseURL: baseApiUrl,

  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + useAuth.getState().token,
  },
});

privateAxios.interceptors.request.use(
  function (config) {
    config.data = {
      ...config.data,
    };
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

const publicAxios: AxiosInstance = axios.create({
  baseURL: baseApiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export { privateAxios, publicAxios };
