import 'whatwg-fetch';

export const SAVE_ARRAY_ELEMENT = 'SAVE_ARRAY_ELEMENT';
export const ADD_ARRAY_ELEMENT = 'ADD_ARRAY_ELEMENT';

export const removeArrayElement = url => async (dispatch) => {
  const fetchRes = await fetch(url, {
    method: 'DELETE',
    headers: DEFAULT_HEADERS,
  });

  return fetchRes;
};

export const putArrayElement = (url, body) => async (dispatch) => {
  const fetchRes = await fetch(url, {
    method: 'PUT',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(body),
  });

  dispatch({ type: SAVE_ARRAY_ELEMENT });

  return fetchRes;
};

export const addArrayElement = (url, id, body) => async (dispatch) => {
  const fetchRes = await fetch(url, {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(body),
  });

  const response = await fetchRes.json();

  dispatch({ type: ADD_ARRAY_ELEMENT, payload: { response, id } });

  return response;
};
