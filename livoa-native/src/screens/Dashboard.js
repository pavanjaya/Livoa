import { useMemo, useState } from 'react'
import { View, Pressable } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useStore } from '../store.js'
import { useTheme } from '../theme.js'
import Ring from '../ui/Ring.js'
import ThemeArt from '../ui/ThemeArt.js'
import { Screen, Card, Btn, T, H1, H2, SectionLabel, Row, Avatar, Checkbox, Divider } from '../ui/kit.js'
import { todayKey, daysAgo, greeting } from '../lib/dates.js'
import { streakFor, METRIC_INFO, METRICS } from '../lib/streaks.js'
import { HANGOUT_THRESHOLD } from '../lib/notifications.js'
import { getInsights } from '../lib/ai.js'

const WARN = '#e5844d'

export default function Dashboard({ go, openPerson }) {
  const { state, dispatch } = useStore()
  const t = useTheme()
  const day = todayKey()
  const log = state.logs[day] || {}
  const w = state.widgets
  const g = state.goals

  const insights = useMemo(() => getInsights(state), [state.logs, state.goals, state.people])
  const [aiIdx, setAiIdx] = useState(0)
  const ins = insights[aiIdx % insights.length]

  const streaks = METRICS.map((m) => ({ m, ...streakFor(m, state.logs, state.goals) })).filter((s) => s.current > 0)

  const affList = state.affirmations
  const affirmation = affList.length ? affList[new Date().getDate() % affList.length].text : null

  const nudges = (state.people || [])
    .filter((p) => p.lastHangout && daysAgo(p.lastHangout) >= HANGOUT_THRESHOLD)
    .sort((a, b) => daysAgo(b.lastHangout) - daysAgo(a.lastHangout))

  const TriCard = ({ onPress, children, label }) => (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1, backgroundColor: t.surface, borderWidth: t.borderW, borderColor: t.border,
        borderRadius: t.radius, paddingVertical: 12, paddingHorizontal: 6, alignItems: 'center', gap: 8,
        ...(t.shadow || {}),
      }}
    >
      {children}
      <T size={11.5} color={t.muted}>{label}</T>
    </Pressable>
  )

  return (
    <Screen>
      {state.theme.picture && !t.wallpaper ? (
        <View style={{ borderRadius: t.radius, overflow: 'hidden', ...(t.shadow || {}) }}>
          <ThemeArt
            motif={t.motif}
            accent={t.accent}
            base={t.gradient ? t.gradient[0] : t.bg}
            width="100%"
            height={132}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.06)', 'rgba(0,0,0,0.44)']}
            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0 }}
          />
          <Row style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 14 }} gap={14}>
            <Avatar picture={state.profile.picture} emoji={state.profile.avatar} size={52} />
            <View style={{ flex: 1 }}>
              <T w="r" size={12} color="rgba(255,255,255,0.9)">{greeting()}</T>
              <T size={22} color="#fff">{state.profile.name}</T>
            </View>
          </Row>
        </View>
      ) : (
        <Card>
          <Row gap={14}>
            <Avatar picture={state.profile.picture} emoji={state.profile.avatar} size={52} />
            <View style={{ flex: 1 }}>
              <T w="r" size={12} muted>{greeting()}</T>
              <T size={22}>{state.profile.name}</T>
            </View>
          </Row>
        </Card>
      )}

      {(w.sleep || w.water || w.screen) && (
        <>
          <SectionLabel>Today</SectionLabel>
          <Row gap={10} style={{ alignItems: 'stretch' }}>
            {w.sleep && (
              <TriCard label="Sleep" onPress={() => go('habits')}>
                <Ring value={log.sleepHours || 0} max={g.sleepMinHours + 1.5} size={78} stroke={8}>
                  <T size={19}>{log.sleepHours ? `${log.sleepHours}h` : '—'}</T>
                  <T size={10} muted>💤</T>
                </Ring>
              </TriCard>
            )}
            {w.water && (
              <TriCard label="Tap +1 glass" onPress={() => dispatch({ type: 'addWater', date: day, delta: 1 })}>
                <Ring value={log.water || 0} max={g.waterTargetGlasses} size={78} stroke={8}>
                  <T size={19}>{log.water || 0}</T>
                  <T size={10} muted>/ {g.waterTargetGlasses} 💧</T>
                </Ring>
              </TriCard>
            )}
            {w.screen && (
              <TriCard label="Screen" onPress={() => go('habits')}>
                <Ring
                  value={Math.min(log.screen || 0, g.screenLimitHours)}
                  max={g.screenLimitHours}
                  size={78}
                  stroke={8}
                  color={(log.screen || 0) > g.screenLimitHours ? WARN : undefined}
                >
                  <T size={19}>{log.screen != null ? `${log.screen}h` : '—'}</T>
                  <T size={10} muted>≤ {g.screenLimitHours}h 📵</T>
                </Ring>
              </TriCard>
            )}
          </Row>
        </>
      )}

      {w.livoaAI && ins && (
        <Card style={{ borderColor: t.accent }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <T size={12} color={t.accent} style={{ letterSpacing: 0.6, textTransform: 'uppercase' }}>✦ Livoa AI</T>
            {insights.length > 1 && (
              <Btn title="another →" kind="ghost" size="sm" onPress={() => setAiIdx((i) => (i + 1) % insights.length)} />
            )}
          </Row>
          <T size={14} style={{ marginTop: 10, marginBottom: 6 }}>
            {ins.tone === 'cheer' ? 'Livoa says' : 'Livoa noticed'} {ins.emoji}
          </T>
          {ins.lines.map((l, i) => (
            <T key={i} size={15} color={i === 0 ? t.text : t.muted} style={{ lineHeight: 22 }}>{l}</T>
          ))}
          {ins.suggestion && (
            <View style={{ marginTop: 12, padding: 12, borderRadius: 14, backgroundColor: t.accentSoft }}>
              <T size={11} color={t.muted} style={{ textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>
                Tiny suggestion
              </T>
              <T size={15} style={{ lineHeight: 22 }}>{ins.suggestion}</T>
            </View>
          )}
        </Card>
      )}

      {w.affirmation && affirmation && (
        <Card>
          <SectionLabel style={{ marginBottom: 8 }}>Affirmation of the day</SectionLabel>
          <T size={18} style={{ lineHeight: 25 }}>“{affirmation}”</T>
        </Card>
      )}

      {w.streaks && (
        <Card>
          <Row style={{ justifyContent: 'space-between', marginBottom: 4 }}>
            <H2>Streaks</H2>
            <Btn title="Log →" kind="ghost" size="sm" onPress={() => go('habits')} />
          </Row>
          {streaks.length === 0 ? (
            <T w="r" size={12} muted style={{ paddingVertical: 8 }}>No streaks yet — log a habit today to start one. 🌱</T>
          ) : (
            streaks.map((s, i) => (
              <View key={s.m} style={{ borderTopWidth: i ? 1 : 0, borderTopColor: t.border }}>
                <Row gap={10} style={{ paddingVertical: 9 }}>
                  <T size={18} style={{ width: 26, textAlign: 'center' }}>
                    {s.current >= 7 ? '🔥' : METRIC_INFO[s.m].emoji}
                  </T>
                  <T size={15}>{s.current}</T>
                  <T w="r" size={13} muted style={{ flex: 1 }}>{METRIC_INFO[s.m].label}</T>
                  {s.best > s.current ? <T w="r" size={12} muted>best {s.best}</T> : null}
                </Row>
              </View>
            ))
          )}
        </Card>
      )}

      {w.people && nudges.length > 0 && (
        <Card>
          <H2 style={{ marginBottom: 8 }}>Reach out 👀</H2>
          {nudges.slice(0, 3).map((p) => (
            <Row key={p.id} gap={12} style={{ paddingVertical: 8 }}>
              <Avatar emoji={p.emoji} size={40} />
              <View style={{ flex: 1 }}>
                <T size={14}>{p.name}</T>
                <T w="r" size={12.5} color={WARN}>Last hangout {daysAgo(p.lastHangout)} days ago</T>
              </View>
              <Btn title="Open" size="sm" onPress={() => openPerson(p.id)} />
            </Row>
          ))}
        </Card>
      )}

      {w.goals && state.goalList.length > 0 && (
        <Card>
          <Row style={{ justifyContent: 'space-between', marginBottom: 8 }}>
            <H2>Goals</H2>
            <Btn title="All →" kind="ghost" size="sm" onPress={() => go('goals')} />
          </Row>
          {state.goalList.slice(0, 3).map((gl) => (
            <Row key={gl.id} gap={12} style={{ paddingVertical: 8 }}>
              <Checkbox on={gl.done} onPress={() => dispatch({ type: 'toggleGoal', id: gl.id })} />
              <T w="r" size={14} style={{ flex: 1, textDecorationLine: gl.done ? 'line-through' : 'none', color: gl.done ? t.muted : t.text }}>
                {gl.text}
              </T>
            </Row>
          ))}
        </Card>
      )}
    </Screen>
  )
}
