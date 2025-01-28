import {
    View,
    Text,
    ScrollView,
    Image,
    ImageBackground,
    StatusBar,
    TouchableOpacity,
    Alert, ActivityIndicator, StyleSheet, Dimensions,
} from "react-native";
import React, { useState } from "react";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";




import { images, theme} from "../constants";
import { components } from "../components";


import WebView from "react-native-webview";




const ForgotPassWebView = ({ navigation }) => {
    const route = useRoute();

    const url = "https://bookings.ebeanomarket.com/forgot-password?app"

    const current_user = useSelector(state => state.auth.CURRENT_USER);



    const [visible, setVisible ] = useState(false);

    const ActivityIndicatorElement = () => {
        return(
            <View style={styles.activityIndicatorStyle}>
                <ActivityIndicator color="grey" size="large" />
            </View>
        )
    }

    const renderStatusBar = () => {
        return <StatusBar translucent={false} backgroundColor={theme.COLORS.white}
                          barStyle="dark-content"/>;
    };

    const renderHeader = () => {
        return <components.Header title="Forgot Password" goBack={true} />;
    };



    return (
        <View style={{flex: 1, backgroundColor: theme.COLORS.white}} >
            {renderStatusBar()}
            {renderHeader()}
            <WebView
                source={{ uri: url }}
                onLoadStart={() => setVisible(true)}
                onLoad={() => setVisible(false)}
                startInLoadingState={true}
                onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn('WebView error: ', nativeEvent);
                }}
                onHttpError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn(
                        'WebView received error status code: ',
                        nativeEvent.statusCode,
                    );
                }}
                onRenderProcessGone={syntheticEvent => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn(
                        'WebView Crashed: ',
                        nativeEvent.didCrash,
                    );
                }}
                renderLoading={ActivityIndicatorElement}
                style = {{marginTop: 0, width: Dimensions.get('window').width, height: Dimensions.get('window').height}}
            />

            { visible ? <ActivityIndicatorElement /> : null}
        </View>
    );
};




const styles = StyleSheet.create({
    container : {
        flex : 1
    },
    activityIndicatorStyle : {
        flex : 1,
        position : 'absolute',
        margin : 'auto',
        left : 0,
        right : 0,
        top : 0,
        bottom : 0,
        justifyContent : 'center'
    }
})

export default ForgotPassWebView;
