import {View, Text, Image, StyleSheet, Dimensions, Platform, TouchableOpacity, Share} from 'react-native';
import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import {ResizeMode, Video} from "expo-av";

import {logFunction} from "../helpers/FunctionHelper";
import {useVideoPlayer} from "../contexts/VideoPlayerContext";
import SmallText from "./Texts/SmallText";
import {SIZES} from "../constants";
import LargeText from "./Texts/LargeText";
import images from "../constants/images";
import RegularText from "./Texts/RegularText";
import CustomImage from "./Image/CustomImage";
import {FeedService, UserService} from "../services";
import {useSelector} from "react-redux";
import {useNavigation} from "@react-navigation/native";
import {RegularButton} from "./index";

// Get the device width
const deviceWidth = Dimensions.get('window').width;

// Check if the device is a tablet
// You can define your own logic to determine if the device is a tablet
const isTablet = Platform.isPad || (deviceWidth >= 768); // Example condition for tablet


const styles = StyleSheet.create({
    cardContainer: {
        position: 'relative', // relative
        height: 326,
        width: isTablet ? deviceWidth / 4 : deviceWidth / 2.2,
        marginRight: 12,
        justifyContent: 'space-between',
    },

    poster : {
        // position : "absolute",
        width : "100%",
        alignItems : "center",
        flexDirection : "row",
        justifyContent : "space-between",
        zIndex : 9999,
        // bottom : 70,
        padding : 10,
        // height : 100,
        // backgroundColor : "red"
    },

    video: {
        flex : 1,
        height: '100%',
        // width: '100%',
        // // borderRadius: 10,
        // position: 'absolute',
    },
    iconContainer: {
        // justifyContent: 'flex-end', // justify-end
        // paddingTop: 12,
        paddingRight: 30,
        gap : 15,
        paddingBottom: 30,
        zIndex : 9999,
        right : 0,
        bottom : SIZES.width / 2,
        position: 'absolute',

        // Include icon styles here
    },
    iconItem : {
        alignItems : "center"
    },
    textContainer: {
        padding: 8,
    },
    titleText: {
        color: 'white', // text-white
        textShadowColor: 'rgba(0, 0, 0, 0.8)', // shadow-lg
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 5,
        fontWeight: 'bold', // font-bold
        fontSize: 14, // text-sm
    },
    viewCountText: {
        color: 'white', // text-white
        textShadowColor: 'rgba(0, 0, 0, 0.7)', // shadow-md
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 3,
        fontWeight: '800', // font-extrabold
        fontSize: 10, // text-xs
    },
});

