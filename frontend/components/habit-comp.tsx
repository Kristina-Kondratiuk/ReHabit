import { View, StyleSheet, Text } from 'react-native';
import React, { ReactNode } from 'react';
import TaskCheckbox from './ui/task-checkbox';
import { Colors, getHabitColorTokens, type HabitColorName } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type HabitTodayProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  color?: HabitColorName;
};

const HabitToday = ({ title, description, icon, color = 'purple' }: HabitTodayProps) => {
    const themeName = useColorScheme() ?? 'light';
    const theme = Colors[themeName];
    const habitColor = getHabitColorTokens(themeName, color);
    const shadowStyle = themeName === 'dark'
        ? {
            shadowColor: habitColor.shadow,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 4,
            elevation: 4,
        }
        : {
            shadowOpacity: 0,
            elevation: 0,
        };

    return (
        <View
            style={[
                styles.habitCont,
                {
                    backgroundColor: habitColor.background,
                },
                shadowStyle,
            ]}
        >
            <View style={styles.content}>
                <View style={[styles.iconView, { backgroundColor: '#ffff' }]}>
                    {icon}
                </View>
                <View style={styles.textCont}>
                    <Text style={[styles.habitName, { color: theme.text }]}>{title}</Text>
                    <Text style={[styles.habitDesc, { color: theme.descr }]}>{description}</Text>
                </View>
                <TaskCheckbox />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    habitCont: {
        width: '100%',
        height: 100,
        paddingTop: 20,
        paddingBottom: 30,
        paddingHorizontal: 16,
        justifyContent: 'center',
        backgroundColor: '#E1F7DD',
        borderRadius: 16,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 12,
        width: '100%'
    },
    iconView: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 50,
    },
    textCont: {
        flexDirection: 'column',
        gap: 5,
        width: 201,
        marginRight: 20,
    },
    habitName: {
        fontFamily: 'Inter',
        fontSize: 18,
        lineHeight: 20,
        fontWeight: '600',
    },
    habitDesc: {
        fontFamily: 'Inter',
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 12,
    },
});

export default HabitToday;
