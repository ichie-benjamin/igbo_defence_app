import {
    View,
    TouchableOpacity,
    StyleSheet, ScrollView, RefreshControl, FlatList
} from "react-native";
import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {useNavigation, useRoute} from "@react-navigation/native";

import {COLORS, config, SIZES} from "../constants";
import {components, LargeText, RegularText, SmallText} from "../components";
import {useDispatch, useSelector} from "react-redux";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {logFunction, numberWithComma} from "../helpers/FunctionHelper";
import {AntDesign, FontAwesome, Ionicons} from "@expo/vector-icons";
import {useUserActions} from "../hooks/useUserActions";

import {ThemeContext} from "../contexts/themeContext";
import RegularButton from "../components/Buttons/RegularButton";
import BottomSheet from "@gorhom/bottom-sheet";

import CustomTextInput from "../components/Input/CustomTextInput";
import UserService from "../services/UserService";

const Notifications = (props) => {
    const { doGetUser } = useUserActions();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const current_user = useSelector(state => state.auth.current_user);

    const onRefresh = () => {
        setRefreshing(true);
        doGetUser().then(() => {
            setRefreshing(false)
        })
    };

    const { theme } = useContext(ThemeContext)
    let activeColors = COLORS[theme.mode]

    useEffect(() => {
        doGetUser()
    }, []);

    const getNotifications = async () => {
        setLoading(true)
        const notifications = await UserService.getNotifications({page : 1})
        if(notifications.status){
            setNotifications(notifications.data)
        }
        setLoading(false)
    }

    useEffect(() => {
        getNotifications()
    }, [current_user]);


    const renderHeader = () => {
        return (
            <components.Header
                title="Notifications"
                goBack={true}
            />
        );
    };

    const renderNotificationItem = useCallback(
        ({ item }) => (
            <TouchableOpacity key={item.id} style={{
                flexDirection : "row",
                paddingHorizontal : 10,
                marginVertical : 5,
                justifyContent : "space-between",
                paddingVertical : 10,
                alignItems : "center"
            }}>
                <View style={{
                    flexDirection : "row",
                    alignItems : "center",
                    width : "80%"
                }}>
                    <View style={{}}>
                        { item.type === 'deposit' ? (
                            <Ionicons name="ios-arrow-redo-circle-sharp" size={24} color={ activeColors.inverseColor } />
                        ) : (
                            <Ionicons name="ios-arrow-undo-circle" size={24} color={ activeColors.inverseColor } />
                        )}
                    </View>
                    <View style={{
                        marginHorizontal : 10
                    }}>
                        <RegularText>{item.type}</RegularText>
                        { item.description.length > 1 ? (<SmallText>{item.description} </SmallText>) : null }
                        <SmallText>{item.created_date}</SmallText>
                    </View>
                </View>

                <View style={{
                    // marginHorizontal : 10
                }}>
                    <RegularText  customStyles={{
                        color : item.type === "withdraw" ? activeColors.danger : activeColors.success
                    }} bold>{numberWithComma(item.amount)}</RegularText>
                </View>
            </TouchableOpacity>
        ),
        []
    );

    return (
        <components.BaseContainer >

            {/* Header */}
            {renderHeader()}

            {notifications.length > 0 &&
                <FlatList
                    data={notifications}
                    renderItem={renderNotificationItem}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={10}
                    bounces={false}
                    scrollEnabled={true}
                    refreshControl={
                        <RefreshControl
                            refreshing={props.refreshing ? props.refreshing : refreshing}
                            onRefresh={props.onRefresh ? props.onRefresh : onRefresh}
                        />
                    }
                    style={[{
                        marginHorizontal: wp("4%"),
                    }, props.customStyles]}
                />

            }

            {loading && <components.Loader/>}



            { !loading && notifications.length < 1 &&
            <View style={{
                alignItems : 'center',
                justifyContent : 'center',
                flex : 1,
                // marginTop : SIZES.height / 2
            }}>
                <LargeText customStyles={{
                    textAlign : 'center',
                }}>No Notifications</LargeText>
            </View>
            }




        </components.BaseContainer>


    )
};

export default Notifications;

