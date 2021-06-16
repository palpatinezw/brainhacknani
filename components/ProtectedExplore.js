import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';
import React, {useState, useEffect} from 'react'
import { View, Text, TextInput, TouchableOpacity, Keyboard } from "react-native";
import { createStackNavigator } from "@react-navigation/stack"
import { NavigationContainer } from '@react-navigation/native';
import tailwind from 'tailwind-rn';
import styles from '../styles/styles'
import Protected from './Protected';



const ProtectedExplore = ({ route, navigation }) => {
    const { username, password } = route.params;
    const [search, setSearch]=useState();
    const [textvalue, settextvalue]=useState("Reccomended");
    const [reccommended,setreccommended]=useState(
        <TouchableOpacity onPress={ 
            () => navigation.navigate("Description")}>
    
        <Text>Video Games</Text>
          </TouchableOpacity>

    )

    return (
        <View style={tailwind('px-4 py-4')}>
            <Text>Explore</Text>
            <TextInput secureTextEntry={true} style={styles.input} placeholder={'Search'} value = {null}
        onChangeText ={(text) => setSearch(text)} onFocus={search1}/>
        <Text>{textvalue}</Text>
        <Text>{reccommended}</Text>
        </View>
            );
        
    
        function search1(){
    
            settextvalue("Search History")
            setreccommended("")
            }
            
         
    
    
        }
        function Description( ) {
            return (
              <View>
              <Text>" " </Text>
    
              </View>
            )
          }

          const Stack = createStackNavigator()

export default function ProtectedExploreStack() {
  return (

    <Stack.Navigator>
      <Stack.Screen name="Home" component={ProtectedExplore} initialParams={{username, password}} />
      <Stack.Screen name="Details" component={Description} initialParams={{username, password}} />
    </Stack.Navigator>
  )
}