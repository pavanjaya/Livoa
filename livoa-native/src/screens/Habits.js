import { useState } from 'react'
import { View } from 'react-native'
import { useStore } from '../store.js'
import { useTheme } from '../theme.js'
import Ring from '../ui/Ring.js'
import Sheet from '../ui/Sheet.js'
import { PickerField } from '../ui/DateField.js'
import { Screen, Card, Btn, Chip, T, H1, H2, Field, Row, Stepper, Input } from '../ui/kit.js'
import { todayKey, addDays, parseKey } from '../lib/dates.js'
import { streakFor, dayPass, METRIC_INFO, METRICS } from '../lib/streaks.js'

const WARN = '#e5844d'

export default function Habits() {
  const { state, dispatch } = useStore()
  const t = useTheme()
  const day = todayKey()
  const log = state.logs[day] || {}
  const g = state.goals
  const [editGoals, setEditGoals] = useState(false)

  const set = (patch) => dispatch({ type: 'logDay', date: day, patch })
  const setGoal = (patch) => dispatch({ type: 'setGoals', patch })
  const week = Array.from({ length: 7 }, (_, i) => addDays(day, -(6 - i)))

  return (
    <Screen>
      <H1>Habits</H1>

      {/* Sleep */}
      <Card style={{ gap: 12 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <H2>💤 Sleep</H2>
          <Btn title="Targets" kind="ghost" size="sm" onPress={() => setEditGoals(true)} />
        </Row>
        <Row gap={16} style={{ alignItems: 'flex-start' }}>
          <Ring value={log.sleepHours || 0} max={g.sleepMinHours + 2} size={96}>
            <T size={19}>{log.sleepHours || 0}h</T>
            <T size={10} muted>goal {g.sleepMinHours}h+</T>
          </Ring>
          <View style={{ flex: 1, gap: 10 }}>
            <Field label="Hours slept">
              <Stepper value={log.sleepHours || 0} onChange={(v) => set({ sleepHours: v })} step={0.5} max={16} suffix="h" />
            </Field>
            <Field label="Bedtime">
              <PickerField mode="time" value={log.bedtime || ''} onChange={(v) => set({ bedtime: v })} placeholder="Set time" />
              <T w="r" size={12} muted>Before {g.bedtimeLimit} keeps your “asleep before 11” streak.</T>
            </Field>
          </View>
        </Row>
      </Card>

      {/* Water */}
      <Card style={{ gap: 12 }}>
        <H2>💧 Water</H2>
        <Row gap={16} style={{ alignItems: 'flex-start' }}>
          <Ring value={log.water || 0} max={g.waterTargetGlasses} size={96}>
            <T size={19}>{log.water || 0}</T>
            <T size={10} muted>/ {g.waterTargetGlasses} glasses</T>
          </Ring>
          <View style={{ flex: 1, gap: 12 }}>
            <Stepper value={log.water || 0} onChange={(v) => set({ water: v })} max={30} />
            <Row gap={8} style={{ flexWrap: 'wrap' }}>
              <Chip label="+1 glass" onPress={() => dispatch({ type: 'addWater', date: day, delta: 1 })} />
              <Chip label="+2" onPress={() => dispatch({ type: 'addWater', date: day, delta: 2 })} />
              <Chip label="reset" onPress={() => set({ water: 0 })} />
            </Row>
          </View>
        </Row>
      </Card>

      {/* Screen time */}
      <Card style={{ gap: 12 }}>
        <H2>📵 Screen time</H2>
        <Row gap={16} style={{ alignItems: 'flex-start' }}>
          <Ring
            value={Math.min(log.screen || 0, g.screenLimitHours)}
            max={g.screenLimitHours}
            size={96}
            color={(log.screen || 0) > g.screenLimitHours ? WARN : undefined}
          >
            <T size={19}>{log.screen != null ? `${log.screen}h` : '0h'}</T>
            <T size={10} muted>limit {g.screenLimitHours}h</T>
          </Ring>
          <View style={{ flex: 1, gap: 10 }}>
            <Stepper value={log.screen || 0} onChange={(v) => set({ screen: v })} step={0.5} max={24} suffix="h" />
            {(log.screen || 0) > g.screenLimitHours ? (
              <T w="r" size={12} color={WARN}>Over your limit today — tomorrow's a fresh start.</T>
            ) : null}
          </View>
        </Row>
      </Card>

      {/* Streaks + week strip */}
      <Card>
        <H2 style={{ marginBottom: 10 }}>This week</H2>
        {METRICS.map((m, idx) => {
          const s = streakFor(m, state.logs, state.goals)
          return (
            <View key={m} style={{ paddingVertical: 8, borderTopWidth: idx ? 1 : 0, borderTopColor: t.border }}>
              <Row style={{ justifyContent: 'space-between' }}>
                <T size={13}>{METRIC_INFO[m].emoji} {METRIC_INFO[m].label}</T>
                <T w="r" size={12} muted>{s.current} {METRIC_INFO[m].unit} · best {s.best}</T>
              </Row>
              <Row gap={6} style={{ marginTop: 6 }}>
                {week.map((k) => {
                  const v = dayPass(state.logs[k], state.goals)[m]
                  const bg = v === true ? t.accent : v === false ? '#e5844d55' : t.track
                  return (
                    <View key={k} style={{ flex: 1 }}>
                      <View style={{ height: 26, borderRadius: 8, backgroundColor: bg }} />
                      <T w="r" size={10} muted style={{ textAlign: 'center', marginTop: 3 }}>
                        {parseKey(k).toLocaleDateString(undefined, { weekday: 'narrow' })}
                      </T>
                    </View>
                  )
                })}
              </Row>
            </View>
          )
        })}
      </Card>

      <Sheet open={editGoals} onClose={() => setEditGoals(false)} title="Targets">
        <View style={{ gap: 14, marginTop: 10 }}>
          <Field label="Minimum sleep (hours)">
            <Input
              keyboardType="decimal-pad"
              value={String(g.sleepMinHours)}
              onChangeText={(v) => setGoal({ sleepMinHours: parseFloat(v) || 0 })}
            />
          </Field>
          <Field label="Bedtime limit">
            <PickerField mode="time" value={g.bedtimeLimit} onChange={(v) => setGoal({ bedtimeLimit: v })} />
          </Field>
          <Field label="Water target (glasses)">
            <Input
              keyboardType="number-pad"
              value={String(g.waterTargetGlasses)}
              onChangeText={(v) => setGoal({ waterTargetGlasses: parseInt(v, 10) || 0 })}
            />
          </Field>
          <Field label="Screen time limit (hours)">
            <Input
              keyboardType="decimal-pad"
              value={String(g.screenLimitHours)}
              onChangeText={(v) => setGoal({ screenLimitHours: parseFloat(v) || 0 })}
            />
          </Field>
          <Btn title="Done" kind="primary" onPress={() => setEditGoals(false)} />
        </View>
      </Sheet>
    </Screen>
  )
}
