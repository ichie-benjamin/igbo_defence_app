import {View, TextInput, TouchableOpacity, StyleSheet, Text} from "react-native";
import React, {useContext} from "react";
import SmallText from "../Texts/SmallText";
import {ThemeContext} from "../../contexts/themeContext";
import {COLORS} from "../../constants";
import { Ionicons } from '@expo/vector-icons';
import RegularText from "../Texts/RegularText";


export default function RegularTextInput({label, prepend, error, icon, isPassword, hidePassword, setHidePassword, ...props}) {
    const { theme } = useContext(ThemeContext)
    let activeColors = COLORS[theme.mode]

    const styles = StyleSheet.create({
        container: {
            marginBottom: 10,
            width : "100%"
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor : activeColors.inputBGColor,
            borderRadius: 10,
            overflow: 'hidden',
        },
        iconContainer: {
            paddingHorizontal: 15,
            justifyContent: 'center',
            alignItems: 'center',
        },
        input: {
            flex: 1,
            paddingVertical: 15,
            paddingHorizontal: 15,
            fontSize: 16,
            color: activeColors.textColor, backgroundColor: activeColors.inputBGColor
        },
        passwordIconContainer: {
            paddingHorizontal: 15,
            justifyContent: 'center',
            alignItems: 'center',
        },
        errorInput: {
            borderColor: activeColors.lightDanger,
            borderWidth : 1,
        },
        errorText: {
            color: activeColors.lightDanger,
        },
    });

    return (
        <View style={[styles.container, {
            backgroundColor : activeColors.white
        }]}>
            { label && (
                <View>
                    <RegularText bold>{ label }</RegularText>
                </View>
            )}
            <View style={[styles.inputContainer, error && styles.errorInput]}>
                {icon && (
                    <View style={styles.iconContainer}>
                        <Ionicons name={icon} size={25} color={activeColors.primary} />
                    </View>
                )}
                {prepend && (
                    <View style={styles.iconContainer}>
                        { prepend }
                    </View>
                )}

                <TextInput
                    secureTextEntry={}
                    placeholderTextColor={activeColors.textColor}
                    style={[styles.input]}

                    {...props}
                />
                {isPassword && (
                    <TouchableOpacity
                        onPress={() => {
                            setHidePassword(!hidePassword);
                        }}
                        style={styles.passwordIconContainer}
                    >
                        <Ionicons
                            name={hidePassword ? 'ios-eye-off' : 'ios-eye'}
                            size={30}
                            color={activeColors.primary}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {error && <SmallText customStyles={styles.errorText}>{error}</SmallText>}
        </View>

    );
}

