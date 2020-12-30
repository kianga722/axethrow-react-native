import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Disclaimer from './components/Disclaimer';
import Axe from './components/Axe';
import { Audio } from 'expo-av';
import soundStartFile from './audio/start.mp3';

export default function App() {
  const [accept, setAccept] = useState(false);
  const [soundStart, setSoundStart] = useState(null);

  async function loadSound(audioFile, setAudio) {
      const { sound } = await Audio.Sound.createAsync(
          audioFile
      );

      if (setAudio) {
          setAudio(sound)
      }
  }

  async function playSound(audio) {
      await audio.setPositionAsync(0);
      await audio.playAsync();
  }

  useEffect(() => {
    if (!soundStart) {
        loadSound(soundStartFile, setSoundStart)
    }
  }, [])

  return (
    <View style={styles.main}>
      {
        accept ? <Axe
          loadSound={loadSound}
          playSound={playSound}
          soundStart={soundStart}
        /> : 
        <Disclaimer 
          setAccept={setAccept}
          playSound={playSound}
          soundStart={soundStart}
        />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 15,
    backgroundColor: '#0f1013',
    borderColor: '#067',
    borderWidth: 8,
  }
});