const ShortVideoItem = React.memo(forwardRef(({ item, activeColors, increaseView }, parentRef) => {

    const [currentVideo, setCurrentVideo] = useState(item);

    const navigation  = useNavigation();


    const ref = useRef(null)

    const current_user = useSelector(state => state.auth.current_user);


    const { currentlyPlaying, setCurrentlyPlaying } = useVideoPlayer();


    const [isFollowing, setIsFollowing] = useState(false);
    const [fLoading, setFLoading] = useState(false);


    const followUser = async () => {
        if(!current_user){
            navigation.navigate("PhoneGetStarted")
            return;
        }
        try {
            setFLoading(true)
            const res = await UserService.followUser({
                'user_id': currentVideo?.user?.id
            })
            if(res.status){
                const is_follow = res?.data?.is_following ?? false
                setIsFollowing(is_follow)
            }
            logFunction('followUser', res)

            setFLoading(false)
        }catch (e) {
            setFLoading(false)
        }

    }


    useEffect(() => {
        // logFunction('user', user)
        if(currentVideo){
            const isF = current_user?.all_followings.includes(currentVideo?.user?.id) ?? false
            setIsFollowing(isF)
        }
    }, [currentVideo]);

    useImperativeHandle(parentRef, () => ({
        play,
        unload,
        stop,
    }))

    const play = async () => {
        if(ref.current === null){
            return;
        }
        const status = await ref.current.getStatusAsync();
        if(status?.isPlaying){
            return;
        }
        try {
            await ref.current.playAsync();
        }catch (e){
            logFunction('play error', e)
        }
    }



    const onPlaybackStatusUpdate = async (status) => {
        if (status.isPlaying && ref.current) {
            if (currentlyPlaying && currentlyPlaying !== ref.current) {
                await currentlyPlaying.pauseAsync(); // Pause the currently playing video
            }
            // logFunction('ref.current', ref.current)
            setCurrentlyPlaying(ref.current); // Set the current video ref as playing
        } else if (status.didJustFinish && currentlyPlaying === ref.current) {
            logFunction('status.didJustFinish', status.didJustFinish)
            setCurrentlyPlaying(null);
        }
    };


    const shareApp = async () => {
        try {
            let text = Platform.OS === 'ios' ? currentVideo.share_message_ios : currentVideo.share_message_android;

            logFunction('text', text)

            await Share.share({
                message: text ?? 'Download igbodefence app',
            })
        }catch (e){
            logFunction('share error', e)
        }
    }

    const toggleLike = async () => {
        if(!current_user){
            navigation.navigate('PhoneGetStarted')
            return
        }
        logFunction('toggleLike', currentVideo.id)
        const res = await FeedService.toggleLike({
            'id' : currentVideo.id,
            'type' : 'shorts',
        })

        if(res.status){
            setCurrentVideo(prevVideo => ({
                ...prevVideo,
                likes: res.data.likes, // Update likes count in the state
            }));

        }else {
            logFunction('toggleResError', res.data)
        }
    };

    const togglePlayPauseOld = async () => {
        logFunction('clicked ','short')
        if(ref.current){
            const status = await ref.current.getStatusAsync();
            if (status) {
                try {
                    if (status.isLoaded && status.isPlaying) {
                        await ref.current.pauseAsync();
                    } else {
                        await ref.current.playAsync();
                    }
                }catch (e){
                    logFunction('error playing or pausing', e)
                }

            }
        }

    };

    const togglePlayPause = async () => {
        logFunction('clicked', 'short');
        if (ref.current) {
            const status = await ref?.current?.getStatusAsync();
            if (status) {
                try {
                    if (status.isLoaded) {
                        if (status.isPlaying) {
                            await ref?.current?.pauseAsync();
                        } else {
                            await ref?.current?.playAsync();
                            currentVideo.view_count++;
                            increaseView(currentVideo.id, 'shorts')
                        }
                    } else {
                        // Wait for the video to load before attempting to play or pause
                        const playbackStatus = await ref?.current?.loadAsync();
                        if (playbackStatus?.isLoaded) {
                            if (playbackStatus.isPlaying) {
                                await ref?.current?.pauseAsync();
                            } else {
                                await ref?.current?.playAsync();
                                currentVideo.view_count++;
                                increaseView(currentVideo.id, 'shorts')
                            }
                        }
                    }
                } catch (e) {
                    logFunction('error playing or pausing', e.message);
                }
            }
        }
    };


    useEffect(() => {
        return() => {
            logFunction('unload','yes')
            unload()
        };
    }, []);

    const stop = async () => {
        if(ref.current === null){
            return;
        }
        const status = await ref.current.getStatusAsync();
        if(!status?.isPlaying){
            return;
        }
        try {
            await ref.current.stopAsync();
        }catch (e){
            logFunction('stop error', e)
        }
    }
    const unload = async () => {
        if(ref.current === null){
            return;
        }
        try {
            await ref.current.unloadAsync();
        }catch (e){
            logFunction('unload error', e)
        }
    }

    return (
        <>
            { currentVideo ? (
                <View style={styles.video}>
                    <TouchableOpacity style={{
                        flex: 1,
                    }} activeOpacity={0.8} onPress={togglePlayPause}>

                        <Video
                            ref={ref}
                            style={[{
                                borderWidth : 3,
                                flex: 1,
                                borderColor : activeColors.primary
                            }]}
                            source={{
                                uri: currentVideo?.video,
                            }}
                            useNativeControls={false}

                            resizeMode={ResizeMode.COVER}
                            shouldPlay={false}
                            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                            isLooping={true}
                        />
                    </TouchableOpacity>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity onPress={() => toggleLike()}  style={styles.iconItem}>
                            <Ionicons name="heart" size={30} color="white" />
                            <SmallText>{ currentVideo.likes ?? 0 }</SmallText>
                        </TouchableOpacity>

                        <View style={styles.iconItem}>
                            <MaterialIcons name="bar-chart" size={30} color={ activeColors.primary } />
                            <SmallText>{ currentVideo.view_count }</SmallText>
                        </View>

                        <TouchableOpacity onPress={() => shareApp()}  style={styles.iconItem}>

                            <MaterialIcons name="share" size={30} color={activeColors.primary} />
                            <SmallText>Share</SmallText>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.poster}>
                        <View style={{
                            flex : 1,
                        }}>
                            <TouchableOpacity onPress={() => navigation.navigate('viewProfile', {
                                'user' : currentVideo.user
                            })} style={{
                                flexDirection : "row",
                                alignItems : "center",
                                gap : 4
                            }}>
                                <CustomImage style={{
                                    height : 50,
                                    width : 50,
                                    resizeMode : "contain"
                                }} source={{ uri : currentVideo?.user?.avatar }} />
                                <LargeText>@{ currentVideo?.user?.name }</LargeText>

                            </TouchableOpacity>

                            <SmallText numberOfLines={2}>{ currentVideo.title }</SmallText>
                        </View>

                        <View>
                            { current_user?.id !== currentVideo?.user?.id ? (
                            <RegularButton isLoading={fLoading} buttonText={ isFollowing ? "Followed" : "Follow"} disabled={fLoading} onPress={() => followUser()} buttonContainerStyle={{
                                backgroundColor : isFollowing ? activeColors.primary : activeColors.white,
                                paddingHorizontal : 30,
                                padding : 2,
                                height: 50,
                                width : "100%",
                                borderRadius : 10,
                            }} />
                                ):null }
                        </View>

                    </View>

                </View>
            ) : null}
        </>

    );
}))

export default ShortVideoItem;
