import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, FlatList, Modal } from "react-native";
import tailwind from 'tailwind-rn'
import { createStackNavigator } from "@react-navigation/stack";

import Call from './Call'
import CircleInfoScreen from './CircleInfoScreen'
import ProtectedCreateCommunity from './ProtectedCreateCommunity';
import ProtectedJoinCommunity from './ProtectedJoinCommunity';


const ProtectedHomeMain = ({ route, navigation }) => {
	const { username, password } = route.params
	var [ selected, setSelected ] = useState([])
	var [ filter, setFilter ] = useState()
	const [ filterModalVisible, setFilterModalVisible ] = useState(false)
	const [ filterModal, setFilterModal ] = useState()
	const [ loading, setloading ] = useState(true)
	const [ circles, setCircles ] = useState()
	const [ refreshModal, setRefreshModal ] = useState(false);
	const [ donotInit,  setdonotInit ] = useState(false)

	//setting filters state - default all picked
	function initFilter() {
		if (!circles) {
			loadCircles()
			return
		}
		if (donotInit) return
		var tempFilter = []
		for (var i = 0; i < circles.length; i++) {
			tempFilter[circles[i].name] = [...circles[i].flairs]
		}
		setFilter(tempFilter)
		setdonotInit(true)
	}
	//loading circles from server
	function loadCircles() {
		setloading(true)
		// console.log(`http://flyyee-brainhackserver.herokuapp.com/my_circles?username=${username}&password=${password}`)
		fetch('http://flyyee-brainhackserver.herokuapp.com/my_circles?username='+username+'&password='+password)
		.then(response => response.json())
		.then(data => {
			if (data.success == 1) {
				setdonotInit(false)
				console.log(data)
				setCircles(data.results)
				setloading(false)
			} else console.log("load Circles Error")
		})
		
	}
	useEffect(() => {
		loadCircles()
	}, [])
	//changing filter when circles are updated
	useEffect(() => {
		initFilter()
	}, [circles])
	
	//changing selection of circles to call
	function makeSelection(circleName) {
		const tempSel = selected
		const curCircle = tempSel.indexOf(circleName)
		if (curCircle == -1) {
			tempSel.push(circleName)
		} else {
			tempSel.splice(curCircle, 1)
		}
		setSelected(tempSel)
		setCircles([
			...circles,
		])
	}
	//showing the page to edit filters for flairs
	function showFilter(circleName) {
		setFilterModal(circles.find(o => o.name === circleName))
		setFilterModalVisible(true)
	}
	//flatlist render for circles
	function renderCircles( {item} ) {
		return (
			<View style={tailwind('h-14 rounded-lg px-2 flex-row border-2')}>
				<TouchableOpacity style={tailwind('w-8/12 text-xl self-center')} onPress={() => navigation.navigate("Circle Info", {name:item.name})}>
					<Text style={tailwind('text-xl')}>{item.name}</Text>
				</TouchableOpacity>
				<TouchableOpacity style={tailwind('w-3/12 justify-center')} onPress={() => showFilter(item.name)}>
					<Text style={tailwind('justify-end')}>FILTER {filter ? '('+filter[item.name].length+')' : ''}</Text>
				</TouchableOpacity>
				<TouchableOpacity style={tailwind('w-1/12 justify-center')} onPress={() => makeSelection(item.name)}>
					<View style={tailwind(`h-7 w-7 border-2 rounded-full self-end justify-center ${selected.includes(item.name) ? 'bg-blue-600':''}`)}>

					</View>
				</TouchableOpacity>
			</View>
		)
	}
	function separator() {
        return (<View style={{height:5}}></View>)
    }
	//toggling filters
	function toggleFilter(circleName, flair) {
		if (!filter[circleName]) return
		console.log(circles)
		var tempfilter = filter
		console.log(tempfilter[filterModal.name])
		var flairid = tempfilter[filterModal.name].findIndex(o => o === flair)

		if (flairid == -1) {
			tempfilter[filterModal.name].push(flair)
		} else {
			tempfilter[filterModal.name].splice(flairid, 1)
		}
		setFilter(tempfilter)
		console.log(filter)
		setRefreshModal(!refreshModal)
	}
	//flatlist render for flairs
	function renderFilter({item}) {
		return (
			<View style={tailwind('h-14 rounded-lg px-2 flex-row border-2')}>
				<Text style={tailwind('w-5/6 text-xl self-center')}>{item}</Text>
				<TouchableOpacity style={tailwind('w-1/6 justify-center')} onPress={() => toggleFilter(filterModal.name, item)}>
					<View style={tailwind(`h-7 w-7 border-2 rounded-full self-end justify-center ${filter[filterModal.name]?.find(o => o === item) ? 'bg-blue-600':''}`)}>
					</View>
				</TouchableOpacity>
			</View>
		)
	}
	//all and none flair functions
	function filterNone() {
		let circleName = filterModal.name
		var tempfilter = filter
		tempfilter[circleName] = []
		setFilter(tempfilter)
		setRefreshModal(!refreshModal)
	}
	function filterAll() {
		let circleName = filterModal.name
		var tempFilter = filter
		tempFilter[circleName] = [...circles.find(o => o.name===circleName).flairs]
		setFilter(tempFilter)
		setRefreshModal(!refreshModal)
	}

	return (
		<View style={tailwind('px-4 py-4')}>
			<Modal
				animationType="slide"
				transparent={true}
				visible={filterModalVisible}
				onRequestClose={() => {
					setFilterModalVisible(!filterModalVisible);
				}}
			>
				<View style={tailwind('px-4 py-4 h-full w-full justify-center')}>
					<View style={tailwind('px-4 py-4 h-5/6 w-full bg-blue-100 self-center border-2 rounded-lg')}>
						<Text style={tailwind('text-3xl')}>{filterModal ? filterModal.name : ''}</Text>
						{filterModal ? <FlatList data={ filterModal.flairs } extraData={ refreshModal } renderItem={renderFilter} ItemSeparatorComponent={separator} keyExtractor={(item, index) => index.toString()}/> : <Text>Error</Text>}
						<View style={tailwind('flex-row')}>
							<TouchableOpacity style={tailwind('h-12 w-1/3 justify-center rounded-lg px-2 flex-row border-2')} onPress={filterAll}>
								<Text style={tailwind('text-xl self-center text-center')}>ALL</Text>
							</TouchableOpacity>
							<TouchableOpacity style={tailwind('h-12 w-1/3 mx-1 rounded-lg px-2 flex-row border-2')} onPress={() => setFilterModalVisible(!filterModalVisible)}>
								<Text style={tailwind('w-full text-xl self-center text-center')}>CLOSE</Text>
							</TouchableOpacity>
							<TouchableOpacity style={tailwind('h-12 w-1/3 rounded-lg px-2 flex-row border-2')} onPress={filterNone}>
								<Text style={tailwind('text-xl self-center text-center')}>NONE</Text>
							</TouchableOpacity>
						</View>
						
					</View>
				</View>
      		</Modal>
			<View style={tailwind('h-full')}>
				<TouchableOpacity style={tailwind('w-4/5 self-center bg-blue-300 h-20 justify-center rounded-full')} onPress={() => navigation.navigate("Call", {username, password})}>
					<Text style={tailwind('text-3xl self-center')}>CALL</Text>
				</TouchableOpacity>
				<View style={tailwind('my-4 h-4/6 bg-blue-100')}>
					{loading
						? <Text>Loading...</Text>
						: <FlatList data={circles} renderItem={renderCircles} ItemSeparatorComponent={separator} keyExtractor={(item, index) => index.toString()}/>
					}
				</View>
				<TouchableOpacity style={tailwind('w-4/5 self-center bg-blue-300 h-20 justify-center rounded-full')} onPress={loadCircles}>
					<Text style={tailwind('text-3xl self-center')}>RELOAD</Text>
				</TouchableOpacity>
			</View>
			
		</View>
	);
}

const Stack = createStackNavigator();
export default function ProtectedHome({route}) {
	const { username, password } = route.params

	return (
		<Stack.Navigator>
			<Stack.Screen name="Protected Home Main" options={{headerShown: false}} component={ProtectedHomeMain} initialParams={{username, password}}/>
			<Stack.Screen name="Circle Info" component={CircleInfoScreen} initialParams={{username, password}}/>
			<Stack.Screen name="Call" component={Call} initialParams={{username, password}} />
		</Stack.Navigator>
	)
}