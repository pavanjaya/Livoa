import { View } from 'react-native'
import { T, Btn, Field, Row } from './kit.js'
import { useTheme } from '../theme.js'
import { humanAgo, todayKey } from '../lib/dates.js'

// On web the OS date/time picker isn't available, so use the browser's
// native <input type="date"> / <input type="time"> — they already speak
// our storage format (YYYY-MM-DD and HH:MM).
export function PickerField({ mode = 'date', value, onChange, showToday }) {
  const t = useTheme()
  return (
    <View style={{ gap: 6 }}>
      <Row>
        <View style={{ flex: 1 }}>
          <input
            type={mode === 'time' ? 'time' : 'date'}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              background: t.surface2,
              border: `${t.borderW}px solid ${t.border}`,
              borderRadius: 14,
              padding: '12px 14px',
              fontSize: 14,
              fontFamily: t.fonts?.bold || 'inherit',
              fontWeight: 700,
              color: t.text,
              colorScheme: t.dark ? 'dark' : 'light',
              outline: 'none',
            }}
          />
        </View>
        {showToday ? <Btn title="Today" size="sm" onPress={() => onChange(todayKey())} /> : null}
      </Row>
      {value && mode === 'date' ? <T w="r" size={12} muted>{humanAgo(value)}</T> : null}
    </View>
  )
}

export default function DateField({ label, value, onChange, showToday }) {
  return (
    <Field label={label}>
      <PickerField mode="date" value={value} onChange={onChange} showToday={showToday} />
    </Field>
  )
}
