import { useEffect } from 'react'
import { View, Pressable } from 'react-native'
import { useStore } from '../store.js'
import { useTheme } from '../theme.js'
import { Screen, Card, Btn, T, H1, Row } from '../ui/kit.js'
import { KIND_STYLE } from '../lib/notifications.js'

function ago(ts) {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

export default function Inbox({ back, openPerson }) {
  const { state, dispatch } = useStore()
  const t = useTheme()
  const list = state.notifications

  useEffect(() => {
    const id = setTimeout(() => dispatch({ type: 'readAllNotifs' }), 700)
    return () => clearTimeout(id)
  }, [dispatch])

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between' }}>
        <Btn title="← Home" kind="ghost" size="sm" onPress={back} />
        {list.length > 0 ? (
          <Btn title="Clear" kind="ghost" size="sm" onPress={() => dispatch({ type: 'clearNotifs' })} />
        ) : null}
      </Row>
      <H1>Notifications</H1>

      {list.length === 0 ? (
        <Card>
          <View style={{ alignItems: 'center', paddingVertical: 26, gap: 8 }}>
            <T size={30}>🔔</T>
            <T w="r" size={13} muted style={{ textAlign: 'center' }}>Nothing yet. Streak wins and gentle nudges land here.</T>
          </View>
        </Card>
      ) : (
        <Card>
          {list.map((n, i) => (
            <Pressable
              key={n.id}
              onPress={() => n.personId && openPerson(n.personId)}
              style={{ borderTopWidth: i ? 1 : 0, borderTopColor: t.border }}
            >
              <Row gap={12} style={{ paddingVertical: 13, alignItems: 'flex-start' }}>
                <T size={20} style={{ width: 30, textAlign: 'center' }}>{n.emoji}</T>
                <View style={{ flex: 1 }}>
                  <Row gap={7}>
                    <T size={14}>{n.title}</T>
                    {!n.read ? <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: t.accent }} /> : null}
                  </Row>
                  <T w="r" size={13} muted style={{ marginTop: 2, lineHeight: 19 }}>{n.body}</T>
                  <T w="r" size={11} muted style={{ marginTop: 4 }}>
                    {(KIND_STYLE[n.kind] || {}).label || 'Livoa'} · {ago(n.ts)}
                  </T>
                </View>
              </Row>
            </Pressable>
          ))}
        </Card>
      )}

      <T w="r" size={12} muted style={{ textAlign: 'center', paddingHorizontal: 20 }}>
        Streak ended? Life happens. Start again — we don't do guilt here. 🤍
      </T>
    </Screen>
  )
}
