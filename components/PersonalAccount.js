//ios test
// import React from 'react';
// import { StyleSheet } from 'react-native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// // Import your screen components
// import Friends from '../PersonalScreens/Friends';
// import Group from '../PersonalScreens/Group';
// import Add from '../PersonalScreens/Add';
// import History from '../PersonalScreens/History';
// import Acct from './Acct';

// const Tab = createBottomTabNavigator();

// export default function App() {
//   return (
//     <Tab.Navigator
//       initialRouteName="Add"
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarIcon: ({ color, size }) => {
//           let iconName;

//           switch (route.name) {
//             case 'Friends':
//               iconName = 'user-friends';
//               break;
//             case 'Group':
//               iconName = 'users';
//               break;
//             case 'Add':
//               iconName = 'plus-circle';
//               break;
//             case 'History':
//               iconName = 'history';
//               break;
//             case 'Account':
//               iconName = 'user-circle';
//               break;
//             default:
//               iconName = 'question';
//           }

//           return <FontAwesome5 name={iconName} size={size} color={color} solid />;
//         },
//         tabBarActiveTintColor: '#007bff',
//         tabBarInactiveTintColor: 'gray',
//         tabBarStyle: {
//           backgroundColor: 'black', // ✅ Set black background
//           borderTopColor: 'transparent',
//           height: 60,
//           paddingBottom: 5,
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//         },
//       })}
//     >
//       <Tab.Screen name="Friends" component={Friends} />
//       <Tab.Screen name="Group" component={Group} />
//       <Tab.Screen name="Add" component={Add} />
//       <Tab.Screen name="History" component={History} />
//       <Tab.Screen name="Account" component={Acct} />
//     </Tab.Navigator>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'black',
//   },
// });


import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { FontAwesome } from './IconWrapper';

// Screens
import Friends from '../PersonalScreens/Friends';
import Group from '../PersonalScreens/Group';
import Add from '../PersonalScreens/Add';
import History from '../PersonalScreens/History';
import Acct from './Acct';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Tab.Navigator
      initialRouteName="Add"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Friends':
              iconName = 'user-friends';
              break;
            case 'Group':
              iconName = 'users';
              break;
            case 'Add':
              iconName = 'plus-circle';
              break;
            case 'History':
              iconName = 'history';
              break;
            case 'Account':
              iconName = 'user-circle';
              break;
            default:
              iconName = 'question';
          }

          return (
            // <FontAwesome5
            //   name={iconName}
            //   size={size ?? 24}
            //   color={color ?? '#fff'}
            //   solid={focused}
            // />

          <FontAwesome 
          name={iconName} 
          size={size} 
          color={color} 
          solid={focused}/>
          );
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'black',
          borderTopColor: 'transparent',
          height: 60,
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen name="Friends" component={Friends} />
      <Tab.Screen name="Group" component={Group} />
      <Tab.Screen name="Add" component={Add} />
      <Tab.Screen name="History" component={History} />
      <Tab.Screen name="Account" component={Acct} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
