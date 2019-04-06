const INITIAL_STATE = {
    news: null
};

const applySetNews = (state, action) => ({
  ...state,
  news: action.news
});

function newsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "NEWS_SET": {
      return applySetNews(state, action);
    }
    default:
      return state;
  }
}

export default newsReducer;
