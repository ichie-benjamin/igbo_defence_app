import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {theme} from "../../constants";

function Alert(props) {
    return (
        <Text
            style={[styles.txt, {backgroundColor: props.type === 'error' ? theme.COLORS.red : theme.COLORS.success}]}>{props.message}</Text>
    )
}

export default Alert;

const styles = StyleSheet.create({
    txt: {
        textAlign: 'center',
        color: theme.COLORS.white,
        padding: 10
    }
});
