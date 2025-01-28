import {
    Alert,
    Image, Platform, Text,
    TouchableOpacity,
    View,
} from "react-native";
import React, {useContext, useEffect, useState, useCallback, useMemo, useRef} from "react";

import {useDispatch, useSelector} from "react-redux";

import {components, CustomImage, RegularButton} from "../components";

import { logFunction} from "../helpers/FunctionHelper";
import {isValidMobile} from "../helpers";

import {showMessage} from "react-native-flash-message";
import CustomTextInput from "../components/Input/CustomTextInput";
import UserService from "../services/UserService";
import {useUserActions} from "../hooks/useUserActions";

import {ThemeContext} from "../contexts/themeContext";
import {COLORS} from "../constants";
import {Ionicons} from "@expo/vector-icons";
import userService from "../services/UserService";
import * as ImagePicker from "expo-image-picker";
import {BottomSheetModal, BottomSheetModalProvider} from "@gorhom/bottom-sheet";

const EditPersonalInfo = ({ navigation }) => {
    const dispatch = useDispatch();
    const [formData, setData] = useState({
        first_name: null,
        last_name: null,
        email: null,
        location_id: null,
        username: null,
        phone: null,
        submitted: false,
        loading: false,
        message: null,
        type: 'error'
    });
    const [errors, setErrors] = useState({});

    const {first_name, last_name, email, phone, submitted, loading} = formData;

    const current_user = useSelector(state => state.auth.current_user)

    const [profileImage, setPhotoImage] = useState(null);


    const bottomSheetModalRef = useRef(null);

    const snapPoints = useMemo(() => ['25%', '30%'], []);
    const [type, setType] = useState(null);


    const { doGetUser } = useUserActions();

    const { theme } = useContext(ThemeContext)
    let activeColors = COLORS[theme.mode]


    const validate = () => {
        // logFunction("Name ", first_name)
        // logFunction("Errors ", errors)
        setData({...formData, submitted: true})

        if (first_name == null || first_name == '') {
            // logFunction("Field ", 'First name is required')
            setErrors({
                ...errors,
                first_name: 'First Name is required'
            });
            return false;
        }
        return true;
    }

    const update = async () => {
        if (validate()) {
            setData({
                ...formData,
                loading: true
            })
            let sendData = {
                'first_name' : first_name,
                'last_name' : last_name,
            }
            try {
                const { data, message } = await  UserService.updateUserData(sendData)

                setData({
                    ...formData,
                    type: 'success',
                    message: message,
                    loading: false
                });

                showMessage({
                    message: 'Profile updated',
                    type: "success",
                });

                await doGetUser();

            } catch (error) {
                logFunction("Error", error.response)
                setData({
                    ...formData,
                    loading: false
                });
            }
        }
    }

    useEffect(() => {
        // logFunction("USER DATA ", current_user)

        setData({
            ...formData,
            first_name: current_user?.first_name,
            last_name: current_user?.last_name,
            email: current_user?.email,
            phone: current_user.full_phone,
        });
    }, [current_user]);



    // callbacks
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    // callbacks
    const onClose = useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
    }, []);

    const showActionSheet = async (type) => {
        setType(type)
        handlePresentModalPress()
    };

    const submit = async (file) => {
        // return navigation.navigate("GoogleMap")

        if (!profileImage) {
            setErrors({
                ...errors,
                image_id: 'Please upload an image'
            });
            return false;
        }

        setData({
            ...formData,
            loading: true
        })
        let data = new FormData();
        data.append('file', {
            uri: file,
            type: 'image/jpeg',
            name: 'image.jpg',
        });

        try {

            const response = await userService.updateAvatar(data)

            setData({
                ...formData,
                loading: false
            })

            // logFunction('res', response)

            if(response?.status){

                await doGetUser();


                showMessage({
                    message: response?.message,
                    type: "success",
                });

                navigation.goBack();

            }
            else {
                logFunction("Errors ", response.message)
                showMessage({
                    message: response.message,
                    type: "danger",
                });
            }
        } catch (error) {
            logFunction("Error", error.message)
            setData({
                ...formData,
                loading: false
            })
        }



    }

    const _pickImage = async (permissionType, res) => {
        onClose()
        const pickFrom = res;

        let permissions;
        if (permissionType === 'CAMERA') {
            permissions = await ImagePicker.requestCameraPermissionsAsync();
        } else {
            permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
        }
        const { status } = permissions;

        if (status === 'granted') {

            let result = await pickFrom({
                allowsEditing: true,
                aspect: [3, 3],
                base64: true,
            });


            if (!result.canceled) {
                // logFunction('res', result)
                let data = 'data:image/jpeg;base64,' + result?.assets?.base64;
                if (type === "photo") {
                    setPhotoImage(result.assets[0].uri);
                    // logFunction('result.assets', result.assets[0].uri)
                }

                const blob = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        resolve(xhr.response);
                    };
                    xhr.onerror = function () {
                        Alert('Image upload error');
                    };
                    xhr.responseType = 'blob';
                    xhr.open('GET', Platform.OS === 'ios' ? data : result.assets[0].uri, true);
                    xhr.send(null);
                });
            }
        } else {
            Alert("permission denied")
        }
    }


    useEffect(() => {
        if(profileImage){
            onClose()
            let res = submit(profileImage)
        }
    }, [profileImage]);


    const renderAdd = () => {
        return (
            <BottomSheetModalProvider>
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={1}
                    style={{
                        backgroundColor : activeColors.bgPrimary
                    }}
                    snapPoints={snapPoints}
                >
                    <TouchableOpacity
                        style={{ width: '90%', alignSelf: 'center', paddingLeft: 20, paddingRight: 20,
                            borderColor: COLORS.light_white, borderBottomWidth: 1, height: 60,
                            alignItems: 'center', justifyContent: 'center'}}
                        onPress={() => { _pickImage('CAMERA', ImagePicker.launchCameraAsync) }}
                    >
                        <Text style={{ color: COLORS.darkGreen, fontWeight: 'bold' }}>Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ width: '90%', alignSelf: 'center', paddingLeft: 20, paddingRight: 20, borderBottomWidth: 1, borderColor: COLORS.light_white, height: 60, alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => { _pickImage('MEDIA', ImagePicker.launchImageLibraryAsync) }}
                    >
                        <Text style={{ color: COLORS.darkGreen, fontWeight: 'bold' }}>Media Library</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ width: '90%', alignSelf: 'center', paddingLeft: 20, paddingRight: 20, height: 50, alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => { onClose() }}>
                        <Text style={{ color: 'red', fontWeight: 'bold' }}>Cancel</Text>
                    </TouchableOpacity>

                </BottomSheetModal>
            </BottomSheetModalProvider>
        )
    }


    const renderHeader = () => {
        return (
            <components.Header
                title="My Account"
                goBack={true}
                customStyles={{
                    color : activeColors.black
                }}
            />
        );
    };

    const renderContent = () => {
        return (
            <View
                style={{
                    flexGrow: 1,
                    paddingVertical: 10,
                }}
            >

                <View style={{
                    // backgroundColor : activeColors.lightGray2,
                    marginRight :  10,
                    borderRadius : 70,
                    flexDirection : "row",
                    justifyContent : "center",
                    marginBottom : 30,
                }}>
                    <TouchableOpacity style={ {
                        borderWidth : 1,
                        padding : 5,
                        borderRadius : 70,
                        borderColor : activeColors.primary
                    }} onPress={() => { showActionSheet('photo');  delete errors.image_id }}
                    >

                        {!profileImage &&
                            <CustomImage source={{uri: current_user.avatar}} style={{
                                height : 120,
                                width : 120,
                                borderRadius : 60,
                            }}></CustomImage>
                        }

                        {profileImage &&
                            <Image source={ { uri : profileImage } }
                                   style={{
                                       height : 100,
                                       width : 100,
                                       borderRadius : 50,
                                   }}
                            ></Image>
                        }

                        <View
                            style={{
                                position: "absolute",
                                bottom: 0,
                                right: 0,
                                height: 40,
                                width: 40,
                                backgroundColor : activeColors.bg,
                                borderRadius: 25,
                                alignItems : "center",
                                justifyContent : "center"
                            }}
                        >
                            <Ionicons name="camera" size={24} color={ activeColors.white } />
                        </View>

                    </TouchableOpacity>
                </View>


                <CustomTextInput label="First name" value={first_name} onChangeText={(value) => {
                    setData({...formData, submitted: false, first_name: value}); delete errors.first_name
                }} error={ errors.first_name } placeholder="First name" />


                <CustomTextInput label="Last Name" value={last_name} onChangeText={(value) => {
                    setData({...formData, submitted: false, last_name: value}); delete errors.last_name
                }} error={ errors.last_name } placeholder="Last name" />


                <CustomTextInput label="Email" editable={false} value={email} placeholder="Email" />
                {/*<CustomTextInput label="Phone" editable={false} value={phone} laceholder="Phone" />*/}

                <RegularButton
                    textCustomStyle={{
                        color : activeColors.white,
                    }}
                    buttonText="Update"
                    onPress={() => update()} buttonContainerStyle={{
                    borderRadius : 30,
                    height : 65,
                    backgroundColor : activeColors.bg,
                    color : activeColors.white,
                    marginBottom: 30,
                    marginTop : 20,
                }} isLoading={loading} />



            </View>
        );
    };

    return (
        <components.BaseContainer>

            {renderHeader()}

            <components.ContentContainer>
                {renderContent()}
            </components.ContentContainer>


            {loading && <components.LoadingBg/>}

            { renderAdd() }


            {/*{*/}
            {/*    showMessage == true && <components.Alert type={type} message={message}/>*/}
            {/*}*/}

        </components.BaseContainer>

    );
};

export default EditPersonalInfo;
