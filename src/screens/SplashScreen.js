import React, {useContext, useEffect} from "react";
import {
    View,
    Animated,
    Easing,
    LogBox
} from "react-native";
import {COLORS, images} from '../constants';

import {components, Loader} from "../components";


import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {theme} from '../constants'
import {useDispatch, useSelector} from "react-redux";
import {logFunction} from "../helpers/FunctionHelper";

import {useUserActions} from "../hooks/useUserActions";
import {ThemeContext} from "../contexts/themeContext";

const animatedValue = new Animated.Value(0);

function SplashScreen(props) {

    const dispatch = useDispatch();

    const { theme } = useContext(ThemeContext)
    let activeColors = COLORS[theme.mode]


    const { doAuthInit } = useUserActions();

    const loadApplication = useSelector(state => state.mainScreenInit.loadApplication)
    const navScreen = useSelector(state => state.mainScreenInit.navScreen)

    const navigateToMain = () => {
        logFunction('navScreen',navScreen)
        let navTo = setTimeout(() => loadApplication &&
            props.navigation.reset({
                index: 0,
                routes: [{name: navScreen}]
            }), 300)

        return () => {
            clearTimeout(navTo);
        };
    }

    useEffect(() => {
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);

        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true, // Add this line

        }).start();

        async function fetchData() {
            // You can await here
            let loadApp = setTimeout(() => { logFunction('doing','authInt'), doAuthInit()}, 1000);
            // let loadApp = setTimeout(() => { logFunction('doing','authInt'), doAuthInit()}, 100000);
            return () => {
                clearTimeout(loadApp);
            };
        }

        fetchData();

    }, [

        navigateToMain()

    ]);


    return (
        <components.BaseContainer customStyle={{
            backgroundColor : activeColors.bg
        }}>
            <View style={{backgroundColor: activeColors.bg, flex: 1}}>
            {/*    <Animated.Image source={images.splashlogo} resizeMode='contain' style={{*/}
            {/*        position: 'absolute',*/}
            {/*        left: wp('35%'),*/}
            {/*        top: hp('20%'),*/}
            {/*        height: hp('10%'),*/}
            {/*        width: wp('10%'),*/}
            {/*        transform: [*/}
            {/*            {*/}
            {/*                translateX: animatedValue.interpolate({*/}
            {/*                    inputRange: [0, 1],*/}
            {/*                    outputRange: [0, 32]*/}
            {/*                })*/}
            {/*            },*/}
            {/*            {*/}
            {/*                translateY: animatedValue.interpolate({*/}
            {/*                    inputRange: [0, 1],*/}
            {/*                    outputRange: [0, 150]*/}
            {/*                })*/}
            {/*            },*/}
            {/*            {*/}
            {/*                scaleX: animatedValue.interpolate({*/}
            {/*                    inputRange: [0, 1],*/}
            {/*                    outputRange: [1, 8]*/}
            {/*                })*/}
            {/*            },*/}
            {/*            {*/}
            {/*                scaleY: animatedValue.interpolate({*/}
            {/*                    inputRange: [0, 1],*/}
            {/*                    outputRange: [1, 10]*/}
            {/*                })*/}
            {/*            }*/}
            {/*        ]*/}
            {/*    }}*/}

            {/*    />*/}
                <Loader />

            </View>

        </components.BaseContainer>
    )

}


export default SplashScreen;
