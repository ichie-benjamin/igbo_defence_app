import React, {useContext, useEffect, useRef} from 'react';
import {
    View,
    StyleSheet, TouchableOpacity, Animated, ImageBackground
} from 'react-native';
import {Circle, G, Svg} from "react-native-svg";

import { AntDesign } from '@expo/vector-icons'
import {COLORS, images} from "../../constants";

import {ThemeContext} from "../../contexts/themeContext";

export  const NextButton = ({ percentage, scrollTo }) => {

    const size = 80;

    const strokeWidth = 2;

    const center = size / 2;

    const radius = size / 2 - strokeWidth / 2

    const circumference = 2 * Math.PI * radius;


    const progressAnimation = useRef(new Animated.Value(0)).current

    const progressRef = useRef(null)

    const { theme } = useContext(ThemeContext)
    let activeColors = COLORS[theme.mode]


    const animation = (toValue) => {
        return Animated.timing(progressAnimation, {
            toValue,
            duration : 250,
            useNativeDriver : true,
        }).start()
    }

    useEffect(() => {
        animation(percentage)
    }, [percentage]);


    const styles = StyleSheet.create({
        container : {
            flex : 1,
            justifyContent : 'center',
            alignItems : 'center',
        },

        button : {
            position : 'absolute',
            backgroundColor : activeColors.primary,
            borderRadius : 100,
            padding : 10,
        }


    })



    useEffect(() => {
        progressAnimation.addListener((value) => {
            const strokeDashoffset = circumference - (circumference * value.value) / 100


            if(progressRef?.current){
                progressRef.current.setNativeProps({
                    strokeDashoffset
                })
            }
        }, [percentage]
        );


        return () => {
            progressAnimation.removeAllListeners()
        };

    },[]);


    return (

        <View
            style={styles.container}
        >

                <Svg width={ size } height={size}>

                    <G rotation="-90" origin={center}>
                        <Circle stroke="#E6E7E8" cx={center} cy={center} r={radius}
                                strokeWidth={strokeWidth} />

                        <Circle
                            stroke={ activeColors.primary}
                            ref={progressRef}
                            cx={center}
                            r={radius}
                            cy={center}
                            strokeWidth={strokeWidth}
                            strokeDasharray={ circumference }
                        />
                    </G>

                </Svg>
                <TouchableOpacity onPress={scrollTo} style={styles.button} activeOpacity={ 0.6 }>
                    <AntDesign name="arrowright" size={32} color={activeColors.black} />
                </TouchableOpacity>


        </View>

    );
}

