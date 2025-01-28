import {View, Text, Image, StyleSheet, TouchableOpacity, Share, Platform} from 'react-native';
import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';

import { formatViews } from '../utils/numbers';
import {logFunction} from "../helpers/FunctionHelper";
import SmallText from "./Texts/SmallText";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import CustomImage from "./Image/CustomImage";
import RegularText from "./Texts/RegularText";
import {ResizeMode, Video} from "expo-av";
import {useVideoPlayer} from "../contexts/VideoPlayerContext";
import {FeedService} from "../services";
import {useNavigation} from "@react-navigation/native";
import {useSelector} from "react-redux";

const styles = StyleSheet.create({
    imageThumbnail: {
        height: 300, // h-52 (1 unit = 4px in TailwindCSS)
        width: '100%', // w-full
    },

  video: {
        height: 208, // h-52 (1 unit = 4px in TailwindCSS)
        width: '100%', // w-full
    },


    videoLengthText: {
        color: 'white', // text-white
        fontWeight: '600', // font-semibold
        fontSize: 12, // text-xs
    },
    videoInfoContainer: {
        flexDirection: 'row', // flex-row
        justifyContent: 'space-between', // justify-between
        alignItems: 'center', // items-center
        paddingBottom: 20, // pb-5
        paddingHorizontal: 8, // mx-2
        flex: 1, // flex-1
    },
    videoIcon : {
        alignItems : "center"
    },
    channelThumbnail: {
        height: 36, // h-9
        width: 36, // w-9
        marginRight : 5,
        borderRadius: 18, // rounded-full
    },
    videoDetails: {
        flex: 1, // flex-1
        marginTop : 5,
    },

    videoSubTitle: {
        color: '#4B5563', // text-zinc-400
        fontSize: 12, // text-xs
        // space-y-1 not directly supported, apply margin to children instead
    },
    moreIconContainer: {
        alignSelf: 'flex-start', // self-start
        // Additional styles for the icon container if needed
    },
});

const VideoCard = React.memo(forwardRef(({ video, activeColors, increaseView }, ref) => {
    // logFunction('video', video)

    const [currentVideo, setCurrentVideo] = useState(video); // State to hold the video object

    const navigation = useNavigation()

    const current_user = useSelector(state => state.auth.current_user);


    const videoRef = useRef(null);

    const { currentlyPlaying, setCurrentlyPlaying } = useVideoPlayer();

    useImperativeHandle(ref, () => ({
        stopVideo: async () => {
            const status = await videoRef.current.getStatusAsync();
            try {
                if (status.isLoaded && status.isPlaying) {
                    await videoRef.current.pauseAsync();
                    logFunction('videoRef.current.pauseAsync', 'paused')
                }
            }catch (e) {
                logFunction('error on VideoCard', e.message)
            }

        },
    }));

    useEffect(() => {
        return () => {
            // Stop the video if it's currently playing
            if (videoRef.current) {
                videoRef.current.unloadAsync().catch(console.error);
            }
        };
    }, []);

    const togglePlayPause = async () => {
        logFunction('clicked')
        const status = await videoRef.current.getStatusAsync();
        if (videoRef.current) {
            if (status.isLoaded && status.isPlaying) {
                await videoRef.current.pauseAsync();
            } else {
                await videoRef.current.playAsync();

                setCurrentVideo(prevVideo => ({
                    ...prevVideo,
                    view_count: parseInt((prevVideo.view_count || 0)) + 1, // Update likes count in the state
                }));
                increaseView(currentVideo.id, 'videos')
            }
        }
    };

    const shareApp = async () => {
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

    const toggleLike = async () => {

        if(!current_user){
            navigation.navigate('PhoneGetStarted')
            return
        }


        logFunction('toggleLike', currentVideo.id)
        const res = await FeedService.toggleLike({
            'id' : currentVideo.id,
            'type' : 'videos',
        })
        if(res.status){
            setCurrentVideo(prevVideo => ({
                ...prevVideo,
                likes: res.data.likes, // Update likes count in the state
            }));

            // currentVideo.likes = res.data.likes;
        }else {
            logFunction('toggleResError', res.data)
        }
    };


    const onPlaybackStatusUpdate = async (status) => {
        if (status.isPlaying) {
            if (currentlyPlaying && currentlyPlaying !== videoRef.current) {
                await currentlyPlaying.pauseAsync(); // Pause the currently playing video
            }
            setCurrentlyPlaying(videoRef.current); // Set the current video ref as playing
        } else if (status.didJustFinish && currentlyPlaying === videoRef.current) {
            setCurrentlyPlaying(null);
        }
    };

    // const videoRef = React.useRef(null);

    return (
        <View>
            <TouchableOpacity activeOpacity={0.8} onPress={togglePlayPause}>
            <Video
                ref={videoRef}
                style={styles.video}
                source={{
                    uri: currentVideo.video,
                }}
                useNativeControls={false}
                resizeMode={ResizeMode.COVER}
                // isLooping={true}
                onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            />
            </TouchableOpacity>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                // marginRight: 8,
                // marginBottom: 20,
                marginTop: -24,
            }}>
                <View style={{
                    backgroundColor: activeColors.primary,
                    // borderRadius: 4,
                    paddingHorizontal: 6,
                }}>
                    <SmallText bold customStyles={{
                        color : activeColors.black
                    }}>
                        PREMIUM VIDEO
                    </SmallText>
                </View>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('viewProfile', {
                'user' : currentVideo.user
            })} style={styles.videoInfoContainer}>
                <Image source={{ uri :  currentVideo?.user?.avatar }} style={styles.channelThumbnail} />
                <View style={styles.videoDetails}>
                    <RegularText customStyles={{
                        lineHeight : 18,
                    }}>
                        {currentVideo.title }
                    </RegularText>
                    <View style={{
                        flexDirection : "row",
                        justifyContent : "space-between"
                    }}>
                        <View style={{
                            flex : 2,
                        }}>
                            <SmallText>
                                { currentVideo.created_at_ago }
                            </SmallText>

                        </View>

                        <View style={{
                            flexDirection : "row",
                            justifyContent : "space-between",
                            flex : 1
                        }}>
                            <TouchableOpacity onPress={() => toggleLike()} style={styles.videoIcon}>
                                <Ionicons name="heart" size={20} color="white" />
                                <SmallText>{ currentVideo.likes ?? 0 }</SmallText>
                            </TouchableOpacity>

                            <View style={styles.videoIcon}>
                            <MaterialIcons name="bar-chart" size={20} color={ activeColors.primary } />
                                <SmallText>{ currentVideo.view_count }</SmallText>
                            </View>
                            <TouchableOpacity onPress={() => shareApp()} style={styles.videoIcon}>
                            <MaterialIcons name="share" size={20} color={activeColors.primary} />
                                <SmallText>Share</SmallText>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
                {/*<View style={styles.moreIconContainer}>*/}
                {/*    <Ionicons name="heart" size={24} color="white" />*/}
                {/*</View>*/}
            </TouchableOpacity>
        </View>
    );
}));

export default VideoCard;
