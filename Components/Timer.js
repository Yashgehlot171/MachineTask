import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View, TouchableOpacity, 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Timer = ({ time_in_minutes, totalTime }) => {
    // var time_in_minutes = 1;
    var current_time = Date.parse(new Date());
    var deadline = new Date(current_time + time_in_minutes * 60 * 1000);

    const [sec, setSec] = useState('');
    const [min, setMin] = useState('');
    const [hr, setHr] = useState('');
    const [startButton, setStartButton] = useState(false)
    const [paused, setPaused] = useState(false);
    const [history_Data, setHistory_Data] = useState([])

    useEffect(() => {
        getHistoryData();
    }, [])

    const getHistoryData = async () => {
        const history = JSON.parse(await AsyncStorage.getItem("history"))
        console.log('prinefdfhbffjdhbgjsdhfg',history)
        if(history==null){

        }else{
            setHistory_Data(history)  
        }
        // setHistory_Data(history)
        console.log('----= first call   ', history)
    }
    function time_remaining(endtime) {
        var t = Date.parse(endtime) - Date.parse(new Date());
        var seconds = Math.floor((t / 1000) % 60);
        var minutes = Math.floor((t / 1000 / 60) % 60);
        var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        var days = Math.floor(t / (1000 * 60 * 60 * 24));
        return { 'total': t, 'days': days, 'hours': hours, 'minutes': minutes, 'seconds': seconds };
    }

    var timeinterval;
    function run_clock(id, endtime) {
        console.log('start')
        var clock = 'pause_clock'
        function update_clock() {
            var t = time_remaining(endtime);
            setSec(t.seconds);
            setMin(t.minutes);
            setHr(t.hours);

            if (t.total <= 0) { clearInterval(timeinterval); HistoryData() }
        }
        update_clock(); // run function once at first to avoid delay
        timeinterval = setInterval(update_clock, 1000);
    }
 var time_left; // time left on the clock when paused

    function pause_clock() {
        if (!paused) {
            console.log('hello pause')
            setPaused(true);
            // paused = true;
            clearInterval(timeinterval); // stop the clock
            time_left = time_remaining(deadline).total; // preserve remaining time
            console.log('pause', time_left)
        }
    }
   

    function resume_clock() {
        if (paused) {
            setPaused(false)
            // paused = false;

            // update the deadline to preserve the amount of time remaining
            deadline = new Date(Date.parse(new Date()) + time_left);

            // start the clock again
            run_clock('clockdiv', deadline);
        }
    }

    const HistoryData = async () => {

        console.log('his data old data==', history_Data)
        history_Data.push({ time: totalTime })
        console.log('his data new  push', history_Data)
        await AsyncStorage.setItem('history', JSON.stringify(history_Data))
        console.log('after update data',history_Data)

        const history = JSON.parse(await AsyncStorage.getItem("history"))
        console.log('print after get',history)
    }
    return (
        <View style={{ flex: 1, }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {sec == '' || sec <= 0 ? <Text style={{ marginLeft: 10, minWidth: 80 }}> 00:00:00 </Text> :
                    <Text style={{ marginLeft: 10, minWidth: 80 }}> {hr} : {min} : {sec} </Text>
                }
                {!startButton ? 
                    <TouchableOpacity style={{ backgroundColor: '#0d0e2e', borderRadius: 10, width: 100, height: 40, alignItems: 'center', justifyContent: 'center', marginLeft: 10 }} 
                  
                    onPress={() => {  setStartButton(true); run_clock('clockdiv', deadline); }}
                    >
                        <Text style={{ color: '#fff' }}> Start </Text>
                    </TouchableOpacity> : !paused ?

                        <TouchableOpacity style={{ backgroundColor: '#0d0e2e', borderRadius: 10, width: 100, height: 40, alignItems: 'center', justifyContent: 'center', marginLeft: 10 }} onPress={() => { pause_clock() }}>
                            <Text style={{ color: '#fff' }}>Pause</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={{ backgroundColor: '#0d0e2e', borderRadius: 10, width: 100, height: 40, alignItems: 'center', justifyContent: 'center', marginLeft: 10 }}
                            onPress={() => { resume_clock() }}>
                            <Text style={{ color: '#fff' }}>Resume </Text>
                        </TouchableOpacity>
                }
            </View>
        </View>
    );
}
export default Timer