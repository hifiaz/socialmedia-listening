const INITIAL_STATE = {
    twitters: null
};

const applySetTwitters = (state, action) => ({
  ...state,
  twitters: action.twitters
});

function twitterReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "TWITTER_SET": {
      return applySetTwitters(state, action);
    }
    default:
      return state;
  }
}

export default twitterReducer;
