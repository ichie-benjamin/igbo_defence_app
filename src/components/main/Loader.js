import React, {useContext} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {COLORS, theme} from "../../constants";

import {ThemeContext} from "../../contexts/themeContext";

function Loader() {

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
            // backgroundColor : activeColors.bgTransparentPrimary,
            justifyContent : 'center'
        }
    })

    return (
        <View style={styles.activityIndicatorStyle}>
            <ActivityIndicator color={activeColors.primary} size="large" />
        </View>
        // <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        //     <ActivityIndicator size="large" color={theme.COLORS.themeColor}/>
        // </View>
    )
}

export default Loader;


