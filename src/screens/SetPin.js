import {
    View,
    TouchableOpacity, StyleSheet,
} from "react-native";
import React, {useContext, useEffect, useRef, useState} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { components } from "../components";
import {COLORS} from "../constants";
import {useRoute} from "@react-navigation/native";
import {logFunction} from "../helpers/FunctionHelper";
import {showMessage} from "react-native-flash-message";
import RegularText from "../components/Texts/RegularText";
import OTPTextView from "react-native-otp-textinput";
import LargeText from "../components/Texts/LargeText";
import SmallText from "../components/Texts/SmallText";

import {ThemeContext} from "../contexts/themeContext";
import RegularButton from "../components/Buttons/RegularButton";
import {axiosInstance, storeData} from "../config";

import {useUserActions} from "../hooks/useUserActions";
import {UserService} from "../services";

const SetPin = ({ navigation }) => {

    const route = useRoute();


    const { verificationId } = route.params || false;

    const { doSetAuthUser } = useUserActions();

    const [code, setCode] = useState(null);
    const [confirm_code, setCodeConfirm] = useState(null);

    const [loading, setLoading] = useState(false);


    const codeInput = useRef(null);
    const confirmCodeInput = useRef(null);


    const [errors, setErrors] = useState({});

    const { theme } = useContext(ThemeContext)
    let activeColors = COLORS[theme.mode]

    const validate = () => {
        if (code == null) {
            logFunction("Field ", 'Please enter code to proceed')
            setErrors({
                ...errors,
                code: 'Please enter code to proceed'
            });
            return false;
        }
        if (code.length < 4) {
            logFunction("Field ", 'Please enter the 4-digit code to proceed')
            setErrors({
                ...errors,
                code: 'Please complete the pin'
            });
            return false;
        }

        if (confirm_code !== confirm_code) {
            logFunction("Field ", 'Invalid Confirm pin')
            setErrors({
                ...errors,
                confirm_code: 'Invalid pin confirmation'
            });
            return false;
        }

        return true;

    }

    const submit = async () => {
        if (validate()) {
            setLoading(true)
            let sendData = {
                'pin': code,
                'pin_confirmation' : confirm_code
            }
            try {

               const pin_res = await UserService.setPin(sendData);

               setLoading(false)

                if(pin_res.status){
                    await doSetAuthUser(pin_res.data)
                    return navigation.navigate("Tabs")
                }else {
                    showMessage({
                        message: pin_res.data?.message ?? "Something went wrong",
                        type: "danger",
                    });
                }
            } catch (error) {
                logFunction("Error", error.message)
                setLoading(false)
            }
        }
    }

    const styles = StyleSheet.create({
        textInputContainer: {
            marginBottom: 10,
            padding : 0,
        },
        roundedTextInput: {
            borderRadius: 10,
            height : 70,
            width : 70,
            borderBottomWidth : 0,
            backgroundColor : activeColors.white
        },
    });

    const renderContent = () => {
        return (
            <KeyboardAwareScrollView
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    flexGrow: 1,
                    // alignContent : 'center',
                    // alignItems : 'center'
                }}
                enableOnAndroid={true}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ marginVertical : 30,
                    justifyContent : 'center',
                }}>
                    <LargeText primary bold>Set Transaction Pin</LargeText>
                    <RegularText customStyles={{
                        marginTop : 10,
                    }} >Do no disclose this pin to anyone</RegularText>
                </View>


                <View>
                    <View style={{
                        paddingHorizontal : 5
                    }}>
                        <RegularText bold>Enter pin</RegularText>
                    </View>
                    <OTPTextView
                        handleTextChange={(text) => {
                            delete errors.code; setCode(text)
                        }}
                        inputCount={4}
                        ref={codeInput}
                        keyboardType="numeric"
                        containerStyle={styles.textInputContainer}
                        textInputStyle={styles.roundedTextInput}
                        inputCellLength={1}
                    />
                </View>
                <View>
                    <View style={{
                        paddingHorizontal : 5
                    }}>
                        <RegularText bold>Confirm pin</RegularText>
                    </View>
                    <OTPTextView
                        handleTextChange={(text) => {
                            delete errors.confirm_code; setCodeConfirm(text)
                        }}
                        inputCount={4}
                        ref={confirmCodeInput}
                        keyboardType="numeric"
                        containerStyle={styles.textInputContainer}
                        textInputStyle={styles.roundedTextInput}
                        inputCellLength={1}
                    />
                </View>


                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent : "space-between",
                        marginBottom: 20,
                        paddingHorizontal : 10
                    }}
                >

                </View>


                <View style={{
                    // marginTop : 20
                }}>
                    <RegularButton onPress={() => submit()}
                                   isDisabled={(!code || code !== confirm_code)}
                                   buttonText="Continue"
                                   buttonContainerStyle={{
                                       // borderRadius : 30,
                                       width : "100%"
                                   }}
                    />
                </View>



            </KeyboardAwareScrollView>
        );
    };

    const renderHeader = () => {
        return (
            <components.Header
                title="Transaction Pin"
                small={true}
                goBack={false}
            />
        );
    };

    return (
        <components.BaseContainer  customStyles={{backgroundColor: activeColors.bgPrimary}}>
            { renderHeader() }
            <components.ContentContainer>

            {renderContent()}

            {loading && <components.Loader/>}

            </components.ContentContainer>

        </components.BaseContainer>
    );
};

export default SetPin;

