import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import { StyleSheet } from 'react-native';

// npm install @react-navigation/native
// npx expo install react-native-screens react-native-safe-area-context
import { NavigationContainer } from "@react-navigation/native";
// npm install @react-navigation/native-stack
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// npm install @react-navigation/bottom-tabs
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

// * Screens
import ScanScreen from "./components/screens/ObjScreen";
import CollectionScreen from "./components/screens/CollectionScreen";
import PersonalScreen from "./components/screens/PersonalScreen"

// *  Screen Names
const NfcName = "Scan";
const CollectionName = "Collection";
const ProfileName = "Profile";

// ! icon names scan-circle, library, persons

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={NfcName}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === NfcName) {
              iconName = focused ? "scan-circle" : "scan-circle-outline";
            } else if (rn === CollectionName) {
              iconName = focused ? "library" : "library-outline";
            } else if (rn === ProfileName) {
              iconName = focused ? "person" : "person-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },

          tabBarActiveTintColor: "#3f51b5",
          tabBarInactiveTintColor: "grey",
          labelStyle: { paddingBottom: 10, fontSize: 10 },
          tabBarStyle: { paddingBottom: 10, paddingTop: 10, height: 65 },
        })}
      >
        <Tab.Screen
          name={ProfileName}
          component={PersonalScreen}
          options={{
            headerTransparent: true,
            headerTitleAlign: "center",
            headerShown: false,
          }}
        />
        <Tab.Screen
          name={NfcName}
          component={ScanScreen}
          options={{
            headerTransparent: true,
            headerTitleAlign: "center",
            headerTintColor: "#3f51b5",
          }}
        />
        <Tab.Screen
          name={CollectionName}
          component={CollectionScreen}
          options={{
            headerTransparent: true,
            headerTitleAlign: "center",
            headerTintColor: "#3f51b5",
          }}
        />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    height: 100,
    borderRadius: 50,
    aspectRatio: 1,
    backgroundColor: "black",
    opacity: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  butText: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    alignItems: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
});