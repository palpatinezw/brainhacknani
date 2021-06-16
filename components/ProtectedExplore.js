import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';
import React, {useState, useEffect} from 'react'
import { View, Text, TextInput, TouchableOpacity, Keyboard, Button, Pressable,FlatList } from "react-native";
import { createStackNavigator } from "@react-navigation/stack"
import { NavigationContainer } from '@react-navigation/native';
import tailwind from 'tailwind-rn';
import styles from '../styles/styles'
import { AntDesign } from '@expo/vector-icons';

import ProtectedCreateCommunity from './ProtectedCreateCommunity';
import ProtectedJoinCommunity from './ProtectedJoinCommunity';



const ProtectedExplore = ({ route, navigation }) => {
    const { username, password } = route.params;
    const [search, setSearch]=useState();
    const [textvalue, settextvalue]=useState("Recommendations");
    const [results, setresults]=useState();
    const [ShowRecommended,setShowRecommended]= useState()
    const [ShowRecommended1,setShowRecommended1]= useState()
    const [ShowRecommended2,setShowRecommended2]= useState()
    const [ShowSearch,setShowSearch]=useState()
    
    

  
    // useEffect(() => {
    //   navigation.setOptions({
    //     headerRight: () => (
    //       <TouchableOpacity onPress={addCommunity}>
    //         <AntDesign 
    //         name="plus" 
    //         size={24} 
    //         color="black"
    //         style={{
    //           color: "#f55",
    //           marginRight: 10,
    //         }} />
    //       </TouchableOpacity>
    //     ),
    //   });
    // });

    function addCommunity() {
      navigation.navigate("Create");
    }

    useEffect(() => {

      if (search == null || search == ""){
        settextvalue("Recommendations:")
        setShowRecommended(true)
        setShowRecommended1(true)
        setShowRecommended2(true)
        setShowSearch(false)
      }
      else{
        settextvalue("Search Results")
        setShowRecommended(false)
        setShowRecommended1(false)
        setShowRecommended2(false)
        setShowSearch(true)
      }
     });
    

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
      <TouchableOpacity onPress={ () => navigation.navigate("Join",
        {  username: username,
           password: password,
          circleName: item})
        }>
           <Text style = {tailwind('text-lg mt-1 border-4 border-opacity-100')} >{item}</Text>
           </TouchableOpacity> 
        </View>
    )
}


function separator() {
    return (
     <View style={{height:8}}></View>
    
    )
}

    return (
        <View style={tailwind('px-4 py-4')}>
          <View style={{flexDirection:'row'}}>
            <TextInput style={styles.input} placeholder={'Search'} value = {null}
        onChangeText ={(text) => {
            setSearch(text)
            search2()
        }}/>
       
       <TouchableOpacity onPress={search2}
          ><AntDesign name="search1" size={24} color="black"style={{
            marginRight: 10,
            marginTop: 10,
            marginLeft:10

          }} />
          </TouchableOpacity>

        <TouchableOpacity onPress={addCommunity}>
            <AntDesign 
            name="plus" 
            size={24} 
            color="black"
            style={{
              color: "#f55",
              marginRight: 10,
              marginTop: 10
            }} />
          </TouchableOpacity>
          </View>

         
          <Text style = {tailwind('text-2xl mt-3 font-bold border-4 border-black border-opacity-100')}>{textvalue}</Text>
     
          
          {ShowRecommended ? <TouchableOpacity onPress={ () => navigation.navigate("Join",
      { 
      username: username,
       password: password,
       circleName: "Video Games"
     }) 
      } >
        <Text style = {tailwind('text-lg mt-3 bg-pink-100 border-4 rounded-lg border-black border-opacity-100')} >Video Games</Text>
  </TouchableOpacity>  : <Text></Text>}

  {ShowRecommended1 ? <TouchableOpacity onPress={ () => navigation.navigate("Join",
      { 
      username: username,
       password: password,
       circleName: "Movies"
     }) 
      } >
        <Text style = {tailwind('text-lg mt-3 bg-pink-100 border-4 rounded-lg border-black border-opacity-100')} >Shows</Text>
  </TouchableOpacity>  : <Text></Text>}

  {ShowRecommended2 ? <TouchableOpacity onPress={ () => navigation.navigate("Join",
      { 
      username: username,
       password: password,
       circleName: "Shows"
     }) 
      } >
        <Text style = {tailwind('text-lg mt-3 bg-pink-100 border-4 rounded-lg border-black border-opacity-100')} >Movies</Text>
  </TouchableOpacity>  : <Text></Text>}
  
        
       {ShowSearch ? <FlatList data={results} renderItem={renderCircles} ItemSeparatorComponent={separator} keyExtractor={(item, index) => index.toString()}/> : <Text></Text>}
        </View>
            );
      }



const Stack = createStackNavigator()

export default function ProtectedExploreStack({route}){
  let {username, password} = route.params
  return (
    <Stack.Navigator>
    <Stack.Screen name="Explore" component={ProtectedExplore} initialParams={{username, password}} />
    <Stack.Screen name="Join" component={ProtectedJoinCommunity} initialParams={{username, password}} />
    <Stack.Screen name="Create" component={ProtectedCreateCommunity} initialParams={{username, password}} />
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