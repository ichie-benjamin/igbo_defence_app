import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    RefreshControl,
    StyleSheet, Modal, Alert, Platform, Linking, Share,
} from "react-native";
import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {useNavigation, useRoute} from "@react-navigation/native";

import {COLORS, FONTS, images} from "../constants";
import {components, CustomImage, RegularButton, RegularText, SmallText} from "../components";
import {useDispatch, useSelector} from "react-redux";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";

import {FontAwesome5, MaterialIcons, Fontisto, Ionicons, AntDesign, FontAwesome} from '@expo/vector-icons';


import  {BottomSheetModal, BottomSheetModalProvider} from "@gorhom/bottom-sheet";


import * as ImagePicker from "expo-image-picker";
import {logFunction} from "../helpers/FunctionHelper";
import Constants from "expo-constants";
import {showMessage} from "react-native-flash-message";

import {ThemeContext} from "../contexts/themeContext";
import userService from "../services/UserService";
import {useUserActions} from "../hooks/useUserActions";
import axios from "axios";

import * as Sharing from "expo-sharing";

const Profile = ({ navigation }) => {
    const route = useRoute();
    const { sub } = route.params || false;
    const dispatch = useDispatch();

    const [profileImage, setPhotoImage] = useState(null);

    const [showDelete, setShowDelete] = useState(false);

    const [loading, setLoading] = useState(false);

    const main_config  = useSelector(state => state.config.data);

    const current_user = useSelector(state => state.auth.current_user);

    const authStatus = useSelector(state => state.auth.auth_user);


    const { theme } = useContext(ThemeContext)
    let activeColors = COLORS[theme.mode]

    const { doGetUser, doAuthLogout } = useUserActions();

    const bottomSheetModalRef = useRef(null);

    const snapPoints = useMemo(() => ['25%', '30%'], []);

    const menuItems = [
        {
            icon: images.key,
            name: 'Change Password',
            is_auth : true,
            link: 'ChangePassword',
        },
        //  {
        //     icon: images.location,
        //     name: 'Address',
        //     external : true,
        //      webview : true,
        //     link: main_config?.my_addresses_url,
        // },

       {
            icon: images.messages,
            name: 'Contact Us',
            external : true,
            webview : false,
            link: main_config?.contact_url,
        },
       {
            icon: images.help,
            name: 'Support Us',
            external : true,
            webview : false,
            link: main_config?.support_url,
        },
        {
            icon: images.buy,
            name: 'Buy from us',
            external : true,
            webview : false,
            link: main_config?.buy_url,
        },
{
            icon: images.partner,

            name: 'Partner With Us',
            external : true,
            webview : false,
            link: main_config?.partner_url,
        },

        {
            icon: images.bill,
            name: 'Terms & Condition',
            external : true,
            webview : false,
            link: main_config?.terms_url,
        },{
            icon: images.profile,
            name: 'About',
            external : true,
            webview : false,
            link: main_config.about_url,
        },
        {
            icon: images.security,
            name: 'Privacy Policy',
            external : true,
            link: main_config?.privacy_url,
            webview : false,
        },
        // {
        //     icon: images.wallet_money,
        //     name: 'Refer & Earn',
        //     external : true,
        //     link: '#',
        // },

        {
            icon: images.export_icon,
            name: 'Share',
            external : false,
            link: 'share',
        },
        {
            icon: images.trash,
            name: 'Delete Account',
            external : false,
            is_auth : true,
            link: 'delete',
        },

    ];


    // callbacks
    const onClose = useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
    }, []);


    const checkLink = async (item) => {
        if(item.link === 'share'){
            return shareApp();
        }
        if(item.is_auth && !authStatus){
            navigation.navigate("PhoneGetStarted")
            return
        }
        if(item.link === 'delete'){
            setShowDelete(true)
            return

        }

        if(item.external){
            if (item.link){
                await Linking.openURL(item.link)
            }
            return
        }
        if(item.webview){
            navigation.navigate("WebView", {
                url : item.link,
                show_title : true,
                title : item.name
            })
            return
        }
        if(!item.webview && !item.external){
            navigation.navigate(item.link, {
                sub : true
            })
        }

    };


    const shareApp = async () => {
        try {
            let text = main_config?.share_message ?? 'Download Igbo defence app';

            logFunction('text', text)

            await Share.share({
                message: text,
            })
            // await Sharing.shareAsync({
            //     message: text,
            // });
        }catch (e){
            logFunction('share error', e)
        }
    }


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


    const login = () => {
        return navigation.navigate("PhoneGetStarted")
    }


    const confirmDelete = async () => {
        try {
            setLoading(true)

            const res = await userService.deleteAccount({ id : current_user.email})

            setLoading(false)

            if(res.status){

                showMessage({
                    message: res.message,
                    type: "success",
                });

                dispatch(doAuthLogout)

            }else {
                showMessage({
                    message: res.message,
                    type: "danger",
                });
            }

        } catch (e) {
            // logFunction('e',e)
            logFunction('error', e.response)
            setLoading(false)
            if(e?.response?.data?.message){
                showMessage({
                    message: e.response.data.message,
                    type: "error",
                });
            }
        }
    }

    const renderHeader = () => {
        return (
            <components.Header
                title="My profile"
                goBack={!!sub}
                goMenu={!sub}
            />
        );
    };

    const style = StyleSheet.create({
        icon: {
            // fontSize: wp('4.5%'),
            // color: activeColors.inverseColor
        },
        rightIcon: {
            fontSize: wp('3.5%'),
            color: activeColors.inverseColor
        },
    })

    return (
        <components.BaseContainer>
            {/*{renderHeader()}*/}

            <View style={[styles.container, {
                flexDirection : "row",
                paddingHorizontal : 20,
                marginTop : 30,
                justifyContent : "flex-start"
            }]}>
                { authStatus ?
                    (
                        <>
                            <TouchableOpacity style={[styles.imageView, {
                                borderColor: activeColors.bg,
                                borderWidth: 1,
                                backgroundColor : activeColors.bg,
                                marginRight : 20,
                            }]}
                                              onPress={() => {
                                                  navigation.navigate("EditPersonalInfo")
                                              }}
                            >

                                {!profileImage &&
                                    <CustomImage source={{uri: current_user.avatar}} style={{
                                        height: 60,
                                        width: 60,
                                        borderRadius: 10,
                                    }}></CustomImage>
                                }

                                {profileImage &&
                                    <Image source={{uri: profileImage}}
                                           style={{
                                               height: 60,
                                               width: 60,
                                               borderRadius: 10,
                                           }}
                                    ></Image>}


                            </TouchableOpacity>
                            <components.Divider size={'sm'}/>
                            <TouchableOpacity onPress={() => {
                                navigation.navigate("EditPersonalInfo")
                            }}>
                                <View style={{
                                    flexDirection : "row",
                                    alignItems : "center",
                                    gap : 5,
                                }}>
                                    <RegularText customStyles={{
                                        color : activeColors.black
                                    }} numberOfLines={1} bold>{current_user && current_user.name}</RegularText>
                                    <View>
                                        <MaterialIcons name="edit" size={24} color="black" />
                                    </View>
                                </View>
                                <RegularText customStyles={{
                                    color : activeColors.black
                                }} numberOfLines={1} >{current_user && current_user.email}</RegularText>
                            </TouchableOpacity>

                        </>
                    ) :
                    (
                        <>
                            <TouchableOpacity style={[styles.imageView, {
                                borderColor: activeColors.primary,
                                marginRight : 20,
                            }]}
                                              onPress={() => {
                                                  navigation.navigate('PhoneGetStarted');
                                              }}
                            >
                                <Image source={images.NOTFOUND}
                                       style={{
                                           height: 50,
                                           width: 50,
                                           borderRadius: 25,
                                       }}
                                ></Image>
                            </TouchableOpacity>
                            {/*<components.Divider size={'md'}/>*/}
                            <View>
                                <RegularText bold customStyles={{
                                    color : activeColors.black
                                }}>Sign in to follow</RegularText>
                                <RegularText bold customStyles={{
                                    color : activeColors.black
                                }}>like and share IGB videos </RegularText>


                            </View>

                        </>
                    )
                }

            </View>


            {/* Header */}


            {/* Content Start from here */}
            <components.ContentContainer customStyles={[styles.contentView, {
                backgroundColor: activeColors.white,

            }]}>
                <components.Divider size={'lg'}/>

                {menuItems.map((menuItem, index) => (
                    <components.ProfileCategory key={index}
                                                first={true}
                                                icon={<CustomImage source={menuItem.icon} />}
                                                title={ menuItem.name }
                                                onPress={() =>
                                                    checkLink(menuItem)
                                                }
                    />
                ))}

                <View style={{
                    padding : 20,
                    paddingBottom : 50,
                }}>
                    { authStatus ? (
                        <RegularButton onPress={() => dispatch(doAuthLogout)} buttonText="Logout" />
                    ) : (
                        <RegularButton onPress={() => login() } buttonText="Login" />
                    ) }
                </View>



                <components.Divider size={'lg'}/>



                {
                    loading && (
                        <components.Loader />
                    )
                }


                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showDelete}
                >

                    <View style={[styles.centeredView, {
                        backgroundColor: activeColors.transparentBlack2,
                    }]}>

                        <View style={[styles.modalViewSM,{
                            backgroundColor: activeColors.bgPrimary,
                        }]}>
                            <View style={{
                                // flexDirection : "row",
                                marginTop : 10,
                                alignItems : "center"

                                // justifyContent : "space-between"
                            }}>
                                <View style={{
                                    // justifyContent : "center",
                                    alignItems : "center"
                                }}>
                                    <Text style={{
                                        textAlign : "center",
                                        ...FONTS.h3
                                    }
                                    }>Delete your { main_config?.app_name } {'\n'} account permanently?</Text>

                                </View>

                            </View>


                            <View style={{
                                justifyContent : "center",
                                alignItems : "center",
                                marginVertical : 30,
                                textAlign : "center"
                                // marginHorizontal : 10
                            }}>

                                <View>


                                    <Text style={{
                                        // ...FONTS.bodyText,
                                        textAlign : "center"
                                    }}>You will lose your data on IGB app</Text>

                                </View>
                                <View style={{
                                    marginTop : 30
                                }}>

                                    <TouchableOpacity
                                        style={[styles.button,{
                                            paddingVertical : 15,
                                            backgroundColor : COLORS.lightGray,
                                            borderRadius : 30,
                                            width : 200,
                                            alignItems : "center"
                                        }]}
                                        onPress={() => setShowDelete(false)}>
                                        <Text style={[styles.textStyle, { color : COLORS.black}]}>Cancel</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.button,  {
                                            paddingVertical : 15,
                                            borderRadius : 30,
                                            backgroundColor :  COLORS.danger,
                                            marginTop : 10,
                                            width : 200,
                                            alignItems : "center"
                                        }]}
                                        onPress={() => confirmDelete()}>
                                        <Text style={[styles.textStyle, { color : COLORS.white}]}>Confirm</Text>
                                    </TouchableOpacity>

                                </View>

                            </View>


                        </View>
                    </View>


                    {
                        loading && (
                            <components.Loader />
                        )
                    }

                </Modal>


            </components.ContentContainer>


            { renderAdd() }



        </components.BaseContainer>
    )
};

