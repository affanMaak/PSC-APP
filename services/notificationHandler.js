/**
 * Notification Handler Service
 * 
 * Handles FCM push notifications and navigates to appropriate screens
 * based on the notification payload.
 * 
 * Supports three notification states:
 * - Foreground: App is open and in focus
 * - Background: App is minimized but running
 * - Quit/Closed: App was completely closed
 */

import messaging from '@react-native-firebase/messaging';

/**
 * Extract navigation parameters from FCM notification data
 * @param {Object} remoteMessage - FCM message object
 * @returns {{ screen: string, params: Object } | null}
 */
export const extractNavigationFromNotification = (remoteMessage) => {
    const data = remoteMessage?.data;

    if (!data) {
        console.log('📭 [NotificationHandler] No data payload in notification');
        return null;
    }

    console.log('📬 [NotificationHandler] Processing notification data:', JSON.stringify(data, null, 2));

    // Handle booking notifications
    if (data.type === 'booking' && data.id) {
        console.log('📍 [NotificationHandler] Navigating to BookingDetailsScreen with id:', data.id);
        return {
            screen: 'BookingDetailsScreen',
            params: { bookingId: data.id },
        };
    }

    // Handle event notifications
    if (data.type === 'event' && data.id) {
        console.log('📍 [NotificationHandler] Navigating to EventDetails with id:', data.id);
        return {
            screen: 'EventDetails',
            params: { eventId: data.id },
        };
    }

    // Fallback: check for screen and screenParams in data
    if (data.screen) {
        console.log('📍 [NotificationHandler] Navigating to custom screen:', data.screen);
        return {
            screen: data.screen,
            params: data.screenParams ? JSON.parse(data.screenParams) : {},
        };
    }

    console.log('⚠️ [NotificationHandler] Unknown notification type, no navigation');
    return null;
};

/**
 * Handle notification tap and navigate to appropriate screen
 * @param {Object} remoteMessage - FCM message object
 * @param {Object} navigationRef - React Navigation ref
 */
export const handleNotificationNavigation = (remoteMessage, navigationRef) => {
    const navData = extractNavigationFromNotification(remoteMessage);

    if (navData && navigationRef?.isReady()) {
        console.log('🚀 [NotificationHandler] Navigating to:', navData.screen, navData.params);
        navigationRef.navigate(navData.screen, navData.params);
    } else if (navData) {
        console.log('⏳ [NotificationHandler] Navigation not ready, queuing navigation');
        // Queue navigation for when NavigationContainer is ready
        // This is handled by the onReady callback in App.js
    }
};

/**
 * Setup background notification handler
 * Call this OUTSIDE of any component (e.g., in index.js)
 */
export const setupBackgroundHandler = () => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('📩 [NotificationHandler] Background message received:', remoteMessage);
        // Background messages are handled when the user taps the notification
        // The actual navigation happens in onNotificationOpenedApp
    });
};

/**
 * Check for initial notification (app opened from quit state)
 * @param {Object} navigationRef - React Navigation ref
 */
export const checkInitialNotification = async (navigationRef) => {
    try {
        const initialNotification = await messaging().getInitialNotification();

        if (initialNotification) {
            console.log('🚀 [NotificationHandler] App opened from QUIT state via notification');
            handleNotificationNavigation(initialNotification, navigationRef);
        }
    } catch (error) {
        console.error('❌ [NotificationHandler] Error checking initial notification:', error);
    }
};

/**
 * Subscribe to background notification opened events
 * @param {Object} navigationRef - React Navigation ref
 * @returns {Function} Unsubscribe function
 */
export const subscribeToNotificationOpened = (navigationRef) => {
    return messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('🔔 [NotificationHandler] App opened from BACKGROUND state via notification');
        handleNotificationNavigation(remoteMessage, navigationRef);
    });
};

export default {
    extractNavigationFromNotification,
    handleNotificationNavigation,
    setupBackgroundHandler,
    checkInitialNotification,
    subscribeToNotificationOpened,
};
