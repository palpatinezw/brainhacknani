import { setStatusBarBackgroundColor, StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
    Text, View, Button, TouchableOpacity, KeyboardAvoidingView, TextInput, Keyboard,
} from "react-native";
import { CommonActions } from '@react-navigation/native'

import styles from '../styles/styles'

const Login = ({ navigation }) => {

  const [password, setPassword] = useState();
  const [username, setAccount] = useState();

  function handleLogin(){

    Keyboard.dismiss()
    fetch('https:/flyyee-brainhackserver.herokuapp.com/login?username='+username+'&password='+password)
    .then(response => response.json())
    .then(data => {
        if (data.success === 1) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'ProtectedHome', params:{username, password}}],
              })
            );
        } else {
            console.log(false)
        }
    })
  }

  return (
    <View>
      <KeyboardAvoidingView behavior = {Platform.OS === 'ios' ? 'padding': 'height'}>
        <TextInput style = {styles.input} placeholder = {'Enter your username'} value = {null}
        onChangeText ={(text) => setAccount(text)}
        />
      </KeyboardAvoidingView>

      <KeyboardAvoidingView
        behavior = {Platform.OS === 'ios' ? 'padding': 'height'}
       >
      <TextInput secureTextEntry={true} style={styles.input} placeholder={'Enter your password'} value = {null}
      onChangeText ={(text) => setPassword(text)}
      />
      <Button
        title="Login"
        onPress={() => handleLogin()}
      />

      </KeyboardAvoidingView>
    </View>
  )
}

export default Login
