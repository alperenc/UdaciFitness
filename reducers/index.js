import { RECEIVE_ENTRIES, ADD_ENTRY } from '../actions';

const entries = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_ENTRIES:
      return {
        ...state,
        ...action.entries,
      };
      break;

    case ADD_ENTRY:
      return {
        ...state,
        ...action.entry,
      };
      break;

    default:
      return state;
      break;
  }
};

export default entries;
