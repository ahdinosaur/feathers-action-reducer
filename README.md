# feathers-action-reducer

create a [redux reducer](http://redux.js.org/docs/basics/Reducers.html) to handle [feathers actions](https://github.com/ahdinosaur/feathers-action-creators)

## install

with [npm](https://npmjs.com):

```shell
npm install --save feathers-action-reducer
```

## api

### `createReducer(serviceName, config)`

given the following arguments:

- `serviceName`: a **required** `String` describing the name of the [feathers service](http://feathersjs.com/docs/#toc10) (e.g. 'todos')
- `config`: an **required** `Object`
  - `config.update`: a **required** `Function` that implements an interface compatible to `react-addons-update`, such as `update-object` or `tcomb/lib/update`
  - `config.key`: an *optional* `String` that describes the default key (e.g. 'id')

returns a [redux reducer](http://redux.js.org/docs/basics/Reducers.html) `Function`

## TODO

- [ ] keep track of action status (busy, pending, ...)
- [ ] handle errors
