import React, {useContext} from 'react';
import {View, SafeAreaView, StatusBar} from 'react-native';
import { GlobalStyles, COLORS} from "../../constants";
import Constants from "expo-constants";

import {ThemeContext} from "../../contexts/themeContext";
import {logFunction} from "../../helpers/FunctionHelper";

function BaseContainer(props) {
    const { theme } = useContext(ThemeContext)
    let activeColors = COLORS[theme.mode]

    return (
        <>
            <StatusBar
                backgroundColor="transparent"
                // backgroundColor={ activeColors.bgPrimary }
                translucent={true}
                barStyle="dark-content"
            />
            <SafeAreaView style={{flex: 1, backgroundColor: activeColors.bgPrimary,
            paddingTop : Constants.statusBarHeight
            }}>
                <View style={[GlobalStyles.mainView, props.customStyles]}>
                    {
                        props.children
                    }
                </View>
            </SafeAreaView>
        </>
    )
}

export default BaseContainer;
