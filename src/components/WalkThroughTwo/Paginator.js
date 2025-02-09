import React, {useContext} from 'react';
import {
    View,
    Text,
    StyleSheet, Animated, useWindowDimensions
} from 'react-native';
import {COLORS} from "../../constants";

import {ThemeContext} from "../../contexts/themeContext";

export  const Paginator = ({ data, scrollX }) => {

    const { width } = useWindowDimensions()


    const { theme } = useContext(ThemeContext)
    let activeColors = COLORS[theme.mode]


    const styles = StyleSheet.create({
        container : {
            flex : 1,
            justifyContent : 'center',
            alignItems : 'center',
        },

        dot  : {
            height : 10,
            borderRadius : 5,
            backgroundColor : activeColors.primary,
            marginHorizontal : 8
        }

    })

    return (
        <View
            style={{ flexDirection : 'row', height : 34}}
        >

            { data.map((_, i) => {

                const inputRange = [(i - 1) * width, i * width, (i + 1 ) * width ];


                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange : [10, 20, 10],
                    extrapolate : 'clamp',
                })

                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange : [0.3, 1, 0.3],
                    extrapolate : 'clamp',
                })


                return <Animated.View style={[styles.dot, { width : dotWidth, opacity}]} key={i.toString()} />;
            })}

        </View>
    )
}



