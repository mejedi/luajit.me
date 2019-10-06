const actionMap = {};

export function apply(state, action) {
  return actionMap[action.id](state, action);
}

/* propertySet - generic toplevel property setter */
export function propertySet(properties) {
  return { id: propertySet, properties };
}
actionMap[propertySet] = (state, action) => Object.assign(
  {}, state, action.properties
);

/**/
export function propertyToggle(key) {
  return { id: propertyToggle, key };
}
actionMap[propertyToggle] = (state, action) => Object.assign(
  {}, state, { [action.key]: !state[action.key] }
);

/* inputPropertySet - generic input property setter */
export function inputPropertySet(properties) {
  return { id: inputPropertySet, properties };
}
actionMap[inputPropertySet] = (state, action) => {
  const input = Object.assign({}, state._input || {});
  delete input._delay;
  return Object.assign(
    {}, state,
    { _input: Object.assign(input, action.properties) }
  );
}

/* Layout management */
const layoutMap = {
  ["inspectorPanel.paneLayout"]:
    require("./InspectorPanelPaneLayout.js").default
};

export function windowResize(width, height) {
  return { id: windowResize, width, height };
}
actionMap[windowResize] = (state, action) => {
  const state2 = Object.assign(
    {}, state, { _windowWidth: action.width, _windowHeight: action.height }
  );
  for (let layoutId in layoutMap)
    state2[layoutId] = layoutMap[layoutId](state2[layoutId], action, state2);
  return state2;
}

export function paneResize(layoutId, paneId, size) {
  return { id: paneResize, layoutId, paneId, size };
}

export function paneVisibilitySet(layoutId, paneId, isVisible) {
  return { id: paneVisibilitySet, layoutId, paneId, isVisible };
}

actionMap[paneResize] =
actionMap[paneVisibilitySet] = (state, action) => Object.assign(
  {}, state,
  { [action.layoutId]: layoutMap[action.layoutId](state[action.layoutId], action, state) }
);

export function paneVisibilityToggle(layoutId, paneId) {
  return { id: paneVisibilityToggle, layoutId, paneId };
}
actionMap[paneVisibilityToggle] = (state, action) => apply(
  state, paneVisibilitySet(
    action.layoutId, action.paneId,
    !state[action.layoutId][action.paneId + "IsVisible"]
  )
);
