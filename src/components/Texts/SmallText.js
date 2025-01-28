import { Text, StyleSheet } from "react-native";
import {COLORS } from "../../constants";
import {ThemeContext} from "../../contexts/themeContext";
import {useContext} from "react";


const SmallText = ({ customStyles, bold, primary, caption, ...props}) => {
    const { theme } = useContext(ThemeContext)
    let activeColors = COLORS[theme.mode]

    let color;

    switch (true) {
        case primary:
            color = activeColors.textPrimaryColor;
            break;
        case caption:
            color = activeColors.textCaptionColor;
            break;
        default:
            color = activeColors.textColor;
            break;
    }

    const styles = StyleSheet.create({
        text: {
            fontSize: 11,
            textAlign: "left",
            fontFamily: bold ? "RobotoBold" : "RobotoRegular",
            lineHeight: 20,
            color: color,
        },
    });

    return (
        <Text  {...props} style={[styles.text, customStyles]}>{props.children}</Text>
    )
}

export default SmallText;
