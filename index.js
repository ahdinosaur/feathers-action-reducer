'use strict'

const handleActions = require('redux-actions').handleActions
const createActionTypes = require('feathers-action-types')
const mapValues = require('lodash.mapvalues')

const constants = require('./constants')

module.exports = createReducers

function createReducers (serviceName, config) {
  if (serviceName == null) {
    throw new Error('feathers-action-reducers: Expected serviceName as first argument.')
  }
  if (config == null) {
    throw new Error('feathers-action-reducers: Expected config as second argument.')
  }

  config = config || {}
  const key = config.key || constants.DEFAULT_KEY
  const update = config.update
  if (update == null) {
    throw new Error('feathers-action-reducers: Expected config.update. Try passing in `react-addons-update` or a compatible interface here (`update-object`, `tcomb/lib/update`)')
  }

  const actionTypes = createActionTypes(serviceName)

  const specCreators = {
    [actionTypes.findSuccess]: function (action) {
      return {
        records: action.payload.body.reduce(function (sofar, entity) {
          sofar[entity[key]] = { $set: entity }
          return sofar
        }, {})
      }
    },
    [actionTypes.getSuccess]: function (action) {
      return {
        records: {
          [action.payload.id]: { $set: action.payload.body }
        }
      }
    },
    [actionTypes.createStart]: function (action) {
      return {
        records: {
          [action.payload.cid]: { $set: action.payload.data }
        }
      }
    },
    [actionTypes.createSuccess]: function (action) {
      return {
        records: {
          [action.payload.cid]: { $set: undefined },
          [action.payload.body[key]]: { $set: action.payload.body }
        }
      }
    },
    [actionTypes.createError]: function (action) {
      return {
        records: {
          [action.payload.cid]: { $set: undefined }
        }
      }
    },
    [actionTypes.updateStart]: function (action) {
      return {
        records: {
          [action.payload.id]: { $set: action.payload.data }
        }
      }
    },
    [actionTypes.updateSuccess]: function (action) {
      return {
        records: {
          [action.payload.id]: { $set: action.payload.body }
        }
      }
    },
    [actionTypes.updateError]: function (action) {
      return {
        records: {
          [action.params.id]: { $set: undefined }
        }
      }
    },
    [actionTypes.patchStart]: function (action) {
      return {
        records: {
          [action.payload.id]: { $merge: action.payload.data }
        }
      }
    },
    [actionTypes.patchSuccess]: function (action) {
      return {
        records: {
          [action.payload.id]: { $merge: action.payload.body }
        }
      }
    },
    [actionTypes.patchError]: function (action) {
      return {
        records: {
          [action.params.id]: { $set: undefined }
        }
      }
    },
    [actionTypes.removeStart]: function (action) {
      return {
        records: {
          [action.payload.id]: { $set: undefined }
        }
      }
    },
    [actionTypes.removeSuccess]: function (action) {
      return {
        records: {
          [action.payload.id]: { $set: undefined }
        }
      }
    },
    [actionTypes.removeError]: function (action) {
      return {
        records: {
          [action.params.id]: { $set: undefined }
        }
      }
    }
  }

  const actionHandlers = mapValues(specCreators, (specCreator) => {
    return function (state, action) {
      if (state.records == null) {
        state = Object.assign(state, { records: {} })
      }
      return update(state, specCreator(action))
    }
  })

  return handleActions(actionHandlers)
}
