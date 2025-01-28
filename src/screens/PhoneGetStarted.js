import {View, TouchableOpacity, StyleSheet, Image, Platform, Text, StatusBar, Linking} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import React, {useContext, useEffect, useState} from "react";

import {components, LargeText} from "../components";
import {COLORS} from "../constants";
import { logFunction} from "../helpers/FunctionHelper";


import {useNavigation, useRoute} from "@react-navigation/native";
import {showMessage} from "react-native-flash-message";
import {useDispatch, useSelector} from "react-redux";


import {ThemeContext} from "../contexts/themeContext";
import SmallText from "../components/Texts/SmallText";
import RegularText from "../components/Texts/RegularText";
import CustomTextInput from "../components/Input/CustomTextInput";
import RegularButton from "../components/Buttons/RegularButton";
import { getData} from "../config";
import {useUserActions} from "../hooks/useUserActions";
import userService from "../services/UserService";

const PhoneGetStarted = () => {
    const navigation = useNavigation()

    const dispatch = useDispatch();

    const [refreshing, setRefreshing] = useState(false);

    const { doAuthLogin } = useUserActions();

    const main_config  = useSelector(state => state.config.data);

    const [formData, setData] = React.useState({
        email: null,
        password: null,
        submitted: false,
        loading: false
    });

    const {password, email, loading, submitted } = formData;

    const [errors, setErrors] = useState({});

    const [hidePass, setHidePass] = useState(true);


    const validate = () => {
        setData({...formData, submitted: true})

        if (email == null) {
            // logFunction("Field ", 'Phone is required')
            setErrors({
                ...errors,
                email: 'Please enter Email Address'
            });
            return false;
        }

        return true;

    }

    const { theme } = useContext(ThemeContext)

    let activeColors = COLORS[theme.mode]

    const submit = async () => {

        if (validate()) {
            setData({
                ...formData,
                loading: true
            })
            let sendData = {
                'email': email,
                'password': password,
                'platform': Platform.OS,
            }
            try {
                const current_email = await getData('@igbo_defence_email');

                logFunction('sendData',sendData)

                const login_res = await userService.loginUser(sendData)

                setData({
                    ...formData, loading: false
                })

                if(login_res.status){

                    // if(current_email === email){
                        const tab = await doAuthLogin(login_res.data)
                        // showMessage({
                        //     message: login_res.message,
                        //     type: "success",
                        // });

                        return navigation.navigate(tab)
                    // }
                }else {
                    showMessage({
                        message: login_res.message,
                        type: "danger",
                    });
                }

            } catch (error) {
                logFunction("Error", error)
                setData({
                    ...formData,
                    loading: false
                })
            }
        }
    }

    useEffect(() => {
        getData('@igbo_defence_email').then((e) => {
            logFunction('igbo_defence_email',e)
            setData({
                ...formData,
                email: e
            })
        })
    }, []);

    const  forgotPass = async () => {
        if (main_config.forgot_password_url) {
            await Linking.openURL(main_config.forgot_password_url)
        }
    }


const renderHeader = () => {
        return (
            <components.Header
                title="Igbo Defence"
                bg={activeColors.bg}
                small={true}
                goBack={true}
            />
        );
    };

    return (
        <components.BaseContainer customStyles={{
            backgroundColor : activeColors.bg
        }}>
            <StatusBar
                backgroundColor={ activeColors.bg }
                translucent={true}
                barStyle={'light-content'}/>


            { renderHeader() }
            <components.ContentContainer onRefresh={() => {} }
                                         refreshing={refreshing} >
                <KeyboardAwareScrollView
                    enableOnAndroid={true}
                    showsVerticalScrollIndicator={false}
                >


                    <View style={{ marginVertical : 30, marginHorizontal : 20,
                        justifyContent : 'center',
                        alignItems : 'center',
                        // textAlign : 'center'
                    }}>
                        <LargeText primary customStyles={{
                            color: activeColors.primary
                        }} bold>Welcome back</LargeText>
                        <LargeText bold={true} customStyles={{
                            marginTop : 10,
                        }} >Log In</LargeText>
                    </View>


                    <View style={[
                        styles.layout,
                        {
                            paddingBottom: 60,
                        },
                    ]}>

                        <CustomTextInput keyboardType={'email-address'} label="Email Address" value={email} onChangeText={(value) => {
                            setData({...formData, submitted: false, email: value}); delete errors.email
                        }} error={ errors.email } placeholder="Email Address" />


                        <CustomTextInput setHidePassword={setHidePass} hidePassword={hidePass} label="Password" isPassword={true} onChangeText={(value) => {
                            setData({...formData, submitted: false, password: value}); delete errors.password
                        }} error={errors.password}  placeholder="Password" />


                        <View style={{
                            flexDirection : "row",
                            justifyContent :  "flex-end",
                            marginVertical : 10,
                        }}>
                            <TouchableOpacity onPress={() => forgotPass()}>
                                <SmallText bold primary>Forgot Password ? </SmallText>
                            </TouchableOpacity>
                        </View>
                        <components.Divider size={'md'}/>


                        <RegularButton
                            isLoading={loading}
                            darkLoader={true}
                            buttonContainerStyle={{
                            }} buttonText="Sign In" onPress={() => submit()} />

                        <View style={{
                            flexDirection : "row",
                            alignItems : "center",
                            justifyContent : "center",
                            marginTop : 20,
                        }}>
                            <SmallText bold> Don't have an account ? </SmallText>
                            <TouchableOpacity onPress={() => {
                                navigation.navigate("SignupUserInfo")
                            }}><SmallText bold customStyles={styles.term}> Sign Up </SmallText></TouchableOpacity>
                        </View>

                    </View>

                </KeyboardAwareScrollView>

            </components.ContentContainer>



            {loading && <components.LoadingBg/>}

        </components.BaseContainer>
    );
};

export default PhoneGetStarted;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 0,
    },
    term : {
        color : COLORS.textSecondary
    },
    buttonBack: {},

    img: {
        alignSelf: 'center',
        marginTop: 40,
        marginBottom: 32,
    },
    layout: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },

});
