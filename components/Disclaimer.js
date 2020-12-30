import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function Disclaimer({
    setAccept,
    playSound,
    soundStart,
}) {
    function handleAccept() {
        playSound(soundStart);
        setAccept(true);
    }
    
    return (
        <View style={styles.disclaimer}>

            <Text
                style={styles.title}
            >AXE THROW</Text>

            <Text style={{ color: 'red', fontSize: 32, textAlign: 'center' }}>
                WARNING:&nbsp;
                <Text style={styles.text}>NEVER LET GO OF YOUR DEVICE WHILE USING THIS APP</Text>
            </Text>
            
            <TouchableOpacity onPress={handleAccept} style={styles.button}>
                <Text style={styles.buttonText}>
                I Understand
                </Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    disclaimer: {
        flex: 1,
        backgroundColor: '#0f1013',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#fff',
        fontSize: 32

    },
    title: {
        marginBottom: 50,
        color: '#fff',
        fontSize: 50,
        textDecorationLine: 'underline'
    },
    button: {
        marginTop: 50,
        backgroundColor: '#4a4545',
        borderRadius: 4,
        paddingHorizontal: 60,
        paddingVertical: 30,
        borderColor: 'red',
        borderWidth: 3
    },
    buttonText: {
        color: '#fff',
        fontSize: 22,
        textTransform: 'uppercase'
    }
});
