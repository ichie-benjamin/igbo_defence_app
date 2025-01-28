import {
    View,
    TouchableOpacity,
    StyleSheet, ScrollView, RefreshControl, FlatList, StatusBar, Image, Platform, Share
} from "react-native";
import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {useNavigation, useRoute} from "@react-navigation/native";

import {COLORS, config, SIZES} from "../constants";
import {components, LargeText, RegularText, SmallText} from "../components";
import {useDispatch, useSelector} from "react-redux";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {logFunction, numberWithComma} from "../helpers/FunctionHelper";
import {AntDesign, FontAwesome, Ionicons, MaterialIcons} from "@expo/vector-icons";
import {useUserActions} from "../hooks/useUserActions";

import {ThemeContext} from "../contexts/themeContext";
import RegularButton from "../components/Buttons/RegularButton";
import BottomSheet from "@gorhom/bottom-sheet";

import CustomTextInput from "../components/Input/CustomTextInput";
import UserService from "../services/UserService";
import WebView from "react-native-webview";

const Live = (props) => {
    const {  doGetLives } = useUserActions();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);

    const current_user = useSelector(state => state.auth.current_user);
    const lives = useSelector(state => state.auth.lives);

    const onRefresh = () => {
        setRefreshing(true);
        doGetLives().then(() => {
            setRefreshing(false)
        })
    };

    const { theme } = useContext(ThemeContext)
    let activeColors = COLORS[theme.mode]

    useEffect(() => {
        doGetLives()
    }, []);


    const shareApp = async (currentVideo) => {
        try {
            let text = Platform.OS === 'ios' ? currentVideo.share_message_ios : currentVideo.share_message_android;

            logFunction('text', text)

            await Share.share({
                message: text ?? 'Download igbodefence',
            })
        }catch (e){
            logFunction('share error', e)
        }
    }


    useEffect(() => {
        doGetLives()
    }, [current_user]);


    const renderHeader = () => {
        return (
            <components.Header
                title="LIVE STREAM"
                goBack={true}
                customStyles={{
                    color : activeColors.dark
                }}
            />
        );
    };

    const renderLiveItem = useCallback(
        ({ item }) => (
            <View style={{
                flex : 1,
            }}>
                <View key={item.id} style={styles.videoContainer}>
                    <WebView
                        source={{ uri: item.link }}
                        style={styles.webview}
                    />
                </View>
                <View style={styles.videoInfoContainer}>
                    <Image source={{ uri :  item?.user?.avatar }} style={styles.channelThumbnail} />
                    <View style={styles.videoDetails}>
                        <RegularText customStyles={{
                            lineHeight : 18,
                        }}>
                            {item.title }
                        </RegularText>
                        <View style={{
                            flexDirection : "row",
                            justifyContent : "space-between"
                        }}>
                            <View style={{
                                flex : 2,
                            }}>
                                <SmallText>
                                    { item.created_at_ago }
                                </SmallText>

                            </View>

                            <View style={{
                                flexDirection : "row",
                                justifyContent : "flex-end",
                                flex : 1
                            }}>
                                {/*<View style={styles.videoIcon}>*/}
                                {/*    <Ionicons name="heart" size={20} color="white" />*/}
                                {/*    <SmallText>{ item.likes_count ?? 0 }</SmallText>*/}
                                {/*</View>*/}

                                {/*<View style={styles.videoIcon}>*/}
                                {/*    <MaterialIcons name="bar-chart" size={20} color={ activeColors.primary } />*/}
                                {/*    <SmallText>{ item.view_count }</SmallText>*/}
                                {/*</View>*/}
                                <TouchableOpacity onPress={() => shareApp(item)} style={styles.videoIcon}>
                                    <MaterialIcons name="share" size={20} color={activeColors.primary} />
                                    <SmallText>Share</SmallText>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                    {/*<View style={styles.moreIconContainer}>*/}
                    {/*    <Ionicons name="heart" size={24} color="white" />*/}
                    {/*</View>*/}
                </View>
            </View>

        ),
        []
    );

    return (
        <components.BaseContainer >


            {/* Header */}
            {renderHeader()}

            <View style={{
                flex :1,
                backgroundColor : activeColors.bg
            }}>
                {lives.length > 0 &&
                    <FlatList
                        data={lives}
                        renderItem={renderLiveItem}
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



                { !loading && lives.length < 1 &&
                    <View style={{
                        alignItems : 'center',
                        justifyContent : 'center',
                        flex : 1,
                        // marginTop : SIZES.height / 2
                    }}>
                        <LargeText customStyles={{
                            textAlign : 'center',
                        }}>No Live Stream</LargeText>
                    </View>
                }



            </View>


        </components.BaseContainer>


    )
};

export default Live;

const styles = StyleSheet.create({

    videoIcon : {
        alignItems : "center"
    },
    videoContainer: {
        width: '100%',
        aspectRatio: 16 / 10,
        marginVertical : 10,
        // backgroundColor : "red",
        // padding : 10,
    },
    videoInfoContainer: {
        flexDirection: 'row', // flex-row
        justifyContent: 'space-between', // justify-between
        alignItems: 'center', // items-center
        paddingBottom: 20, // pb-5
        paddingHorizontal: 8, // mx-2
        flex: 1, // flex-1
    },
    videoDetails: {
        flex: 1, // flex-1
        marginTop : 5,
    },
    webview: {
        flex: 1,
    },
});
