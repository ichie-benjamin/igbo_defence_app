import {
    View,
    Text,
    RefreshControl,
    TextInput,
    Modal,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    ImageBackground, Image, ScrollView, Pressable, SafeAreaView,
} from "react-native";
import React, {useEffect, useState} from "react";
import {useNavigation, useRoute} from "@react-navigation/native";

import {COLORS, FONTS, SIZES, images, GlobalStyles, config} from "../constants";

import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";

import {_roundDimensions} from "../constants/util";
import {getAuthUser, logFunction, numberWithComma} from "../helpers/FunctionHelper";
// import axios from "../redux/Api/axiosInterceptors";

import { MaterialIcons } from '@expo/vector-icons';

import {useDispatch, useSelector} from "react-redux";

import {Alert, Button, FormControl, InfoOutlineIcon, Input, Select} from "native-base";
import {showMessage} from "react-native-flash-message";

import { components } from "../components";
// import {authData} from "../redux/Action";



const Withdraw = (props) => {
    const navigation  = useNavigation();

    const dispatch = useDispatch();

    const current_user = useSelector(state => state.auth.CURRENT_USER)


    const [modalVisible, setModalVisible] = useState(false);


    const main_config  = useSelector(state => state.auth.config);


    const [refreshing, setRefreshing] = useState(false);

    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(null);

    const [bank, setBank] = useState(null);


    // const defaultVal = current_user?.balance / 2

    const submitRequest = async () => {
        try {
            if(amount < 500){
                showMessage({
                    message: 'Sorry, the minimum withdraw is ₦500',
                    type: "warning",
                });
                return null
            }

            if(parseInt(amount) > parseFloat(current_user.balance)){
                logFunction(amount, current_user.balance)
                showMessage({
                    message: 'You cant withdraw more than your account balance',
                    type: "warning",
                });
                return null
            }

            setLoading(true)

            const res = await axios.post('/user/request/withdraw', { amount : amount})

            setLoading(false)


            if(res.data.data) {


                setAmount(null);

                showMessage({
                    message: "Success, "+res.data.message,
                    type: "success",
                });

                await fetchData()

            }
        } catch (e) {
            logFunction('error', e.response.data)
            setLoading(false)
            if(e?.response?.data?.error){
                showMessage({
                    message: e.response.data.error,
                    type: "danger",
                });
            }
        }
    }



    const onRefresh = () => {
        setRefreshing(true);
        fetchData().then(() => {
            setRefreshing(false);
        })
    };


    const fetchData = async () => {
        try {
            const user = await getAuthUser()
            dispatch(authData(user));

        } catch (e) {
            logFunction('error', e.response.data)
            setLoading(false)
        }
    }



    // useEffect(() => {
    //     // let promised = fetchData();
    //     if(current_user.balance){
    //         setAmount(current_user?.balance / 2)
    //     }
    // }, []);

    const renderContent = () => {
        return (

                <View style={styles.modalContent}>


                    <View style={{
                        marginBottom :10
                    }}>
                        <>
                            {current_user.bank_name &&
                                <View style={{
                                    paddingHorizontal: 10,
                                    marginTop: 10,
                                }}>
                                    <View style={{
                                        flexDirection: 'column',
                                        borderRadius: 10,
                                        backgroundColor: COLORS.transparentBlack1,
                                        paddingVertical: 10,
                                        justifyContent: "center",
                                        paddingHorizontal: 10
                                    }}>
                                        <View style={{
                                            // marginTop : 5,
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "center"
                                        }}>
                                            <View>
                                                <Text style={{
                                                    ...FONTS.smallText,
                                                    color: COLORS.primary
                                                }}>{current_user.bank_name}</Text>

                                                <Text style={{
                                                    ...FONTS.smallText,
                                                    color: COLORS.primary
                                                }}>{current_user.account_number}

                                                    {current_user.account_verified &&
                                                        <MaterialIcons name="check-circle" size={12} color="green"/>
                                                    }
                                                </Text>
                                                {!current_user.account_verified &&
                                                    <Text style={{
                                                        color: COLORS.danger
                                                    }}>unverified</Text>
                                                }
                                            </View>


                                            <TouchableOpacity onPress={() => {
                                                navigation.navigate("UpdateBank")
                                            }} style={{
                                                backgroundColor: COLORS.darkGreen,
                                                paddingVertical: 5,
                                                paddingHorizontal: 10,
                                                borderRadius: 10,
                                            }}>
                                                <Text style={{
                                                    color: COLORS.white
                                                }}>Update</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            }
                            {!current_user.bank_name &&
                                <View style={{
                                    paddingHorizontal: 10,
                                    marginTop: 10,
                                }}>
                                    <View style={{
                                        flexDirection: 'column',
                                        borderRadius: 10,
                                        backgroundColor: COLORS.transparentBlack1,
                                        paddingVertical: 10,
                                        justifyContent: "center",
                                        paddingHorizontal: 10
                                    }}>
                                        <View style={{
                                            // marginTop : 5,
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "center"
                                        }}>
                                            <View>
                                                <Text style={{
                                                    ...FONTS.body4,
                                                    color: COLORS.text_color
                                                }}>Set bank account</Text>

                                                <Text style={{
                                                    ...FONTS.smallText,
                                                    color: COLORS.text_color,
                                                    marginTop : 5
                                                }}>Please add only your personal account {'\n'}for quick verification

                                                </Text>

                                            </View>


                                            <TouchableOpacity onPress={() => {
                                                navigation.navigate("UpdateBank")
                                            }} style={{
                                                backgroundColor: COLORS.darkGreen,
                                                paddingVertical: 5,
                                                paddingHorizontal: 10,
                                                borderRadius: 10,
                                            }}>
                                                <Text style={{
                                                    color: COLORS.white
                                                }}>set bank</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            }
                        </>




                        {/*{current_user.pending_balance > 0 &&*/}
                        {/*    <View style={{*/}
                        {/*        paddingHorizontal: 10,*/}
                        {/*        marginTop: 10,*/}
                        {/*    }}>*/}
                        {/*        <View style={{*/}
                        {/*            flexDirection: 'column',*/}
                        {/*            borderRadius: 10,*/}
                        {/*            backgroundColor: COLORS.secondary,*/}
                        {/*            paddingVertical: 15,*/}
                        {/*            justifyContent: "center",*/}
                        {/*            paddingHorizontal: 10*/}
                        {/*        }}>*/}
                        {/*            <View style={styles.boxItemTp}>*/}
                        {/*                <View style={{*/}
                        {/*                    flex: 1*/}
                        {/*                }}>*/}
                        {/*                    <Text numberOfLines={1}*/}
                        {/*                          style={styles.boxHeadingText}>{config.CURRENCY}{numberWithComma(current_user.pending_balance)}</Text>*/}
                        {/*                </View>*/}


                        {/*                <Image source={images.wallet} style={{*/}
                        {/*                    tintColor: COLORS.primary,*/}
                        {/*                    height: 20, width: 20,*/}
                        {/*                }}/>*/}

                        {/*            </View>*/}
                        {/*            <View style={styles.boxItemBm}>*/}
                        {/*                <Text style={{*/}
                        {/*                    ...FONTS.smallText,*/}
                        {/*                    color: COLORS.text_color*/}
                        {/*                }}>Pending Balance</Text>*/}

                        {/*                <TouchableOpacity onPress={() => {*/}
                        {/*                    navigation.navigate("PendingWashes");*/}
                        {/*                }} style={{*/}
                        {/*                    backgroundColor: COLORS.text_color,*/}
                        {/*                    paddingVertical: 5,*/}
                        {/*                    paddingHorizontal: 10,*/}
                        {/*                    borderRadius: 10,*/}
                        {/*                }}>*/}
                        {/*                    <Text style={{*/}
                        {/*                        color: COLORS.primary*/}
                        {/*                    }}>Pending Orders</Text>*/}
                        {/*                </TouchableOpacity>*/}
                        {/*            </View>*/}
                        {/*        </View>*/}
                        {/*    </View>*/}
                        {/*}*/}


                        <View style={{
                            paddingHorizontal : 10,
                            marginTop : 10,
                        }}>
                            <View  style={{
                                flexDirection : 'column',
                                borderRadius : 10,
                                backgroundColor : COLORS.transparentBlack1,
                                paddingVertical : 15,
                                justifyContent : "center",
                                paddingHorizontal : 10
                            }}>
                                <View style={styles.boxItemTp }>
                                    <View style={{
                                        flex : 1
                                    }}>
                                        <Text numberOfLines={1} style={styles.boxHeadingText}>{ config.CURRENCY }{ numberWithComma(current_user.balance) }</Text>
                                    </View>



                                    <Image source={images.wallet} style={{
                                        // tintColor : COLORS.primary,
                                        height : 20, width : 20,
                                    }} />

                                </View>
                                <View style={styles.boxItemBm }>
                                    <Text style={{
                                        ...FONTS.smallText,
                                        color : COLORS.text_color
                                    }}>Available Balance</Text>

                                    <TouchableOpacity onPress={() => {
                                        navigation.navigate("Withdrawals");
                                    }} style={{
                                        backgroundColor : COLORS.darkGreen,
                                        paddingVertical : 5,
                                        paddingHorizontal : 10,
                                        borderRadius : 10,
                                    }}>
                                        <Text style={{
                                            color : COLORS.white
                                        }}>Withdrawal history</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>




                        <View style={{
                            paddingVertical : 20,
                            paddingHorizontal : 10,
                        }}>
                            {/*<FormControl borderRadius={10} isRequired >*/}

                            {/*    <FormControl.Label>Amount : </FormControl.Label>*/}
                            {/*    <Input  defaultValue={amount} variant="outline" borderRadius="15" placeholder="Amount to withdraw"*/}
                            {/*           style={[GlobalStyles.textInputStyle, {height: wp("10%")}]}*/}
                            {/*           onChangeText={(value) => {*/}
                            {/*               setAmount(value)*/}
                            {/*           }}*/}
                            {/*            keyboardType="number-pad"*/}
                            {/*    />*/}
                            {/*</FormControl>*/}


                            <View style={{
                                marginVertical : 20
                            }}>
                                <Button
                                    isLoading={loading}
                                    size="sm"
                                    backgroundColor={COLORS.darkGreen}
                                    onPress={() => submitRequest()}
                                    style={[GlobalStyles.button, { marginBottom: 10, borderRadius : 50 }]}
                                >
                                    <Text style={GlobalStyles.buttonText}>Submit request</Text>
                                </Button>

                            </View>


                        </View>



                    </View>



                </View>

        );
    };

    return (
        <components.BaseContainer customStyles={{backgroundColor: COLORS.white}}>
            {/*<View style={[styles.headerView]}>*/}
                <components.GlobalHeader customStyles={{backgroundColor: COLORS.white}}>
                    <TouchableOpacity style={GlobalStyles.headerLeft} onPress={() => navigation.goBack()}>
                        <components.BackButton/>
                    </TouchableOpacity>
                    <View style={[GlobalStyles.headerCenter, {flex: 1}]}>
                        <Text style={GlobalStyles.headingTxt}> Withdraw</Text>
                    </View>
                    {current_user && current_user.role === "customer" &&
                        <TouchableOpacity style={
                            {
                                backgroundColor: COLORS.green,
                                marginRight: 20,
                                paddingHorizontal: 10,
                                paddingVertical: 5,
                                borderRadius: 15
                            }
                        } onPress={() => navigation.navigate("Plans")}>
                            <Text style={{
                                color: COLORS.white
                            }}>Top up</Text>
                        </TouchableOpacity>
                    }
                </components.GlobalHeader>

            {/*</View>*/}


            <components.ContentContainer  onRefresh={() => onRefresh() }
                               refreshing={refreshing} >

                {renderContent()}






            </components.ContentContainer>


            { loading && <components.Loader /> }
        </components.BaseContainer>
    )


};

