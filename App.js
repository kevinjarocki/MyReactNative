import React, { useState, useEffect, Component } from 'react';
import { Text, View, StyleSheet, Button, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import moment from "moment";
import momenttimer from "moment-timer";
// First change

// Initialize the react-native timer
function Timer ({ interval }) {
  const duration = moment.duration(interval)
return <Text style={styles.trialText}> 
  {duration.minutes()}:{duration.seconds()}: {duration.milliseconds()}</Text>
}


function Trial({number,interval, fastest, slowest}) {
  const trialStyle = [
    styles.trialText,
    fastest && styles.fastest,
    slowest && styles.slowest,
  ]
  return (
    <View style={styles.trial}>
      <Text style={styles.trialHeadingText}>Attempt {number}</Text>
      <Timer style={trialStyle}>{interval}</Timer>
    </View>
  );
}



function TrialTable({ trials }) {
  let finishedTrials = trials.slice(1);
  let min = Number.MAX_SAFE_INTEGER;
  let max = Number.MIN_SAFE_INTEGER;
  if(finishedTrials.length >= 2){
    finishedTrials.forEach(element => {
      if (element < min) min = element
      if (element > max) max = element
    });
  }
  return(
  <View >
  <ScrollView style={styles.scrollView}>
    {trials.map((trial, index) => (
      <Trial
        number={index+1}
        key={index+1}
        interval={trial}
        fastest={trial===min}
        slowest={trial===max}
        />
    ))}
  </ScrollView>
  </View>
  );
}

 function Scanner({trials})  {
  
  // Set device camera permissions to null
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  let timer = moment();
  // Async function to receive permission to use device camera
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  // Barcode scan event handler
  const handleBarCodeScanned = ({ type, data }) => {
   
    
    setScanned(true);
    let timerAfterScan = moment();
    let timeSeconds = timerAfterScan.seconds() - timer.seconds();
    let timerMilliSec = timerAfterScan.milliseconds() - timer.milliseconds();
    alert(`Bar code Type:${type}\nValue: ${data}\nScan Time: ${timeSeconds}  Seconds \n${timerMilliSec} Milliseconds`);
    timer = moment();
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
        <StatusBar hidden={true} />  
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
    
      {scanned && (
        <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
      )
      }
    </View>
  );
}

export default class App extends Component  {
  constructor(props){
  super(props)
  this.state = {
    trials: [ ],
    start: 0,
    now: 0
  }
}
 start = () => {
    const now = new Date().getTime()
    this.setState({
      start: now,
      now,
      trials: [0],
    })
    timer = setInterval(() => {
      this.setState({ now: new Date().getTime()})
    },100)
 }
 

  render() {
  
  return(
          <View style={styles.container}>
            <Scanner />
          </View>
      )
    }
  }


const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  scrollView: {
    alignSelf: 'auto',
    paddingLeft: 10,
    borderColor: '#000000',
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    alignContent: 'center'
  },
  trialText: {
      color: '#0000ff',
      fontSize: 18,
      padding: 10

  },
  trialHeadingText: {
    color: '#000000',
    textDecorationLine: 'underline'
  },
  trial: {
    // flexDirection: 'column',
    // justifyContent:"space-between"
  },
  fastest: {
    color: '#4BC05F'
  },
  slowest: {
    color: '#CC3531'
  },
})