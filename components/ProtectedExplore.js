import React from 'react'
import { View, Text } from "react-native";
import tailwind from 'tailwind-rn'

const ProtectedExplore = ({ route, navigation }) => {
    const { username, password } = route.params

    return (
        <View style={tailwind('px-4 py-4')}>
            <Text>Explore</Text>
        </View>
    );
}

export default ProtectedExplore
