import { CommonActions } from '@react-navigation/native';

let navigator;

function setTopLevelNavigator(navigatorRef) {
    navigator = navigatorRef;
}

function navigate(routeName, params) {
    navigator.dispatch(
        CommonActions.navigate({
            name: routeName,
            params,
        })
    );
}

// add other navigation functions that you might need and export them too

export default {
    navigate,
    setTopLevelNavigator,
};
