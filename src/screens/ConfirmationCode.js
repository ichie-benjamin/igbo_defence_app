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
import {setAuthToken, setCurrentUser} from "../store/authSlice";
import {useDispatch} from "react-redux";
import {useUserActions} from "../hooks/useUserActions";

const ConfirmationCode = ({ navigation }) => {

    const route = useRoute();
    const { phone, country, country_code } = route.params || false;
    const { auto_verify_code } = route.params || false;

    const { verificationId } = route.params || false;

    const { doAuthLogin } = useUserActions();

    const [code, setCode] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [count_down, setCountDown] = useState(120);

    const [verification_id, setVerificationId] = useState(null);


    const recaptchaVerifier = useRef(null);


    const otpInput = useRef(null);


    const [errors, setErrors] = useState({});

    const { theme } = useContext(ThemeContext)
    let activeColors = COLORS[theme.mode]

    const validate = () => {
        setSubmitted(true)
        if (code == null) {
            logFunction("Field ", 'Please enter code to proceed')
            setErrors({
                ...errors,
                code: 'Please enter phone number to proceed'
            });
            return false;
        }
        if (code.length < 4) {
            logFunction("Field ", 'Please enter the 4-digit code to proceed')
            setErrors({
                ...errors,
                code: 'Please enter the 4-digit code to proceed'
            });
            return false;
        }
        return true;

    }


    const resendOTP = async () => {
        setLoading(true)
        let sendData = {
            'phone': phone,
        }
        try {
            {
                const resend = await axiosInstance.post('/auth/resend/otp', sendData);
                setLoading(false)
                logFunction('res', resend.data)
                logFunction('check_phone.data.auth_verify', resend.data.auto_verify_code)
                if (resend.data.status) {
                    setCountDown(60)
                    showMessage({
                        message: resend?.data?.message,
                        type: "success",
                    });

                    if(resend.data.auto_verify_code){
                        setCode(String(resend.data.auto_verify_code))
                    }

                }else {
                    logFunction("Errors ", resend.data.error)
                    showMessage({
                        message: resend.data.error,
                        type: "danger",
                    });
                }
            }

        } catch (error) {
            logFunction("Error", error.response)
            setLoading(false)
        }
    }

    const submit = async () => {


        if (validate()) {
            setLoading(true)
            setSubmitted(true)
            let sendData = {
                'phone': phone,
                'code' : code
            }
            try {

                logFunction('sendData', sendData)
                const { data : response } = await axiosInstance.post('/auth/verify/phone', sendData);

                setLoading(false)

                // return true


                showMessage({
                    message: response?.message,
                    type: "success",
                    position : "bottom"
                });

                if(response?.data){

                    await storeData('@igbo_defence_phone',phone)


                    const tab = await doAuthLogin(response.data)

                    logFunction('tab',tab)

                    setLoading(false)

                    return navigation.navigate(tab)


                }else {
                    return navigation.navigate("SignupUserInfo",{
                        phone : phone,
                    })
                }

            } catch (error) {
                logFunction("Error", error.message)
                setLoading(false)
            }


        }
    }

    useEffect(() => {
        if(auto_verify_code){
            logFunction('auto_verify_code',auto_verify_code)
            setCode(String(auto_verify_code))
            otpInput.current.setValue(String(auto_verify_code));
        }
    }, [auto_verify_code]);

    useEffect(() => {
        if(verificationId){
            setVerificationId(verificationId)
        }
    }, [verificationId]);

    useEffect(() => {
        if (count_down > 0) {
            const timer = setTimeout(() => {
                setCountDown(count_down - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [count_down]);

    const handleTextChange = (text) => {
        setCode(text);

        const otpCodeLength = 4; // Desired length of the OTP code

        if (text.length === otpCodeLength) {
            // Call your function when the OTP code is complete
            console.log('OTP code entered:', text);

            if(code.length === otpCodeLength && !auto_verify_code){
                submit().then(() => {

                })
            }


            // Call your function here or perform any necessary actions
        }
    };

    const renderContent = () => {
        return (
            <KeyboardAwareScrollView
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingVertical: 30,
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
                    <LargeText primary bold>Enter OTP</LargeText>
                    <RegularText customStyles={{
                        marginTop : 10,
                    }} >Enter the 4-digit code sent to</RegularText>

                    <RegularText>{ phone }</RegularText>
                </View>


                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        // marginBottom: 30,
                    }}
                >

                    <OTPTextView
                        handleTextChange={handleTextChange}
                        inputCount={4}
                        ref={otpInput}
                        // value={code}
                        keyboardType="numeric"
                        containerStyle={styles.textInputContainer}
                        textInputStyle={styles.roundedTextInput}
                        // containerStyle={{
                        //     backgroundColor : "red",
                        //     marginRight : 10,
                        // }}
                        inputCellLength={1}
                    />


                </View>


                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent : "space-between",
                        marginBottom: 40,
                        paddingHorizontal : 10
                    }}
                >


                    <SmallText
                        style={{
                            marginRight: 3,
                        }}
                    >
                        Didn’t receive the OTP?
                    </SmallText>
                    {count_down < 1 ? (<TouchableOpacity onPress={() => resendOTP() }>
                        <SmallText
                            bold
                            customStyles={{
                                color: activeColors.textPrimary,
                                marginVertical : 0
                            }}
                        >
                            Send again
                        </SmallText>
                    </TouchableOpacity>) : null
                    }
                    { count_down > 0 ?
                        (<View style={{marginBottom: 0}}>
                            <SmallText> Resend in {count_down} secs</SmallText>
                        </View>) : null
                    }
                </View>


                <View style={{
                    // marginTop : 20
                }}>
                    <RegularButton onPress={() => submit()}
                                   // isLoading={loading}
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
                title="OTP Verification"
                small={true}
                goBack={true}
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

export default ConfirmationCode;

const styles = StyleSheet.create({
    textInputContainer: {
        marginBottom: 20,
    },
    roundedTextInput: {
        borderRadius: 10,
        height : 70,
        width : 70,
        borderWidth: 4,
    },
});
