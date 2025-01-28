import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {View, FlatList, Dimensions, StyleSheet, Text, StatusBar, ActivityIndicator} from 'react-native';

import {COLORS, SIZES} from "../constants";
import {SafeAreaView} from "react-native-safe-area-context";
import {ThemeContext} from "../contexts/themeContext";
import {components, RegularText} from "../components";

import ShortVideoItem from "../components/shortVideoItem";
import {logFunction} from "../helpers/FunctionHelper";
import {useFocusEffect} from "@react-navigation/native";

import {FeedService, UserService} from "../services";
import {FlashList} from "@shopify/flash-list";
import {useFeedActions} from "../hooks/useFeedActions";

const screenHeight = SIZES.height;

const Shorts = () => {

    const { theme } = useContext(ThemeContext)

    const { doIncreaseView } = useFeedActions();


    const [ loading, setLoading ] = useState(false);
    const [ page, setPage ] = useState(1);
    const [ shorts, setShorts ] = useState([]);

    const currentlyPlayingRef = useRef(null);
    const setCurrentlyPlaying = (cell) => {
        currentlyPlayingRef.current = cell;
    };

    const mediaRefs = useRef(new Map());

    const onViewableItemsChanged = useCallback(({ changed }) => {
        // logFunction('Viewable Items:', changed);

        changed.forEach(element => {
            // logFunction('mediaRefs.current', mediaRefs.current)


            // logFunction('element', element.key)

            const cell = mediaRefs.current[element?.key];
            // logFunction('cell', element?.key)
            if(element?.key){
                setCurrentlyPlaying(element?.key)
            }
            if(cell){
                // logFunction('onViewableItemsChanged', [element.key, element.isViewable])
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


    let activeColors = COLORS[theme.mode]

    const [isRefreshing, setIsRefreshing] = useState(false);



    useEffect(() => {
        getShorts(1)
    }, []);



    // useEffect(() => {
    //     // logFunction('shorts', shorts)
    // }, [shorts]);

    const renderFooter = () => {
        return loading ? (
            <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size="large" color={activeColors.primary} />
            </View>
        ) : null;
    };



    const getShorts = async  (pageNumber, refreshing = false) => {
        logFunction('getting shorts','yes')
        setLoading(!isRefreshing)
        try {
            const res = await FeedService.getShorts(pageNumber)
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


    useFocusEffect(
        useCallback(() => {

            if(shorts.length < 1){
                logFunction('get new shorts', shorts.length)
                getShorts(1);
            }

            // This function will be called when the component gains focus
            return () => {
                // logFunction('useFocusEffect', 'run')
                logFunction('currentlyPlaying', currentlyPlayingRef)
                stopAllVideos();
            };
        }, [])
    );

    const increaseView = (id, type) => {
        doIncreaseView(id, type);
    }
    const stopAllVideos = () => {
        if(currentlyPlayingRef.current){
            const cell = mediaRefs.current[currentlyPlayingRef.current];
            if(cell){
                cell.stop();
            }
        }

    };

    const renderItem = ({ item }) => {
        return (
            <View style={styles.item}>
                {/*<Text>{ screenHeight }</Text>*/}
                <ShortVideoItem
                    increaseView={increaseView}
                    ref={ShortVideoItemRef => (mediaRefs.current[item.id] = ShortVideoItemRef)}
                    activeColors={activeColors}
                    item={item}

                />
            </View>
        );
    }

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



            <View style={{
                flex : 1,
                backgroundColor : activeColors.bg
            }}>
                { shorts.length > 0 ? (
                <FlashList
                    data={shorts}
                    renderItem={renderItem}
                    windowSize={15}
                    initialNumToRender={2}
                    maxToRenderPerBatch={10}
                    removeClippedSubviews={true}
                    estimatedItemSize={300}

                    viewabilityConfig={{
                        itemVisiblePercentThreshold : 50
                    }}
                    pagingEnabled={true}
                    onViewableItemsChanged={onViewableItemsChanged}
                    keyExtractor={item => item.id}


                    ListFooterComponent={renderFooter}


                    onEndReached={() => {
                        if (!loading && shorts.length > 0) {
                            getShorts(page + 1);
                        }
                    }}

                    onEndReachedThreshold={0.1}
                    refreshing={isRefreshing}
                    onRefresh={() => {
                        setIsRefreshing(true);
                        getShorts(1, true).then(() => {
                            setIsRefreshing(false);
                        });
                    }}

                    contentContainerStyle={{
                        backgroundColor : activeColors.bg
                    }}

                />
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
    item: {
        height: screenHeight,
        padding : 10,
        paddingBottom : 70,
        borderTopWidth: 4,

        // borderTopColor: 'red',
    },
});

export default Shorts;
