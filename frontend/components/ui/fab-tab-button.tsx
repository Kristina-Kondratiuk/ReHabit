import { View, StyleSheet } from 'react-native'
import React from 'react'
import { Plus } from 'lucide-react-native'
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs'
import { HapticTab } from '@/components/haptic-tab'
import { Colors } from '@/constants/theme'
import { useThemeColor } from '@/hooks/use-theme-color'

const FabTabButton = (props: BottomTabBarButtonProps) => {
  const underlayerBackgroundColor = useThemeColor(
    { light: Colors.common.white, dark: Colors.dark.grey },
    'background'
  )
  const { onPress, accessibilityState } = props
  const focused = accessibilityState?.selected

  return (
    <HapticTab {...props} onPress={onPress} style={styles.fabWrap}>
      <View style={[styles.whiteUnderlayer, { backgroundColor: underlayerBackgroundColor }]} />
      <View style={[styles.fab, focused && styles.fabActive]}>
        <Plus color={Colors.common.white} size={28} strokeWidth={1.5} />
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
    top: -30,
    width: 76,
    height: 76,
    borderRadius: 120,
    backgroundColor: '#fff',
    shadowColor: Colors.common.tint,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  fab: {
    position: 'absolute',
    top: -22,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.common.tintDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabActive: {
    backgroundColor: 'red',
    transform: [{ scale: 2 }],
  },
});

export default FabTabButton
