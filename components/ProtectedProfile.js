import React from 'react'
import { View, Text, TouchableOpacity, KeyboardAvoidingView, TextInput, Keyboard } from "react-native";
import {Circle} from 'react-native-shape'
import tailwind from 'tailwind-rn'
import styles from '../styles/styles'

const ProtectedProfile = ({ route, navigation }) => {
    const { username, password } = route.params

    return (
        <View style={tailwind('flex px-4 py-4')}>
            <Circle color = 'grey' scale = {1.5} style = {styles.profilepic}/>
            <KeyboardAvoidingView behaviour = {Platform.OS === 'ios' ? 'padding': 'height'}>
                <TextInput style = {tailwind('text-gray-800 text-xl font-medium text-right border-radius')} placeholder = {"Enter your name"} value = {null}>
                </TextInput>
            </KeyboardAvoidingView>
            <Text style = {tailwind('text-right text-gray-800 text-xl pt-4')}>{username}</Text>
            <View style = {tailwind('flex items-center justify-center mt-24')}>
                <KeyboardAvoidingView behaviour = {Platform.OS === 'ios' ? 'padding': 'height'}>
                    <TextInput style = {tailwind('border-2 rounded-lg p-3') /* add some styling here */} placeholder = {'A short bio of less than 150 words'} value = {null} multiline = {true}>
                    </TextInput> 
                </KeyboardAvoidingView>
            </View>
            <View style = {tailwind('flex justify-center items-center mt-10')}>
                <KeyboardAvoidingView behaviour = {Platform.OS === 'ios' ? 'padding': 'height'}>
                    <TextInput style = {tailwind('border-2 rounded-lg p-3') /*add some styling here */} placeholder = {'Insert social links here'} value = {null} multiline = {true}> 
                    </TextInput>
                </KeyboardAvoidingView>
            </View>
        </View>
    );
}

export default ProtectedProfile