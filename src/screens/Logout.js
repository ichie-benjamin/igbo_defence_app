import React, {useEffect} from "react";

// import {doLogout, requestInit} from '../redux/Action';

import {useDispatch} from "react-redux";
import {logFunction} from "../helpers/FunctionHelper";
import {showMessage} from "react-native-flash-message";
// import {setOnline} from "../redux/Reducer/onlineStatus";

import {useUserActions} from "../hooks/useUserActions";
import {useNavigation, useRoute} from "@react-navigation/native";

const LOCATION_TRACKING = 'location-tracking';

function Logout(props) {

    const route = useRoute();

    const dispatch = useDispatch();

    const { message } = route.params || false;


    const navigation = useNavigation()


    const { doAuthLogout } = useUserActions();

    const LogoutUser = () => {
        logFunction('auto logout',message)

        // dispatch(setOnline(false));
        showMessage({
            message: message ? message : "unauthorized, please login",
            type: "danger",
        });


        doAuthLogout().then(() => {
            navigation.navigate("PhoneGetStarted")
        })

    }

    useEffect(() => {

        LogoutUser()

    }, []);

}


export default Logout;
