import { View, Text, Image, StyleSheet } from 'react-native';
import React, {forwardRef, useEffect, useImperativeHandle, useRef} from 'react';

import { formatViews } from '../utils/numbers';
import {logFunction} from "../helpers/FunctionHelper";
import SmallText from "./Texts/SmallText";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import CustomImage from "./Image/CustomImage";
import RegularText from "./Texts/RegularText";
import {ResizeMode, Video} from "expo-av";
import {useVideoPlayer} from "../contexts/VideoPlayerContext";
import {SIZES} from "../constants";

const styles = StyleSheet.create({
    imageThumbnail: {
        height: "100%",
        width: '100%',
    },

    container : {

        flex : 1,
        // backgroundColor : "red",
        // borderBottomWidth : 4,
        borderBottomColor : "white"
    },

  video: {
        height : SIZES.height - 90,
        width: '100%',
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

const ShortCard = React.memo(forwardRef(({ video, activeColors }, ref) => {
    // logFunction('video', video)

    const videoRef = useRef(null);

    const { currentlyPlaying, setCurrentlyPlaying } = useVideoPlayer();

    useImperativeHandle(ref, () => ({
        stopVideo: async () => {
            const status = await videoRef.current.getStatusAsync();
            if (status.isLoaded && status.isPlaying) {
                await videoRef.current.pauseAsync();
                logFunction('videoRef.current.pauseAsync', 'paused')
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
        <View style={styles.container}>
            <Video
                ref={videoRef}
                style={styles.video}
                source={{
                    uri: 'https://app.igbodefence.com/storage/shorts/9a84ea44-84a4-432a-978a-20661300c218/MERFx6Rk9bjI5aBVGjeZTAqlpImVhl518ADinAML.mp4',
                }}
                useNativeControls
                resizeMode={ResizeMode.COVER}
                isLooping={false}
                onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            />
            {/*<View style={{*/}
            {/*    flexDirection: 'row',*/}
            {/*    justifyContent: 'flex-end',*/}
            {/*    // marginRight: 8,*/}
            {/*    // marginBottom: 20,*/}
            {/*    marginTop: -24,*/}
            {/*}}>*/}
            {/*    <View style={{*/}
            {/*        backgroundColor: activeColors.primary,*/}
            {/*        // borderRadius: 4,*/}
            {/*        paddingHorizontal: 6,*/}
            {/*    }}>*/}
            {/*        <SmallText bold customStyles={{*/}
            {/*            color : activeColors.black*/}
            {/*        }}>*/}
            {/*            PREMIUM VIDEO*/}
            {/*        </SmallText>*/}
            {/*    </View>*/}
            {/*</View>*/}
            {/*<View style={styles.videoInfoContainer}>*/}
            {/*    <Image source={{ uri :  video.channelThumbnail ? video.channelThumbnail[0].url : video.channelThumbnail}} style={styles.channelThumbnail} />*/}
            {/*    <View style={styles.videoDetails}>*/}
            {/*        <RegularText customStyles={{*/}
            {/*            lineHeight : 18,*/}
            {/*        }}>*/}
            {/*            {video.title}*/}
            {/*        </RegularText>*/}
            {/*        <View style={{*/}
            {/*            flexDirection : "row",*/}
            {/*            justifyContent : "space-between"*/}
            {/*        }}>*/}
            {/*            <View style={{*/}
            {/*                flex : 2,*/}
            {/*            }}>*/}
            {/*                <SmallText>*/}
            {/*                    {formatViews(video.viewCount)} views • {video.publishedText}*/}
            {/*                </SmallText>*/}

            {/*            </View>*/}

            {/*            <View style={{*/}
            {/*                flexDirection : "row",*/}
            {/*                justifyContent : "space-between",*/}
            {/*                flex : 1*/}
            {/*            }}>*/}
            {/*                <Ionicons name="heart" size={20} color="white" />*/}

            {/*                <MaterialIcons name="bar-chart" size={20} color={ activeColors.primary } />*/}

            {/*                <MaterialIcons name="share" size={20} color={activeColors.primary} />*/}
            {/*            </View>*/}
            {/*        </View>*/}

            {/*    </View>*/}
            {/*    /!*<View style={styles.moreIconContainer}>*!/*/}
            {/*    /!*    <Ionicons name="heart" size={24} color="white" />*!/*/}
            {/*    /!*</View>*!/*/}
            {/*</View>*/}
        </View>
    );
}));

export default ShortCard;
