const URL = 'http://localhost:3123/';

const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

const SuccessStatus = {
  MIN: 200,
  MAX: 300,
};

const checkStatus = (response) => {
  if (response.status >= SuccessStatus.MIN
    && response.status < SuccessStatus.MAX) {
    return response;
  }

  throw new Error(`${response.status}: ${response.statusText}`);
};

const load = ({ firstName = '', secondName = '' }, method, url) => {
  const optionList = {
    method,
  };

  if (method !== Method.GET) {
    optionList.body = JSON.stringify({
      firstName,
      secondName,
    });
    optionList.headers = new Headers({ 'Content-Type': 'application/json' });
  }

  return fetch(
    url, optionList,
  ).then(checkStatus)
    .catch((err) => {
      throw err;
    })
    .then((response) => (
      method !== Method.DELETE ? response.json() : ''));
};

const api = {
  get(user) {
    return load(user, Method.GET, URL);
  },

  post(user) {
    return load(user, Method.POST, URL);
  },

  put(user) {
    return load(user, Method.PUT, `${URL}${user.uuid}`);
  },

  del(user) {
    return load(user, Method.DELETE, `${URL}${user.uuid}`);
  },
};

export default api;
