import { type ReactNode } from 'react';
import { Modal, Pressable, TouchableOpacity, View, StyleSheet } from 'react-native';

import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';

type BottomSheetModalProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  rightActionLabel?: string;
  onRightActionPress?: () => void;
  isRightActionActive?: boolean;
  children: ReactNode;
};

export default function BottomSheetModal({
  visible,
  title,
  onClose,
  rightActionLabel,
  onRightActionPress,
  isRightActionActive = false,
  children,
}: BottomSheetModalProps) {
  const themeName = useColorScheme() ?? 'light';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View style={[styles.modalSheet, { backgroundColor: Colors[themeName].background }]}>
            <View style={styles.headerRow}>
              <ThemedText type='subtitle'>{title}</ThemedText>
              {rightActionLabel ? (
                <Pressable
                  onPress={onRightActionPress}
                  style={[
                    styles.rightAction,
                    isRightActionActive
                      ? { borderColor: Colors.common.tint, backgroundColor: Colors[themeName].purple }
                      : null,
                  ]}
                >
                  <ThemedText style={styles.rightActionText}>{rightActionLabel}</ThemedText>
                </Pressable>
              ) : null}
            </View>
            {children}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 6,
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 44,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '600',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: Colors.common.overlay,
  },
  rightAction: {
    minHeight: 32,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.common.inputBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightActionText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
  },
});
