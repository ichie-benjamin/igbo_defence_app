import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    FlatList,
    ActivityIndicator
} from 'react-native'
import React, {useCallback, useContext, useEffect, useRef, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import VideoCard from '../components/videoCard';
import {COLORS, images} from "../constants";
import {ThemeContext} from "../contexts/themeContext";

import {components, RegularText} from "../components";
import {FontAwesome, Ionicons} from "@expo/vector-icons";
import {useSelector} from "react-redux";
import {logFunction} from "../helpers/FunctionHelper";
import {FeedService} from "../services";
import {useFocusEffect} from "@react-navigation/native";
import {FlashList} from "@shopify/flash-list";

export default function VideosScreen() {
    const { theme } = useContext(ThemeContext)

   const [videos, setVideos] = useState([]);

    const current_user = useSelector(state => state.auth.current_user);

    const [ loading, setLoading ] = useState(false);
    const [ page, setPage ] = useState(1);

    const [isRefreshing, setIsRefreshing] = useState(false);


    let activeColors = COLORS[theme.mode]


    const styles = StyleSheet.create({
        safeArea: {
            flexDirection: 'row', // flex-row
            justifyContent: 'space-between', // justify-between
            marginHorizontal: 16, // mx-4
        },
        logoSection: {
            flexDirection: 'row', // flex-row
            alignItems: 'center', // items-center
        },
        logoIcon: {
            height: 28, // h-7
            width: 40, // w-10
        },
        logoText: {
            color: 'white', // text-white
            fontWeight: '600', // font-semibold
            fontSize: 24, // text-xl
            letterSpacing: -0.5, // tracking-tighter
            marginLeft: 4, // space-x-1
        },
        iconSection: {
            flexDirection: 'row', // flex-row
            alignItems: 'center', // items-center
        },
        avatar: {
            height: 28, // h-7
            width: 28, // w-7
            borderRadius: 14, // rounded-full
            marginLeft: 12, // space-x-3
        },
        iconStyle: {
            stroke: 'white',
            strokeWidth: 1.2,
            height: 22,
            width: 22,
            marginLeft: 12, // space-x-3
        },

        scrollView: {
            flex: 1,
            backgroundColor : activeColors.bg,
            paddingBottom : 80,
        },

        shortVideosSection: {
            marginTop: 8, // mt-2
            paddingTop: 20, // py-5
            paddingBottom: 20, // py-5
            borderTopWidth: 4,
            borderBottomWidth: 4,
            borderColor: '#4B5563', // border-zinc-700
        },
        shortsRow: {
            marginHorizontal: 16,
            marginVertical : 10,
            flexDirection: 'row', // flex-row
            alignItems: 'center', // items-center
            gap : 6,
        },
        shortsIcon: {
            resizeMode : "contain"
        },
        shortsText: {
            color: 'white', // text-white
            fontWeight: '600', // font-semibold
            fontSize: 18, // text-lg
            letterSpacing: -0.5, // tracking-tighter
        },
        shortsScrollView: {
            paddingHorizontal: 16, // px-4
        },
        videoScrollView: {
            flex : 1,
            // Additional styles for the videos scroll view if needed
        },
    });



    useEffect(()=>{
        fetchData(1);
    },[])

    const fetchData = async (pageNumber, refreshing = false)=>{
        logFunction('getting videos','yes '+ pageNumber)
        setLoading(!isRefreshing)
        try {
            const res = await FeedService.getVideos(pageNumber)
            logFunction('res_res', res.status)
            if(res.status){
                if(res.data.length > 0){
                    setVideos(refreshing ? res.data : [...videos, ...res.data]);
                    setPage(res.current_page);
                }
            }
            setLoading(false)
            setIsRefreshing(false);

        }catch (e){
            logFunction('get Videos error', e)
            setLoading(false)
            setIsRefreshing(false);
        }finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    }

    function renderHeader(){
        return (
            <View style={{
                flexDirection : "row",
                marginHorizontal : 10,
                paddingVertical : 10,
                alignItems : "center",
                // backgroundColor : "red",
                justifyContent : "space-between",
                // height : 80
            }}>
                <View style={{
                    // marginRight : 10,
                }}>
                    <Image source={ images.menu }
                           style={{
                               resizeMode : "cover"
                           }}
                    />
                </View>


                <View>
                    <Image source={ images.logoIcon }
                           style={{
                               resizeMode : "contain"
                           }}
                    />

                </View>

                <View style={{
                    // marginRight : 10,
                }}>
                    { current_user  ? (
                        <Image source={{ uri : current_user?.avatar }}
                               style={{
                                   resizeMode : "cover"
                               }}
                        />
                    ) : (
                        <FontAwesome name="user-circle" size={24} color="black" />
                    )}

                </View>

                {/*Image*/}
            </View>
        )
    }


    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50
    });

    const renderFooter = () => {
        return loading ? (
            <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size="large" color={activeColors.primary} />
            </View>
        ) : null;
    };



    useFocusEffect(
        useCallback(() => {
            if(videos.length < 1){
                logFunction('no videos', videos.length)
                fetchData(1);
            }
            return () => {
                stopAllVideos();
            };
        }, [])
    );

    const stopAllVideos = () => {

        videoRefs.forEach((ref, key) => {
            if (ref.current) {
                ref.current.stopVideo();
            }
        });
    };

    const videoRefs = useRef(new Map()).current;

    const onViewableItemsChanged = useCallback(({ viewableItems }) => {
        // logFunction('Viewable Items:', viewableItems);


        videoRefs.forEach((ref, key) => {
            const isViewable = viewableItems.some((viewable) => viewable.key === key);
            if (!isViewable && ref.current) {
                // console.log(`Stopping video for key ${key}`);
                ref.current.stopVideo();
            }
        });
    }, []);

    const renderVideoItem = useCallback(({ item }) => {
        if (!videoRefs.get(item.id)) {
            videoRefs.set(item.id, React.createRef());
        }
        return <VideoCard activeColors={activeColors}
                          ref={videoRefs.get(item.id)} video={item}
        />;
    }, []);


    return (
        <SafeAreaView
            style={{
                flex : 1,
                backgroundColor : activeColors.bgPrimary,
                // paddingTop : Constants.statusBarHeight
            }}

        >
            <StatusBar
                backgroundColor="transparent"
                translucent={true}
                barStyle={'dark-content'}/>

            <View style={{ flex : 1, marginTop : 10}}>
             {/*logo and profile icon*/}

                {/*{ renderHeader() }*/}





            <View style={styles.scrollView}>

                { videos.length > 0 ? (
                    <View style={styles.videoScrollView}>

                        <FlashList
                            data={videos}
                            renderItem={renderVideoItem}
                            keyExtractor={(item) => item.id }
                            removeClippedSubviews={true}
                            windowSize={10}
                            initialNumToRender={5}
                            onViewableItemsChanged={onViewableItemsChanged}
                            viewabilityConfig={viewabilityConfig.current}
                            estimatedItemSize={300}
                            ListFooterComponent={renderFooter}
                            ListHeaderComponent={
                                <>
                                    <View style={{
                                        paddingHorizontal : 10,
                                        paddingVertical : 10,
                                        flexDirection : "row",
                                        alignItems : "center",
                                        gap : 6
                                    }}>
                                        <RegularText bold={true}>
                                            iGD VIDEOS
                                        </RegularText>
                                        <Ionicons name="md-eye-sharp" size={24} color="white" />
                                    </View>

                                </>
                            }

                            onEndReached={() => {
                                if (!loading && videos.length > 0) {
                                    fetchData(page + 1);
                                }
                            }}
                            onEndReachedThreshold={0.1}
                            refreshing={isRefreshing}
                            onRefresh={() => {
                                setIsRefreshing(true);
                                fetchData(1, true).then(() => {
                                    setIsRefreshing(false);
                                });
                            }}

                        />

                        {/*{videos.slice(0,3).map((video, index) => (*/}
                        {/*    <VideoCard activeColors={activeColors} video={video} key={index} />*/}
                        {/*))}*/}
                    </View>
                ) : null}

                { loading  && videos.length < 1 && <components.Loader/>}

            </View>
        </View>
        </SafeAreaView>
    )
}
