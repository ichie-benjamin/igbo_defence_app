import React, {useEffect, useRef, useState} from "react";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";

import { screens } from "../screens";
import Tabs from "./Tabs";
import {createNavigationContainerRef, NavigationContainer, useNavigationContainerRef} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import NavigationService from '../hooks/NavigationService';

import {useDispatch, useSelector} from "react-redux";
import Loader from "../components/main/Loader";

import * as Notifications from "expo-notifications";

import {useNotifications} from "../hooks";
import { logFunction} from "../helpers/FunctionHelper";

import ConfigDataService from "../services/ConfigDataService";
import { setConfigData } from "../store/configSlice";
import {getData, storeData} from "../config";
import {useUserActions} from "../hooks/useUserActions";
import {View} from "react-native";


const Stack = createStackNavigator();

export const navigationRef = createNavigationContainerRef()

export function navigate(name, params) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name, params);
    }
}



const StackNavigator = () => {
    const [firstLaunch, setFirstLaunch] = useState(false);
    const [verified_phone, setVerifiedPhone] = useState(false);
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();

    const { doGetUser } = useUserActions();


    const navigationRef = useNavigationContainerRef();

    const notificationListener = useRef();
    const responseListener = useRef();

    const authStatus = useSelector(state => state.auth.auth_user);


    const chooseScreen = async () => {
        const launched = await getData('@igbo_defence')
        if(launched !== null){
            setFirstLaunch(false)

            setLoading(false)

            // console.log('second')
            // console.log(launched)
        }else {
            await storeData('@igbo_defence','true')
            setFirstLaunch(true)
            setLoading(false)
            // console.log('first')
        }
    }


    const getCurrentUser = async () => {
        try {
            const user = await doGetUser();
            // dispatch(authData(user));
        }catch (e) {

            logFunction('error fetching user',e)
        }

    }

    useEffect(() => {
        chooseScreen();
        logFunction('auth_status',authStatus)
    }, []);



    useEffect(() => {

        ConfigDataService.getSettings().then(response => {
            // logFunction('ConfigDataService.response.data',response.data)
            if (response?.status) {
                dispatch(setConfigData(response.data))
            }
        });

    }, []);

    useEffect(() => {
        const { registerForPushNotificationsAsync, handleNotificationResponse } = useNotifications();

        registerForPushNotificationsAsync().then(async token => {
            if(token){
                // logFunction("token", token)
                await AsyncStorage.setItem("igbo_defence_push_token", token)
            }
            // console.log(token)
        });

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            // console.log("received", notification);
            getCurrentUser().then(() => {})

        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            // console.log('pressed', response)
            // handleNotificationResponse(response)
            getCurrentUser().then(() => {})

            navigationRef.navigate("Tabs")
        });

        // notificationListener.current = Notifications.addNotificationReceivedListener(async notification => {
        //     if(notification?.request?.trigger?.remoteMessage?.data?.channelId === 'user-updated'){
        //         getCurrentUser().then(() => {})
        //     }
        // });



        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    // useEffect(() => {
    //     async function initUser() {
    //         if(current_user && !driverData){
    //             await initDriver(current_user.id)
    //         }
    //     }
    //     initUser();
    // }, [current_user]);



    if (loading) {
        return (
            <View style={{
                backgroundColor : '#000000',
                flex : 1
            }}>
                <Loader/>
            </View>

        )
    }

    if(!loading){
        let initialScreen;

        if(firstLaunch){
            initialScreen = "Onboarding"
        }else {
            initialScreen = "SplashScreen"
        }

        // const initialScreen = firstLaunch ? "Onboarding" : "Onboarding"

        // const initialScreen = firstLaunch ? "Onboarding" : "SplashScreen"

        // const initialScreen = firstLaunch ? "GoogleMap" : "SplashScreen"

        return (
            // <NavigationContainer  ref={navigationRef}>
            <NavigationContainer ref={NavigationService.setTopLevelNavigator}>

                <Stack.Navigator
                    initialRouteName={initialScreen}
                    screenOptions={{
                        gestureEnabled: false,
                        cardStyle: { backgroundColor: '#1E1E1E' },
                        // cardStyle: { backgroundColor: "white" },
                    }}
                >
                    <Stack.Screen
                        name="Tabs"
                        component={ Tabs }
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="SplashScreen"
                        component={screens.SplashScreen}
                        options={{ headerShown: false }}
                    />

                    <Stack.Screen
                        name="viewProfile"
                        component={screens.viewProfile}
                        options={{ headerShown: false }}
                    />

                    <Stack.Screen
                        name="Logout"
                        component={screens.Logout}
                        options={{ headerShown: false }}
                    />


                    <Stack.Screen
                        name="Notifications"
                        component={screens.Notifications}
                        options={{ headerShown: false }}
                    />


                    <Stack.Screen
                        name="Profile"
                        component={screens.Profile}
                        options={{ headerShown: false }}
                    />


                    <Stack.Screen
                        name="Settings"
                        component={screens.Settings}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="SetPin"
                        component={screens.SetPin}
                        options={{ headerShown: false }}
                    />



                    <Stack.Screen
                        name="Onboarding"
                        component={screens.Onboarding}
                        options={{ headerShown: false }}
                    />


                    <Stack.Screen
                        name="ForgotPassWebView"
                        component={screens.ForgotPassWebView}
                        options={{ headerShown: false }}
                    />


                    <Stack.Screen
                        name="SignIn"
                        component={authStatus ? Tabs : screens.SignIn}
                        options={{ headerShown: false }}
                    />

                    <Stack.Screen
                        name="PhoneGetStarted"
                        component={screens.PhoneGetStarted}
                        options={{ headerShown: false }}
                    />
                      <Stack.Screen
                        name="SignupUserInfo"
                        component={screens.SignupUserInfo}
                        options={{ headerShown: false }}
                    />

                      <Stack.Screen
                        name="ViewShorts"
                        component={screens.ViewShorts}
                        options={{ headerShown: false }}
                    />

                      <Stack.Screen
                        name="Live"
                        component={screens.Live}
                        options={{ headerShown: false }}
                    />


                    <Stack.Screen
                        name="Pending"
                        component={screens.Pending}
                        options={{ headerShown: false }}
                    />




                    <Stack.Screen
                        name="ForgotPassword"
                        component={screens.ForgotPassword}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="NewPassword"
                        component={screens.NewPassword}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="ChangePassword"
                        component={screens.ChangePassword}
                        options={{ headerShown: false,

                        }}
                    />
                    <Stack.Screen
                        name="ForgotPasswordSentEmail"
                        component={screens.ForgotPasswordSentEmail}
                        options={{ headerShown: false }}
                    />

                    <Stack.Screen
                        name="ConfirmationCode"
                        component={screens.ConfirmationCode}
                        options={{ headerShown: false }}
                    />

                    <Stack.Screen
                        name="EditPersonalInfo"
                        component={authStatus ? screens.EditPersonalInfo : screens.SignIn}
                        options={{ headerShown: false }}
                    />


                </Stack.Navigator>
            </NavigationContainer>
        );
    }


};

export default StackNavigator;


