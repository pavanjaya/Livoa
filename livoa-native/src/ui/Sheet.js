import { Modal, Pressable, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { T } from './kit.js'
import { useTheme } from '../theme.js'

export default function Sheet({ open, onClose, title, children }) {
  const t = useTheme()
  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(10,10,25,0.45)', justifyContent: 'flex-end' }}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Pressable
            onPress={() => {}}
            style={{
              backgroundColor: t.surface,
              borderTopLeftRadius: 26,
              borderTopRightRadius: 26,
              borderWidth: t.borderW,
              borderColor: t.border,
              paddingHorizontal: 18,
              paddingTop: 10,
              paddingBottom: 28,
              maxHeight: '88%',
            }}
          >
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: t.border, alignSelf: 'center', marginBottom: 14 }} />
            {title ? <T size={18} style={{ marginBottom: 6 }}>{title}</T> : null}
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              {children}
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  )
}
