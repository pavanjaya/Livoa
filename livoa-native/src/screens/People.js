import { useState } from 'react'
import { View, Pressable } from 'react-native'
import { useStore } from '../store.js'
import { useTheme } from '../theme.js'
import Sheet from '../ui/Sheet.js'
import DateField, { PickerField } from '../ui/DateField'
import { Screen, Card, Btn, Chip, T, H1, H2, Row, Field, Input, Avatar } from '../ui/kit.js'
import { humanAgo, niceDate, daysAgo, daysUntilBirthday, ageAtNextBirthday } from '../lib/dates.js'
import { HANGOUT_THRESHOLD } from '../lib/notifications.js'

const WARN = '#e5844d'
const EMOJIS = ['🙂', '🧑🏽', '👩🏻', '🧔🏾', '👵🏼', '👶🏻', '🦸', '🧑🏻‍🎤', '🐰', '🌻', '⭐', '🐥']

export default function People({ personId, setPersonId }) {
  const { state, dispatch } = useStore()
  const t = useTheme()
  const [addOpen, setAddOpen] = useState(false)
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('🙂')

  const person = state.people.find((p) => p.id === personId)
  if (person) return <Detail person={person} back={() => setPersonId(null)} />

  const add = () => {
    const v = name.trim()
    if (!v) return
    dispatch({ type: 'addPerson', person: { name: v, emoji } })
    setName('')
    setEmoji('🙂')
    setAddOpen(false)
  }

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between' }}>
        <H1>People</H1>
        <Btn title="+ Add" kind="primary" size="sm" onPress={() => setAddOpen(true)} />
      </Row>

      {state.people.length === 0 ? (
        <Card>
          <View style={{ alignItems: 'center', paddingVertical: 26, gap: 8 }}>
            <T size={30}>👥</T>
            <T w="r" size={13} muted style={{ textAlign: 'center' }}>
              Add the people who matter. Livoa nudges you when it's been too long.
            </T>
          </View>
        </Card>
      ) : (
        <Card>
          {state.people.map((p, i) => {
            const overdue = p.lastHangout && daysAgo(p.lastHangout) >= HANGOUT_THRESHOLD
            const bd = daysUntilBirthday(p.birthday)
            const sub =
              bd != null && bd <= 7
                ? `🎂 birthday ${bd === 0 ? 'today' : `in ${bd}d`}`
                : p.lastHangout
                  ? `Last hangout ${humanAgo(p.lastHangout)}`
                  : 'No hangouts logged'
            return (
              <Pressable
                key={p.id}
                onPress={() => setPersonId(p.id)}
                style={{ borderTopWidth: i ? 1 : 0, borderTopColor: t.border }}
              >
                <Row gap={12} style={{ paddingVertical: 12 }}>
                  <Avatar emoji={p.emoji} size={44} />
                  <View style={{ flex: 1 }}>
                    <T size={14}>{p.name}</T>
                    <T w="r" size={12.5} color={overdue ? WARN : t.muted}>{sub}</T>
                  </View>
                  <T size={16} muted>›</T>
                </Row>
              </Pressable>
            )
          })}
        </Card>
      )}

      <Sheet open={addOpen} onClose={() => setAddOpen(false)} title="Add someone">
        <View style={{ gap: 14, marginTop: 10 }}>
          <Input placeholder="Name" value={name} onChangeText={setName} onSubmitEditing={add} />
          <Row gap={10} style={{ flexWrap: 'wrap' }}>
            {EMOJIS.map((e) => (
              <Chip key={e} label={e} on={emoji === e} onPress={() => setEmoji(e)} />
            ))}
          </Row>
          <Btn title="Add person" kind="primary" onPress={add} />
        </View>
      </Sheet>
    </Screen>
  )
}

function Detail({ person, back }) {
  const { dispatch } = useStore()
  const t = useTheme()
  const [mem, setMem] = useState('')
  const p = person
  const upd = (patch) => dispatch({ type: 'updatePerson', id: p.id, patch })

  const overdue = p.lastHangout && daysAgo(p.lastHangout) >= HANGOUT_THRESHOLD
  const bd = daysUntilBirthday(p.birthday)
  const age = ageAtNextBirthday(p.birthday)

  const addMem = () => {
    const v = mem.trim()
    if (!v) return
    dispatch({ type: 'addMemory', id: p.id, text: v })
    setMem('')
  }

  return (
    <Screen>
      <Row>
        <Btn title="← People" kind="ghost" size="sm" onPress={back} />
      </Row>

      <Card>
        <Row gap={14}>
          <Avatar emoji={p.emoji} size={56} />
          <View style={{ flex: 1 }}>
            <Input
              value={p.name}
              onChangeText={(v) => upd({ name: v })}
              style={{ backgroundColor: 'transparent', borderWidth: 0, paddingHorizontal: 0, paddingVertical: 0, fontSize: 22 }}
            />
            {overdue ? <T w="r" size={12} color={WARN}>You haven't hung out in {daysAgo(p.lastHangout)} days 👀</T> : null}
            {bd != null && bd <= 30 ? (
              <T w="r" size={12} muted>
                🎂 {bd === 0 ? 'Birthday today!' : `Birthday in ${bd} days`}{age ? ` · turning ${age}` : ''}
              </T>
            ) : null}
          </View>
        </Row>
      </Card>

      <Card style={{ gap: 12 }}>
        <Field label="🎂 Birthday">
          <PickerField mode="date" value={p.birthday || ''} onChange={(v) => upd({ birthday: v })} placeholder="Set date" />
        </Field>
        <DateField label="🧍 Last hangout" value={p.lastHangout} onChange={(v) => upd({ lastHangout: v })} showToday />
        <DateField label="📞 Last call" value={p.lastCall} onChange={(v) => upd({ lastCall: v })} showToday />
      </Card>

      <Card style={{ gap: 12 }}>
        <H2>💭 Memories</H2>
        <Row gap={10}>
          <Input
            placeholder="Something you want to remember…"
            value={mem}
            onChangeText={setMem}
            onSubmitEditing={addMem}
            style={{ flex: 1 }}
          />
          <Btn title="Add" kind="primary" onPress={addMem} />
        </Row>
        {(p.memories || []).length === 0 ? (
          <T w="r" size={12} muted>No memories yet.</T>
        ) : (
          p.memories.map((m, i) => (
            <Row key={m.id} gap={10} style={{ paddingVertical: 10, borderTopWidth: i ? 1 : 0, borderTopColor: t.border }}>
              <View style={{ flex: 1 }}>
                <T w="r" size={14}>{m.text}</T>
                <T w="r" size={11} muted>{niceDate(m.date)}</T>
              </View>
              <Btn title="✕" kind="ghost" size="sm" onPress={() => dispatch({ type: 'removeMemory', id: p.id, memId: m.id })} />
            </Row>
          ))
        )}
      </Card>

      <Btn
        title={`Remove ${p.name}`}
        kind="ghost"
        onPress={() => {
          dispatch({ type: 'removePerson', id: p.id })
          back()
        }}
        style={{ borderColor: 'transparent' }}
      >
        <T size={14} color="#e5484d">Remove {p.name}</T>
      </Btn>
    </Screen>
  )
}
