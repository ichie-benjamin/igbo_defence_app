import {View, TouchableOpacity, StyleSheet, Image, Platform, StatusBar} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import React, {useContext, useEffect, useState} from "react";

const FormData = global.FormData;


import {components, LargeText} from "../components";
import {COLORS} from "../constants";
import { logFunction} from "../helpers/FunctionHelper";

const DATA = Array.from(Array(6).keys()).slice(0);




import { MaterialIcons} from '@expo/vector-icons';
import {useNavigation, useRoute} from "@react-navigation/native";
import {isValidConfirmPassword, isValidEmail, isValidMobile, isValidpassword} from "../helpers";
import {showMessage} from "react-native-flash-message";
import {useDispatch, useSelector} from "react-redux";


import {ThemeContext} from "../contexts/themeContext";
import {SIZES} from "../constants";
import SmallText from "../components/Texts/SmallText";
import RegularText from "../components/Texts/RegularText";
import CustomTextInput from "../components/Input/CustomTextInput";
import RegularButton from "../components/Buttons/RegularButton";
import {axiosInstance, storeData} from "../config";
import {setAuthToken, setCurrentUser} from "../store/authSlice";
import {useUserActions} from "../hooks/useUserActions";

const SignupUserInfo = () => {
    const navigation = useNavigation()

    const dispatch = useDispatch();

    const route = useRoute();
    const { country_code, country } = route.params || false;
    const [refreshing, setRefreshing] = useState(false);

    const { doAuthLogin } = useUserActions();

    const main_config  = useSelector(state => state.config.data);

    const [formData, setData] = React.useState({
        first_name: null,
        username: null,
        phone: null,
        last_name: null,
        password: null,
        email: null,
        submitted: false,
        type: null,
        message: null,
        accepted: false,
        loading: false
    });

    const {first_name, username, last_name, password, email, phone, loading, accepted } = formData;

    const [errors, setErrors] = useState({});


    const [hidePass, setHidePass] = useState(true);


    const validate = () => {
        setData({...formData, submitted: true})

        if (username == null) {
            // logFunction("Field ", 'First name is required')
            setErrors({
                ...errors,
                username: 'Username is required'
            });
            return false;
        }
        else if (first_name == null) {
            logFunction("Field ", 'First name is required')
            setErrors({
                ...errors,
                first_name: 'First Name is required'
            });
            return false;
        } else if (last_name == null) {
            logFunction("Field ", 'Last name is required')
            setErrors({
                ...errors,
                last_name: 'Last Name is required'
            });
            return false;
        } else if (email == null) {
            logFunction("Field ", 'Email is required')
            setErrors({
                ...errors,
                email: 'Email is required'
            });
            return false;
        }
        // else if (phone == null) {
        //     logFunction("Field ", 'Phone is required')
        //     setErrors({
        //         ...errors,
        //         phone: 'Phone is required'
        //     });
        //     return false;
        // }else if (phone.length !== 11) {
        //     logFunction("Field ", 'Enter valid number')
        //     setErrors({
        //         ...errors,
        //         phone: 'Enter valid number'
        //     });
        //     return false;
        // }

        else if (!isValidEmail(email).success) {
            logFunction("Field ", isValidEmail(email).message)
            setErrors({
                ...errors,
                invalidEmail: isValidEmail(email).message
            });
            return false;
        } else if (!accepted) {
            showMessage({
                message: "Accept terms & condition to proceed",
                type: "danger",
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
                'first_name': first_name,
                'last_name': last_name,
                'email': email,
                'username': username,
                // 'phone': phone,
                'password': password,
                // 'password': password,
                'platform': Platform.OS,
                'role': 'customer',
            }
            try {
                await axiosInstance.post('/auth/register', sendData).then(async (response) => {

                    if (response.data.status) {
                        const data = response.data.data;
                        // logFunction('data', data)
                        setData({
                            ...FormData, loading: false
                        })
                        showMessage({
                            message: response?.data?.message,
                            type: "success",
                        });

                        await storeData('IS_REGISTERED',email)

                        const tab = await doAuthLogin(response.data.data, true)

                        return navigation.navigate(tab)

                    }

                }).catch((error) => {
                    logFunction('error',error?.response)
                    setData({
                        ...formData,
                        type: 'error',
                        message: error?.response?.data?.message,
                        loading: false,
                        submitted: true,
                    });
                    setErrors({
                        ...errors,
                        email: error?.response?.data?.errors?.email ? error.response.data.errors.email[0] : null,
                        username: error?.response?.data?.errors?.username ? error.response.data.errors.username[0] : null,
                        password: error?.response?.data?.errors?.password ? error.response.data.errors.password[0] : null,
                        last_name: error?.response?.data?.errors?.last_name ? error.response.data.errors.last_name[0] : null,
                        first_name: error?.response?.data?.errors?.first_name ? error.response.data.errors.first_name[0] : null,
                    });
                    showMessage({
                        message: error.response.data.message,
                        type: "danger",
                    });

                    // logFunction('errors...',error.response.errors)

                    setTimeout(() => {
                        setData({
                            ...formData,
                            message: null,
                            loading: false,
                            submitted: true,
                        })
                    }, 3000);
                })
            } catch (error) {
                logFunction("Error", error)
                setData({
                    ...formData,
                    loading: false
                })
                setData({
                    ...formData,
                    loading: false
                })
            }
        }
    }

    const renderHeader = () => {
        return (
            <components.Header
                title="Sign Up"
                small={true}
                bg={activeColors.bg}
                goBack={true}
            />
        );
    };

    return (
        <components.BaseContainer  customStyles={{backgroundColor: activeColors.bg}}>
            { renderHeader() }
            <StatusBar
                backgroundColor={ activeColors.bg }
                translucent={true}
                barStyle={'light-content'}/>

            <components.ContentContainer onRefresh={() => {} }
                                         refreshing={refreshing} >
                <KeyboardAwareScrollView
                    enableOnAndroid={true}
                    showsVerticalScrollIndicator={false}
                >




                    <View style={{ marginVertical : 30, marginHorizontal : 20,
                    justifyContent : 'center',
                        // alignItems : 'center',
                        // textAlign : 'center'
                    }}>
                        <LargeText primary bold>Welcome to Igbo Defence App</LargeText>
                        <RegularText customStyles={{
                            marginTop : 10,
                        }} >Complete the sign up to get started</RegularText>
                    </View>


                    <View style={[
                        styles.layout,
                        {
                            paddingBottom: 60,
                        },
                    ]}>

                        <CustomTextInput label="Username" value={username} onChangeText={(value) => {
                            setData({...formData, submitted: false, username: value}); delete errors.username
                        }} error={ errors.username } placeholder="Username" />


                        <CustomTextInput label="First name" value={first_name} onChangeText={(value) => {
                            setData({...formData, submitted: false, first_name: value}); delete errors.first_name
                        }} error={ errors.first_name } placeholder="First name" />


                        <CustomTextInput label="Last name" value={last_name} onChangeText={(value) => {
                            setData({...formData, submitted: false, last_name: value}); delete errors.last_name
                        }} error={ errors.last_name } placeholder="Last name" />



                        {/*<CustomTextInput maxLength={11} keyboardType={"number-pad"} label="Phone number" value={phone} onChangeText={(value) => {*/}
                        {/*    setData({...formData, submitted: false, phone: value}); delete errors.phone*/}
                        {/*}} error={ errors.phone } placeholder="Phone number" />*/}

                        <CustomTextInput label="Email address" value={email} onChangeText={(value) => {
                            setData({...formData, submitted: false, email: value}); delete errors.email
                        }} error={ errors.email } placeholder="Email address" />


                        <CustomTextInput hidePassword={hidePass} setHidePassword={setHidePass} label="Password" isPassword={true} onChangeText={(value) => {
                            setData({...formData, submitted: false, password: value}); delete errors.password
                        }} error={errors.password}  placeholder="Password" />


                        <View
                            style={{
                                // position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                // paddingHorizontal : 50,
                                paddingBottom: 10,
                            }}>
                            <View style={{
                                flexDirection : "row",
                                // alignItems : "center",
                                width : "100%",
                                flexWrap: "wrap",
                                marginBottom : 10,
                                // justifyContent: "center",
                                // alignContent : "center"
                            }}>
                                {accepted ?
                                    (<TouchableOpacity onPress={() => setData({...formData, accepted: false})} style={{
                                        marginRight: 10,
                                    }}>
                                        <MaterialIcons name="check-box" size={24}
                                                       color={COLORS.textSecondary}/>
                                    </TouchableOpacity>) :
                                    (
                                        <TouchableOpacity onPress={() => setData({...formData, accepted: true})} style={{
                                            marginRight: 10,
                                        }}>
                                            <MaterialIcons name="check-box-outline-blank" size={24}
                                                           color={COLORS.textSecondary}/>
                                        </TouchableOpacity>
                                    )
                                }


                                <SmallText bold customStyles={{
                                    textAlign : "center"
                                }}>By signing up, you agree to the </SmallText>
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate("WebView", {
                                        url : main_config.terms_url,
                                        title : "Terms & Condition"
                                    })
                                }}><SmallText bold customStyles={styles.term}>Terms of service </SmallText></TouchableOpacity>
                                <SmallText> and</SmallText>
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate("WebView", {
                                        url : main_config.privacy_url,
                                        title : "Terms & Condition"
                                    })
                                }}><SmallText bold customStyles={styles.term}> Privacy policy </SmallText></TouchableOpacity>
                            </View>
                        </View>

                    <components.Divider size={'md'}/>


                        <RegularButton
                            isLoading={loading}
                            darkLoader={true}
                            buttonContainerStyle={{
                            // borderRadius : 30
                        }} buttonText="Continue" onPress={() => submit()} />

                        <View style={{
                            flexDirection : "row",
                            alignItems : "center",
                            justifyContent : "center",
                            marginTop : 20,
                        }}>
                            <SmallText bold> Already have an account ? </SmallText>
                            <TouchableOpacity onPress={() => {
                                navigation.navigate("PhoneGetStarted")
                            }}><SmallText bold customStyles={styles.term}> Sign In </SmallText></TouchableOpacity>
                        </View>

                    </View>

                </KeyboardAwareScrollView>

            </components.ContentContainer>



            {loading && <components.LoadingBg/>}

        </components.BaseContainer>
    );
};

export default SignupUserInfo;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 0,
    },
    term : {
        color : COLORS.textSecondary
    },
    buttonBack: {},
    picked_img :  {
        width : 150,
        height : 150,
        borderRadius : 75,
    },
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
    // input: {
    //     marginBottom: 24,
    // },

    photo_picker : {
        height : 160,
        width : 160,
        borderRadius : 80,
        backgroundColor : COLORS.gray1,
        justifyContent : 'center',
        alignItems : 'center',
        marginTop : SIZES.height / 20,

    }
});
