import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar'
import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Button,
  Pressable,
  FlatList,
  Switch
} from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import tailwind, { create } from 'tailwind-rn'
import styles from '../styles/styles'
import Protected from './Protected'
import { circle } from 'react-native/Libraries/Animated/src/Easing'
import Spinner from 'react-native-loading-spinner-overlay';

export default function ProtectedCreateCommunity ({ route, navigation }) {
	let { username, password } = route.params
	const [ name, setName ] = useState('Name of Community')
	const [ prv, setprv ] = useState(false)
	const [ info, setInfo ] = useState('Add some info here!')
	const [flaire, setFlaire] = useState('Add Flaire')
	const [ loading, setloading ] = useState(false)


	function flaire1(){
		console.log('here!!')
		fetch('http://flyyee-brainhackserver.herokuapp.com/create_flair?flairCreate=1&flairAccept=0&flairPower=11&username='+username+'&password='+password+'&circleName='+name+'&flairName='+flaire)
		.then(response => response.json())
		.then(data => {
			if (data.success == 1) {
				console.log("weird")
				setloading(false)
		
				navigation.goBack()

			} else {
				console.log("create Error")
				setloading(false)
			}
	})
}

	function create() {
		var prvstring = prv?'private':'public';
		setloading(true)
		fetch('http://flyyee-brainhackserver.herokuapp.com/create_circle?username='+username+'&password='+password+'&circleName='+name+'&circleVis='+prvstring+'&circleInfo='+info)
		.then(response => response.json())
		.then(data => {
			if (data.success == 1) {
				console.log(data)
				flaire1()
			

			} else {
				console.log("create Error")
				setloading(false)
			}
		})
	}

	return (
		<View style={tailwind('px-4 py-4')}>
			<TextInput style={tailwind('h-1/6 w-11/12 bg-blue-100 rounded-lg text-2xl px-2')} value={name} onChangeText={(newText) => setName(newText)} />
			
			<View style={tailwind('flex-row h-1/6 w-full justify-center')}>
				<View tailwind={tailwind('w-5/6 self-center')}><Text style={tailwind('text-xl')}>Private</Text></View>
				<View tailwind={tailwind('w-1/6 self-center')}>
					<Switch
						trackColor={{ false: "#767577", true: "#81b0ff" }}
						thumbColor={prv ? "#1d4ed8" : "#f4f3f4"}
						ios_backgroundColor="#3e3e3e"
						onValueChange={() => setprv(!prv)}
						value={prv}
					/>
				</View>
			</View>
			
			<TextInput style = {tailwind('text-xl mt-3 bg-blue-100 rounded-lg ')} value={flaire} onChangeText={(newText) => setFlaire(newText)} />
		
			
			<TextInput style = {tailwind('text-xl mt-3 bg-blue-100 rounded-lg h-2/6')} value={info} onChangeText={(newText) => setInfo(newText)} />
	
			<TouchableOpacity onPress={create}>
				<Text style={tailwind('text-xl')}>Create</Text>
			</TouchableOpacity>
			<Spinner visible={loading} textContent='Creating' textStyle={tailwind('text-white text-sm')}/>
		</View>
	)
}
