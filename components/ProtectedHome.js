import { setStatusBarBackgroundColor, StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
    Text, View, Button, TouchableOpacity, KeyboardAvoidingView, TextInput, Keyboard,
} from "react-native";
import { CommonActions } from '@react-navigation/native';

const ProtectedHome = ({ route, navigation }) => {
    const { username, password } = route.params
    return (
        <View>
           <Text>Username: {username}</Text>
           <Text>Password: {password}</Text>
        </View>
    )
}

export default ProtectedHome
