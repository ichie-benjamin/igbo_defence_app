import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import {Linking, Platform} from "react-native";


// import {useNavigation} from "@react-navigation/native";

export const useNotifications = () => {
    const registerForPushNotificationsAsync = async () => {
        let token;

        if (__DEV__) {
            // Don't create the notification token in development or on simulator
            console.log('Dont create the notification token in development');
            return;
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {

                await Linking.openSettings();

                // alert('Failed to get push token for push notification!');
                return;
            }



            token = (await Notifications.getExpoPushTokenAsync()).data;
            // console.log("tokem", token);
        } else {
            console.log('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });

            // await Notifications.setNotificationChannelAsync('bookings', {
            //     name: 'Booking notifications',
            //     // sound: 'horn.wav',
            // });
            await Notifications.setNotificationChannelAsync('bookings-repeat', {
                name: 'Booking long notifications',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                sound: 'repeat.wav',
            });
        }
        return token;
    };

    const handleNotificationResponse = (response) => {
        const data = { url } = response.notification.request.content.data;
        if(data?.url) {
            // Linking.openURL(data.url)
            // const navigation = useNavigation();
            // navigation.navigate('WashesScreen');
        }
    }

    return { registerForPushNotificationsAsync, handleNotificationResponse }
}
