import {TouchableOpacity, View} from "react-native";

import React, {useContext, useEffect, useState} from "react";

import {components, CustomImage, LargeText, RegularButton, RegularText, SmallText} from "../components";
import {COLORS} from "../constants";

import {useDispatch, useSelector} from "react-redux";

import {ThemeContext} from "../contexts/themeContext";

import {AntDesign, MaterialIcons} from "@expo/vector-icons";
import {useUserActions} from "../hooks/useUserActions";

const About = ({ navigation }) => {

    const { doGetUser } = useUserActions();

    const [refreshing, setRefreshing] = useState(false);

    const current_user = useSelector(state => state.auth.current_user);

    const main_config  = useSelector(state => state.config.data);

    const { theme } = useContext(ThemeContext)
    let activeColors = COLORS[theme.mode]

    const links = [
        { 'name' : 'Terms & Condition', 'link'  : main_config.terms_url ?? 'https://google.com'},
        { 'name' : 'Privacy policy', 'link'  : main_config.privacy_url ?? 'https://google.com'},
        { 'name' : 'About '+main_config?.app_name , 'link'  : main_config.about_url ?? 'https://google.com'}
    ]

    useEffect(() => {
        doGetUser()
    }, []);


    const onRefresh = () => {
        setRefreshing(true);
        doGetUser().then(() => {
            setRefreshing(false)
        })
    };

    const renderHeader = () => {
        return (
            <components.Header
                title="About"
                goMenu={true}
            />
        );
    };



    const renderContent = () => {
        return (
            <View style={{
                flex: 1,
                justifyContent : "center",
                // alignItems : "center"
            }}>

                <View style={{
                    flexDirection : "column",
                    marginTop : "10%",

                    // flex : 1,
                }}>
                    <View style={{
                        width : 120,
                        height : 120,
                        alignSelf : "center",
                        alignItems : "center",
                        justifyContent : "center",
                        backgroundColor : activeColors.transparentBlack2,
                        borderRadius : 60
                    }}>
                        <MaterialIcons name="library-books" size={50} color="black" />
                    </View>

                    <View style={{
                        marginTop : 40,
                    }}>

                        {links?.map((item) =>
                            (
                                <TouchableOpacity key={item.name} onPress={() => {
                                    navigation.navigate("WebView", {
                                        url : item.link,
                                        title : item.name
                                    })
                                }}>
                                    <RegularText customStyles={{}} bold>{ item.name }</RegularText>
                                </TouchableOpacity>
                            ))
                        }

                    </View>
                </View>


            </View>
        );
    };

    return (
        <components.BaseContainer>
            {renderHeader()}


            <components.ContentContainer onRefresh={() => onRefresh() }
                                         refreshing={refreshing}>

                {renderContent()}




            </components.ContentContainer>

        </components.BaseContainer>
    );
};

export default About;

