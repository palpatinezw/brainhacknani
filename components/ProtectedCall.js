import React from 'react'
import { View, Text } from "react-native";
import tailwind from 'tailwind-rn'

const ProtectedCall = ({ route, navigation }) => {
  const { username, password } = route.params

  return (
    <View style={tailwind('px-4 py-4')}>
        <Text>Home</Text>
    </View>
  );
}

export default ProtectedCall
