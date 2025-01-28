import {View, Text, Image, StyleSheet, Dimensions, Platform, TouchableOpacity, Share} from 'react-native';
import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import {ResizeMode, Video} from "expo-av";
import {navigate} from "../navigation/StackNavigator";
import {useNavigation} from "@react-navigation/native";
import SmallText from "./Texts/SmallText";
import ShortVideoItem from "./shortVideoItem";
import {logFunction} from "../helpers/FunctionHelper";
import {FeedService} from "../services";
import {useVideoPlayer} from "../contexts/VideoPlayerContext";
import {useSelector} from "react-redux";

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
        marginRight: 10,
        justifyContent: 'space-between',
    },

    video: {
        height: '100%',
        width: '100%',
        // borderRadius: 10,
        position: 'absolute',
    },
    iconItem : {
        alignItems : "center"
    },
    iconContainer: {
        // justifyContent: 'flex-end', // justify-end
        paddingTop: 12,
        paddingRight: 10,
        gap : 6,
        paddingBottom: 30,
        right : 0,
        bottom : 0,
        position: 'absolute',

        // Include icon styles here
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

// export default function ShortVideoCard({ item, activeColors }) {
const ShortVideoCard = React.memo(forwardRef(({ item, activeColors, increaseView }, ref) => {

    const navigation = useNavigation()

    const videoRef = useRef(null)

    const [currentVideo, setCurrentVideo] = useState(item);

    const current_user = useSelector(state => state.auth.current_user);


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
        logFunction('clicked short video')
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
                increaseView(currentVideo.id, 'shorts')
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
        logFunction('toggleLike', currentVideo.id)

        if(!current_user){
            navigation.navigate('PhoneGetStarted')
            return
        }

        const res = await FeedService.toggleLike({
            'id' : currentVideo.id,
            'type' : 'shorts',
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



    // const videoRef = useRef(null)

    return (
        <TouchableOpacity onPress={togglePlayPause} style={styles.cardContainer}>
            <Video
                ref={videoRef}
                style={[styles.video, {
                    borderWidth : 3,
                    borderColor : activeColors.primary
                }]}
                source={{
                    uri: currentVideo.video,
                }}
                onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                useNativeControls={false}
                resizeMode={ResizeMode.COVER}
                isLooping={false}
            />

            <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => toggleLike()} style={styles.iconItem}>
                    <Ionicons name="heart" size={30} color="white" />
                    <SmallText>{ currentVideo.likes ?? 0 }</SmallText>
                </TouchableOpacity>

                <View style={styles.iconItem}>
                    <MaterialIcons name="bar-chart" size={30} color={ activeColors.primary } />
                    <SmallText>{ currentVideo.view_count }</SmallText>
                </View>

                <TouchableOpacity  onPress={() => shareApp()} style={styles.iconItem}>
                    <MaterialIcons name="share" size={30} color={activeColors.primary} />
                    <SmallText>Share</SmallText>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}));

export default ShortVideoCard;
