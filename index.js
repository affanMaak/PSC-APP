import { AppRegistry } from 'react-native';
import 'react-native-gesture-handler';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';

// Register background handler for FCM
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('📩 [Background] Message received:', remoteMessage);

    // Check for Single Device Session Force Logout
    if (remoteMessage.data?.action === 'FORCE_LOGOUT') {
        console.log('🚨 [Background] Force Logout requested');
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        try {
            await AsyncStorage.multiRemove([
                'access_token',
                'refresh_token',
                'user_info'
            ]);
            console.log('✅ [Background] Auth storage cleared');
        } catch (err) {
            console.error('❌ [Background] Failed to clear storage:', err);
        }
    }
});

AppRegistry.registerComponent(appName, () => App);
