import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Preload from "../screens/Preload";
import Login from '../screens/Login';
import HomeDrawer from './HomeDrawer';

const Stack = createStackNavigator();

export default function MainStack() {
    return(
        <Stack.Navigator initialRouteName="Preload" screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#fff' }
        }}>
            <Stack.Screen name="Preload" component={Preload} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Home" component={HomeDrawer} />
        </Stack.Navigator>
    )
}