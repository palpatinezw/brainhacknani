import { setStatusBarBackgroundColor, StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  Keyboard,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";




function login1(){


  const [password, setPassword] = useState();
  const [username, setAccount] = useState(); 

  function handleAddPassword(){

    Keyboard.dismiss();
    const userCredential = [username, password];
    fetch("https:/flyyee-brainhackserver.herokuapp.com/create?username=${username}&password=${password}")
    .then(response => response.json())
    .then(data => console.log(data.success))


  
  }
        
      //end here

        



 //add password here 
  
  return (
    <View>
      <KeyboardAvoidingView
      behavior = {Platform.OS === 'ios' ? 'padding': 'height'} 
      style = {styles.createAccountWrapper}
      >
        <TextInput style = {styles.input} placeholder = {'Enter your username'} value = {null} 
        onChangeText ={(text) => setAccount(text)} 
        />
      
      </KeyboardAvoidingView>
      
      <KeyboardAvoidingView
       behavior = {Platform.OS === 'ios' ? 'padding': 'height'} 
       style = {styles.createAccountWrapper}
       >
      <TextInput style = {styles.input} placeholder = {'Enter your password'} value = {null} 
      onChangeText ={(text) => setPassword(text)} 
      />
        <TouchableOpacity onPress = {() => handleAddPassword()}>
          <View style = {styles.addWrapper}>
            <Text style = {styles.addText}>Add Password</Text>
          </View>
        </TouchableOpacity>
      
      </KeyboardAvoidingView>
    </View>
  )
}

const Stack = createStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name = 'login1' component = {login1}/>
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
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth:1,
    width: 250,
    paddingLeft: 50,
  },
  addText:{
    paddingBottom: 50,
  },
  addWrapper:{
    justifyContent: 'center'
  }
});