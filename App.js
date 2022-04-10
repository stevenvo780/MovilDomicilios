import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View } from 'react-native';
import { AuthScreen } from './src/screens';
import { OrdersScreen } from './src/orders';
import * as Location from 'expo-location';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "@env"

const Stack = createStackNavigator();
export default function App() {
  useEffect(() => {
    const interval = setInterval(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          console.log('Location: ', location);
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        let user = await AsyncStorage.getItem('user');
        user = JSON.parse(user);
        let payload = {
          position: JSON.stringify(location),
          user: user.id,
        };
        fetch(`${API_URL}/positionUser`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
        })
          .then((response) => response.json())
          .then(response => {
            try {
              console.log(response);
            } catch (err) {
              console.error(err);
            };
          })
          .catch(err => {
            console.error("Error login" + err);
          });
      })();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  /*
  useEffect(() => {
    // If the geolocation is not defined in the used browser you can handle it as an error
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser');
      return;
    }
  }, []);
  */
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={AuthScreen}
        />
        <Stack.Screen
          name="Orders"
          component={OrdersScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
