import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiConstants } from "../constants"

import NavigationService from '../hooks/NavigationService';

import {config} from "../constants";
import {logFunction} from "../helpers/FunctionHelper";

// axios.defaults.baseURL = apiConstants.BACKEND_API.BASE_API_URL;

const axiosInstance = axios.create({
    baseURL: apiConstants.BACKEND_API.BASE_API_URL
});

// axiosInstance.interceptors.request.use(
//     async (config) => {
//         const token = await AsyncStorage.getItem('AUTH_TOKEN');
//         // console.log(token)
//         logFunction('auth set token', token)
//         if(token != null){
//             logFunction('auth seting token', token)
//
//             setAuthorization(token)
//         }
//         return config
//     },
//     (error) => {
//         return Promise.reject(error)
//     }
// );


axiosInstance.interceptors.response.use(null, async (error) => {
    if (error.response.status === 401 || error.response.status === 400) {

        try {

            // console.log('not authorized here')

            logFunction('res', error.response)

            // return navigate('Logout','logging out');
            return NavigationService.navigate('Logout',{
                message : 'unauthorized, please login'
            });

        }catch (e){
            console.log('error',e)
        }

    }

    return Promise.reject(error)
})

axiosInstance.defaults.headers.common['X-App-Version'] = config.VERSION;

export default axiosInstance;


export function setAuthorization(token) {
    logFunction('setting token', token)
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`
}
