import { View, StyleSheet } from 'react-native'
import React from 'react'
import { Plus } from 'lucide-react-native'
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs'
import { HapticTab } from '@/components/haptic-tab'

const FabTabButton = (props: BottomTabBarButtonProps) => {
const {onPress, accessibilityState} = props;
const focused = accessibilityState?.selected

  return (
    <HapticTab {...props} onPress={onPress} style={styles.fabWrap}>
      <View style={styles.whiteUnderlayer}></View>
        <View style={[styles.fab, focused && styles.fabActive]}>
            <Plus color={"#fff"} size={28} strokeWidth={1.5}/>
        </View>
    </HapticTab>
  )
}

const styles = StyleSheet.create({
  fabWrap: {
    flex: 1,
    alignItems: 'center',
  },
  whiteUnderlayer: {
    position: 'absolute',
    top: -28,
    width: 78,
    height: 78,
    borderRadius: 100,
    backgroundColor: '#fff'
  },
  fab: {
    position: 'absolute',
    top: -22,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabActive: {
    backgroundColor: 'red',
    transform: [{ scale: 2 }],
  },
});

export default FabTabButton
