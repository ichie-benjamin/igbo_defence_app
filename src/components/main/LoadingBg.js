import React, {useContext} from 'react';
import {View, StyleSheet} from 'react-native';

import {ThemeContext} from "../../contexts/themeContext";
import {COLORS} from "../../constants";

function LoadingBg() {
    const { theme } = useContext(ThemeContext)
    let activeColors = COLORS[theme.mode]

    const styles = StyleSheet.create({
        container : {
            flex : 1
        },
        activityIndicatorStyle : {
            flex : 1,
            position : 'absolute',
            margin : 'auto',
            left : 0,
            right : 0,
            top : 0,
            bottom : 0,
            backgroundColor : activeColors.bgTransparentPrimary,
            justifyContent : 'center'
        }
    })

    return (
        <View style={styles.activityIndicatorStyle}>
        </View>
    )
}

export default LoadingBg;

