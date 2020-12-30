import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function ModeChange({
    mode,
    handleModeChange,
}) {
    return (
        <View style={styles.modeChange}>
            <Text style={{color: '#fff', textTransform: 'uppercase', fontSize: 16}}>
                CURRENT MODE:&nbsp; 
                <Text style={{color: 'aqua', textTransform: 'none'}}>{mode === 'throw' ? 'Throw' : 'Combat'}</Text>
            </Text>

            <TouchableOpacity onPress={handleModeChange} style={styles.changeButton}>
                <Text style={{color: '#00f400', fontSize: 16}}>
                    CHANGE MODE
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    modeChange: {
        alignItems: 'flex-end'
    },
    changeButton: {
        marginTop: 7,
        padding: 7,
        borderColor: '#00f400',
        borderWidth: 2 
    }
});
