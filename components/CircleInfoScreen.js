import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image, Modal, FlatList, Alert } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
import tailwind from 'tailwind-rn'

export default function CircleInfoScreen( {route, navigation} ) {
    const [ info, setInfo ] = useState({})
	const [ loading, setloading ] = useState(true)
    const [ isMod, setisMod ] = useState(false)
    const [ ModalVisible, setModalVisible ] = useState(false)
    const [ loadingFlairs, setloadingFlairs ] = useState(true)
    const [ loadingCur, setloadingCur ] = useState(true)
    const [ allFlairs, setAllFlairs ] = useState([])
    const [ curFlairs, setCurFlairs ] = useState([])
    const [ assignFlair, setassignFlair ] = useState(false)

    const { username, password, name } = route.params

    function loadCircleInfo() {
        setloading(true)
        fetch('http://flyyee-brainhackserver.herokuapp.com/get_circle_data?username='+username+'&password='+password+'&circleName='+name)
		.then(response => response.json())
		.then(data => {
			if (data.success == 1) {
				console.log(data)
				setInfo(data.circle)
				setloading(false)
			} else console.log("load info Error")
		})
    }
    function loadModInfo() {
        fetch('http://flyyee-brainhackserver.herokuapp.com/create_flair_info?username='+username+'&password='+password+'&circleName='+name)
		.then(response => response.json())
		.then(data => {
			if (data.success == 1) {
				console.log(data)
				if (data.power <= 2) setisMod(true)
			} else console.log("load mod Error")
		})
    }
    function loadFlairInfo() {
        setloadingFlairs(true)
        fetch('http://flyyee-brainhackserver.herokuapp.com/assign_flair_info?username='+username+'&password='+password+'&circleName='+name+'&newuser=0')
		.then(response => response.json())
		.then(data => {
			if (data.success == 1) {
				console.log(data)
				setAllFlairs(data.availableFlairs)
                setloadingFlairs(false)
			} else console.log("load available flairs Error")
		})
    }
    function loadMyFlair() {
        setloadingCur(true)
        fetch('http://flyyee-brainhackserver.herokuapp.com/get_members?username='+username+'&password='+password+'&circleName='+name)
		.then(response => response.json())
		.then(data => {
			if (data.success == 1) {
				console.log(data)
				if (data.members[username]) setCurFlairs(data.members[username])
                else console.log("member not found Error")
                setloadingCur(false)
			} else console.log("load current flairs Error")
		})
    }
    useEffect(() => {
        loadCircleInfo()
        loadModInfo()
        loadFlairInfo()
        loadMyFlair()
    }, [])

    function leaveCircle() {
        fetch('http://flyyee-brainhackserver.herokuapp.com/leave_circle?username='+username+'&password='+password+'&circleName='+name)
		.then(response => response.json())
		.then(data => {
			if (data.success == 1) {
				navigation.navigate("Protected Home Main");
			} else console.log("leave Error")
		})
    }

    function toggleFlair(flair) {
        setassignFlair(true)
        if (flair=="Owner") {
            Alert.alert("Cannot unassign", "You remove yourself as the owner")
            setassignFlair(false)
            return 
        }
        console.log('http://flyyee-brainhackserver.herokuapp.com/assign_flair?username='+username+'&password='+password+'&circleName='+name+'&flairNames='+flair+'&targetUsernames='+username)
        fetch('http://flyyee-brainhackserver.herokuapp.com/assign_flair?username='+username+'&password='+password+'&circleName='+name+'&flairNames='+flair+'&targetUsernames='+username)
		.then(response => response.json())
		.then(data => {
			if (data.success == 1) {
                console.log(data)
				setModalVisible(false)
                loadModInfo()
                loadFlairInfo()
                loadMyFlair()
                setassignFlair(false)
			} else {
                console.log("Assign Error")
                Alert.alert("Error")
                setassignFlair(false)
            }
		})
    }

    function renderFlair({item}) {
        return (
            <TouchableOpacity onPress={() => toggleFlair(item.name)}>
                <View style={tailwind(`h-14 rounded-lg px-2 flex-row border-2 ${curFlairs.includes(item.name) ? 'bg-blue-500' : ''}`)}>
                    <Text style={tailwind(`w-5/6 text-xl self-center`)}>{item.name}</Text>
                </View>
            </TouchableOpacity>
            
        )
    }

    return (  
		<View style={tailwind('px-4 py-4')}>
            <Modal
				animationType="slide"
				transparent={true}
				visible={ModalVisible}
				onRequestClose={() => {
					setModalVisible(!ModalVisible);
				}}
			>
				<View style={tailwind('px-4 py-4 h-full w-full justify-center')}>
					<View style={tailwind('px-4 py-4 h-5/6 w-full bg-blue-100 self-center border-2 rounded-lg')}>
						<Text style={tailwind('text-3xl')}>Flairs</Text>
						{(loadingFlairs||loadingCur) 
                            ? <Text>Loading flairs...</Text>
                            : <FlatList data={allFlairs} extraData={curFlairs} renderItem={renderFlair}/>
                        }
					</View>
				</View>
      		</Modal>
            <View style={tailwind('flex-row')}>
                <Text style={tailwind('text-3xl w-11/12')}>{name}</Text>
                <View style={tailwind('justify-start')}>
                    {isMod
                        ? <TouchableOpacity>
                            <Image style={tailwind('w-9 h-7')} source={require('./icons/edit.png')} /> 
                        </TouchableOpacity>
                        : <View></View>}
                </View>
            </View>
            <View style={tailwind('my-4 px-4 py-4 h-5/6 bg-blue-100 rounded-3xl')}>
                <Text>{loading?"loading...":info.infoText}</Text>
                <Text>{info.vis}</Text>
            </View>
            <View style={tailwind('flex-row')}>
                <TouchableOpacity style={tailwind('h-12 w-1/2 rounded-lg px-2 flex-row border-2')} onPress={leaveCircle}>
                    <Text style={tailwind('text-xl self-center text-center')}>LEAVE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={tailwind('h-12 w-1/2 rounded-lg px-2 flex-row border-2')} onPress={() => setModalVisible(!ModalVisible)}>
                    <Text style={tailwind('text-xl self-center text-center')}>EDIT FLAIR</Text>
                </TouchableOpacity>
            </View>
            <Spinner visible={assignFlair} textContent='Changing your flair' textStyle={tailwind('text-white text-sm')}/>
			
		</View>
	);
}