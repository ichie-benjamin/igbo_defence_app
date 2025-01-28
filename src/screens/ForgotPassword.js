import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import React from "react";

import { components } from "../components";
import {GlobalStyles, theme} from "../constants";


const ForgotPassword = ({ navigation }) => {
    const renderHeader = () => {
        return (
            <components.Header
                title="Forgot password"
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
                    Please enter your email address. You will
                    receive a link to create a new password via
                    email.
                </Text>
                <components.InputField
                    placeholder="enter email address"
                    check={false}
                    containerStyle={{ marginBottom: 18 }}
                />


                <Button
                    size="sm"

                    success
                    onPress={() =>
                        navigation.navigate("NewPassword")
                    }
                    style={[GlobalStyles.button, { marginBottom: 30, borderRadius : 10 }]}
                >
                    <Text style={GlobalStyles.buttonText}>Send</Text>
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

export default ForgotPassword;
