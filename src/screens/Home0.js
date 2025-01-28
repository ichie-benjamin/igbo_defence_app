import React, {useContext, useEffect, useState} from 'react';
import {
    View,
    Text,
    SafeAreaView, StyleSheet,
    TouchableOpacity, FlatList, Image, TextInput, StatusBar, ScrollView, RefreshControl
} from 'react-native';


import {COLORS,  FONTS, images, SIZES} from "../constants";

import {ThemeContext} from "../contexts/themeContext";
import CustomTextInput from "../components/Input/CustomTextInput";
import RegularButtons from "../components/Buttons/RegularButtons";
import {useDispatch, useSelector} from "react-redux";
import {LargeText, RegularText, SmallText} from "../components";
import {AntDesign, Ionicons} from "@expo/vector-icons";
import {logFunction, numberWithComma} from "../helpers/FunctionHelper";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";

import { Feather } from '@expo/vector-icons';
import Constants from "expo-constants";
import {LinearGradient} from "expo-linear-gradient";
import {useUserActions} from "../hooks/useUserActions";

import {toggleShowBalance} from "../store/authSlice";


const Home = ({ navigation }) => {

    const { theme, updateTheme } = useContext(ThemeContext)

    const dispatch = useDispatch();

    let activeColors = COLORS[theme.mode]

    const [isActive, setIsActive] = useState(theme.mode === 'dark');

    const [hidePassword, setHidePassword] = useState(true);

    const main_config  = useSelector(state => state.config.data);

    const current_user = useSelector(state => state.auth.current_user);

    const show_balance = useSelector(state => state.auth.show_balance);


    const toggleShowBal = () => {
        dispatch(toggleShowBalance(!show_balance))
    }


    const handleToggle = () => {
        updateTheme();
        setIsActive((previousState) => !previousState);
    };

    const [refreshing, setRefreshing] = useState(false);

    const { doGetUser } = useUserActions();


    const onRefresh = () => {
        setRefreshing(true);
        doGetUser().then(() => {
            setRefreshing(false)
        })
    };


    const styles = StyleSheet.create({
        container: {
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
        },
        actionCard : {
            flex : 1,
            flexDirection : "row",
            alignItems : "center",
            height : 170,
            justifyContent : "center",
            borderRadius : 15,
        },
        actionIcon : {
            marginBottom : 15,
            padding : 10,
            alignItems : "center",
            justifyContent : "center",
            borderRadius : 30,
        }
    });

    function renderHeader(){
        return (
            <View style={{
                flexDirection : "row",
                marginHorizontal : 10,
                alignItems : "center",
                height : 80
            }}>
                {/*Text*/}

                <View style={{
                    flex : 1,
                    flexDirection : "row",
                    alignItems : "center"
                }}>
                    <View style={{
                        marginRight : 10,
                    }}>
                        <Image source={{ uri : current_user?.avatar }}
                               style={{
                                   width : 60,
                                   height : 60,
                                   borderRadius : 30
                               }}
                        />
                    </View>

                    <View>
                        <RegularText customStyles={{
                            lineHeight : 20
                        }}>Hi, welcome</RegularText>
                        <RegularText customStyles={{
                            lineHeight : 20
                        }} bold dark>{ current_user?.first_name}</RegularText>
                    </View>
                </View>


                {/*Image*/}
                <LinearGradient
                    colors={activeColors.bgGradient}
                    start={[0, 0]}
                    end={[1, 1]} style={{
                    // backgroundColor : activeColors.primary,
                    borderRadius : 30,
                    height : 50,
                    width : 50,
                    alignItems : "center",
                    justifyContent : "center"
                }}>
                    <Ionicons name="notifications-outline" size={24} color="rgba(255, 255, 255, 1)" />

                </LinearGradient>
            </View>
        )
    }






    return (
        <SafeAreaView
            style={{
                flex : 1,
                backgroundColor : activeColors.bgPrimary,
                paddingTop : Constants.statusBarHeight
            }}

        >
            <StatusBar
                backgroundColor="transparent"
                translucent={true}
                barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}/>

            <View style={{
                marginTop : 10,
                flex : 1,
            }}>

                {/*Header*/}
                { renderHeader() }

                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => onRefresh}
                        />
                    }
                    showsVerticalScrollIndicator={false}>


                </ScrollView>

            </View>

        </SafeAreaView>
    )
}

export default Home;
