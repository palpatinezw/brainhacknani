import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, FlatList, Modal } from "react-native";
import tailwind from 'tailwind-rn'

export default function CircleInfoScreen( {route, navigation} ) {
    const [ info, setInfo ] = useState({})
	const [ loading, setloading ] = useState(true)

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
    useEffect(() => {
        loadCircleInfo()
    }, [])
    
    return (
		<View style={tailwind('px-4 py-4')}>
            <Text style={tailwind('text-3xl')}>{name}</Text>
            <View style={tailwind('my-4 px-4 py-4 h-4/6 bg-blue-100 rounded-3xl')}>
                <Text>{loading?"loading...":info.infoText}</Text>
            </View>
			
		</View>
	);
}