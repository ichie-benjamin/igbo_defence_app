import {View, TextInput, TouchableOpacity, StyleSheet, Text, ActivityIndicator} from "react-native";
import React, {useContext} from "react";
import SmallText from "../Texts/SmallText";
import {ThemeContext} from "../../contexts/themeContext";
import {COLORS} from "../../constants";
import {Ionicons, MaterialIcons} from '@expo/vector-icons';
import RegularText from "../Texts/RegularText";


export default function CustomTextInputs({label, prepend, success_message, error, isValid, isError, icon, isLoading, isPassword, hidePassword, setHidePassword, ...props}) {
    const { theme } = useContext(ThemeContext)
    let activeColors = COLORS[theme.mode]

    const styles = StyleSheet.create({
        container: {
            marginBottom: 10,
            width : "100%"
        },
        inputContainer: {
            // flexDirection: 'row',
            // alignItems: 'center',
            backgroundColor : activeColors.inputBGColor,
            borderRadius: 10,
            paddingVertical : 12,
            paddingHorizontal : 5,
            overflow: 'hidden',
        },
        iconContainer: {
            paddingHorizontal: 15,
            justifyContent: 'center',
            alignItems: 'center',
        },
        input: {
            flex: 1,
            // paddingVertical: 15,
            paddingHorizontal: 15,
            fontSize: 16,
            color: activeColors.inverseColor, backgroundColor: activeColors.inputBGColor
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
        successText: {
            color: activeColors.primary,
        },
    });

    return (
        <View style={[styles.container, {
            // backgroundColor : activeColors.danger
        }]}>

            <View style={[styles.inputContainer, error && styles.errorInput]}>
                { label && (
                    <View style={{
                        paddingHorizontal : 15,
                    }}>
                        <SmallText caption={true}>{ label }</SmallText>
                    </View>
                )}
                <View style={{
                    flexDirection : "row"
                }}>
                    <TextInput

                        secureTextEntry={isPassword && hidePassword}
                        placeholderTextColor={activeColors.inverseColor}
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

                    { isLoading && <ActivityIndicator size="small" color={ activeColors.primary } /> }

                    {!isLoading && isValid &&
                        <Ionicons name="checkmark-circle" size={24} color={activeColors.primary}/>
                    }
                    {!isLoading && isError &&
                        <MaterialIcons name="cancel" size={24} color={activeColors.danger} />
                    }
                </View>

            </View>
            {error && <SmallText customStyles={styles.errorText}>{error}</SmallText>}
            {success_message && <SmallText customStyles={styles.successText}>{success_message}</SmallText>}
        </View>

    );
}

