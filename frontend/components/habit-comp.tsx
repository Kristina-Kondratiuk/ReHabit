import { Animated, PanResponder, Pressable, View, StyleSheet, Text } from 'react-native';
import React, { ReactNode, useCallback, useEffect, useMemo, useRef } from 'react';
import { Pencil, Trash2 } from 'lucide-react-native';
import TaskCheckbox from './ui/task-checkbox';
import { Colors, type HabitColorName } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const actionWidth = 40;
const cardHeight = 110;

type HabitTodayProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  color?: HabitColorName;
  completed?: boolean;
  onToggleComplete?: (checked: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
};

const HabitToday = ({
    title,
    description,
    icon,
    color = 'purple',
    completed = false,
    onToggleComplete,
    onEdit,
    onDelete,
}: HabitTodayProps) => {
    const themeName = useColorScheme() ?? 'light';
    const theme = Colors[themeName];
    const habitBackground = Colors[themeName][color];
    const habitShadow = Colors.common[color];
    const swipeProgress = useRef(new Animated.Value(0)).current;
    const currentProgress = useRef(0);
    const gestureStartProgress = useRef(0);
    const shadowStyle = themeName === 'dark'
        ? {
            shadowColor: habitShadow,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 4,
            elevation: 4,
        }
        : {
            shadowColor: habitShadow,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.45,
            shadowRadius: 5,
            elevation: 3,
        };
    const actionTranslateX = swipeProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [actionWidth, 0],
    });
    const actionOpacity = swipeProgress.interpolate({
        inputRange: [0, 0.05, 1],
        outputRange: [0, 1, 1],
    });
    const checkboxOpacity = swipeProgress.interpolate({
        inputRange: [0, 0.45, 1],
        outputRange: [1, 0, 0],
    });

    useEffect(() => {
        const listenerId = swipeProgress.addListener(({ value }) => {
            currentProgress.current = value;
        });

        return () => {
            swipeProgress.removeListener(listenerId);
        };
    }, [swipeProgress]);

    const animateSwipe = useCallback((toValue: 0 | 1) => {
        Animated.spring(swipeProgress, {
            toValue,
            useNativeDriver: false,
            speed: 18,
            bounciness: 0,
        }).start();
    }, [swipeProgress]);

    const panResponder = useMemo(
        () =>
            PanResponder.create({
                onMoveShouldSetPanResponder: (_, gestureState) =>
                    Math.abs(gestureState.dx) > 8 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
                onPanResponderGrant: () => {
                    gestureStartProgress.current = currentProgress.current;
                },
                onPanResponderMove: (_, gestureState) => {
                    const nextProgress = gestureStartProgress.current - gestureState.dx / actionWidth;
                    swipeProgress.setValue(clamp(nextProgress, 0, 1));
                },
                onPanResponderRelease: () => {
                    animateSwipe(currentProgress.current > 0.45 ? 1 : 0);
                },
                onPanResponderTerminate: () => {
                    animateSwipe(currentProgress.current > 0.45 ? 1 : 0);
                },
            }),
        [animateSwipe, swipeProgress]
    );

    const handleEdit = () => {
        animateSwipe(0);
        onEdit?.();
    };

    const handleDelete = () => {
        animateSwipe(0);
        onDelete?.();
    };

    return (
        <View style={[styles.shadowFrame, { backgroundColor: habitBackground }, shadowStyle]}>
            <View style={styles.swipeFrame} {...panResponder.panHandlers}>
                <Animated.View
                    style={[
                        styles.habitCont,
                        {
                            backgroundColor: habitBackground,
                        },
                    ]}
                >
                    <View style={styles.content}>
                        <View style={[styles.iconView, { backgroundColor: Colors.common.white }]}>
                            {icon}
                        </View>
                        <View style={styles.textCont}>
                            <Text style={[styles.habitName, { color: theme.text }]} numberOfLines={2}>
                                {title}
                            </Text>
                            {description ? (
                                <Text style={[styles.habitDesc, { color: theme.descr }]} numberOfLines={2}>
                                    {description}
                                </Text>
                            ) : null}
                        </View>
                        <Animated.View style={[styles.checkboxWrap, { opacity: checkboxOpacity }]}>
                            <TaskCheckbox
                                checked={completed}
                                onChange={(nextChecked) => onToggleComplete?.(nextChecked)}
                            />
                        </Animated.View>
                    </View>
                </Animated.View>
                <Animated.View
                    style={[
                        styles.actions,
                        {
                            backgroundColor: themeName === 'dark' ? Colors.common.black : Colors.common.white,
                            opacity: actionOpacity,
                            transform: [{ translateX: actionTranslateX }],
                        },
                    ]}
                >
                    <View style={styles.actionButtons}>
                        <Pressable style={styles.actionButton} onPress={handleEdit}>
                            <Pencil color={Colors.common.tint} size={22} strokeWidth={1.7} />
                        </Pressable>
                        <Pressable style={styles.actionButton} onPress={handleDelete}>
                            <Trash2 color="#FF0000" size={22} strokeWidth={1.7} />
                        </Pressable>
                    </View>
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    actionButton: {
        width: actionWidth,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButtons: {
        width: actionWidth,
        height: '100%',
    },
    actions: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: actionWidth,
        height: '100%',
        overflow: 'hidden',
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
    },
    checkboxWrap: {
        width: 28,
        alignItems: 'flex-end',
    },
    habitCont: {
        flex: 1,
        height: cardHeight,
        paddingVertical: 20,
        paddingHorizontal: 16,
        justifyContent: 'center',
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
        padding: 12,
        borderRadius: 50,
    },
    textCont: {
        flexDirection: 'column',
        gap: 8,
        flex: 1,
        minWidth: 0,
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
    shadowFrame: {
        width: '96%',
        height: cardHeight,
        alignSelf: 'center',
        borderRadius: 16,
    },
    swipeFrame: {
        width: '100%',
        height: cardHeight,
        borderRadius: 16,
        overflow: 'hidden',
    },
});

export default HabitToday;
