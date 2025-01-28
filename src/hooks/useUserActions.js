import {useDispatch} from 'react-redux';
import {setAuthToken, setCurrentUser, setLives, setLogout} from "../store/authSlice";
import {getData, storeData} from "../config";
import {successInit} from "../store/mainScreenReducer";
import {logFunction} from "../helpers/FunctionHelper";
import {removeData} from "../config/asynStorage";
import {setAuthorization} from "../config/axiosInterceptors";
import UserService from "../services/UserService";

const TAG = "useUserActions";

export const useUserActions = () => {
    const dispatch = useDispatch();

    const doAuthLogin = async (user_data, auto_login  = false) => {

        let user = Object.assign({}, user_data, {
            token: user_data?.token,
        });

        let token = user_data?.token

        logFunction('doAuthLogin', user)

        return await setAuthData(token, user, auto_login);

    };

    const doSetAuthUser = async (user_data) => {

        await storeData("CURRENT_USER", user_data)

        await dispatch(setCurrentUser(user_data))

    };

    const doAuthInit = async () => {

        const token = await getData("AUTH_TOKEN")
        logFunction('token', token)

        const is_registered = await getData("IS_REGISTERED")
        // const user = await getData("CURRENT_USER")


        if(token){
            await setAuthorization(token)
            const user = await doGetUser()
            if(user){
                return await setAuthData(token, user, true);
            }else {
                if(is_registered){
                    await dispatch(successInit('PhoneGetStarted'))
                    return "PhoneGetStarted";
                }else {
                    await dispatch(successInit('Tabs'))
                    return "Tabs";
                }
            }
        }else {
            await dispatch(successInit('Tabs'))
            return "Tabs";
        }

    };

    const doGetUser = async () => {
        const response = await UserService.getUserData()

        if(response.status){
            await storeData("CURRENT_USER", response.data)
            logFunction('hook', response.data)
            await dispatch(setCurrentUser(response.data))

            return response.data;
        }
        return false;
    };
    const doGetLives = async () => {
        const response = await UserService.getLives()

        if(response.status){
            // logFunction('doGetLives', response)
            await dispatch(setLives(response.data))

            return response.data;
        }
        return false;
    };

    const doAuthLogout = async () => {

        await removeData("AUTH_TOKENs")
        await removeData("CURRENT_USERs")

        await dispatch(setLogout())

    };

    const setAuthData = async (token, user, auto_login = false) => {
        setAuthorization(token);

        await storeData("AUTH_TOKEN", token)
        await storeData("CURRENT_USER", user)

        await dispatch(setAuthToken(token))

        await dispatch(setCurrentUser(user))

        // let screen = "SignUpVehicle";

        let screen = "Tabs";

        // if(!user?.pin_set){
        //     screen = "SetPin";
        // }

        if (auto_login){

            logFunction('screen', screen)

            await dispatch(successInit(screen))

        }

        return screen;


    };


    return { doAuthLogin, doSetAuthUser, doGetLives, doAuthInit, doAuthLogout, doGetUser };
};
