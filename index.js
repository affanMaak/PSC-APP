import { AppRegistry } from 'react-native';
import 'react-native-gesture-handler';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';

// Register background handler for FCM
// This runs when app is in background or quit state and receives a notification
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('📩 [Background] Message received:', remoteMessage);
    console.log('📩 [Background] Data payload:', remoteMessage.data);
    // Navigation happens via onNotificationOpenedApp when user taps the notification
});

AppRegistry.registerComponent(appName, () => App);
