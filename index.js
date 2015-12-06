// TODO
// - error handling
// - status (busy)
//
const { handleActions } = require('redux-actions')
const createActionTypes = require('feathers-action-types')
const mapValues = require('lodash.mapvalues')

const { DEFAULT_KEY } = require('./constants')

module.exports = createReducers(serviceName, config) {
  if (service == null) throw new Error('feathers-action-reducers: Expected service as first argument.')
  if (config == null) throw new Error('feathers-action-reducers: Expected config as second argument.')

  const key = config.key || DEFAULT_KEY
  const update = config.update
  if (update == null) throw new Error('feathers-action-reducers: Expected config.update. Try passing in `react-addons-update` or a compatible interface here')

  const actionTypes = createActionTypes(serviceName)

  const specCreators = {
    [actionTypes.findSuccess]: function (action) {
      return {
        records: action.payload.body.reduce(function (sofar, entity) {
          sofar[entity[key]] = { $set: entity }
        }, {})
      }
    },
    [actionTypes.getSuccess]: function (state, action) {
      return {
        [action.payload.id]: { $set: action.payload.body }
      }
    },
    [actionTypes.createStart]: function (state, action) {
      return {
        [action.payload.params.cid]: { $set: action.payload.data }
      }
    },
    [actionTypes.createSuccess]: function (state, action) {
      return {
        [action.payload.params.cid]: { $set: undefined },
        [action.payload.body[key]]: { $set: action.payload.body }
      }
    },
    [actionTypes.createError]: function (state, action) {
      return {
        [action.payload.params.cid]: { $set: undefined }
      }
    },
    [actionTypes.updateStart]: function (state, action) {
      return {
        [action.payload.id]: { $set: action.payload.data }
      }
    },
    [actionTypes.updateSuccess]: function (state, action) {
      return {
        [action.payload.id]: { $set: action.payload.body }
      }
    },
    [actionTypes.updateError]: function (state, action) {
      return {
        [action.params.id]: { $set: undefined }
      }
    },
  }

  const actionHandlers = mapValues(specCreators, (specCreator) => {
    return function (state, action) {
      return update(state, specCreator(action))
    }
  })

  return handleActions(actionHandlers)
}
