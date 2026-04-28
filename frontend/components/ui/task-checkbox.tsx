import React, { useState} from 'react'
import ExpoCheckbox from 'expo-checkbox';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function TaskCheckbox() {
    const [checked, setChecked] = useState(false);


  return (
    <TouchableOpacity>
        <ExpoCheckbox
        value={checked}
        onValueChange={setChecked}
        color={checked ? '#4CAF50' : undefined}
        style={s.checkbox}/>
    </TouchableOpacity>
  );
};


const s = StyleSheet.create({
    checkbox: {
        borderRadius: 50,
        width: 24,
        height: 24
    },
})
