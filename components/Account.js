// // import React, { useState, useEffect } from 'react';
// // import { StyleSheet, View, Alert, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
// // import { supabase } from '../lib/supabase'; 
// // import Avatar from './Avatar';

// // export default function Account({ navigation, session }) {
// //   const [loading, setLoading] = useState(true);
// //   const [username, setUsername] = useState('');
// //   const [website, setWebsite] = useState('');
// //   const [avatarUrl, setAvatarUrl] = useState('');

// //   useEffect(() => {
// //     if (session) {
// //       getProfile();
// //     }
// //   }, [session]);

// //   async function getProfile() {
// //     try {
// //       setLoading(true);
// //       if (!session?.user) throw new Error('No user on the session!');

// //       const { data, error, status } = await supabase
// //         .from('profiles')
// //         .select('username, website, avatar_url')
// //         .eq('id', session.user.id)
// //         .single();

// //       if (error && status !== 406) throw error;

// //       if (data) {
// //         setUsername(data.username || '');
// //         setWebsite(data.website || '');
// //         setAvatarUrl(data.avatar_url || '');
// //       }
// //     } catch (error) {
// //       setTimeout(() => Alert.alert('Error', error.message), 100);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   async function updateProfile() {
// //     try {
// //       setLoading(true);
// //       if (!session?.user) throw new Error('No user on the session!');

// //       const updates = {
// //         id: session.user.id,
// //         username,
// //         website,
// //         avatar_url: avatarUrl,
// //         updated_at: new Date(),
// //       };

// //       const { error } = await supabase.from('profiles').upsert(updates);
// //       if (error) throw error;

// //       setTimeout(() => Alert.alert('Success', 'Profile updated!'), 100);
// //     } catch (error) {
// //       setTimeout(() => Alert.alert('Error', error.message), 100);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   return (
// //     <ScrollView contentContainerStyle={styles.container}>
// //       <View style={styles.header}>
// //         <Text style={styles.title}>Your Profile</Text>
// //         <Text style={styles.subtitle}>Update your information below</Text>
// //       </View>

// //       <View style={styles.avatarContainer}>
// //         <Avatar
// //           size={150}
// //           url={avatarUrl}
// //           onUpload={(url) => {
// //             setAvatarUrl(url);
// //             updateProfile({ username, website, avatar_url: url });
// //           }}
// //           style={styles.avatar}
// //         />
// //       </View>

// //       <View style={styles.form}>
// //         <View style={styles.inputGroup}>
// //           <Text style={styles.label}>Email</Text>
// //           <TextInput
// //             value={session?.user?.email || ''}
// //             editable={false}
// //             style={[styles.input, { color: '#BBB' }]}
// //           />
// //         </View>

// //         <View style={styles.inputGroup}>
// //           <Text style={styles.label}>Username</Text>
// //           <TextInput
// //             value={username}
// //             onChangeText={setUsername}
// //             style={styles.input}
// //           />
// //         </View>

// //         <View style={styles.inputGroup}>
// //           <Text style={styles.label}>Website</Text>
// //           <TextInput
// //             value={website}
// //             onChangeText={setWebsite}
// //             style={styles.input}
// //           />
// //         </View>

// //         <TouchableOpacity
// //           onPress={async () => {
// //             await updateProfile();
// //             navigation.navigate('Home');
// //           }}
// //           disabled={loading}
// //           style={[styles.button, loading && styles.disabledButton]}
// //         >
// //           <Text style={styles.buttonText}>{loading ? 'Updating...' : 'Update & Go Home'}</Text>
// //         </TouchableOpacity>

// //         <TouchableOpacity
// //           onPress={() => supabase.auth.signOut()}
// //           style={styles.secondaryButton}
// //         >
// //           <Text style={styles.buttonText}>Sign Out</Text>
// //         </TouchableOpacity>
// //       </View>
// //     </ScrollView>
// //   );
// // }



// //ios test
// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, Alert, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
// import { supabase } from '../lib/supabase'; 
// import Avatar from './Avatar';

// export default function Account({ navigation, session }) {
//   const [loading, setLoading] = useState(true);
//   const [username, setUsername] = useState('');
//   const [website, setWebsite] = useState('');
//   const [avatarUrl, setAvatarUrl] = useState('');
//   const [profileComplete, setProfileComplete] = useState(false);

//   useEffect(() => {
//     if (session) {
//       checkProfileCompletion();
//     }
//   }, [session]);

//   async function checkProfileCompletion() {
//     try {
//       setLoading(true);
//       if (!session?.user) return;

//       const { data, error } = await supabase
//         .from('profiles')
//         .select('username, website, avatar_url')
//         .eq('id', session.user.id)
//         .single();

//       if (error) throw error;

//       if (data) {
//         const isComplete = data.username && data.avatar_url;
//         setProfileComplete(isComplete);
        
//         if (isComplete) {
//           navigation.replace('Home');
//           return;
//         }

