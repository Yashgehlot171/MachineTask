import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableHighlight, StatusBar, TouchableOpacity, Image, FlatList, TextInput, Keyboard, Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Timer from './Components/Timer';
const Home = ({ navigation }) => {
    const [timerDuration, setTimerDuration] = useState(0);
    const [tasks, setTasks] = useState([]);
    const [finish, setFinish] = useState([]);
    const [ids, setId] = useState('');
const [status,setStatus] =useState(false)
    useEffect(() => {
        getAndUpdate()
    }, [])


    //data store and get to local storage
    const getAndUpdate = async () => {
        const Data = JSON.parse(await AsyncStorage.getItem("data"))
        console.log('Aynch store data',Data)
        setTasks(Data);
        await AsyncStorage.setItem('data', JSON.stringify(tasks))   
    }

    //update data to local storage
    const addNewData = async () => {
        await AsyncStorage.setItem('data', JSON.stringify(tasks))
        const Data = JSON.parse(await AsyncStorage.getItem("data"))
        console.log('Aynch store data',Data)
        // setTasks(Data);
  
        
    }
    
    //add new timer box{value}
    const addTask = (task) => {
     
        if (task == null) {
            setTasks([{ id: tasks.length + 1, status: false, time: 0, buttonStatus: 0 }])
            addNewData();
        }
        else {
            setTasks([...tasks, { id: tasks.length + 1, status: false, time: 0, buttonStatus: 0 }]);
            addNewData();
        }
    }
    //add time in array list
    const UpdateTimeValue = (id, time) => {
        const newState = tasks.map(obj => {
            if (obj.id === id) {
                return { ...obj, time: time };
            }

            return obj;
        });
        console.log('print===', newState)
        setTasks(newState);
    };

    const List = ({ item }) => {
        return (
            <View style={{ flex: 1, marginBottom: 10 }}>

                <View style={{ height: 100, backgroundColor: '#eee', elevation: 5, shadowColor: '#000', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.3, shadowRadius: 5 }}>

                    <View style={{ flexDirection: 'row', }}>
                        <Text>Time in second</Text>
                        <Text style={{ marginLeft: 10 }}>Second to HH:MM:SS</Text>

                    </View>
                    <View style={styles.sectionStyle}>

                        <TextInput
                            style={{ width: 120, backgroundColor: '#fafafa', borderRadius: 15 ,paddingLeft:10,fontSize:13}}
                            onChangeText={(time) => {
                                setTimerDuration(time)
                            }}
                            placeholder={'Enter value in sec'}
                            placeholderTextColor="#ccc"
                            keyboardType="phone-pad"
                            value={item.time}
                            returnKeyType="next"
                            onSubmitEditing={() => {
                                UpdateTimeValue(item.id, timerDuration), Keyboard.dismiss()
                            }}
                        />
                        <Timer time_in_minutes={item.time / 60} totalTime={item.time} /></View>

                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'light-content'} backgroundColor='#0d0e2e' translucent />
            <View style={styles.container}>
       
                <View style={{ backgroundColor: '#0d0e2e', height: 100, width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, padding: 10 }}>
                    <Text style={{ color: '#fff', width: 200, fontSize: 17, marginTop: 40 }}>Timer</Text>
                    <TouchableOpacity onPress={() => {  addTask('text') }} style={{ backgroundColor: 'white', width: 120, height: 40, alignSelf: 'flex-end', marginTop: 20, marginRight: 10, borderRadius: 20, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                        {/* <Image style={{ width: 25, height: 25, tintColor: 'black', marginTop: 5 }} source={require('../Constant/Assets/plus.png')} /> */}
                        <Text style={{ color: 'black', margin: 5 }}> Add Timer</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => <View style={{flex:1,backgroundColor:'#fff'}}>
                    <Text style={{color:'#000',fontSize:16,textAlign:'center',padding:21,marginTop:10}}>No Timer List data  add your time...</Text>
                  </View>}
                    ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#e5e5e5', marginVertical: 15 }} />}
                    contentContainerStyle={{ flexGrow: 1, padding: 20, paddingBottom: 20 }}
                    renderItem={List}
                    data={tasks} />
          
            </View>
        </SafeAreaView>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#FFFFFF'

    },
    title: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        padding: 20,
    },
    sectionStyle: {
        flex: 1,
        marginTop: 10,
        alignItems: 'center', flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonText: {
        fontSize: 15,
        color: 'white'
    },
});

