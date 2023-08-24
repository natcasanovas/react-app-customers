import axios from 'axios';
import QueryString from 'qs';
import * as utilService from '../utilities/ServiceTools';

const URL_BASE = 'http://localhost:8090/api';

export async function getCustomers(orientation, order, page) {
  const data = new FormData();

  if (orientation) {
    data.append('orientation', orientation);
  }

  if (order) {
    data.append('order', order);
  }

  if (page) {
    data.append('page', page);
  }

  const config = {
    method: 'POST',
    url: `${URL_BASE}/customers/list`,
    data: data,
  };

  return axios(config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}
