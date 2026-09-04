import { useState } from 'react'
import { View } from 'react-native'
import { useStore } from '../store.js'
import { useTheme } from '../theme.js'
import { Screen, Card, Btn, T, H1, H2, Row, Input, Checkbox } from '../ui/kit.js'

function Empty({ emoji, text }) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 26, gap: 8 }}>
      <T size={30}>{emoji}</T>
      <T w="r" size={13} muted style={{ textAlign: 'center' }}>{text}</T>
    </View>
  )
}

export default function Goals() {
  const { state, dispatch } = useStore()
  const t = useTheme()
  const [goalText, setGoalText] = useState('')
  const [affText, setAffText] = useState('')

  const addGoal = () => {
    const v = goalText.trim()
    if (!v) return
    dispatch({ type: 'addGoal', text: v })
    setGoalText('')
  }
  const addAff = () => {
    const v = affText.trim()
    if (!v) return
    dispatch({ type: 'addAffirmation', text: v })
    setAffText('')
  }
  const done = state.goalList.filter((g) => g.done).length

  return (
    <Screen>
      <H1>Goals</H1>

      <Card style={{ gap: 12 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <H2>🎯 My goals</H2>
          {state.goalList.length > 0 ? <T w="r" size={12} muted>{done}/{state.goalList.length} done</T> : null}
        </Row>
        <Row gap={10}>
          <Input placeholder="Add a goal…" value={goalText} onChangeText={setGoalText} onSubmitEditing={addGoal} style={{ flex: 1 }} />
          <Btn title="Add" kind="primary" onPress={addGoal} />
        </Row>

        {state.goalList.length === 0 ? (
          <Empty emoji="🎯" text="No goals yet. What are you working toward?" />
        ) : (
          state.goalList.map((g, i) => (
            <Row
              key={g.id}
              gap={12}
              style={{ paddingVertical: 10, borderTopWidth: i ? 1 : 0, borderTopColor: t.border }}
            >
              <Checkbox on={g.done} onPress={() => dispatch({ type: 'toggleGoal', id: g.id })} />
              <Input
                value={g.text}
                onChangeText={(v) => dispatch({ type: 'editGoal', id: g.id, text: v })}
                style={{
                  flex: 1, backgroundColor: 'transparent', borderWidth: 0, paddingHorizontal: 0, paddingVertical: 0,
                  textDecorationLine: g.done ? 'line-through' : 'none', color: g.done ? t.muted : t.text,
                }}
              />
              <Btn title="✕" kind="ghost" size="sm" onPress={() => dispatch({ type: 'removeGoal', id: g.id })} />
            </Row>
          ))
        )}
      </Card>

      <Card style={{ gap: 12 }}>
        <H2>🪞 Affirmations</H2>
        <T w="r" size={12} muted>One shows on your home screen each day.</T>
        <Row gap={10}>
          <Input placeholder="I am…" value={affText} onChangeText={setAffText} onSubmitEditing={addAff} style={{ flex: 1 }} />
          <Btn title="Add" kind="primary" onPress={addAff} />
        </Row>

        {state.affirmations.length === 0 ? (
          <Empty emoji="🪞" text="Add a few kind words to yourself." />
        ) : (
          state.affirmations.map((a, i) => (
            <Row
              key={a.id}
              gap={10}
              style={{ paddingVertical: 10, borderTopWidth: i ? 1 : 0, borderTopColor: t.border }}
            >
              <T size={16}>“</T>
              <T w="r" size={14} style={{ flex: 1 }}>{a.text}</T>
              <Btn title="✕" kind="ghost" size="sm" onPress={() => dispatch({ type: 'removeAffirmation', id: a.id })} />
            </Row>
          ))
        )}
      </Card>
    </Screen>
  )
}
