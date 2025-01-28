import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {
    View,
    FlatList,
    Dimensions,
    StyleSheet,
    Text,
    StatusBar,
    ActivityIndicator,
    Platform,
    TouchableOpacity
} from 'react-native';

import {COLORS, SIZES} from "../constants";
import {SafeAreaView} from "react-native-safe-area-context";
import {ThemeContext} from "../contexts/themeContext";
import {components, RegularButton, RegularText, SmallText} from "../components";

import ShortVideoItem from "../components/shortVideoItem";
import {logFunction} from "../helpers/FunctionHelper";
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";

import {FeedService, UserService} from "../services";
import {FlashList} from "@shopify/flash-list";
import Constants from "expo-constants";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import BackButton from "../components/main/BackButton";
import CustomImage from "../components/Image/CustomImage";
import LargeText from "../components/Texts/LargeText";
import images from "../constants/images";
import {Ionicons} from "@expo/vector-icons";
import {useSelector} from "react-redux";
import ShortVideoCard from "../components/shortVideoCard";
import {useFeedActions} from "../hooks/useFeedActions";

const screenHeight = SIZES.height;

const ViewProfile = () => {

    const { theme } = useContext(ThemeContext)

    const route = useRoute();

    const current_user = useSelector(state => state.auth.current_user);


    const navigation = useNavigation()


    const { user } = route.params || false;

    const [ loading, setLoading ] = useState(false);
    const [ isEnd, setIsEnd ] = useState(false);
    const [ page, setPage ] = useState(0);
    const [ shorts, setShorts ] = useState([]);

    const currentlyPlayingRef = useRef(null);
    const setCurrentlyPlaying = (cell) => {
        currentlyPlayingRef.current = cell;
    };

    const { doIncreaseView, doToggleVideoLike } = useFeedActions();


    const mediaRefs = useRef(new Map());


    let activeColors = COLORS[theme.mode]

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [fLoading, setFLoading] = useState(false);



    useEffect(() => {
                return () => {
                    logFunction('currentlyPlaying', currentlyPlayingRef)
                    stopAllVideos();
                };
    }, []);


    useEffect(() => {
        // logFunction('user', user)
        if(user){
            const isF = current_user?.all_followings.includes(user?.id) ?? false
            setIsFollowing(isF)
            getShorts(1);
        }
    }, [user]);

    const followUser = async () => {
        if(!current_user){
            navigation.navigate("PhoneGetStarted")
            return;
        }
        setFLoading(true)
        try {
            const res = await UserService.followUser({
                'user_id': user.id
            })
            if(res.status){
                const is_follow = res?.data?.is_following ?? false
                setIsFollowing(is_follow)
            }
            setFLoading(false)
        }catch (e) {
            setFLoading(false)
        }

        logFunction('followUser', res)
    }


    useEffect(() => {
        logFunction('isfollowing', isFollowing)
    }, [isFollowing]);


    useEffect(() => {
        logFunction('shorts', shorts?.length)
    }, [shorts]);

    const renderFooter = () => {
        return loading ? (
            <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size="large" color={activeColors.primary} />
            </View>
        ) : null;
    };


    const onViewableItemsChangedShort = useCallback(({ changed }) => {
        changed.forEach(element => {
            const cell = mediaRefs.current[element?.key];
            if(element?.key){
                setCurrentlyPlaying(element?.key)
            }
            if(cell){

                if(element.isViewable){
                    // setCurrentlyPlaying(cell);
                    cell.play();

                }else {
                    // setCurrentlyPlaying(null);
                    cell.stop();
                }
            }

        })
    }, [])


    const getShorts = async  (pageNumber, refreshing = false) => {
        logFunction('getting shorts','yes')
        // return;
        setLoading(!isRefreshing)
        try {
            const res = await FeedService.getUserShorts(user?.id, pageNumber)
            logFunction('res_res', res.status)
            if(res.status){
                if(res.data.length > 0){
                    setShorts(refreshing ? res.data : [...shorts, ...res.data]);
                    setPage(res.current_page);
                }
            }
            setLoading(false)
            setIsRefreshing(false);

        }catch (e){
            logFunction('getShorts error', e)
            setLoading(false)
            setIsRefreshing(false);
        }finally {
            setLoading(false)
            setIsRefreshing(false);
        }

    }


    const stopAllVideos = () => {
        if(currentlyPlayingRef.current){
            const cell = mediaRefs.current[currentlyPlayingRef.current];
            if(cell){
                cell.stop();
            }
        }

    };

    const renderHeader = () => {
        return (
            <View style={[styles.header, {
                backgroundColor : activeColors.bg
            }]}>
                <View style={{
                    // justifyContent : "space-between",
                    flexDirection : "row",
                    paddingHorizontal : 10,
                    gap : 10,
                }}>
                    <TouchableOpacity style={{
                        flex: 0.1,
                        // marginLeft: wp("5%"),
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight : 20,
                    }} onPress={() => navigation.goBack()}>
                        <BackButton/>
                    </TouchableOpacity>

                </View>

            </View>
        );
    };

    const videoRefs = useRef(new Map()).current;


    const increaseView = (id, type) => {
        doIncreaseView(id, type);
    }

    return (
        <SafeAreaView
            style={{
                flex : 1,
                backgroundColor : activeColors.bg,
                // position : "relative"
                // paddingTop : Constants.statusBarHeight
            }}

        >
            <StatusBar
                backgroundColor="transparent"
                translucent={true}
                barStyle={'light-content'}/>

            {renderHeader()}


            <View style={{
                flex : 1,
                backgroundColor : activeColors.bg,
                marginTop : 50,
            }}>
                <View>

                    <View style={{
                        flexDirection : "row",
                        paddingHorizontal : 20,
                        paddingVertical : 10,
                        gap : 10,
                        alignItems : "center"
                    }}>
                        <View style={{
                            borderRadius : 60,
                            padding : 10,
                            borderWidth : 2,
                            borderColor : activeColors.light_white
                        }}>
                            <CustomImage style={{
                                height: 100,
                                width : 100,
                                borderRadius : 50,
                                resizeMode : "contain"
                            }} source={{ uri : user.avatar }} />
                        </View>
                        <View style={{
                            justifyContent : "center",
                            alignItems : "center"
                        }}>
                            <View style={{
                                flexDirection : "row",
                                alignItems : "center",
                                gap : 5,
                            }}>
                                <LargeText bold>@{ user.name }</LargeText>
                                <Ionicons name="checkmark-circle" size={24} color={ activeColors.primary} />
                            </View>

                            { user.info ? (
                                <View>
                                    <SmallText>{ user.info }</SmallText>
                                </View>
                            ) : null}


                            <View style={{
                                flexDirection : "row",
                                marginTop : 5,
                            }}>
                                <SmallText>{ user.videos_count ?? 0 } Videos</SmallText>
                                <SmallText> | { user.followers_count ?? 0 } Followers</SmallText>
                            </View>

                            { current_user?.id !== user.id ? (
                                <View style={{
                                    marginTop : 10,
                                }}>
                                    <RegularButton isLoading={fLoading} buttonText={ isFollowing ? "Followed" : "Follow"} disabled={fLoading} onPress={() => followUser()} buttonContainerStyle={{
                                        backgroundColor : isFollowing ? activeColors.primary : activeColors.white,
                                        paddingHorizontal : 30,
                                        padding : 2,
                                        height: 50,
                                        borderRadius : 10,
                                    }} />

                                </View>
                            ) : null}


                        </View>
                    </View>

                    <View style={{
                        borderWidth : 1,
                        borderColor : activeColors.white,
                        marginVertical : 10,
                    }}>

                    </View>

                    <RegularText bold>Shorts</RegularText>
                </View>
                { shorts.length > 0 ? (
                <FlatList
                    data={shorts}
                    // renderItem={renderItem}
                    windowSize={15}
                    // initialNumToRender={2}
                    maxToRenderPerBatch={10}

                    onViewableItemsChanged={onViewableItemsChangedShort}

                    renderItem={({ item: short, index }) =>
                    {
                        if (!videoRefs.get(short.key)) {
                            videoRefs.set(short.key, React.createRef());
                        }
                        return (
                            <View style={styles.shortsScrollView}>
                                <ShortVideoCard
                                    increaseView={increaseView}
                                    ref={videoRefs.get(short.key)}
                                    activeColors={activeColors} item={short}
                                    key={short.key} />
                            </View>
                        )}}

                    removeClippedSubviews={true}
                    numColumns={2}

                    // estimatedItemSize={300}

                    // viewabilityConfig={{
                    //     itemVisiblePercentThreshold : 50
                    // }}

                    // onViewableItemsChanged={onViewableItemsChanged}
                    keyExtractor={item => item.id}

                    ListFooterComponent={renderFooter}



                    onEndReached={() => {
                        if (!loading && shorts.length > 0) {
                            // getShorts(page + 1);
                        }
                    }}

                    // onEndReachedThreshold={5}

                    refreshing={isRefreshing}
                    onRefresh={() => {
                        setIsRefreshing(true);
                        getShorts(1, true).then(() => {
                            setIsRefreshing(false);
                        });
                    }}

                    contentContainerStyle={{
                        backgroundColor : activeColors.bg,
                        // flex : 1,
                    }}

                />
                ) : null}

                { !loading && shorts.length < 1 ? (
                    <View>
                        <RegularText>No shorts</RegularText>
                    </View>
                ) : null}
            </View>


            { loading  && shorts.length < 1 && <components.Loader/>}


        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        // height: Platform.OS === "ios" ? wp("22%") : wp("25%"),
        elevation : 4,
        zIndex : 9999,
        paddingTop : Constants.statusBarHeight + 5,
        right: 0,
        paddingBottom : 5,
    },
    item: {
        height : 300,
        width : SIZES.width / 2,
        // padding : 10,
        // flex: 1,
        // paddingBottom : 70,
        borderWidth: 2,
        borderColor : "#FEEF04",
        backgroundColor : 'red',
    },

    shortsScrollView: {
        paddingHorizontal: 0, // px-4
        paddingBottom : 20,
        width : SIZES.width / 2,
        // borderWidth: 2,
        // borderColor : "#FEEF04",
    },
});

export default ViewProfile;
