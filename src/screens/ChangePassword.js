import {View, TouchableOpacity, StyleSheet, Image, Platform, Text} from "react-native";

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
import {getData, storeData} from "../config";
import {useUserActions} from "../hooks/useUserActions";
import userService from "../services/UserService";
import UserService from "../services/UserService";
import {setCurrentUser} from "../store/authSlice";

const ChangePassword = () => {
    const navigation = useNavigation()

    const dispatch = useDispatch();

    const [refreshing, setRefreshing] = useState(false);

    const main_config  = useSelector(state => state.config.data);

    const [formData, setData] = React.useState({
        email: null,
        password: null,
        new_password: null,
        confirm_password: null,
        submitted: false,
        loading: false
    });

    const [error_message, setError] = useState(null);

    const {password, email, loading, new_password, confirm_password } = formData;

    const [errors, setErrors] = useState({});

    const [hidePass, setHidePass] = useState(true);


    const validate = () => {
        setData({...formData, submitted: true})

        if (!password) {
            setErrors({
                ...errors,
                password: 'Please enter your password'
            });
            return false;
        }
        if (!new_password) {
            setErrors({
                ...errors,
                new_password: 'Please enter your new password'
            });
            return false;
        }
        if (new_password !== confirm_password) {
            setErrors({
                ...errors,
                confirm_password: 'Password confirmation failed'
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
                'current_password': password,
                'new_password': new_password,
                // 'platform': Platform.OS,
            }
            try {

                logFunction('sendData', sendData)

                const res = await userService.changePassword(sendData)

                setData({
                    ...formData, loading: false
                })

                if(res.status){

                    showMessage({
                        message: res.message,
                        type: "success",
                    });

                    return navigation.goBack();

                }else {

                    setErrors({
                        ...errors,
                        password: res.message
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




    const renderHeader = () => {
        return (
            <components.Header
                title="Change Password"
                // small={true}
                customStyles={{
                    color : activeColors.black
                }}
                goBack={true}
            />
        );
    };

    return (
        <components.BaseContainer >
            { renderHeader() }
            <components.ContentContainer onRefresh={() => {} }
                                         refreshing={refreshing} >
                <KeyboardAwareScrollView
                    enableOnAndroid={true}
                    showsVerticalScrollIndicator={false}
                >


                    <View style={[
                        styles.layout,
                        {
                            paddingBottom: 60,
                        },
                    ]}>

                        <CustomTextInput setHidePassword={setHidePass} hidePassword={hidePass}
                                         label="Current Password" isPassword={true}
                                         onChangeText={(value) => {
                            setData({...formData, submitted: false, password: value});
                            delete errors.password; delete errors.email
                        }} error={errors.password}  placeholder="Password" />

                        <CustomTextInput setHidePassword={setHidePass} hidePassword={hidePass}
                                         label="New Password" isPassword={true}
                                         onChangeText={(value) => {
                            setData({...formData, submitted: false, new_password: value});
                            delete errors.new_password;
                        }} error={errors.new_password}  placeholder="New Password" />


                        <CustomTextInput setHidePassword={setHidePass} hidePassword={hidePass}
                                         label="Confirm Password" isPassword={true}
                                         onChangeText={(value) => {
                            setData({...formData, submitted: false, confirm_password: value});
                            delete errors.confirm_password;
                        }} error={errors.confirm_password}  placeholder="Confirm Password" />


                        <components.Divider size={'md'}/>


                        <RegularButton
                            isLoading={loading}
                            textCustomStyle={{
                                color : activeColors.white
                            }}
                            buttonContainerStyle={{
                                backgroundColor : activeColors.bg
                            }} buttonText="Update password" onPress={() => submit()} />

                    </View>

                </KeyboardAwareScrollView>

            </components.ContentContainer>



            {loading && <components.Loader />}

        </components.BaseContainer>
    );
};

export default ChangePassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 0,
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
