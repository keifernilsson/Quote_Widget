export function createStateMachine({ screens, initialData = {} }) {
  const ids = screens.map((screen) => screen.id);
  const listeners = new Set();

  let state = freezeState({
    current: ids[0],
    index: 0,
    data: { ...initialData },
    history: [],
    submission: null,
  });

  function emit() {
    listeners.forEach((listener) => listener(state));
  }

  function transition(currentState, action) {
    switch (action.type) {
      case "UPDATE_FIELD":
        return freezeState({
          ...currentState,
          data: {
            ...currentState.data,
            [action.name]: action.value,
          },
        });

      case "NEXT": {
  const currentScreen = screens[currentState.index];

  let nextId = null;

if (currentScreen.next) {
  nextId = currentScreen.next;
} else if (currentScreen.nextByService) {
  nextId = currentScreen.nextByService[currentState.data.service];
}

  const nextIndex =
    nextId && ids.includes(nextId)
      ? ids.indexOf(nextId)
      : Math.min(currentState.index + 1, ids.length - 1);

  return freezeState({
    ...currentState,
    current: ids[nextIndex],
    index: nextIndex,
    history: [...currentState.history, currentState.current],
  });
}

      case "BACK": {
  const previousId =
    currentState.history[currentState.history.length - 1];

  const previousIndex = previousId
    ? ids.indexOf(previousId)
    : Math.max(currentState.index - 1, 0);

  return freezeState({
    ...currentState,
    current: ids[previousIndex],
    index: previousIndex,
    history: currentState.history.slice(0, -1),
  });
}

      case "SUBMIT": {
        const successIndex = ids.indexOf("success");
        return freezeState({
          ...currentState,
          current: "success",
          index: successIndex,
          history: [...currentState.history, currentState.current],
          submission: action.payload,
        });
      }

      case "RESET":
        return freezeState({
          current: ids[0],
          index: 0,
          data: {},
          history: [],
          submission: null,
        });

      default:
        return currentState;
    }
  }

  return {
    getState() {
      return state;
    },
    getCurrentScreen() {
      return screens[state.index];
    },
    send(action, options = {}) {
  const nextState = transition(state, action);

  if (nextState !== state) {
    state = nextState;

    if (!options.silent) {
      emit();
    }
  }
},
    subscribe(listener) {
      listeners.add(listener);
      listener(state);
      return () => listeners.delete(listener);
    },
  };
}

function freezeState(state) {
  return Object.freeze({
    ...state,
    data: Object.freeze({ ...state.data }),
    history: Object.freeze([...state.history]),
  });
}
