import React from 'react'
import { View, Text } from "react-native";
import tailwind from 'tailwind-rn'

const ProtectedProfile = ({ route, navigation }) => {
    const { username, password } = route.params

    return (
        <View style={tailwind('px-4 py-4')}>
            <Text>Profile</Text>
        </View>
    );
}

export default ProtectedProfile
