import { setStatusBarBackgroundColor, StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'

import ProtectedHome from './components/ProtectedHome'

const Stack = createStackNavigator()

export default function App() {

  // const [username,setUsername] = useState()
  // const [password, setPassword] = useState()

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="home">
        <Stack.Screen name='home' component = {Home} options={{ title: 'Login/Register' }}/>
        <Stack.Screen name='login' component = {Login} options={{ title: 'Login' }}/>
        <Stack.Screen name='register' component = {Register} options={{ title: 'Register' }}/>

        <Stack.Screen name='ProtectedHome' component = {ProtectedHome} options={{ title: 'Sigma' }} headerLeft={()=> null}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// <Stack.Screen name='login'>
//     {() => <Login {...{setUsername, setPassword}} options={{ title: 'Login' }}/>}
// </Stack.Screen>
// <Stack.Screen name='register'>
//     {() => <Register {...{setUsername, setPassword}} options={{ title: 'Register' }}/>}
// </Stack.Screen>
