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
  FlatList
} from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import tailwind from 'tailwind-rn'
import styles from '../styles/styles'
import Protected from './Protected'
import { circle } from 'react-native/Libraries/Animated/src/Easing'

export default function ProtectedJoinCommunity ({ route, navigation }) {
  let { username, password, circleName } = route.params
  //circleName = 'qui' // TODO: REMOVE
  const [loadingData, setloadingData] = useState(true)
  const [circleInfo, setcircleInfo] = useState('sample circle info')
  const [loadingFlairData, setloadingFlairData] = useState(true)
  const [flairInfo, setflairInfo] = useState(['sample flair info'])
  const [flairStatus, setflairStatus] = useState({})
  const [refresh, setRefresh] = useState(false)
  const [recommended, setrecommended] = useState(
    <TouchableOpacity onPress={() => navigation.navigate('Description', {})}>
      <Text>Video Games</Text>
    </TouchableOpacity>
  )

  function getCircleInfo (username, password, circleName) {
      // TODO: header still says description
    // return new Promise((res, err) => {
    fetch(
      `http://flyyee-brainhackserver.herokuapp.com/get_circle_data?username=${username}&password=${password}&circleName=${circleName}`
    )
      .then(fetched => fetched.json())
      .then(ret => {
          console.log(ret)
        if (ret.success == 1) {
          setcircleInfo(ret.circle.infoText)
        }
        setloadingData(false)
        res()
      })
    // .catch(caught => err(caught))
    // })
  }

  function getFlairs () {
    // console.log('here')
    // return new Promise((res, err) => {
    fetch(
      `http://flyyee-brainhackserver.herokuapp.com/assign_flair_info?username=${username}&password=${password}&circleName=${circleName}&newuser=1`
    )
      .then(fetched => fetched.json())
      .then(ret => {
        // console.log(ret.success)
        if (ret.success == 1) {
          let flairs = ret.availableFlairs
        //   console.log(flairs)
          for (let x = 0; x < flairs.length; x++) {
            flairs[x] = flairs[x].name
          }
          setflairInfo(flairs)
          let fs = {}
          for (let flair of flairs) {
            fs[flair] = false
          }
          setflairStatus(fs)
          setloadingFlairData(false)
        }
        res()
      })
    // .catch(caught => err(caught))
    // })
  }

  useEffect(() => {
    getCircleInfo(username, password, circleName)
    getFlairs()
  }, [])

  function renderCircles ({ item }) {
    return (
      <View style={tailwind('rounded-lg px-2 flex-row border-2')}>
        <TouchableOpacity
          onPress={() => {
            let fs = flairStatus
            fs[item] = !fs[item]
            setflairStatus(fs)
            console.log(flairStatus[item])
            setRefresh(!refresh)
          }}
          style={tailwind(flairStatus[item] ? 'bg-blue-600' : 'bg-blue-100')}
        >
          <Text>{item}</Text>
        </TouchableOpacity>
      </View>
    )
  }
  function separator () {
    return <View style={{ height: 5 }}></View>
  }

  async function join() {
    await fetch(
        `http://flyyee-brainhackserver.herokuapp.com/join_circle?username=${username}&password=${password}&circleName=${circleName}`
    ).then(
        res => res.json()
    ).then(async res => {
        if (res.success || true) { // TODO: leakk
            if (res.info == "joined") {
                let flairs = []
                for (let flair in flairStatus) {
                    if (flairStatus[flair]) {
                        flairs.push(flair)
                    }
                }
                flairs = flairs.toString()
                await fetch(`http://flyyee-brainhackserver.herokuapp.com/assign_flair?username=${username}&password=${password}&circleName=${circleName}&flairnames=${flairs}&targetUsernames=${username}`)
                .then(assignRes => assignRes.json())
                .then(assignRes => {
                    // TODO: go to home
                    // console.log("HERE")
                    setloading(false)
                    navigation.goBack()
                  
                })
            }
        }
    })
  }

  return (
    <View style={tailwind('px-4 py-4')}>
      <Text style ={tailwind('text-xl mt-1 font-bold border-4 border-opacity-100') }>{circleName}</Text>
      <Text style ={tailwind('text-lg mt-1  border-4 border-opacity-100') }>Info: {loadingData ? 'still loading data, welcome' : circleInfo}</Text>
      <Text style ={tailwind('text-base mt-1  border-4 border-opacity-100 font-bold' ) }>Choose a role: </Text>
      <FlatList
        extraData={refresh}
        data={loadingFlairData ? ['still loading flair data, welcome'] : flairInfo}
        renderItem={renderCircles}
        ItemSeparatorComponent={separator}
        keyExtractor={(item, index) => index.toString()}
      />
      <Button onPress={join} title='Join' />
    </View>
  )
}