export default Profile;

const styles = StyleSheet.create({


    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop: 22,
    },

    modalViewSM: {
        margin: 5,
        width: 300,
        borderRadius: 10,
        padding: 18,
        // alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },


    modalContent: {
        flex: 1,
        flexDirection: "column",
        justifyContent: 'flex-start',
        marginTop: Constants.statusBarHeight + 10,
        paddingHorizontal: 20,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    modal: {
        backgroundColor: COLORS.light_white,
        flex: 1,
    },




    container: {
        // height: hp('40%'),
        position: 'relative',
        justifyContent: 'flex-end',
        alignItems: 'center',
        zIndex: 99,
        marginBottom: hp('4%')
    },

    image: {
        resizeMode: 'contain',
        height: undefined,
        aspectRatio: 1,
        width: wp('25%'),
        borderRadius : 25,
        alignSelf: 'center'
    },
    username: {
        fontFamily: FONTS.Font_Bold,
        fontSize: wp('4%'),
    },
    email: {
        color: COLORS.secondary_text_color,
        fontFamily: FONTS.Font_Reguler,
        fontSize: wp('3.5%'),
        marginTop: hp('0.5%')
    },
    contentView: {
        elevation: 2,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 0.2},
        shadowOpacity: 0.20,
        shadowRadius: 3,
        marginHorizontal: 0,
        // borderTopRightRadius: wp('10%'),
        // borderTopLeftRadius: wp('10px')
    },
    listView: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: hp('1%')
    },
    leftSide: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: wp('2%'),
        flex: 0.10,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        flex: 0.80,
        padding: 10,
        marginHorizontal: wp('3%')
    },
    rightSide: {
        flex: 0.10
    },
    listTitle: {
        color: COLORS.text_color,
        fontFamily: FONTS.Font_Semibold,
        fontSize: wp('3.8%'),
    },

    imaged : {
        width: 60,
        height: 60,
        marginRight: 26,
    },
    imageView : {
        borderWidth : 1,
        padding : 5,
        borderRadius : 10,
    }
})
