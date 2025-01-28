
import {TouchableOpacity, Text, StyleSheet, Platform, ActivityIndicator, View} from "react-native";
import {COLORS, FONTS} from "../../constants";
import {ThemeContext} from "../../contexts/themeContext";
import {useContext} from "react";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import {LinearGradient} from "expo-linear-gradient";


const  RegularButton = ({buttonText, darkLoader, textCustomStyle, buttonContainerStyle, isLoading, isDisabled, onPress, ...props}) => {

    const { theme } = useContext(ThemeContext)
    let activeColors = COLORS[theme.mode]


        return (
            <TouchableOpacity style={[{
            }]}
                              onPress={!isDisabled && !isLoading ? onPress : null}
                              { ...props }>
                <View
                    style={[{
                        borderRadius: 10,
                        height : Platform.isPad === true ? wp("10%") : wp("16%"),
                        alignItems : "center",
                        backgroundColor : activeColors.primary,
                        width : "100%",
                        padding: 15,
                        justifyContent : "center",
                        ...buttonContainerStyle
                    }]}
                >
                    { !isLoading && <Text style={[{
                        textAlign : 'center',
                        color : COLORS.textColor,
                        ...FONTS.h3
                    }, textCustomStyle ]}>
                        { buttonText }
                    </Text> }
                    { isLoading && darkLoader && <ActivityIndicator size="large" color={ activeColors.bg } /> }
                    { isLoading && !darkLoader && <ActivityIndicator size="large" color={ activeColors.primary } /> }
                </View>

            </TouchableOpacity>
        )

        // return (
        //     <TouchableOpacity style={[{
        //         backgroundColor : isLoading ? activeColors.lightPrimary : activeColors.btnColor,
        //         borderRadius: 10,
        //         height : Platform.isPad === true ? wp("8%") : wp("14%"),
        //         alignItems : "center",
        //         width : "100%",
        //         padding: 15,
        //         justifyContent : "center",
        //         ...buttonContainerStyle
        //     }]} onPress={onPress}  { ...props }>
        //         { !isLoading && <Text style={{
        //             textAlign : 'center',
        //             color : COLORS.white,
        //             ...FONTS.h3
        //         }}>
        //             { buttonText }
        //         </Text> }
        //         { isLoading && <ActivityIndicator size="large" color={ activeColors.primary } /> }
        //     </TouchableOpacity>
        // )

}

export default RegularButton;

const styles = StyleSheet.create({
    button : {
        alignItems : "center",
        width : "100%",
        padding: 15,
        justifyContent : "center",
        // borderRadius : 50,
        // height : 80,
    }
});
