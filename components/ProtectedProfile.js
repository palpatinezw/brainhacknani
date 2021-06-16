import React from 'react'
import { View, Text, TouchableOpacity, KeyboardAvoidingView, TextInput, Keyboard, Pressable } from "react-native";
import {Circle} from 'react-native-shape'
import tailwind from 'tailwind-rn'
import styles from '../styles/styles'
import Ionicons from 'react-native-vector-icons/Ionicons'

const ProtectedProfile = ({ route, navigation }) => {
    const { username, password } = route.params

   
    return (
        <View style={tailwind('flex-col px-4 py-4')}>
            
            <View style = {tailwind('flex flex-row items-center justify-center')}>
               <Ionicons name='person-circle' size={70} color='black'/>
                <View style={tailwind('flex flex-column')}>
                    <TextInput style = {tailwind('text-gray-800 text-xl font-medium border-radius')} placeholder = {"Enter your name"} value = {null}></TextInput>
                    <Text style = {tailwind('text-center text-gray-800 text-xl')}>{username}</Text>
                </View>
                
            </View>
            
            <TouchableOpacity onPress = {() => {
                Keyboard.dismiss()
            }}>
                <Text style = {tailwind('text-xl mt-3 font-bold border-4 border-black border-opacity-100')}>Save Profile</Text>
            </TouchableOpacity>
            
            <View style = {tailwind('flex items-left justify-left mt-12')}>
                
                <Text style = {tailwind('text-xl pb-2')} > About me </Text>
                
                <KeyboardAvoidingView behaviour = {Platform.OS === 'ios' ? 'padding': 'height'}>
                    <TextInput style = {tailwind('border-2 rounded-lg p-3') /* add some styling here */} placeholder = {'A short bio of less than 150 words'} value = {null} multiline = {true} >
                    </TextInput> 
                </KeyboardAvoidingView>
                
            </View>
            <View style = {tailwind('flex-row mt-10 items-center')}>
                <Text style = {tailwind('pr-28 text-xl')}> Instagram </Text>
                <KeyboardAvoidingView behaviour = {Platform.OS === 'ios' ? 'padding': 'height'}>
                    <TextInput style = {tailwind('border-2 rounded-lg p-3') /*add some styling here */} placeholder = {'Insert social links here'} value = {null} multiline = {true}> 
                    </TextInput>
                </KeyboardAvoidingView>
            </View>
            <View style = {tailwind('flex-row mt-10 items-center')}>
                <Text style = {tailwind('pr-28 text-xl')}> Facebook </Text>
                <KeyboardAvoidingView behaviour = {Platform.OS === 'ios' ? 'padding': 'height'}>
                    <TextInput style = {tailwind('border-2 rounded-lg p-3') /*add some styling here */} placeholder = {'Insert social links here'} value = {null} multiline = {true}> 
                    </TextInput>
                </KeyboardAvoidingView>
            </View>
            
        </View>
    );
}

export default ProtectedProfile