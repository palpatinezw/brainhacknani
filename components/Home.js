import React from 'react'
import {
    View, Button, Pressable, Text
} from "react-native";
import tailwind from 'tailwind-rn'

const Home = ({ navigation }) => {
  return (
    <View style={tailwind('flex justify-center items-center h-full')}>
        <Pressable style={tailwind('px-8 py-2 bg-blue-500 rounded')} onPress={() => navigation.navigate("login")}>
            <Text style={tailwind('text-lg text-center text-white')}>Login</Text>
        </Pressable>
        <Pressable style={tailwind('px-8 py-2 mt-4 bg-blue-500 rounded')} onPress={() => navigation.navigate("register")}>
            <Text style={tailwind('text-lg text-center text-white')}>Register</Text>
        </Pressable>
    </View>
  );
 }

export default Home

// style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}
