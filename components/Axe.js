import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Vibration, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { Accelerometer } from 'expo-sensors';
import ModeChange from './ModeChange';
import Results from './Results';
import axePic from '../assets/axe.png';
import soundThrowFile from '../audio/axe_throw.mp3';
import soundRecallFile from '../audio/axe_recall.mp3';
import soundSwing1File from '../audio/swing_1.mp3';
import soundSwing2File from '../audio/swing_2.mp3';
import soundSwing3File from '../audio/swing_3.mp3';

export default function Axe({
    loadSound,
    playSound,
    soundStart,
}) {
    // Set accelerometer interval
    Accelerometer.setUpdateInterval(20);
    // Minimum accel needed to trigger throw in m/s^2
    const minAccelThrow = 40;

    const windowHeight = Dimensions.get('window').height;

    const soundSwingArr = [soundSwing1File, soundSwing2File, soundSwing3File]
    // Set sounds so they can only repeat after they finish completely first
    const [soundThrown, setSoundThrown] = useState(null);
    const [soundRecall, setSoundRecall] = useState(null);

    const [subscription, setSubscription] = useState(null);
    // Accel data in Gs 
    const [data, setData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });
    // Max accel data in m/s^2
    const [maxX, setMaxX] = useState(0);

    const [mode, setMode] = useState('throw');
    const [showAxe, setShowAxe] = useState(true);
    const [thrown, setThrown] = useState(false);

    // Animations
    const [spinAnim, setSpinAnim] = useState(new Animated.Value(0));
    const [scaleAnim, setScaleAnim] = useState(new Animated.Value(0));
    const [flashAnim, setFlashAnim] = useState(new Animated.Value(0));

    const spin = spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '-1080deg']
    })

    const scale = scaleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0]
    })

    const flash = flashAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#0f1013', '#fff']
    })

    function startThrowAnim(toValue) {
        Animated.parallel([
            Animated.timing(spinAnim, {
                toValue,
                duration: 1000,
                useNativeDriver: true  // To make use of native driver for performance
            }),
            Animated.timing(scaleAnim, {
                toValue,
                duration: 1000,
                useNativeDriver: true  // To make use of native driver for performance
            })
        ]).start();
    }

    function startFlashAnim() {
        Animated.timing(flashAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: false
        }).start(() => {
            Animated.timing(flashAnim, {
                toValue: 0,
                duration: 100,
                useNativeDriver: false
            }).start()
        });
    }

    const _subscribe = () => {
        setSubscription(
            Accelerometer.addListener(accelerometerData => {
                setData(accelerometerData);
            })
        );
    };

    const _unsubscribe = () => {
        subscription && subscription.remove();
        setSubscription(null);
    };

    function loadSounds() {
        if (!soundThrown) {
            loadSound(soundThrowFile, setSoundThrown)
        }
        if (!soundRecall) {
            loadSound(soundRecallFile, setSoundRecall)
        }
    }

    async function playCombatSound(audioArray) {
        const randInt = Math.floor(Math.random()*audioArray.length)
        const { sound } = await Audio.Sound.createAsync(
            soundSwingArr[randInt]
        );
        await sound.playAsync();
    }

    function handleReset() {
        spinAnim.setValue(1)
        scaleAnim.setValue(1)
        setShowAxe(true)
        startThrowAnim(0)
        playSound(soundRecall)
        setData({
            x: 0,
            y: 0,
            z: 0
        })
        setMaxX(0)
        setTimeout(() => {
            Vibration.vibrate(200)
            setThrown(false)
        }, 1000)
    }

    function handleModeChange() {
        spinAnim.setValue(0)
        scaleAnim.setValue(0)
        setShowAxe(true)
        setMode(mode === 'throw' ? 'combat' : 'throw')
        playSound(soundStart)
        setData({
            x: 0,
            y: 0,
            z: 0
        })
        setMaxX(0)
        setThrown(false)
    }

    useEffect(() => {
        loadSounds();
        if (!thrown) {
            if (!subscription) {
                _subscribe();
            } else {
                // Accel Measuring logic
                const { x } = data;
                const accel = Math.abs(x)*9.81;
                // Keep detecting max
                if (accel > maxX) {
                    setMaxX(accel)
                }
                if (accel > minAccelThrow) {
                    // Throw Mode
                    if (mode === 'throw') {
                        startThrowAnim(1);
                        Vibration.vibrate(200)
                        playSound(soundThrown)

                        // Need to wait some time to capture the max acceleration instead of just when it passes the minimum
                        setTimeout(() => {
                            setThrown(true)
                        }, 100)
                        setTimeout(() => {
                            setShowAxe(false)
                        }, 1000)
                    }
                    // Combat Mode
                    if (mode === 'combat') {
                        startFlashAnim()
                        playCombatSound(soundSwingArr)
                        Vibration.vibrate(200)
                        setThrown(true)
                        setTimeout(() => {
                            setThrown(false)
                        }, 300)
                    }
                }
            }
        } else {
            _unsubscribe()
        }

        return () => _unsubscribe();
    }, [data, thrown, soundThrown, soundRecall]);

    // const {x, y, z} = data;

    return (
        <Animated.View style={[styles.axe, {backgroundColor: flash}]}>

            {/* <Text style={{color: '#fff'}}>
                x: {x} y: {y} z: {z}
            </Text>
            <Text style={{color: '#fff'}}>
                maxX: {maxX}
            </Text> */}

            <ModeChange 
                mode={mode}
                handleModeChange={handleModeChange}
            />
            
            {
                showAxe ? 
                <View style={{ marginTop: 50, alignItems: 'center' }}>
                    <Animated.Image     
                        source={axePic} 
                        style={[{ 
                                aspectRatio: 510/1438, 
                                height: windowHeight*.7
                            },
                            {
                                transform: [{rotate: spin}, {scale: scale}],
                            },
                        ]} 
                    />
                </View> :
                <Results 
                    maxX={maxX}
                    handleReset={handleReset}
                />
            }
        
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    axe: {
        marginTop: 40,
        flex: 1,
        backgroundColor: '#0f1013',
    }
});
