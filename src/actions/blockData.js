import 'whatwg-fetch';

export const SAVE_BLOCK_ELEMENT = 'SAVE_BLOCK_ELEMENT';
export const CHANGE_BLOCK_ELEMENT = 'CHANGE_BLOCK_ELEMENT';

export const changeBlockElement = (url, body) => async (dispatch) => {
  const fetchRes = await fetch(url, {
    headers: DEFAULT_HEADERS,
    method: 'PUT',
    body: JSON.stringify(body),
  });
  const response = await fetchRes.json();

  dispatch({ type: CHANGE_BLOCK_ELEMENT, payload: response });
};

export const saveBLockElement = (url, body) => async (dispatch) => {
  const fetchRes = await fetch(url, {
    headers: DEFAULT_HEADERS,
    method: 'PUT',
    body: JSON.stringify(body),
  });

  const response = await fetchRes.json();

  dispatch({ type: SAVE_BLOCK_ELEMENT, payload: response });
};
