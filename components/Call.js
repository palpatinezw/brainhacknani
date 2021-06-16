import React from 'react'
import { View, Text } from "react-native";
import tailwind from 'tailwind-rn'

export default function Call({route}) {
    const { username, password } = route.params

    return (
        <View style={tailwind('px-4 py-4')}>
            <Text>{username}</Text>
        </View>
    );
}
