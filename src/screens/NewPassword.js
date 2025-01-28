import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import React from "react";

import { components } from "../components";
import {GlobalStyles, theme} from "../constants";


const NewPassword = ({ navigation } ) => {
    const renderHeader = () => {
        return (
            <components.Header
                title="New password"
                goBack={true}
            />
        );
    };

    const renderContent = () => {
        return (
            <KeyboardAwareScrollView
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingVertical: 30,
                    flexGrow: 1,
                }}
                enableOnAndroid={true}
                showsVerticalScrollIndicator={false}
            >
                <Text
                    style={{
                        ...theme.FONTS.bodyText,
                        color: theme.COLORS.textColor,
                        marginBottom: 20,
                    }}
                >
                    Enter new password and confirm.
                </Text>
                <components.InputField
                    placeholder="Your password"
                    eyeOffSvg={true}
                    containerStyle={{ marginBottom: 14 }}
                />
                <components.InputField
                    placeholder="Confirm your password"
                    eyeOffSvg={true}
                    containerStyle={{ marginBottom: 14 }}
                />


                <Button
                    size="sm"

                    success
                    onPress={() =>
                        navigation.navigate("ForgotPasswordSentEmail")
                    }
                    style={[GlobalStyles.button, { marginBottom: 30, borderRadius : 10 }]}
                >
                    <Text style={GlobalStyles.buttonText}>Change Password</Text>
                </Button>
            </KeyboardAwareScrollView>
        );
    };

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.COLORS.white,
            }}
        >
            {renderHeader()}
            {renderContent()}
        </SafeAreaView>
    );
};

export default NewPassword;
