import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";

// import { svg } from "../svg";
import { theme } from "../constants";

const Checkbox = () => {
    const [checked, setChecked] = useState(false);
    return (
        <TouchableOpacity
            style={{
                width: 22,
                height: 22,
                borderWidth: 1,
                marginRight: 14,
                borderRadius: 4,
                borderColor: "#CED6E1",
                justifyContent: "center",
                alignItems: "center",
            }}
            onPress={() => setChecked(!checked)}
        >
            {/*{checked && <svg.CategoryCheck />}*/}
        </TouchableOpacity>
    );
};

export default Checkbox;
