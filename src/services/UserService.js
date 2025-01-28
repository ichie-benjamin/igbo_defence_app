
import {axiosInstance} from "../config";
import {apiConstants} from "../constants";
import {logFunction} from "../helpers/FunctionHelper";

const updateUserData = async (sendData) => {
  let key = 'update user';
  try {
    const { data } = await axiosInstance.post(apiConstants.BACKEND_API.UPDATE_USER, sendData);
    // logFunction(key, data)
    return {
      status: true,
      message: data.message,
      data: data?.data,
    };
  } catch (error) {
    logFunction('error', error.message)
    return {
      status: false,
      data : error?.response?.data,
      message: `${key}  data not found`,
    };
  }
};

const getUserData = async () => {
  let key = 'get user data';
  try {
    const { data : response } = await axiosInstance.post(apiConstants.BACKEND_API.GET_USER);
    // logFunction(key, response)
    return {
      status: true,
      message: `${key} success`,
      data: response?.data,
    };
  } catch (error) {
    logFunction('error', error.message)
    return {
      status: false,
      data : error?.response?.data,
      message: `${key}  data not found`,
    };
  }
};

const updateUserCarData = async (sendData) => {
  let key = 'update user car';
  try {
    const { data } = await axiosInstance.post(apiConstants.BACKEND_API.UPDATE_USER_CAR, sendData);
    // logFunction(key, data)
    return {
      status: true,
      message: `${key} success`,
      data: data?.data,
    };
  } catch (error) {
    logFunction('error', error)
    return {
      status: false,
      data : error?.response?.data,
      message: `${key}  data not found`,
    };
  }
};

