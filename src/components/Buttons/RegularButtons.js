import { LinearGradient } from 'expo-linear-gradient';
import {TouchableOpacity, Text, StyleSheet, View} from "react-native";
import {COLORS, FONTS} from "../../constants";
import {ThemeContext} from "../../contexts/themeContext";
import {useContext} from "react";
import RegularText from "../Texts/RegularText";


const
    CustomButton = ({buttonText, buttonContainerStyle, colors = [], onPress, ...props}) => {

    const { theme } = useContext(ThemeContext)
    let activeColors = COLORS[theme.mode]


    if(colors.length > 0){
        return (
            <TouchableOpacity onPress={onPress}>
                <LinearGradient colors={colors}
                                start={{x:0, y: 0}}
                                end={{x:1, y: 0}}
                                style={{
                                    ...buttonContainerStyle
                                }}
                >
                    <Text style={{
                        textAlign : 'center',
                        color : COLORS.white,
                        ...FONTS.h3
                    }}>
                        { buttonText }
                    </Text>
                </LinearGradient>

            </TouchableOpacity>
        )
    }else {
        return (
            <TouchableOpacity style={[{
                backgroundColor : activeColors.secondary,
                ...buttonContainerStyle
            }, styles.button]} onPress={onPress}  { ...props }>
                <Text style={{
                    textAlign : 'center',
                    color : COLORS.white,
                    ...FONTS.h3
                }}>
                    { buttonText }
                </Text>
            </TouchableOpacity>
        )
    }
}

export default CustomButton;

const styles = StyleSheet.create({
    button : {
        alignItems : "center",
        width : "100%",
        padding: 15,
        justifyContent : "center",
        borderRadius : 10,
        height : 60,
    }
});
