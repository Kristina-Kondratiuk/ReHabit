import React, { useState} from 'react'
import ExpoCheckbox from 'expo-checkbox';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/theme';

export default function TaskCheckbox() {
    const [checked, setChecked] = useState(false);

    return (
        <TouchableOpacity>
            <ExpoCheckbox
                hitSlop={40}
                value={checked}
                onValueChange={setChecked}
                color={checked ? Colors.common.success : undefined}
                style={s.checkbox} />
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
