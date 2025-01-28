

import {
    View,
    Text,
    TouchableOpacity,
} from "react-native";
import React, {useContext } from "react";
import { useNavigation } from "@react-navigation/native";

import {COLORS, FONTS } from "../constants";
import GlobalHeader from "./main/GlobalHeader";
import BackButton from "./main/BackButton";
import {ThemeContext} from "../contexts/themeContext";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import LargeText from "./Texts/LargeText";


const Header = ({
                    goBack,
                    title, bg,
                    goMenu,small,
                    customStyles,
                }) => {
    const navigation = useNavigation();

    const canGoBack = navigation.canGoBack();


    const { theme } = useContext(ThemeContext)
    let activeColors = COLORS[theme.mode]


    return (
        <GlobalHeader customStyles={[{backgroundColor: bg ? bg : activeColors.bgPrimary}, customStyles ]}>
            <View style={{
                width : "15%"
            }}>
                {goBack && (
                    <View>
                        {  canGoBack ? (
                            <TouchableOpacity style={{
                                flex: 0.1,
                                marginLeft: wp("5%"),
                                justifyContent: "center",
                                alignItems: "center",
                            }} onPress={() => navigation.goBack()}>
                                <BackButton/>
                            </TouchableOpacity>
                        ): (
                            <View style={{
                                flex: 0.1,

                                marginLeft: wp("5%"),
                            }}>

                            </View>
                        )
                        }
                    </View>
                )
                }
                {goMenu && (
                    <TouchableOpacity style={{
                        flex: 0.1,
                        marginLeft: wp("5%"),
                        justifyContent: "center",
                        alignItems: "center",
                    }} onPress={() => navigation.openDrawer()}>
                        <BackButton/>
                    </TouchableOpacity>
                )
                }
            </View>

            {title && (
                <View style={[{
                    flex: 1,
                    // marginLeft: wp("5%"),
                    justifyContent: "center",
                    // alignItems: "flex-start",
                }]}>
                    <LargeText customStyles={[{
                        fontSize: small ? 18 : 24,
                        fontFamily: small ? "RobotoRegular" : "RobotoBold",
                        textAlign : "center",
                        color : activeColors.textPrimaryColor
                    }, customStyles]}> { title }</LargeText>
                </View>
            )
            }

            <View style={{
                width : "15%"
            }}>
            {goBack && (
                <TouchableOpacity style={{
                    flex: 0.1,
                    marginRight: wp("5%"),
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    {/*<BackButton/>*/}
                </TouchableOpacity>
            )
            }
            </View>

        </GlobalHeader>

    );
};

export default Header;
