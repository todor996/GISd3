import axios from '.';

export function fetchData(params) {
  return axios.get(`/wms?${params}`);
}
