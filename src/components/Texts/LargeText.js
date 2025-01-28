import { Text, StyleSheet} from "react-native";
import {COLORS } from "../../constants";
import {ThemeContext} from "../../contexts/themeContext";
import {useContext} from "react";


const LargeText = ({customStyles, primary, bold, ...props}) => {
    const { theme } = useContext(ThemeContext)
    let activeColors = COLORS[theme.mode]

    const styles = StyleSheet.create({
        text : {
            fontSize : 24,
            lineHeight: 30,
            fontFamily: bold ? "RobotoBold" : "RobotoRegular",
            textAlign : 'left',
        }
    });

    return (
        <Text style={[styles.text, { color : primary ? activeColors.textPrimaryColor : activeColors.textColor },  customStyles]}>
            { props?.children }
        </Text>
    )
}

export default LargeText;


