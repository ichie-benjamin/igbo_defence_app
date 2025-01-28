
import 'expo-dev-client';
import { useFonts } from 'expo-font';


import FlashMessage from "react-native-flash-message";
import { Provider } from "react-redux";
import { ThemeContext } from "./src/contexts/themeContext";

import store from './src/store/store'

import StackNavigator from "./src/navigation/StackNavigator";

import * as SplashScreen from "expo-splash-screen";

import * as Notifications from "expo-notifications";
import {Appearance} from "react-native";
import {useEffect, useState} from "react";
import {getData, storeData} from "./src/config";
import {VideoPlayerProvider} from "./src/contexts/VideoPlayerContext";

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});


const App = () => {
    const [loaded] = useFonts({
        JosefinSansBold : require("./src/fonts/JosefinSans-Bold.ttf"),
        JosefinSansRegular : require("./src/fonts/JosefinSans-Regular.ttf"),
        CatamaranSemiBold : require("./src/fonts/Catamaran-SemiBold.ttf"),
        CatamaranRegular : require("./src/fonts/Catamaran-Regular.ttf"),
        CatamaranMedium : require("./src/fonts/Catamaran-Medium.ttf"),
        CatamaranBold : require("./src/fonts/Catamaran-Bold.ttf"),
        RobotoRegular : require("./src/fonts/Roboto-Regular.ttf"),
        RobotoMedium : require("./src/fonts/Roboto-Medium.ttf"),
        RobotoBold : require("./src/fonts/Roboto-Bold.ttf"),
    });

    const [theme, setTheme] = useState({mode : "light"})


    const updateTheme = (newTheme) => {
        let mode;
        if (!newTheme) {
            mode = theme.mode === "dark" ? "light" : "dark"
            newTheme = {mode, system: false}
        } else {
            if (newTheme.system) {
                const systemColorScheme = Appearance.getColorScheme();
                mode = systemColorScheme === "dark" ? "dark" : "light"
                newTheme = {...newTheme, mode}
            } else {
                newTheme = {...newTheme, system: false}
            }
        }
        setTheme(newTheme);
        storeData("igbo_defence_theme", newTheme)
    }


    const fetchStoredTheme = async () => {
        try {
            const themeData = await getData("igbo_defence_theme")
            if(themeData){
                await updateTheme(themeData);
            }
        }catch (e) {
            console.log(e)
        }finally {
            await SplashScreen.hideAsync()
        }
    }

    useEffect(() => {
        fetchStoredTheme()
    }, []);

    if(theme.system){
        Appearance.addChangeListener(({colorScheme}) => {
            updateTheme({system : true, mode : colorScheme})
        })
    }



    if(!loaded) return null;


    return (
            // <SafeAreaProvider>
            //     <NativeBaseProvider config={config}>
        <VideoPlayerProvider>
                    <ThemeContext.Provider value={{ theme, updateTheme }}>
                <Provider store={store}>
                    <StackNavigator />
                </Provider>

                    <FlashMessage position="bottom" statusBarHeight={20} />

                    </ThemeContext.Provider>
        </VideoPlayerProvider>
                // </NativeBaseProvider>



            // </SafeAreaProvider>


  );
}

export default App;


