import { Text, StyleSheet} from "react-native";
import {COLORS } from "../../constants";
import {ThemeContext} from "../../contexts/themeContext";
import {useContext} from "react";


const RegularText = ({ customStyles, dark, bold, ...props}) => {
    const { theme } = useContext(ThemeContext)
    let activeColors = COLORS[theme.mode]

    const styles = StyleSheet.create({
        text: {
            fontSize: 14,
            textAlign: "left",
            fontFamily: bold ? "RobotoBold" : "RobotoRegular",
            lineHeight: 30,
            color: dark ? activeColors.textGray : activeColors.textColor,
        },
    });

    return (
        <Text {...props} style={[styles.text, customStyles]}>{props.children}</Text>
    )
}

export default RegularText;

