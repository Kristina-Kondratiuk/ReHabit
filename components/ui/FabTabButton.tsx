import { View, StyleSheet, Pressable, Platform } from 'react-native'
import React from 'react'
import { Plus } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'

const FabTabButton = (props: any) => {
const {onPress, accessibilityState} = props;
const focused = accessibilityState?.selected

  return (
    <Pressable  onPress={() => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.(); 
  }} style={styles.fabWrap}>
      <View style={styles.whiteUnderlayer}></View>
        <View style={[styles.fab, focused && styles.fabActive]}>
            <Plus color={"#fff"} size={28} strokeWidth={1.5}/>
        </View>
    </Pressable>
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
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  fabActive: {
    backgroundColor: 'red',
    transform: [{ scale: 2 }],
  },
});

export default FabTabButton