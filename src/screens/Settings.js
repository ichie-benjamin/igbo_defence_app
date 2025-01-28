import {View, TouchableOpacity, StyleSheet} from "react-native";

import React, {useContext, useState} from "react";

import {components} from "../components";
import {COLORS, images} from "../constants";

import {useNavigation} from "@react-navigation/native";

import {ThemeContext} from "../contexts/themeContext";

import RegularText from "../components/Texts/RegularText";

import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import {useSelector} from "react-redux";
import {logFunction} from "../helpers/FunctionHelper";

const Settings = () => {
    const navigation = useNavigation()

    const [refreshing, setRefreshing] = useState(false);

    // const { theme } = useContext(ThemeContext)
    const { theme, updateTheme } = useContext(ThemeContext)

    const main_config  = useSelector(state => state.config.data);


    let activeColors = COLORS[theme.mode]

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingBottom: 0,
        },
        rightSide: {
            flex: 0.15
        },
        item : {
            backgroundColor : activeColors.white,
            flexDirection : "row",
            paddingHorizontal : 15,
            paddingVertical : 15,
            borderRadius : 10,
            marginVertical : 5,
            justifyContent : "space-between",
            alignItems : "center"
        },
        layout: {
            // paddingHorizontal: 10,
            paddingVertical: 10,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
        },

    });


    const toggleDark = () => {
        updateTheme();
        // if(theme.mode === 'light'){
        //     updateTheme('dark')
        // }else {
        //     updateTheme('light')
        // }
      logFunction('theme', theme.mode)
    }

    const renderHeader = () => {
        return (
            <components.Header
                title="Settings"
                small={true}
                goBack={true}
            />
        );
    };

    return (
        <components.BaseContainer  customStyles={{backgroundColor: activeColors.bgPrimary}}>
            { renderHeader() }
            <components.ContentContainer onRefresh={() => {} }
                                         refreshing={refreshing} >


                    <View style={[
                        styles.layout,
                        {
                            paddingBottom: 60,
                            marginTop : 30
                        },
                    ]}>

                        <components.ProfileCategory
                            icon={images.unlock}
                            title="Reset Password"
                            onPress={() =>
                                navigation.navigate("ChangePassword")
                            }
                        />

                        <components.ProfileCategory
                            icon={images.sun}
                            title="Dark Mode"
                            onPress={() =>
                                toggleDark()
                            }
                            right_icon={(
                                <View style={styles.rightSide}>
                                    { theme.mode === "light" ? (
                                            <MaterialIcons name="toggle-off" size={30} color="black" />
                                    ) :
                                        (
                                            <Ionicons name="ios-toggle" size={30} color={ activeColors.inverseColor } />
                                        )
                                    }

                                </View>
                            )}
                        />


                        <components.ProfileCategory
                            icon={images.security}

                            title="Privacy policy"
                            onPress={() =>
                                navigation.navigate("WebView", {
                                    url : main_config.privacy_url ?? 'https:google.com',
                                    title : "Privacy policy"
                                })
                            }
                        />

                    </View>

            </components.ContentContainer>

        </components.BaseContainer>
    );
};

export default Settings;