//         setUsername(data.username || '');
//         setWebsite(data.website || '');
//         setAvatarUrl(data.avatar_url || '');
//       }
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function updateProfile() {
//     try {
//       setLoading(true);
//       if (!session?.user) throw new Error('No user on the session!');

//       const updates = {
//         id: session.user.id,
//         username,
//         website,
//         avatar_url: avatarUrl,
//         updated_at: new Date(),
//       };

//       const { error } = await supabase.from('profiles').upsert(updates);
//       if (error) throw error;

//       setProfileComplete(true);
//       navigation.replace('Home');
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (loading) {
//     return (
//       <View style={[styles.container, styles.loadingContainer]}>
//         <ActivityIndicator size="large" color="#FFF0DC" />
//       </View>
//     );
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Complete Your Profile</Text>
//         <Text style={styles.subtitle}>Set up your account to continue</Text>
//       </View>

//       <View style={styles.avatarContainer}>
//         <Avatar
//           size={150}
//           url={avatarUrl}
//           onUpload={(url) => setAvatarUrl(url)}
//           style={styles.avatar}
//         />
//       </View>

//       <View style={styles.form}>
//         <View style={styles.inputGroup}>
//           <Text style={styles.label}>Email</Text>
//           <TextInput
//             value={session?.user?.email || ''}
//             editable={false}
//             style={[styles.input, { color: '#BBB' }]}
//           />
//         </View>

//         <View style={styles.inputGroup}>
//           <Text style={styles.label}>Username *</Text>
//           <TextInput
//             value={username}
//             onChangeText={setUsername}
//             style={styles.input}
//             placeholder="Choose a username"
//             placeholderTextColor="#888"
//           />
//         </View>

//         <View style={styles.inputGroup}>
//           <Text style={styles.label}>Website</Text>
//           <TextInput
//             value={website}
//             onChangeText={setWebsite}
//             style={styles.input}
//             placeholder="Your website (optional)"
//             placeholderTextColor="#888"
//           />
//         </View>

//         <TouchableOpacity
//           onPress={updateProfile}
//           disabled={loading || !username}
//           style={[
//             styles.button, 
//             (loading || !username) && styles.disabledButton
//           ]}
//         >
//           <Text style={styles.buttonText}>
//             {loading ? 'Setting up...' : 'Complete Setup'}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: 'black',
//     padding: 20,
//     flexGrow: 1,
//   },
//   header: {
//     marginTop: 30,
//     marginBottom: 20,
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     color: '#FFF0DC',
//     marginBottom: 5,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#D2B48C',
//     opacity: 0.8,
//   },
//   avatarContainer: {
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   avatar: {
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//     backgroundColor: '#1E1E1E',
//   },
//   form: {
//     flex: 1,
//   },
//   inputGroup: {
//     marginBottom: 20,
//   },
//   label: {
//     color: '#FFF0DC',
//     fontSize: 16,
//     marginBottom: 8,
//     fontWeight: 'bold',
//   },
//   input: {
//     backgroundColor: '#1E1E1E',
//     borderColor: '#543A14',
//     borderWidth: 1,
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     fontSize: 16,
//     color: '#FFF0DC',
//   },
//   button: {
//     backgroundColor: '#543A14',
//     paddingVertical: 14,
//     borderRadius: 30,
//     alignItems: 'center',
//     marginTop: 10,
//     borderWidth : 1,
//     borderColor : '#FFF0DC',
//     elevation: 6,
//   },
//   disabledButton: {
//     opacity: 0.6,
//   },
//   secondaryButton: {
//     backgroundColor: '#1E1E1E',
//     paddingVertical: 14,
//     borderRadius: 30,
//     alignItems: 'center',
//     marginTop: 15,
//     borderWidth: 1,
//     borderColor: '#FFF0DC',
//   },
//   buttonText: {
//     color: '#FFF0DC',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });


// Account.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase'; 
import Avatar from './Avatar';

export default function Account({ navigation, session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    if (session) {
      checkProfileCompletion();
    }
  }, [session]);

  async function checkProfileCompletion() {
    try {
      setLoading(true);
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('username, website, avatar_url')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      if (data) {
        const isComplete = data.username && data.avatar_url;
        setProfileComplete(isComplete);
        
        if (isComplete) {
          navigation.replace('Home');
          return;
        }

        setUsername(data.username || '');
        setWebsite(data.website || '');
        setAvatarUrl(data.avatar_url || '');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const updates = {
        id: session.user.id,
        username,
        website,
        avatar_url: avatarUrl,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;

      setProfileComplete(true);
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FFF0DC" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>Set up your account to continue</Text>
      </View>

      <View style={styles.avatarContainer}>
        <Avatar
          size={150}
          url={avatarUrl}
          onUpload={(url) => setAvatarUrl(url)}
          style={styles.avatar}
        />
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={session?.user?.email || ''}
            editable={false}
            style={[styles.input, { color: '#BBB' }]}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username *</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            placeholder="Choose a username"
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Website</Text>
          <TextInput
            value={website}
            onChangeText={setWebsite}
            style={styles.input}
            placeholder="Your website (optional)"
            placeholderTextColor="#888"
          />
        </View>

        <TouchableOpacity
          onPress={updateProfile}
          disabled={loading || !username}
          style={[
            styles.button, 
            (loading || !username) && styles.disabledButton
          ]}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Setting up...' : 'Complete Setup'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    padding: 20,
    flexGrow: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: 30,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF0DC',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#D2B48C',
    opacity: 0.8,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#1E1E1E',
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#FFF0DC',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#1E1E1E',
    borderColor: '#543A14',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#FFF0DC',
  },
  button: {
    backgroundColor: '#543A14',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    borderWidth : 1,
    borderColor : '#FFF0DC',
    elevation: 6,
  },
  disabledButton: {
    opacity: 0.6,
  },
  secondaryButton: {
    backgroundColor: '#1E1E1E',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#FFF0DC',
  },
  buttonText: {
    color: '#FFF0DC',
    fontSize: 16,
    fontWeight: '600',
  },
});
