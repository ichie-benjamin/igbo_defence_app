import {
    View,
    Text,
    ScrollView,
    ImageBackground,
    TouchableOpacity,
    StatusBar,
} from "react-native";
import React, { useState } from "react";

import { SIZES, COLORS, FONTS } from "../constants";
// import { svg } from "../svg";

const ratio = SIZES.width / 375; //375 is actual image width

const ForgotPasswordSentEmail = ({
    navigation,
}) => {
    const [innerScreenSize, setInnerScreenSize] = useState(0);
    console.log("innerScreenSize -->", innerScreenSize);

    const [innerViewSize, setInnerViewSize] = useState(0);
    console.log("innerViewSize -->", innerViewSize);

    const renderStatusbar = () => {
        return <StatusBar barStyle="dark-content" />;
    };

    const renderContent = () => {
        return (
            <ScrollView
                style={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    justifyContent: "flex-end",
                    flex: 1,
                }}
                onLayout={event => {
                    const { height } = event.nativeEvent.layout;
                    setInnerScreenSize(height);
                }}
                scrollEnabled={
                    innerViewSize > innerScreenSize
                        ? true
                        : false
                }
            >
                <View
                    onLayout={event => {
                        const { height } =
                            event.nativeEvent.layout;
                        setInnerViewSize(height);
                    }}
                >
                    <ImageBackground
                        source={{
                            uri: "https://dl.dropbox.com/s/nk9eoyxyrh9ymno/bg%20object.png?dl=0",
                        }}
                        style={{
                            width: SIZES.width,
                            height: 679 * ratio, //425 is actual height of image
                            justifyContent: "flex-end",
                            paddingBottom: 77,
                            paddingHorizontal: 20,
                        }}
                    >
                        <View style={{ marginBottom: 60 }}>
                            {/*<svg.KeySvg />*/}
                        </View>

                        <Text
                            style={{
                                ...FONTS.H2,
                                color: COLORS.darkBlue,
                                marginBottom: 20,
                            }}
                        >
                            Your password{"\n"}has been reset!
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Text
                                style={{
                                    width: "70%",
                                    ...FONTS.bodyText,
                                    color: COLORS
                                        .textColor,
                                }}
                            >
                               You can now login to your account
                                Thank you for being part of Ebeano Riders
                            </Text>
                            <TouchableOpacity
                                style={{
                                    height: 50,
                                    backgroundColor:
                                        COLORS.mainColor,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    paddingHorizontal: 24,
                                }}
                                onPress={() =>
                                    navigation.navigate("SignIn")
                                }
                            >
                                <Text
                                    style={{
                                        ...FONTS
                                            .Catamaran_SemiBold,
                                        fontSize: 18,
                                        color: COLORS
                                            .white,
                                        textTransform:
                                            "capitalize",
                                    }}
                                >
                                    Login
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </View>
            </ScrollView>
        );
    };

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: COLORS.white,
            }}
        >
            {renderStatusbar()}
            {renderContent()}
        </View>
    );
};

export default ForgotPasswordSentEmail;
