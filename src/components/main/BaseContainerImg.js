import React, {useContext} from 'react';
import {View, SafeAreaView, StatusBar, ImageBackground} from 'react-native';
import { images, COLORS} from "../../constants";
import Constants from "expo-constants";
import {ThemeContext} from "../../contexts/themeContext";

function BaseContainerImg(props, customStyles) {
    const { theme } = useContext(ThemeContext)
    let activeColors = COLORS[theme.mode]

    return (
        <>
            <StatusBar  backgroundColor={activeColors.bgPrimary}
                        translucent={true}
                       barStyle="dark-content"/>
            <ImageBackground source={images.bg} style={{
                width : '100%',
                height : '100%',
                flex : 1,
                top : Constants.statusBarHeight,
            }}>
                <SafeAreaView style={{flex: 1}}>
                    <View style={[{
                        flex: 1,
                    }, customStyles]}>
                        {
                            props.children
                        }
                    </View>
                </SafeAreaView>
            </ImageBackground>

        </>
    )
}

export default BaseContainerImg;
