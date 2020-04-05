// Library code

function createStore(reducer) {
  // The store should have four parts
  // 1. The state
  // 2. Get the state.
  // 3. Listen to changes on the state.
  // 4. Update the state

  let state
  let listeners = []

  const getState = () => state

  const subscribe = (listener) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }

  const dispatch = (action) => {
    state = reducer(state, action)
    listeners.forEach((listener) => listener())
  }

  return {
    getState,
    subscribe,
    dispatch
  }
}


// App Code


/** CONSTANTS */

const ADD_TODO = 'ADD_TODO'
const REMOVE_TODO = 'REMOVE_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'
const ADD_GOAL = 'ADD_GOAL'
const REMOVE_GOAL = 'REMOVE_GOAL'

/** ACTION CREATORS */

function addTodoAction(todo) {
  return {
    type: ADD_TODO,
    todo,
  }
}

function removeTodoAction(id) {
  return {
    type: REMOVE_TODO,
    id,
  }
}

function toggleTodoAction(id) {
  return {
    type: TOGGLE_TODO,
    id,
  }
}

function addGoalAction(goal) {
  return {
    type: ADD_GOAL,
    goal,
  }
}

function removeGoalAction(id) {
  return {
    type: REMOVE_GOAL,
    id,
  }
}


function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return state.concat([action.todo])
    case REMOVE_TODO:
      return state.filter((todo) => todo.id !== action.id)
    case TOGGLE_TODO:
      return state.map((todo) => todo.id !== action.id ? todo : Object.assign({}, todo, { complete: !todo.complete }))
    default:
      return state
  }
}

function goals(state = [], action) {
  switch (action.type) {
    case ADD_GOAL:
      return state.concat([action.goal])
    case REMOVE_GOAL:
      return state.filter((goal) => goal.id !== action.id)
    default:
      return state
  }
}

function app(state = {}, action) {
  return {
    todos: todos(state.todos, action),
    goals: goals(state.goals, action)
  }
}

/*
Passing the root reducer to our store since our createStore function can only take one reducer.
*/

const store = createStore(app)

store.subscribe(() => {
  console.log('The new state is: ', store.getState())
})

store.dispatch(addTodoAction({
  id: 0,
  name: 'Walk the dog',
  complete: false,
}))

store.dispatch(addTodoAction({
  id: 1,
  name: 'Wash the car',
  complete: false,
}))

store.dispatch(addTodoAction({
  id: 2,
  name: 'Go to the gym',
  complete: true,
}))

store.dispatch(removeTodoAction(1))

store.dispatch(toggleTodoAction(0))

store.dispatch(addGoalAction({
  id: 0,
  name: 'Learn Redux'
}))

store.dispatch(addGoalAction({
  id: 1,
  name: 'Lose 20 pounds'
}))

store.dispatch(removeGoalAction(0))


/* To unsubscribe
 *
 * const unsubscribe = store.subscribe(() => {
 *    console.log('The new state change ', store.getState())
 * })
 *
 * unsubscribe()
*/

/* Notes

1. createStore()
    sets up a local(private) variable to hold the state
    returns an object that publicly exposes the getState() function
    createStore function can only take one reducer.

2. getState()
    returns the existing state variable.

2. subscribe()
    listen for changes in the state.
    The store's subscribe() function helps connect React components to the store.

4. store.subscribe()
    It is a function.
    When called, it is passed a single function.
    It returns a function.

5. unsubscribe()
    store.subscribe() returns a function, when that is invoked the subscribe function is unsubscribed.

6. Action
    is just a regular JavaScript Object.

7. Action Creators
    are functions that create/return action objects.

8. dispatch()
    used to make changes to the store's state.

9. the store object's methods have access to the state of the store via closure.

10. app
    is a main reducer.
    that in turn calls both of the other reducers to get each piece of state to build the final state of the app.
    return a object with both the reducer states

11. Whenever dispatch is called, we invoke our app function.
    The app function will then invoke the todos reducer as well as the goals reducer.
    Those will return their specific portions of the state.
    And then, the app function will return a state object with a todos property (the value of which is what the todos reducer returned)
    and a goals property (the value of which is what the goals reducer returned).

*/