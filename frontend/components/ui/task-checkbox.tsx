import ExpoCheckbox from 'expo-checkbox';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/theme';

type TaskCheckboxProps = {
    checked: boolean;
    disabled?: boolean;
    onChange: (checked: boolean) => void;
};

export default function TaskCheckbox({ checked, disabled = false, onChange }: TaskCheckboxProps) {
    return (
        <TouchableOpacity disabled={disabled}>
            <ExpoCheckbox
                hitSlop={40}
                value={checked}
                disabled={disabled}
                onValueChange={onChange}
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
