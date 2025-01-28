import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {COLORS, images} from '../constants';
import {Ionicons} from "@expo/vector-icons";

import { screens } from "../screens";

import {ThemeContext} from "../contexts/themeContext";
import {Image} from "react-native";
import {useSelector} from "react-redux";
import {getFocusedRouteNameFromRoute} from "@react-navigation/native";

const BottomTabs = createBottomTabNavigator();

export default ({ route }) => {

    const { theme, updateTheme } = useContext(ThemeContext)
    let activeColors = COLORS[theme.mode]

    const authStatus = useSelector(state => state.auth.auth_user);



    return (
        <BottomTabs.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    height: 65,
                    paddingVertical : 10,
                    backgroundColor: activeColors.bg,
                    borderTopWidth: 0,
                },
                // tabBarShowLabel: false,
                tabBarActiveTintColor: activeColors.primary,
                tabBarInactiveTintColor: activeColors.bgPrimary,

                tabBarLabelStyle : {
                    marginTop : 0,
                    paddingTop : 0,
                    marginBottom :  12,
                    fontFamily: "RobotoMedium",
                    fontSize: 9,
                    color : activeColors.light_white,
                }
            }}
            >
            {/*<BottomTabs.Screen*/}
            {/*    name="Home"*/}
            {/*    component={screens.Home}*/}
            {/*    options={{*/}
            {/*        tabBarIcon: ({color}) => (*/}
            {/*            <Ionicons name="home-outline" size={20} color={color} />*/}
            {/*        ),*/}
            {/*    }}*/}
            {/*/>*/}

            <BottomTabs.Screen
                name="Home"
                component={screens.Home}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Image
                            resizeMode="contain"
                            source={images.home_icon}
                            style={{ width: 20, height: 20, tintColor: color }}
                        />
                    ),
                }}
            />

            <BottomTabs.Screen
                name="Shorts"
                component={screens.Shorts}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Image
                            source={images.shorts}
                            resizeMode="contain"
                            style={{ width: 20, height: 20, tintColor: color }}
                        />
                    ),
                }}
            />
            <BottomTabs.Screen
                name="Upload"
                component={screens.Home}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Image
                            source={images.uploadIcon}
                            resizeMode="contain"
                            style={{ width: 20, height: 20, tintColor: color }}
                        />
                    ),
                }}
            />
            <BottomTabs.Screen
                name="Videos"
                component={screens.Videos}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Image
                            source={images.playIcon}
                            resizeMode="contain"
                            style={{ width: 20, height: 20, tintColor: color }}
                        />
                    ),
                }}
            />
            <BottomTabs.Screen
                name="Profile"
                component={screens.Profile}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Image
                            resizeMode="contain"
                            source={images.profile_icon}
                            style={{ width: 20, height: 20, tintColor: color }}
                        />
                    ),
                    tabBarVisible: false,
                }}
            />
        </BottomTabs.Navigator>
    )
};
