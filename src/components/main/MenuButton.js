import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {images, theme} from "../../constants";
import {_roundDimensions} from "../../constants/util";


const MenuButton = () => {
    return (
        <View style={styles.backRound}>
            {/*<svg.GoBackSvg color={styles.backButton} />*/}
            <Image source={images.menuLight} style={styles.backButton}/>
        </View>
    )
}

export default MenuButton;

const styles = StyleSheet.create({
    backRound: {
        justifyContent: 'center',
        alignItems: 'center',
        height: _roundDimensions()._height * 0.042,
        width: _roundDimensions()._height * 0.040,
        borderRadius: _roundDimensions()._borderRadius,
        backgroundColor: theme.COLORS.lightGray,
        shadowColor: 'grey',
        shadowOffset: {width: 0, height: 0.2},
        shadowOpacity: 0.10,
        shadowRadius: 3,
        elevation: 2,
        padding: 10
    },
    backButton: {
        height: _roundDimensions()._height * 0.022,
        width: _roundDimensions()._height * 0.022,
    }

});
