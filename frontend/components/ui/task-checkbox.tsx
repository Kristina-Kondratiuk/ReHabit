import ExpoCheckbox from 'expo-checkbox';
import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

type TaskCheckboxProps = {
    checked: boolean;
    disabled?: boolean;
    onChange: (checked: boolean) => void;
};

export default function TaskCheckbox({ checked, disabled = false, onChange }: TaskCheckboxProps) {
    return (
        <ExpoCheckbox
            hitSlop={40}
            value={checked}
            disabled={disabled}
            onValueChange={onChange}
            color={checked ? Colors.common.success : undefined}
            style={s.checkbox} />
    );
};


const s = StyleSheet.create({
    checkbox: {
        borderRadius: 50,
        width: 24,
        height: 24
    },
})
