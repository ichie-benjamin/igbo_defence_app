import React from 'react';
import {createNavigationContainerRef} from "@react-navigation/native";

export const navigationRefs = createNavigationContainerRef();

export function navigator(name, params) {
    console.log(navigationRefs.isReady())
    if (navigationRefs.isReady()) {
        navigationRefs.navigate(name, params);
    }
}

const RootNavigator = () => {

}

export default RootNavigator;
