import React, {useState} from 'react';
import {View, SafeAreaView, ScrollView, RefreshControl} from 'react-native';
import {useDispatch} from "react-redux";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import {useUserActions} from "../../hooks/useUserActions";

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}


function ContentContainer(props) {

    const dispatch = useDispatch();

    const { doGetUser } = useUserActions()



    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        doGetUser().then(() => {
            setRefreshing(false)
        })
    }, []);

    const [refreshing, setRefreshing] = useState(false);


    return (

        <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={10}
            bounces={false}
            scrollEnabled={true}
            refreshControl={
                <RefreshControl
                    refreshing={props.refreshing ? props.refreshing : refreshing}
                    onRefresh={props.onRefresh ? props.onRefresh : onRefresh}
                />
            }
            nestedScrollEnabled={true}
            style={[{
                marginHorizontal: wp("4%"),
            }, props.customStyles]}>
            {
                props.children
            }
        </ScrollView>

    )
}

export default ContentContainer;

