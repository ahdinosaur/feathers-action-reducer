'use strict'

const test = require('tape')
const createSyncActions = require('feathers-action-creators/sync')
const update = require('update-object')
const deepFilterObject = require('deep-filter-object')
const objectValues = require('object-values')

const createReducer = require('./')

test('find', function (t) {
  const actions = createSyncActions('things')
  const reducer = createReducer('things', { update })

  let state
  const cid = '1234'
  const things = {
    0: { id: 0, name: 'honey' },
    1: { id: 1, name: 'tea' },
    2: { id: 2, mame: 'mug' }
  }
  const startAction = actions.findStart(cid, { $limit: 3 })
  state = reducer(state, startAction)
  deepEqual(t, state.records, {})
  state = reducer(state, actions.findSuccess(objectValues(things), startAction.payload))
  deepEqual(t, state.records, things)
  t.end()
})

test('get', function (t) {
  const actions = createSyncActions('things')
  const reducer = createReducer('things', { update })

  let state
  const cid = '1234'
  const startAction = actions.getStart(cid, 0)
  state = reducer(state, startAction)
  deepEqual(t, state.records, {})
  state = reducer(state, actions.getSuccess({ id: 0, name: 'honey' }, startAction.payload))
  deepEqual(t, state.records, { 0: { id: 0, name: 'honey' } })
  t.end()
})

test('create', function (t) {
  const actions = createSyncActions('things')
  const reducer = createReducer('things', { update })

  let state
  const cid = '1234'
  const startAction = actions.createStart(cid, { name: 'honey' })
  state = reducer(state, startAction)
  deepEqual(t, state.records, { [cid]: { name: 'honey' } })
  state = reducer(state, actions.createSuccess({ id: 0, name: 'honey' }, startAction.payload))
  deepEqual(t, state.records, { 0: { id: 0, name: 'honey' } })
  t.end()
})

test('update', function (t) {
  const actions = createSyncActions('things')
  const reducer = createReducer('things', { update })

  let state = { records: { 0: { id: 0, name: 'honey', description: 'sweet and delicious.' } } }
  const cid = '1234'
  const startAction = actions.updateStart(cid, 0, { id: 0, name: 'bee spit' })
  state = reducer(state, startAction)
  deepEqual(t, state.records, { 0: { id: 0, name: 'bee spit' } })
  state = reducer(state, actions.updateSuccess({ id: 0, name: 'bee spit' }, startAction.payload))
  deepEqual(t, state.records, { 0: { id: 0, name: 'bee spit' } })
  t.end()
})

test('patch', function (t) {
  const actions = createSyncActions('things')
  const reducer = createReducer('things', { update })

  let state = { records: { 0: { id: 0, name: 'honey', description: 'sweet and delicious.' } } }
  const cid = '1234'
  const startAction = actions.patchStart(cid, 0, { id: 0, name: 'bee spit' })
  state = reducer(state, startAction)
  deepEqual(t, state.records, { 0: { id: 0, name: 'bee spit', description: 'sweet and delicious.' } })
  state = reducer(state, actions.patchSuccess({ id: 0, name: 'bee spit' }, startAction.payload))
  deepEqual(t, state.records, { 0: { id: 0, name: 'bee spit', description: 'sweet and delicious.' } })
  t.end()
})

test('remove', function (t) {
  const actions = createSyncActions('things')
  const reducer = createReducer('things', { update })

  let state = { records: { 0: { id: 0, name: 'honey' } } }
  const cid = '1234'
  const startAction = actions.removeStart(cid, 0)
  state = reducer(state, startAction)
  deepEqual(t, state.records, {})
  state = reducer(state, actions.removeSuccess({ id: 0, name: 'honey' }, startAction.payload))
  deepEqual(t, state.records, {})
  t.end()
})

function deepEqual (t, actual, expected, message) {
  t.deepEqual(
    deepFilterObject(actual, isValue),
    deepFilterObject(expected, isValue),
    message
  )
}

function isValue (val) {
  return val != null
}
