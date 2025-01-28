import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    FlatList,
    ActivityIndicator, Linking, Modal
} from 'react-native'
import React, {useCallback, useContext, useEffect, useRef, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import ShortVideoCard from '../components/shortVideoCard';
import VideoCard from '../components/videoCard';
import {COLORS, FONTS, images, SIZES} from "../constants";
import {ThemeContext} from "../contexts/themeContext";
import {components, RegularText} from "../components";
import {FontAwesome, Ionicons, MaterialIcons} from "@expo/vector-icons";
import {useSelector} from "react-redux";
import {logFunction} from "../helpers/FunctionHelper";
import axios from "axios";
import SmallText from "../components/Texts/SmallText";
import {FlashList} from "@shopify/flash-list";
import CustomImage from "../components/Image/CustomImage";
import {useFocusEffect} from "@react-navigation/native";
import {useFeedActions} from "../hooks/useFeedActions";
import {useUserActions} from "../hooks/useUserActions";
import {FeedService} from "../services";
import Constants from "expo-constants";

export default function HomeScreen({ navigation }) {
    const { theme } = useContext(ThemeContext)

    const { doIncreaseView, doToggleVideoLike } = useFeedActions();

    const {  doGetLives } = useUserActions();

    const main_config  = useSelector(state => state.config.data);


    const [feedData, setFeedData] = useState([]);
    const [page, setPage] = useState(1);
    const [isFetching, setIsFetching] = useState(false);
    const [show_menu, setShowMenu] = useState(false);

    const mediaRefs = useRef(new Map());


    const current_user = useSelector(state => state.auth.current_user);
    const lives = useSelector(state => state.auth.lives);

    const [isRefreshing, setIsRefreshing] = useState(false);


    let activeColors = COLORS[theme.mode]




    useEffect(()=>{
        fetchFeedData(1);
    },[])


    useEffect(() => {
        doGetLives()
    }, [feedData]);


    const increaseView = (id, type) => {
      doIncreaseView(id, type);
    }

    const currentlyPlayingRef = useRef(null);
    const setCurrentlyPlaying = (cell) => {
        currentlyPlayingRef.current = cell;
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

    const toggleVideoLike = async (id, type) => {
        logFunction('toggle', id)

        const res = await FeedService.toggleLike({
            'id' : id,
            'type' : type,
        })
        if(res.status){
            logFunction('toggleRes', res.data.id)
            const item = feedData.find(i => i.id === res?.data?.id);
            logFunction('item', item)
            logFunction('feedData', feedData)
        }else {
            logFunction('toggleResError', res.data)

        }


    }


    const fetchFeedData = async (pageNum,  refreshing = false) => {
        if (isFetching) return; // Prevent multiple simultaneous requests

        setIsFetching(true);

        try {
            const response = await axios.get(`https://app.igbodefence.com/api/v1/feeds?page=${pageNum}`);
            const data = response.data;

            logFunction('fetching new ', pageNum);


            // setFeedData((prevFeedData) => {
            //
            //     const newData = [...prevFeedData];
            //
            //     newData.push({ type: 'videos', items: data.videos });
            //
            //     newData.push({ type: 'shorts', items: data.shorts });
            //
            //     newData.push({ type: 'ads', items: data.ads });
            //
            //
            //     newData.push({ type: 'posts', items: data.posts });
            //
            //
            //     return newData;
            // });

            setFeedData((prevFeedData) => {
                let newData = [];

                if (refreshing) {
                    // If refreshing, replace the existing data with the new data
                    newData = [
                        { type: 'videos', items: data.videos },
                        { type: 'shorts', items: data.shorts },
                        { type: 'ads', items: data.ads },
                        { type: 'posts', items: data.posts },
                    ];
                } else {
                    // If not refreshing, concatenate the new data to the existing data
                    newData = [
                        ...prevFeedData,
                        { type: 'videos', items: data.videos },
                        { type: 'shorts', items: data.shorts },
                        { type: 'ads', items: data.ads },
                        { type: 'posts', items: data.posts },
                    ];
                }

                return newData;
            });


            if(data.posts?.length > 0 || data?.shorts.length > 0 || data?.videos?.length > 0){
                setPage(parseInt(data?.pagination?.current_page));
            }


        } catch (error) {
            logFunction('Failed to fetch feed data:', error);
        } finally {
            setIsFetching(false);
        }
    };

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
                <TouchableOpacity onPress={() => setShowMenu(true)} style={{
                    // marginRight : 10,
                }}>
                    <Image source={ images.menu }
                           style={{
                               resizeMode : "cover"
                           }}
                    />
                </TouchableOpacity>



                <View style={{
                    alignItems : "center"
                }}>
                    <Image source={ images.logoIcon }
                           style={{
                               resizeMode : "contain"
                           }}
                    />

                    { lives.length > 0 ? (
                    <TouchableOpacity onPress={() => navigation.navigate('Live')} style={{
                        marginTop : 10,
                        flexDirection : "row",
                        alignItems : "center",
                        gap : 5,
                    }}>
                        <RegularText bold dark >LIVE STREAM</RegularText>
                        <View style={{
                            height : 10,
                            width : 10,
                            borderRadius : 5,
                            backgroundColor : "red"
                        }}>

                        </View>
                    </TouchableOpacity>
                        ): null
                    }


                </View>

                <View style={{
                    // marginRight : 10,
                }}>
                    { current_user  ? (
                        <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={{
                            backgroundColor : activeColors.bg,
                            padding : 5,
                            borderRadius : 20,

                        }}>

                        <Image source={{ uri : current_user?.avatar }}
                               style={{
                                   resizeMode : "contain",
                                   height : 30,
                                   width : 30,
                               }}
                        />
                        </TouchableOpacity>
                    ) : (
                        <FontAwesome name="user-circle" size={24} color="black" />
                    )}

                </View>

                {/*Image*/}
            </View>
        )
    }


    const menuItems = [
        {
            name: 'Instagram',
            link : main_config?.insta_url
        },{
            name: 'Whatsapp',
            link : main_config?.whatsapp_url
        },{
            name: 'Facebook',
            link : main_config?.fb_url
        },{
            name: 'Tiktok',
            link : main_config?.tiktok_url
        },{
            name: 'Twitter X',
            link : main_config?.twitter_url
        },{
            name: 'Youtube',
            link : main_config?.youtube
        },

        ];
    const menuLinks = [
        {
            name: 'Buy From Us',
            link : main_config?.buy_url
        },{
            name: 'Support Us',
            link : main_config?.support_url
        },{
            name: 'Partner With Us',
            link : main_config?.partner_url
        }

        ];

    const checkLink = async (item) => {
        if(item.link){
            await Linking.openURL(item.link)
            return
        }
    };


    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50
    });


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

    useFocusEffect(
        useCallback(() => {
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

    const renderFooter = () => {
        return isFetching ? (
            <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size="large" color={activeColors.primary} />
            </View>
        ) : null;
    };

    const gotoNews = (link) => {
        Linking.openURL(link).catch((err) => console.error('An error occurred', err));
    }



    const renderItem = useCallback(({ item }) => {
        // For videos, map through each video item and render it.
        if (item.type === 'videos' && item?.items?.length > 0) {
            return item.items.map((video) => {
                if (!videoRefs.get(video.key)) {
                    videoRefs.set(video.key, React.createRef());
                }
                return (
                    <VideoCard
                        key={video.key}
                        toggleVideoLike={toggleVideoLike}
                        increaseView={increaseView}
                        activeColors={activeColors}
                        ref={videoRefs.get(video.key)}
                        video={video}
                    />
                );
            });
        }

        // For shorts, render a horizontal `FlatList`.
        if (item.type === 'shorts' && item?.items?.length > 0) {
            return (
                <View style={{ paddingBottom : 20, paddingHorizontal : 10 }}>
                    {/* Header Row for Shorts Section */}
                    <View >
                        <View style={{
                            paddingHorizontal : 5,
                            flexDirection : "row",
                            marginBottom : 10,
                            alignItems : "center",
                            gap : 16
                        }}>
                            <RegularText customStyles={{
                                color : activeColors.primary
                            }} bold={true}>
                                iGD Shorts
                            </RegularText>
                            <Image source={images.shorts} />
                        </View>
                    </View>
                    {/* Horizontal Scroll View for Shorts */}
                    <FlatList
                        data={item.items}
                        onViewableItemsChanged={onViewableItemsChangedShort}
                        horizontal
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
                        keyExtractor={(short) => `short-${short.id}`}
                        showsHorizontalScrollIndicator={false}
                    />
                    <TouchableOpacity onPress={() => { navigation.navigate("Shorts")}} style={{
                        alignItems : "center",
                        flexDirection : "row",
                        justifyContent : "center",
                        gap:5
                    }}>
                        <SmallText>View All</SmallText>
                        <Ionicons name="ios-arrow-down-outline" size={14} color={ activeColors.primary} />
                    </TouchableOpacity>
                </View>
            );
        }

        if (item.type === 'ads' && item?.items?.length > 0) {
            return (
                <View style={{
                    // backgroundColor: "blue",
                }}>
                    {item.items.map((img) => (
                        <View key={img.id}>
                            <CustomImage style={{
                                height : 200,
                                resizeMode: "cover"
                            }} source={{ uri : img.file }} />
                        </View>
                        ))}
                </View>
            )
        }

        // For posts, render a `View` with two columns.
        if (item.type === 'posts' && item?.items?.length > 0) {
            return (
                <>
                    <View>
                        <View style={{
                            paddingHorizontal : 5,

                            flexDirection : "row",

                            alignItems : "center",
                            gap : 16
                        }}>
                            <RegularText customStyles={{
                                color : activeColors.white
                            }} bold={true}>
                                iGD News
                            </RegularText>
                        </View>
                    </View>
                    <View style={{  flexDirection: 'row', flexWrap: 'wrap', justifyContent : "space-between",
                        paddingBottom :0,
                        marginBottom : 0,
                        // backgroundColor : "red"
                    }}>
                        {item.items.map((post) => (
                            <TouchableOpacity onPress={() => gotoNews(post.guid)} key={post.key} style={styles.postContainer}>
                                <View>
                                    <CustomImage style={{
                                        height : 160,
                                        resizeMode: "cover"
                                    }} source={{ uri : post.img }} />
                                </View>

                                <View style={{
                                    marginTop : 5
                                }}>
                                    <RegularText  numberOfLines={2}  customStyles={{
                                        lineHeight : 18,

                                    }}>{ post.post_title }</RegularText>
                                    { (post.post_excerpt && post.post_excerpt.length > 5) ? (
                                        <SmallText  numberOfLines={1} customStyles={{
                                            lineHeight : 15,
                                        }}>{ post.post_excerpt }</SmallText>
                                    ) : null}


                                    <View style={{
                                        flexDirection : "row",
                                        // backgroundColor : "red",
                                        justifyContent : "space-between"
                                    }}>
                                        <SmallText  numberOfLines={1}>{ post.created_at_ago }</SmallText>
                                        {/*<SmallText>2 Views</SmallText>*/}
                                    </View>
                                </View>

                            </TouchableOpacity>
                        ))}
                    </View>
                </>

            );
        }

        return (
            <View></View>
        )
    }, [activeColors, videoRefs]);




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

                        { renderHeader() }


                        <View style={[styles.scrollView, {
                            backgroundColor : activeColors.bg,}]}>


                        { feedData.length > 0 ? (
                            <>


                            <View style={[styles.videoScrollView, {

                            }]}>

                                <FlatList
                                    data={feedData}
                                    renderItem={renderItem}
                                    estimatedItemSize={300}
                                    keyExtractor={(item, index) => `item-${item.type}-${index}`}
                                    viewabilityConfig={viewabilityConfig.current}
                                    onViewableItemsChanged={onViewableItemsChanged}

                                    onEndReached={() => {
                                        if (!isFetching && feedData.length > 0) {
                                            fetchFeedData(page + 1);
                                        }
                                    }}

                                    ListFooterComponent={renderFooter}

                                    onEndReachedThreshold={0.1}
                                    refreshing={isRefreshing}
                                    onRefresh={() => {
                                        setIsRefreshing(true);
                                        fetchFeedData(1, true).then(() => {
                                            setIsRefreshing(false);
                                        });
                                    }}

                                    ListHeaderComponent={
                                        <>
                                            <View style={{
                                                paddingHorizontal : 10,
                                                flexDirection : "row",
                                                alignItems : "center",
                                                gap : 6
                                            }}>
                                                <RegularText bold={true}>
                                                    iGD VIEWS
                                                </RegularText>
                                                <Ionicons name="md-eye-sharp" size={24} color="white" />
                                            </View>

                                        </>
                                    }
                                />
                                {/*<FlatList*/}
                                {/*    data={feedData}*/}
                                {/*    renderItem={renderItem}*/}
                                {/*    // renderItem={renderVideoItem}*/}
                                {/*    // keyExtractor={(item) => item.videoId}*/}
                                {/*    keyExtractor={(item, index) => `item-${item.type}-${index}`}*/}
                                {/*    removeClippedSubviews={true}*/}
                                {/*    windowSize={10}*/}
                                {/*    maxToRenderPerBatch={5}*/}
                                {/*    initialNumToRender={5}*/}
                                {/*    // onViewableItemsChanged={onViewableItemsChanged}*/}
                                {/*    viewabilityConfig={viewabilityConfig.current}*/}

                                {/*    ListHeaderComponent={*/}
                                {/*        <>*/}
                                {/*            <View style={{*/}
                                {/*                paddingHorizontal : 10,*/}
                                {/*                flexDirection : "row",*/}
                                {/*                alignItems : "center",*/}
                                {/*                gap : 6*/}
                                {/*            }}>*/}
                                {/*                <RegularText bold={true}>*/}
                                {/*                    iGD VIEWS*/}
                                {/*                </RegularText>*/}
                                {/*                <Ionicons name="md-eye-sharp" size={24} color="white" />*/}
                                {/*            </View>*/}

                                {/*        </>*/}
                                {/*    }*/}
                                {/*/>*/}

                                {/*{videos.slice(0,3).map((video, index) => (*/}
                                {/*    <VideoCard activeColors={activeColors} video={video} key={index} />*/}
                                {/*))}*/}
                            </View>

                            </>
                        ) : null}

                        </View>

                    </View>



            <Modal
                animationType="slide"
                transparent={true}
                visible={show_menu}
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
                            // alignItems : "center"

                        }}>
                            <TouchableOpacity onPress={() => setShowMenu(false)}>
                                <MaterialIcons name="cancel" size={34} color="black" />
                            </TouchableOpacity>
                        </View>


                        <View style={{
                            // justifyContent : "center",
                            // alignItems : "center",
                            marginVertical : 30,
                            textAlign : "center"
                            // marginHorizontal : 10
                        }}>

                            <View style={{
                                marginTop : 10
                            }}>
                                {menuLinks.map((menuItem, index) => (
                                    <TouchableOpacity style={{
                                        marginVertical : 2,
                                        borderBottomWidth : 1,
                                        borderBottomColor : activeColors.transparentBlack2

                                    }} onPress={() => checkLink(menuItem)} key={index}>
                                        <View>
                                            <RegularText customStyles={{
                                                color : activeColors.black,
                                            }}>{ menuItem.name }</RegularText>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <View style={{
                                marginTop : 5
                            }}>
                                {menuItems.map((menuItem, index) => (
                                    <TouchableOpacity style={{
                                        marginVertical : 5,
                                    }} onPress={() => checkLink(menuItem)} key={index}>
                                        <View>
                                            <RegularText customStyles={{
                                                color : activeColors.black,
                                            }}>{ menuItem.name }</RegularText>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>

                        </View>


                    </View>
                </View>

            </Modal>

            { isFetching  && feedData.length < 1 && <components.Loader/>}

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        // justifyContent: '',
        // alignItems: 't',
        // marginTop: 22,
    },

    modalViewSM: {
        margin: 5,
        width: 200,
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
        height : SIZES.height,
        // marginTop: Constants.statusBarHeight + 10,
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





    safeArea: {
        flexDirection: 'row', // flex-row
        justifyContent: 'space-between', // justify-between
        marginHorizontal: 16, // mx-4
    },
    postContainer : {
        height : 235,
        // backgroundColor : "red",
        width : "48%"
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

    },

    shortVideosSection: {
        marginTop: 8,
        marginBottom : 20,
        paddingTop: 10,
        paddingBottom: 20,
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
        paddingHorizontal: 0, // px-4
        paddingBottom : 20,
    },
    videoScrollView: {
        paddingBottom : 70,
        flex : 1,
        // Additional styles for the videos scroll view if needed
    },
});
