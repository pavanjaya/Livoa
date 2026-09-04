import { useState } from 'react'
import { Platform, Pressable, View, Modal } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { T, Btn, Field, Row } from './kit.js'
import { useTheme } from '../theme.js'
import { pad, humanAgo, niceDate, todayKey } from '../lib/dates.js'

function dateStrToDate(s) {
  if (!s) return new Date()
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0)
}
function dateToStr(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
function timeStrToDate(s) {
  const d = new Date()
  if (s) {
    const [h, m] = s.split(':').map(Number)
    d.setHours(h || 0, m || 0, 0, 0)
  }
  return d
}
function dateToTimeStr(d) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// pressable "field" that opens a native date/time picker
export function PickerField({ mode = 'date', value, onChange, showToday, placeholder = 'Set' }) {
  const t = useTheme()
  const [open, setOpen] = useState(false)
  const asDate = mode === 'time' ? timeStrToDate(value) : dateStrToDate(value)
  const toStr = mode === 'time' ? dateToTimeStr : dateToStr

  const commit = (_e, picked) => {
    if (Platform.OS !== 'ios') setOpen(false)
    if (picked) onChange(toStr(picked))
  }

  const label = value
    ? mode === 'time'
      ? value
      : niceDate(value)
    : placeholder

  return (
    <View style={{ gap: 6 }}>
      <Row>
        <Pressable
          onPress={() => setOpen(true)}
          style={{
            flex: 1,
            backgroundColor: t.surface2,
            borderWidth: t.borderW,
            borderColor: t.border,
            borderRadius: 14,
            paddingVertical: 12,
            paddingHorizontal: 14,
          }}
        >
          <T color={value ? t.text : t.muted}>{label}</T>
        </Pressable>
        {showToday ? <Btn title="Today" size="sm" onPress={() => onChange(todayKey())} /> : null}
      </Row>
      {value && mode === 'date' ? <T w="r" size={12} muted>{humanAgo(value)}</T> : null}

      {open && Platform.OS === 'ios' ? (
        <Modal transparent animationType="fade" onRequestClose={() => setOpen(false)}>
          <Pressable
            onPress={() => setOpen(false)}
            style={{ flex: 1, backgroundColor: 'rgba(10,10,25,0.45)', justifyContent: 'flex-end' }}
          >
            <Pressable onPress={() => {}} style={{ backgroundColor: t.surface, padding: 16, borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
              <DateTimePicker
                value={asDate}
                mode={mode}
                display="spinner"
                themeVariant={t.dark ? 'dark' : 'light'}
                onChange={(_e, picked) => picked && onChange(toStr(picked))}
              />
              <Btn title="Done" kind="primary" onPress={() => setOpen(false)} style={{ marginTop: 8 }} />
            </Pressable>
          </Pressable>
        </Modal>
      ) : null}

      {open && Platform.OS !== 'ios' ? (
        <DateTimePicker value={asDate} mode={mode} onChange={commit} />
      ) : null}
    </View>
  )
}

// full labelled field used on the People detail screen
export default function DateField({ label, value, onChange, showToday }) {
  return (
    <Field label={label}>
      <PickerField mode="date" value={value} onChange={onChange} showToday={showToday} />
    </Field>
  )
}
