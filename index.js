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
    throw new Error('feathers-action-reducers: Expected config.update. Try passing in `tcomb/lib/update` or a compatible interface here')
  }

  const actionTypes = createActionTypes(serviceName)

  const specCreators = {
    [actionTypes.findStart]: function (action) {
      return startSpec(action)
    },
    [actionTypes.findSuccess]: function (action) {
      return Object.assign({
        records: action.payload.body.reduce(function (sofar, entity) {
          sofar[entity[key]] = { $set: entity }
          return sofar
        }, {})
      }, successSpec(action))
    },
    [actionTypes.findError]: function (action) {
      return errorSpec(action)
    },
    [actionTypes.getStart]: function (action) {
      return startSpec(action)
    },
    [actionTypes.getSuccess]: function (action) {
      return Object.assign({
        records: {
          [action.payload.id]: { $set: action.payload.body }
        }
      }, successSpec(action))
    },
    [actionTypes.getError]: function (action) {
      return errorSpec(action)
    },
    [actionTypes.createStart]: function (action) {
      return Object.assign({
        records: {
          [action.payload.cid]: { $set: action.payload.data }
        }
      }, startSpec(action))
    },
    [actionTypes.createSuccess]: function (action) {
      return Object.assign({
        records: {
          $remove: [action.payload.cid],
          [action.payload.body[key]]: { $set: action.payload.body }
        }
      }, successSpec(action))
    },
    [actionTypes.createError]: function (action) {
      return Object.assign({
        records: {
          $remove: [action.payload.cid]
        }
      }, errorSpec(action))
    },
    [actionTypes.updateStart]: function (action) {
      return Object.assign({
        records: {
          [action.payload.id]: { $set: action.payload.data }
        }
      }, startSpec(action))
    },
    [actionTypes.updateSuccess]: function (action) {
      return Object.assign({
        records: {
          [action.payload.id]: { $set: action.payload.body }
        }
      }, successSpec(action))
    },
    [actionTypes.updateError]: function (action) {
      return Object.assign({
        // TODO reset to before update
        records: {
          $remove: [action.payload.id]
        }
      }, errorSpec(action))
    },
    [actionTypes.patchStart]: function (action) {
      return Object.assign({
        records: {
          [action.payload.id]: { $merge: action.payload.data }
        }
      }, startSpec(action))
    },
    [actionTypes.patchSuccess]: function (action) {
      return Object.assign({
        records: {
          [action.payload.id]: { $merge: action.payload.body }
        }
      }, successSpec(action))
    },
    [actionTypes.patchError]: function (action) {
      return Object.assign({
        // TODO reset to before patch
        records: {
          $remove: [action.payload.id]
        }
      }, errorSpec(action))
    },
    [actionTypes.removeStart]: function (action) {
      return Object.assign({
        records: {
          $remove: [action.payload.id]
        }
      }, startSpec(action))
    },
    [actionTypes.removeSuccess]: function (action) {
      return Object.assign({
        records: {
          $remove: [action.payload.id]
        }
      }, successSpec(action))
    },
    [actionTypes.removeError]: function (action) {
      return Object.assign({
        // TODO reset to before remove
        records: {
          $remove: [action.payload.id]
        }
      }, errorSpec(action))
    }
  }

  const actionHandlers = mapValues(specCreators, (specCreator) => {
    return function (state, action) {
      return update(state, specCreator(action))
    }
  })

  return handleActions(actionHandlers, {
    records: {}
  })
}

function startSpec (action) {
  return {
    pending: { $set: { [action.payload.cid]: action } }
  }
}

function successSpec (action) {
  return {
    pending: { $remove: [action.payload.cid] },
    success: { $set: { [action.payload.cid]: action } }
  }
}

function errorSpec (action) {
  return {
    pending: { $remove: [action.payload.cid] },
    error: { $set: { [action.payload.cid]: action } }
  }
}
