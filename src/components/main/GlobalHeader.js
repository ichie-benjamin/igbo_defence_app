import React from "react";
import {View, Dimensions,} from "react-native";
import {GlobalStyles} from "../../constants";


const {height, width} = Dimensions.get('window');

function GlobalHeader(props) {
    return (
        <View style={[GlobalStyles.tabBarView, props.customStyles]}>
            {
                props.children
            }

        </View>
    )
}

export default GlobalHeader;



