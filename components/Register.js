import { setStatusBarBackgroundColor, StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
    Text, View, Button, TouchableOpacity, KeyboardAvoidingView, TextInput, Keyboard,
} from "react-native";
import { CommonActions } from '@react-navigation/native'

import styles from '../styles/styles'

const Register = ({ navigation, setUsername, setPassword }) => {

  const [formUsername, setFormUsername] = useState();
  const [formPassword, setFormPassword] = useState();

  function handleRegister(){
    Keyboard.dismiss();
    fetch('https:/flyyee-brainhackserver.herokuapp.com/create?username='+formUsername+'&password='+formPassword)
    .then(response => response.json())
    .then(data => {
        if ((data.info === "created user") || (data.info === "user already exists")) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'ProtectedHome', params:{formUsername, formPassword}}],
              })
            );
        }
    })
  }

  return (
    <View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding': 'height'}>
        <TextInput
            style = {styles.input} placeholder = {'Username'} value = {null}
            onChangeText ={(text) => setFormUsername(text)}
        />
      </KeyboardAvoidingView>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding': 'height'}>
          <TextInput
            secureTextEntry={true} style={styles.input} placeholder={'Password'} value = {null}
            onChangeText ={(text) => setFormPassword(text)}
          />
      </KeyboardAvoidingView>
      <Button
        title="Create Account"
        onPress={() => handleRegister()}
      />
      <Button
        title="Login"
        onPress={() => navigation.push('login')}
      />
    </View>
  )
}

export default Register
