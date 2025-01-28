import React, {useContext} from 'react';
import {
    View,
    Text,
    StyleSheet,
    useWindowDimensions, Image, TouchableOpacity
} from 'react-native';
import {COLORS, FONTS} from "../../constants";
import {LargeText, RegularText} from "../index";

import {ThemeContext} from "../../contexts/themeContext";

export  const OnboardingItem = ({ item, navigation }) => {
    const { width } =  useWindowDimensions();


    const { theme } = useContext(ThemeContext)
    let activeColors = COLORS[theme.mode]

    const styles = StyleSheet.create({
        container : {
            flex : 1,
            justifyContent : 'center',
            alignItems : 'center',
            marginTop : 30,
            // paddingVertical : "20%"
        },
        image : {
            flex : 0.7,
            width : 250,
            justifyContent : "center",
        },
        title : {
            marginBottom : 10,
            color : activeColors.primary,
            textAlign : "center",
        },
        description : {
            // color : "#004C6C",
            textAlign : "center",
            paddingHorizontal : 64,
            marginTop : 10
        }
    })

    return (
        <View
            style={[styles.container, { width }]}
        >

            <Image
                style={[styles.image, { resizeMode : 'contain' }]}
                source={item.image}
            />

            <View style={{ flex : 0.5, alignItems : "center" }}>
                <LargeText bold style={styles.title}>{ item.title }</LargeText>
                <RegularText customStyles={styles.description}>{ item.sub_title }</RegularText>
            </View>

            <View style={{
                position : "absolute",
                top : 60,
                right : 30,

            }}>
                <TouchableOpacity onPress={() => navigation.replace('Tabs')}>
                    <RegularText bold customStyles={{
                        color : activeColors.primary,
                    }}>Skip</RegularText>
                </TouchableOpacity>
            </View>

        </View>
    )
}


