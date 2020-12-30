import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function Results({
    maxX,
    handleReset
}) {
    return (
        <View style={styles.results}>
            <Text style={{color: '#fff', fontSize: 32}}>You threw the axe at:</Text>
            <Text style={{color: '#fff', fontSize: 32}}>{Math.floor(maxX)} m/s²</Text>
            <TouchableOpacity style={styles.buttonRecall} onPress={handleReset}> 
                <Text style={{color: 'aqua', fontSize: 20, textTransform: 'uppercase'}}>
                    Recall Axe
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    results: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonRecall: {
        marginTop: 40,
        color: 'aqua',
        borderRadius: 4,
        paddingHorizontal: 60,
        paddingVertical: 20,
        borderColor: 'aqua',
        borderWidth: 3
    }
});
