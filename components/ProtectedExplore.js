import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';
import React, {useState, useEffect} from 'react'
import { View, Text, TextInput, TouchableOpacity, Keyboard, Button, Pressable,FlatList } from "react-native";
import { createStackNavigator } from "@react-navigation/stack"
import { NavigationContainer } from '@react-navigation/native';
import tailwind from 'tailwind-rn';
import styles from '../styles/styles'
import { Ionicons } from "@expo/vector-icons";



const ProtectedExplore = ({ route, navigation }) => {
    const { username, password } = route.params;
    const [search, setSearch]=useState();
    const [textvalue, settextvalue]=useState("Reccomended");
    const [results, setresults]=useState();
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
    //       <Ionicons
    //           name="ios-create-outline"
    //           size={30}
    //           color="black"
    //           style={{
    //           color: "#f55",
    //              marginRight: 10,
    //            }}
    //          />
    //        </TouchableOpacity>
    //  ),



    //   });
    // });



    function search2(){
      

    fetch(`http://flyyee-brainhackserver.herokuapp.com/search_circles?username=`+username+`&password=`+password+`&searchstring=`+search)
   .then(response => response.json())
    .then(data => {
        console.log(search);
        
        console.log (data);
        
        if (data.success === 1) {
         

          console.log(data.results);
          
          setresults(data.results); 
            // navigation.dispatch(CommonActions.reset({
            //     index: 0,
            //     routes: [{ name: 'ProtectedHome', params:{searchstring}}],
            // }))
        } else {
            console.log(false)
        }
    })
  }

  function renderCircles( {item} ) {
    return (
        <View style={tailwind('h-15 rounded-lg px-2 flex-row border-2')}>
           <TouchableOpacity onPress={ () => navigation.navigate("Description",
        { })
        }>
           <Text>{item}</Text>
           </TouchableOpacity>
        </View>
    )
}
function separator() {
    return (<View style={{height:5}}></View>)
}

    return (
        <View style={tailwind('px-4 py-4')}>
            <Text>Explore</Text>
            <TextInput style={styles.input} placeholder={'Search'} value = {null}
        onChangeText ={(text) => setSearch(text)} onFocus={search1}/>
        <Text>{textvalue}</Text>
        <Text>{reccommended}</Text>
        <Button onPress={search2} title="enter" />
        <FlatList data={results} renderItem={renderCircles} ItemSeparatorComponent={separator} keyExtractor={(item, index) => index.toString()}/>
        </View>
            );


        function search1(){

            settextvalue("Search Results")
            setreccommended("")
            }



        }





    function ProtectedJoinCommunity( ) {
        return (
          <View>
          <Text>  </Text>

          </View>
        )
      }



const Stack = createStackNavigator()

export default function ProtectedExploreStack({route}){
  let {username, password} = route.params
  return (
    <Stack.Navigator>
    <Stack.Screen name="Explore" component={ProtectedExplore} initialParams={{username, password}} />
    <Stack.Screen name="Description" component={ProtectedJoinCommunity} initialParams={{username, password}} />
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
