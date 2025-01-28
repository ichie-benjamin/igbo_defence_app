
import {View, Text, TouchableOpacity, StyleSheet} from "react-native";
import React, {useContext} from "react";

import {COLORS, theme} from "../constants";

import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import { MaterialIcons } from "@expo/vector-icons";
import RegularText from "./Texts/RegularText";
import {ThemeContext} from "../contexts/themeContext";



const ProfileCategory = ({title, onPress, icon, first, borderless}) => {
    const { theme } = useContext(ThemeContext)
    let activeColors = COLORS[theme.mode]


    return (
        <TouchableOpacity style={[styles.listView, {
            borderBottomWidth : borderless ? 0 : 1,
        }]}
                          onPress={onPress} >
            {
                icon && (
                    <View style={[styles.leftSide, first ? {left: wp('1%')} : null]}>
                        {
                            icon
                        }
                    </View>
                )

            }

            <View style={styles.center}>
                <RegularText customStyles={{
                    lineHeight : 20,
                    color : activeColors.black
                }}>{ title }</RegularText>
            </View>
            <View style={styles.rightSide}>
                <MaterialIcons name="arrow-forward-ios" style={styles.rightIcon}/>
            </View>
        </TouchableOpacity>
    );
};

export default ProfileCategory;

const styles = StyleSheet.create({
    listView: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor : 'rgba(82,98,117,0.16)',
        paddingBottom : 10,
        marginVertical: hp('0.5%')
    },
    leftSide: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: wp('2%'),
        flex: 0.10,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        flex: 0.80,
        padding: 10,
        marginHorizontal: wp('3%')
    },
    rightSide: {
        flex: 0.10
    },
    listTitle: {
        color: theme.COLORS.text_color,
        fontFamily: theme.FONTS.Font_Semibold,
        fontSize: wp('3.8%'),
    },
    icon: {
        fontSize: wp('5.5%'),
        color: theme.COLORS.secondary_text_color
    },
    rightIcon: {
        fontSize: wp('3.5%'),
        color: theme.COLORS.secondary_text_color
    },
})
