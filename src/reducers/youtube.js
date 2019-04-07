const INITIAL_STATE = {
    youtubes: null
};

const applySetYoutubes = (state, action) => ({
  ...state,
  youtubes: action.youtubes
});

function youtubeReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "YOUTUBE_SET": {
      return applySetYoutubes(state, action);
    }
    default:
      return state;
  }
}

export default youtubeReducer;
