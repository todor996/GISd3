import {failFetch, startFetch, successFetch} from '../reducers/objectData';
import {fetchData} from '../api/wmsObject';

export function getData(params) {
  return dispatch => fetchData(params)
    .then(res => {
      dispatch(successFetch(res));
    })
}