const styles = StyleSheet.create({

    boxItem : {
        flexDirection : 'column',
        // marginHorizontal : SIZES.padding,
        marginTop : SIZES.padding,
        width : SIZES.width / 2.3,
        borderRadius : 10,
        backgroundColor : COLORS.secondary,
        paddingVertical : 15,
        justifyContent : "center",
        // alignItems : "center",
        paddingHorizontal : 10
    },
    boxItemTp : {
        flexDirection : "row",
    },
    boxItemBm : {
        marginTop : 10,
        flexDirection : "row",
        justifyContent  : "space-between",
        alignItems : "center"

    },
    boxHeadingText  : {
        ...GlobalStyles.headingTxt,
        color : COLORS.primary
    },

    headerView: {
        marginVertical: hp('2%'),
        marginHorizontal: wp('3%'),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },


    modal: {
        backgroundColor: COLORS.light_white,
        flex : 1,
    },

    // modalContent: {
    //     flex: 1,
    //     flexDirection : "column",
    //     justifyContent : 'flex-start',
    //     marginTop: Constants.statusBarHeight + 10,
    //     paddingHorizontal : 20,
    // },
    // modalView: {
    //     margin: 20,
    //     backgroundColor: 'white',
    //     borderRadius: 20,
    //     padding: 35,
    //     alignItems: 'center',
    //     shadowColor: '#000',
    //     shadowOffset: {
    //         width: 0,
    //         height: 2,
    //     },
    //     shadowOpacity: 0.25,
    //     shadowRadius: 4,
    //     elevation: 5,
    // },
    // modalViewSM: {
    //     margin: 5,
    //     width : SIZES.width - 50,
    //     backgroundColor: 'white',
    //     borderRadius: 10,
    //     padding: 15,
    //     // alignItems: 'center',
    //     shadowColor: '#000',
    //     shadowOffset: {
    //         width: 0,
    //         height: 2,
    //     },
    //     shadowOpacity: 0.25,
    //     shadowRadius: 4,
    //     elevation: 5,
    // },
})

export default Withdraw;