const updateLatLng = async (sendData) => {
  let key = 'update user lat lng';
  try {
    const { data } = await axiosInstance.post(apiConstants.BACKEND_API.UPDATE_USER_LATLNG, sendData);
    logFunction(key, data.message)
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

const getPaymentLink = async (sendData) => {
  let key = 'get payment link';
  try {
    const { data } = await axiosInstance.post(apiConstants.BACKEND_API.GET_PAYMENT_LINK, sendData);
    // logFunction(key, data)
    return {
      status: true,
      message: `${key} success`,
      data: data?.data,
    };
  } catch (error) {
    logFunction('error', error)
    return {
      status: false,
      data : error?.response?.data,
      message: `${key}  data not found`,
    };
  }
};

const getTransactions = async (sendData) => {
  let key = 'get transactions';
  try {
    const { data } = await axiosInstance.post(apiConstants.BACKEND_API.TRANSACTIONS, sendData);
    // logFunction("data.data.current_page", data.data.current_page)
    return {
      status: true,
      current_page : data.data.current_page,
      message: `${key} success`,
      data: data?.data?.data,
    };
  } catch (error) {
    logFunction('error', error)
    return {
      status: false,
      data : error?.response?.data,
      message: `${key}  data not found`,
    };
  }
};
const getNotifications = async (sendData) => {
  let key = 'get notifications';
  try {
    const { data } = await axiosInstance.post(apiConstants.BACKEND_API.NOTIFICATIONS, sendData);
    // logFunction("data.data.current_page", data.data.current_page)
    return {
      status: true,
      current_page : data.data.current_page,
      message: `${key} success`,
      data: data?.data?.data,
    };
  } catch (error) {
    logFunction('error', error)
    return {
      status: false,
      data : error?.response?.data,
      message: `${key}  data not found`,
    };
  }
};

const getLives = async (sendData) => {
  let key = 'get lives';
  try {
    const { data } = await axiosInstance.get(apiConstants.BACKEND_API.LIVES);
    // logFunction("data.data.current_page", data.data.current_page)
    return {
      status: true,
      current_page : data.current_page,
      message: `${key} success`,
      data: data?.data,
    };
  } catch (error) {
    logFunction('error', error)
    return {
      status: false,
      data : error?.response?.data,
      message: `${key}  data not found`,
    };
  }
};

const getEarnings = async (sendData) => {
  let key = 'get earnings';
  try {
    const { data } = await axiosInstance.post(apiConstants.BACKEND_API.EARNINGS, sendData);
    // logFunction("meta", data.meta)
    return {
      status: true,
      current_page : data?.data?.current_page,
      message: `${key} success`,
      data: data?.data?.data,
      meta: data?.meta,
    };
  } catch (error) {
    logFunction('error', error)
    return {
      status: false,
      data : error?.response?.data,
      message: `${key}  data not found`,
    };
  }
};

const updateAvatar = async (sendData) => {
  let key = 'update user avatar';
  try {
    const  { data : response }  = await axiosInstance.post(apiConstants.BACKEND_API.UPDATE_USER, sendData,
        {headers: { 'Content-Type': 'multipart/form-data'}});
    return {
      status: true,
      message: response.message,
      data: response?.data,
    };
  } catch (error) {
    logFunction('error', error.response.data)
    return {
      status: false,
      data : error?.response?.data,
      message: `${key}  data not found`,
    };
  }
};

const updateOnlineStatus = async (_status) => {
  let key = 'update online status';
  try {
    const  { data : response }  = await axiosInstance.post(apiConstants.BACKEND_API.UPDATE_ONLINE_STATUS, { status : _status});
   // logFunction(key, response.data)
    return {
      status: true,
      message: response.message,
      data: response?.data,
    };
  } catch (error) {
    logFunction('error', error.message)
    return {
      status: false,
      data : error?.response?.data ?? error.message,
      message: `${key}  data not found`,
    };
  }
};

const RequestOTPCode = async (sendData) => {
  let key = 'request otp code';
  try {
    const  { data : response }  = await axiosInstance.post(apiConstants.BACKEND_API.REQUEST_OTP_CODE, sendData);
   // logFunction(key, response.data)
    return {
      status: true,
      message: response.message,
      data: response?.data,
    };
  } catch (error) {
    logFunction('error', error.message)
    return {
      status: false,
      data : error?.response?.data ?? error.message,
      message: `${key}  data not found`,
    };
  }
};

const setPin = async (sendData) => {
  let key = 'Set pin';
  try {
    const  { data : response }  = await axiosInstance.post(apiConstants.BACKEND_API.SET_PIN, sendData);
   // logFunction(key, response.data)
    return {
      status: true,
      message: response.message,
      data: response?.data,
    };
  } catch (error) {
    logFunction('error', error.message)
    return {
      status: false,
      data : error?.response?.data ?? error.message,
      message: `${key}  data not found`,
    };
  }
};

const followUser = async (sendData) => {
  let key = 'followUser';
  try {
    const  { data : response }  = await axiosInstance.post(apiConstants.BACKEND_API.FOLLOW_USER, sendData);
   // logFunction(key, response.data)
    return {
      status: true,
      message: response.message,
      data: response?.data,
    };
  } catch (error) {
    logFunction('error', error.message)
    return {
      status: false,
      data : error?.response?.data ?? error.message,
      message: `${key}  data not found`,
    };
  }
};

const loginUser = async (sendData) => {
  let key = 'login user';
  try {
    const  { data : response }  = await axiosInstance.post(apiConstants.BACKEND_API.LOGIN_USER, sendData);
   // logFunction(key, response.data)
    return {
      status: true,
      message: response.message,
      data: response?.data,
    };
  } catch (error) {
    logFunction('error', error.message)
    return {
      status: false,
      data : error?.response?.data ?? error.message,
      message: error?.response?.data.message ?? error.message,
    };
  }
};


export default {getUserData, followUser, getLives, setPin, loginUser, updateAvatar, RequestOTPCode, getTransactions, getEarnings, updateLatLng, updateUserData, updateUserCarData, getNotifications, getPaymentLink, updateOnlineStatus};
