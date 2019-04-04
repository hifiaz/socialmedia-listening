const INITIAL_STATE = {
    projects: null
  };
  
  const applySetProjects = (state, action) => ({
    ...state,
    projects: action.projects
  });
  
  const applySetProject = (state, action) => ({
    ...state,
    projects: {
      ...state.project,
      [action.uid]: action.project
    }
  });
  
  function projectReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
      case "PROJECTS_SET": {
        return applySetProjects(state, action);
      }
      case "PROJECT_SET": {
        return applySetProject(state, action);
      }
      default:
        return state;
    }
  }
  
  export default projectReducer;
  