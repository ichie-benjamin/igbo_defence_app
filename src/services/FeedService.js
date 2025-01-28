import {apiConstants} from '../constants';
import {logFunction} from "../helpers/FunctionHelper";

import { axiosInstance } from "../config";

const getVideos = async (page) => {
logFunction('apiConstants.getVideos',apiConstants.BACKEND_API.GET_VIDEOS+'?page='+page)
  try {
    const response = await axiosInstance.get(apiConstants.BACKEND_API.GET_VIDEOS+'?page='+page);
      // logFunction('response', response?.data?.data)
      return {
        status: true,
        current_page : response.data.current_page,
        message: `videos data fetched`,
        data: response?.data?.data,
      };

  } catch (error) {
    logFunction('error', error?.response?.data)
    return {
      status: false,
      message: `videos data not found`,
    };
  }
};
const getShorts = async (page) => {
logFunction('apiConstants.getShorts', apiConstants.BACKEND_API.GET_SHORTS+'?page='+page)
  try {
    const response = await axiosInstance.get(apiConstants.BACKEND_API.GET_SHORTS+'?page='+page);
      // logFunction('response', response?.data?.data)
      return {
        status: true,
        current_page : response.data.current_page,
        message: `shorts data fetched`,
        data: response?.data?.data,
      };

  } catch (error) {
    logFunction('error', error?.response?.data)
    return {
      status: false,
      message: `shorts data not found`,
    };
  }
};
const getUserShorts = async (user_id,page) => {
logFunction('apiConstants.getUserShorts', apiConstants.BACKEND_API.GET_USER_SHORTS+'/'+page)
  try {
    const response = await axiosInstance.get(apiConstants.BACKEND_API.GET_USER_SHORTS+'/'+user_id+'?page='+page);
      // logFunction('response', response?.data?.data)
      return {
        status: true,
        current_page : response.data.current_page,
        message: `shorts data fetched`,
        data: response?.data?.data,
      };

  } catch (error) {
    logFunction('error', error?.response?.data)
    return {
      status: false,
      message: `shorts data not found`,
    };
  }
};

const increaseView = async (sendData) => {
  let key = 'update user lat lng';
  try {
    const { data } = await axiosInstance.post(apiConstants.BACKEND_API.INCREASE_VIEW, sendData);
    // logFunction(key, data.message)
    return {
      status: true,
      message: `${key} success`,
      data: data?.data,
    };
  } catch (error) {
    // logFunction('error', error?.response?.data)
    return {
      status: false,
      data : error?.response?.data,
      message: `${key}  data not found`,
    };
  }
};
const toggleLike = async (sendData) => {
  let key = 'update user lat lng';
  try {
    const { data } = await axiosInstance.post(apiConstants.BACKEND_API.TOGGLE_LIKE, sendData);
    // logFunction(key, data.message)
    return {
      status: true,
      message: `${key} success`,
      data: data?.data,
    };
  } catch (error) {
    logFunction('error', error?.response?.data)
    return {
      status: false,
      data : error?.response?.data,
      message: `${key}  data not found`,
    };
  }
};


export default {
  getVideos,
  getShorts,
  increaseView,
  toggleLike,
  getUserShorts,
};
