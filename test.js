"use strict";

const test = require('tape')
const createSyncActions = require('feathers-action-creators/sync')
const update = require('update-object')
const deepFilterObject = require('deep-filter-object')

const createReducer = require('./')

test('create', function (t) {
  const actions = createSyncActions('things')
  const reducer = createReducer('things', { update })

  let state = {}
  const startAction = actions.createStart('1234', { name: "honey" })
  state = reducer(state, startAction)
  deepEqual(t, state, { '1234': { name: "honey" }})
  state = reducer(state, actions.createSuccess({ id: 0, name: "honey" }, startAction.payload))
  deepEqual(t, state, { 0: { id: 0, name: "honey" }})
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
