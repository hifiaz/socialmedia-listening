const INITIAL_STATE = {
    instagrams: null
};

const applySetInstagrams = (state, action) => ({
  ...state,
  instagrams: action.instagrams
});

function instagramReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "INSTAGRAM_SET": {
      return applySetInstagrams(state, action);
    }
    default:
      return state;
  }
}

export default instagramReducer;
