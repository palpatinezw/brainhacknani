import React from 'react'
import { View, Text, TouchableOpacity, KeyboardAvoidingView, TextInput, Keyboard } from "react-native";
import tailwind from 'tailwind-rn'

const ProtectedProfile = ({ route, navigation }) => {
    const { username, password } = route.params

    return (
        <View style={tailwind('px-4 py-4')}>
            <KeyboardAvoidingView behaviour = {Platform.OS === 'ios' ? 'padding': 'height'}>
                <TextInput style = {tailwind('text-gray-800 text-xl font-medium mt-4 text-right border-radius')} placeholder = {"Enter your name"} value = {null}>
                </TextInput>
            </KeyboardAvoidingView>
            <Text style = {tailwind('text-right text-gray-800 text-xl pt-4')}>{username}</Text>
            <View style = {null/*need to add styling here */}>
                <KeyboardAvoidingView behaviour = {Platform.OS === 'ios' ? 'padding': 'height'}>
                    <TextInput style = {tailwind('') /* add some styling here */} placeholder = {'A short bio of less than 150 words'} value = {null}>
                    </TextInput> 
                </KeyboardAvoidingView>
            </View>
            <View style = {null /* add some styling here again */}>
                <KeyboardAvoidingView behaviour = {Platform.OS === 'ios' ? 'padding': 'height'}>
                    <TextInput style = {tailwind('') /*add some styling here */} placeholder = {'Insert social links here'} value = {null}> 
                    </TextInput>
                </KeyboardAvoidingView>
            </View>
        </View>
    );
}

export default ProtectedProfile
