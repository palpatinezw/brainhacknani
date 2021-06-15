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
import { AsyncStorage } from 'react-native';


function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button onPress={() => navigation.navigate("register")} title="register" />
      <Button onPress={() => navigation.navigate("login")} title="login" />
    </View>
         );
 }


 function login(){


  const [password, setPassword] = useState();
  const [username, setAccount] = useState(); 

  function handlelogin(){

    Keyboard.dismiss();
    const userCredential = [username, password];
    fetch("https:/flyyee-brainhackserver.herokuapp.com/create?username=${username}&password=${password}")
    .then(response => response.json())
    .then(data => {
      if (data.success === 1)
      {
        console.log('login successful');
      }



    })

    


  
  }


  
  
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
        <TouchableOpacity onPress = {() => handlelogin()}>
          <View style = {styles.addWrapper}>
            <Text style = {styles.addText}>Login</Text>
          </View>
        </TouchableOpacity>
      
      </KeyboardAvoidingView>
    </View>
  )
}

function register(){


  const [password, setPassword] = useState();
  const [username, setAccount] = useState(); 

  function handleregister(){

    // Keyboard.dismiss();
    // const userCredential = [username, password];
    // fetch("https:/flyyee-brainhackserver.herokuapp.com/create?username=${username}&password=${password}")
    // .then(response => response.json())
    // .then(data => console.log(data.success))

  }

  
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
        <TextInput style = {styles.input} placeholder = {'Confirm your username'} value = {null} 
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
       
       <Text>Password should be longer than 10 letters and should contain special characters</Text>
      
      </KeyboardAvoidingView>
      <TouchableOpacity onPress = {() => handleAddPassword()}>
          <View style = {styles.addWrapper}>
            <Text style = {styles.addText}> Create Account </Text>
          </View>
        </TouchableOpacity>
    </View>
  )
}



 //add password here 

const Stack = createStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name = 'homescreen' component = {HomeScreen}/>
      <Stack.Screen name = 'login' component = {login}/>
        <Stack.Screen name = 'register' component = {register}/>
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