import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {theme} from "../constants";
import {FontAwesome5} from "@expo/vector-icons";

function SearchBar(props) {

    return (
        <TouchableOpacity style={styles.searchView} onPress={() => props.navigation.navigate('Search', {
            type : props.type
        })}>
            <View style={styles.searchContainer}>
                <FontAwesome5 name="search" style={styles.searchIcon} />
                <View style={styles.verticalLine}></View>
                <Text style={styles.textInputSearchStyle}>Where are you going to </Text>
            </View>

        </TouchableOpacity>
    )
}

export default SearchBar;

const styles = StyleSheet.create({
    searchView: {
        height: hp('9%'),
        backgroundColor: theme.COLORS.white,
        marginTop : 5,
    },
    searchContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop : 10,
        borderRadius: 8,
        backgroundColor: theme.COLORS.light_white,
        height: hp('6%'),

    },
    searchIcon: {
        flex: 0.10,
        color: theme.COLORS.secondary_text_color,
        fontSize: wp('3.5%'),
        alignSelf: 'center',
        textAlign: 'center'
    },
    verticalLine: {
        width: 0.07,
        height: hp('2.5%'),
        backgroundColor: theme.COLORS.secondary_text_color,
    },
    textInputSearchStyle: {
        flex: 0.90,
        ...theme.FONTS.Josefin_Sans_Regular,
        backgroundColor: theme.COLORS.light_white,
        fontSize: wp('3.2%'),
        color: theme.COLORS.secondary_text_color,

    },
});
