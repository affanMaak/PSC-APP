import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { StyleSheet, View, Alert, Image, Button } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

export default function Avatar({ url, size = 150, onUpload }) {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const avatarSize = { height: size, width: size };

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);

      if (error) {
        throw error;
      }

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        setAvatarUrl(fr.result);
      };
    } catch (error) {
      console.error('Error downloading image: ', error.message);
    }
  }

  async function uploadAvatar() {
    try {
      setUploading(true);
  
      const result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: true,
        maxWidth: 800,
        maxHeight: 800,
        quality: 1,
      });
  
      if (result.didCancel) {
        console.log('User cancelled image picker.');
        return;
      }
  
      if (!result.assets || result.assets.length === 0) {
        throw new Error('No image selected!');
      }
  
      const image = result.assets[0];
  
      if (!image.uri) {
        throw new Error('No image URI!');
      }
  
      // Extract file extension from URI
      const fileExt = image.uri.split('.').pop()?.toLowerCase() || 'jpeg';
      const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      
      if (!validExtensions.includes(fileExt)) {
        throw new Error('Invalid image format!');
      }
  
      // Create unique filename
      const timestamp = Date.now();
      const fileName = `${timestamp}.${fileExt}`;
      
      // Prepare form data
      const formData = new FormData();
      formData.append('file', {
        uri: image.uri,
        name: fileName,
        type: image.type || `image/${fileExt}`,
      });
  
      // Upload to Supabase
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, formData, {
          contentType: image.type || `image/${fileExt}`,
        });
  
      if (uploadError) {
        throw uploadError;
      }
  
      onUpload(uploadData.path);
    } catch (error) {
      Alert.alert('Upload Error', error.message);
      console.error('Upload error details:', error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <View>
      {avatarUrl ? (
        <Image 
          source={{ uri: avatarUrl }} 
          accessibilityLabel="Avatar" 
          style={[avatarSize, styles.avatar, styles.image]} 
        />
      ) : (
        <View style={[avatarSize, styles.avatar, styles.noImage]} />
      )}
      <View style={styles.buttonContainer}>
        <Button 
          title={uploading ? 'Uploading...' : 'Upload Picture'} 
          onPress={uploadAvatar} 
          disabled={uploading}
          color="#543A14"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 100,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 10,
    borderColor : '#FFF0DC',
    borderWidth : 1
  },
  image: {
    resizeMode: 'cover',
  },
  noImage: {
    backgroundColor: '#e1e4e8',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#a0a4a8',
  },
  // buttonContainer: {
  //   marginTop: 10,
  //   width: 200,
  //   alignSelf: 'center',
  //   borderColor : '#FFF0DC',
  //   borderWidth : 1 , 
  //   borderRadius : 28
  // },
buttonContainer: {
  backgroundColor: '#543A14',
  borderRadius: 50,
  paddingVertical: 6,        // slimmer vertically
  paddingHorizontal: 40,     // wider horizontally
  borderColor: '#FFF0DC',
  borderWidth: 1,
  alignSelf: 'center',
  marginTop : 10
},


});
