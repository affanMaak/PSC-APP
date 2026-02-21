import { Platform, PermissionsAndroid, Alert } from 'react-native';

const PermissionService = {
    /**
     * Standardized permission request for photo library/gallery access.
     * Uses only React Native built-ins.
     */
    requestPhotoLibraryPermission: async () => {
        if (Platform.OS === 'ios') {
            // iOS permissions are handled via Info.plist keys and handled by CameraRoll internally.
            // Returning true tells the UI it's safe to proceed with the capture logic.
            return true;
        }

        if (Platform.OS === 'android') {
            try {
                const apiLevel = Platform.Version;

                if (apiLevel >= 33) {
                    /**
                     * For Android 13+ (API 33), we need READ_MEDIA_IMAGES.
                     * Note: PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES might not be defined in older RN versions,
                     * so we use the string literal to be safe.
                     */
                    const READ_MEDIA_IMAGES = 'android.permission.READ_MEDIA_IMAGES';

                    const hasPermission = await PermissionsAndroid.check(READ_MEDIA_IMAGES);
                    if (hasPermission) return true;

                    const result = await PermissionsAndroid.request(READ_MEDIA_IMAGES, {
                        title: 'Gallery Permission',
                        message: 'PSC App needs access to your gallery to save vouchers.',
                        buttonPositive: 'OK',
                    });
                    return result === PermissionsAndroid.RESULTS.GRANTED;
                } else {
                    /**
                     * For Android 12 and below, we need WRITE_EXTERNAL_STORAGE.
                     */
                    const hasPermission = await PermissionsAndroid.check(
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                    );
                    if (hasPermission) return true;

                    const result = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                        {
                            title: 'Storage Permission',
                            message: 'PSC App needs access to your gallery to save vouchers.',
                            buttonPositive: 'OK',
                        }
                    );
                    return result === PermissionsAndroid.RESULTS.GRANTED;
                }
            } catch (err) {
                console.warn('Permission Error:', err);
                return false;
            }
        }

        return true;
    },

    handlePermissionDenied: () => {
        Alert.alert(
            'Permission Denied',
            'To save vouchers to your gallery, please enable permissions in your device settings.',
            [{ text: 'OK' }]
        );
    }
};

export const permissionService = PermissionService;
export default PermissionService;
