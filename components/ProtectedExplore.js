import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';
import React, {useState, useEffect} from 'react'
import { View, Text, TextInput, TouchableOpacity, Keyboard, Button } from "react-native";
import { createStackNavigator } from "@react-navigation/stack"
import { NavigationContainer } from '@react-navigation/native';
import tailwind from 'tailwind-rn';
import styles from '../styles/styles'
import { Ionicons } from "@expo/vector-icons";



const ProtectedExplore = ({ route, navigation }) => {
    const { username, password } = route.params;
    const [search, setSearch]=useState();
    const [textvalue, settextvalue]=useState("Reccomended");
    const [reccommended,setreccommended]=useState(
        <TouchableOpacity onPress={ () => navigation.navigate("Description",
        { })
        }>

        <Text>Video Games</Text>
          </TouchableOpacity>

    )
    // useEffect(() => {
    //   navigation.setOptions({
    //     headerRight: () => (
    //       <TouchableOpacity onPress={addNote}>
    //         <Ionicons
    //           name="ios-create-outline"
    //           size={30}
    //           color="black"
    //           style={{
    //             color: "#f55",
    //             marginRight: 10,
    //           }}
    //         />
    //       </TouchableOpacity>
    //     ),



    //   });
    // });

    function search2(){
    fetch('https:/flyyee-brainhackserver.herokuapp.com/login?circle='+search)
    .then(response => response.json())
    .then(data => {
        console.log(search);

        if (data.success === 1) {
            navigation.dispatch(CommonActions.reset({
                index: 0,
                routes: [{ name: 'ProtectedHome', params:{circle}}],
            }))
        } else {
            console.log(false)
        }
    })
  }

    return (
        <View style={tailwind('px-4 py-4')}>
            <Text>Explore</Text>
            <TextInput style={styles.input} placeholder={'Search'} value = {null}
        onChangeText ={(text) => setSearch(text)} onFocus={search1}/>
        <Text>{textvalue}</Text>
        <Text>{reccommended}</Text>
        <Button onPress={search2()} title="enter" />
        </View>
            );


        function search1(){

            settextvalue("Search Results")
            setreccommended("")
            console.log(setSearch);
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

export default function ProtectedExploreStack({route}){
  let {username, password} = route.params
  return (
    <Stack.Navigator>
    <Stack.Screen name="Explore" component={ProtectedExplore} initialParams={{username, password}} />
    <Stack.Screen name="Description" component={Description} initialParams={{username, password}} />
    </Stack.Navigator>
  )
}

// export default function ProtectedExploreStack({route}){
//     return (

//         <Stack.Navigator>
//           <Stack.Screen name="Explore" component={ProtectedExplore} initialParams={{username, password}} />
//           <Stack.Screen name="Description" component={Description} initialParams={{username, password}} />

//         </Stack.Navigator>

//       )
// }
