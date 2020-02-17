import { Map } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import { FETCH_DATA_FAIL, FETCH_DATA_START, FETCH_DATA_SUCCESS } from '../consts/actions';

// CREATE ACTIONS
export const startFetch = createAction(FETCH_DATA_START);
export const successFetch = createAction(FETCH_DATA_SUCCESS);
export const failFetch = createAction(FETCH_DATA_FAIL)
// SET INITIAL STATE
const INITIAL_STATE = Map({
  data: null,
  loading: null
});

// WRITE HANDLERS FOR ACTIONS
export default handleActions(
  {
    [FETCH_DATA_START](state) {
      return state.merge({
        loading: true,
      });
    },

    [FETCH_DATA_SUCCESS](
      state,
        payload,
    ) {
      return state.merge({
        data: payload.payload.data.features,
        loading: false,
      });
    },
    [FETCH_DATA_FAIL](state) {
      return state.merge({
        loading: false,
        data: null,
      })
    }
  },
  INITIAL_STATE,
);
