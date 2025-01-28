import {TouchableOpacity, View} from "react-native";
import React, {useContext, useEffect, useState} from "react";

import {components, CustomImage, LargeText, RegularButton, RegularText, SmallText} from "../components";
import {COLORS} from "../constants";

import {useDispatch, useSelector} from "react-redux";

import {ThemeContext} from "../contexts/themeContext";

import {AntDesign} from "@expo/vector-icons";
import {useUserActions} from "../hooks/useUserActions";

const Pending = ({ navigation }) => {

    const { doGetUser } = useUserActions();

    const [loading, setLoading] = useState(false)

    const [refreshing, setRefreshing] = useState(false);

    const current_user = useSelector(state => state.auth.current_user);



    const { theme } = useContext(ThemeContext)
    let activeColors = COLORS[theme.mode]

    useEffect(() => {
        doGetUser()
    }, []);




    useEffect(() => {
        if(current_user?.status === "approved"){
            navigation.navigate("Tabs")
        }
    }, [current_user]);


    const onRefresh = () => {
        setRefreshing(true);
        doGetUser().then(() => {
            setRefreshing(false)
        })
    };


    const submitDocument = async () => {
        navigation.navigate("Documents")
    }


    const renderContent = () => {
        return (
            <View style={{
                flex: 1,
                justifyContent : "center",
                alignItems : "center"
            }}>

                {/* Registration Form Start from here */}


                <View style={{
                    flexDirection : "column",
                    marginTop : "50%",

                    // flex : 1,
                }}>
                    <View style={{
                        width : 120,
                        height : 120,
                        alignSelf : "center",
                        alignItems : "center",
                        justifyContent : "center",
                        backgroundColor : current_user.status === 'blocked' ? activeColors.danger : activeColors.lightDanger,
                        borderRadius : 60
                    }}>
                        <AntDesign name="clockcircleo" size={24} color={ activeColors.white} />
                    </View>

                    <View style={{
                        alignSelf : "center",
                        marginTop : 20,
                    }}>
                        <LargeText customStyles={{
                            textAlign : "center"
                        }} bold>{ current_user.status_text }</LargeText>
                        <SmallText customStyles={{
                            textAlign : "center",
                            marginTop : 20,
                        }}>{ current_user.comment }</SmallText>
                    </View>
                </View>


            </View>
        );
    };

    return (
        <components.BaseContainerImg>

            <components.ContentContainer onRefresh={() => onRefresh() }
                                         refreshing={refreshing}>

                {renderContent()}




            </components.ContentContainer>

            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    paddingHorizontal : 50,
                    paddingBottom: 10,
                }}>
                <RegularButton onPress={() => submitDocument()} isLoading={loading}
                               buttonContainerStyle={{
                                   marginBottom: 50, marginTop : 30,  borderRadius : 30
                               }}
                               buttonText="Update document"
                />
            </View>

            {loading && <components.Loader/>}

        </components.BaseContainerImg>
    );
};

export default Pending;

