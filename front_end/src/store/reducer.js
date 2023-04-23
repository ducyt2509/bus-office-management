import { SET_DATA_USER } from './constants';

const initState = {
  dataUser: {},
};

function reducer(state, action) {
  switch (action.type) {
    case SET_DATA_USER:
      return {
        ...state,
        dataUser: action.payload,
      };
    default:
      throw new Error('Invalid action');
  }
}

export { initState };
export default reducer;
