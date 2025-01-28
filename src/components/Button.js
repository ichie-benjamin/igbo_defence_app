import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

import { theme } from "../constants";

const Button = ({
    title,
    onPress,
    containerStyle,
    btnStyle,
    titleStyle,
}) => {
    
    return (
        <View style={{ width: "100%", ...containerStyle }}>
            <TouchableOpacity
                style={{
                    width: "100%",
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: theme.COLORS.mainColor,
                    ...btnStyle,
                }}
                onPress={onPress}
            >
                <Text
                    style={{
                        color: theme.COLORS.white,
                        textTransform: "capitalize",
                        fontSize: 18,
                        ...theme.FONTS.Font_Semibold,
                        ...titleStyle,
                    }}
                >
                    {title}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default Button;
