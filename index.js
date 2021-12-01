import axios from "axios";
import {
  CancelManyRequest, common_options
} from './common';

function myAxios(axiosConfig, commonOptions = common_options) {
  const initRequest = axios.create({
    baseURL: (import.meta.env.VITE_APP_BASE_URL) as string,
    timeout: 10000,
    withCredentials: true,
  })
  
  initRequest.interceptors.request.use((config) => {
    CancelManyRequest.removePending(config)
    commonOptions.repeat_request_cancel && CancelManyRequest.addPending(config);
    return config
  }, error => {
    return Promise.reject(error);
  })
  
  initRequest.interceptors.response.use((response) => {
    CancelManyRequest.removePending(response.config);
    
    return response
  }, error => {
    error.config && CancelManyRequest.removePending(error.config);
    return Promise.reject(error);
  })
  return initRequest(axiosConfig)
}



export default myAxios
