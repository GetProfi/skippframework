export const LOAD_FORM_DATA = 'LOAD_FORM_DATA';

export const FORM_DATA_FETCHED = 'FORM_DATA_FETCHED';

export const loadFormData = data => (dispatch) => {
  dispatch({ type: LOAD_FORM_DATA, data });
};

export const INDEX_FETCH_STARTED = 'INDEX_FETCH_STARTED';
export const INDEX_ARRAY_FETCHED = 'INDEX_ARRAY_FETCHED';
export const INDEX_FETCH_FAILED = 'INDEX_FETCH_FAILED';

const indexFetchStarted = id => ({type: INDEX_FETCH_STARTED, id});
const indexArrayFetched = (id, data, url) => ({type: INDEX_ARRAY_FETCHED, id, data, url});
const indexFetchFailed = id => ({type: INDEX_FETCH_FAILED, id});

export const indexArray = (url, id) => async (dispatch) => {
  dispatch(indexFetchStarted(id));
  const response = await fetch(`${url}?sort={"_id": 1}`, {
    method: 'GET',
    headers: DEFAULT_HEADERS,
  });
  if (response.ok) {
    dispatch(indexArrayFetched(id, await response.json(), url));
  } else {
    dispatch(indexFetchFailed(id));
  }
};

const formDataFetched = (data, url) => {
  return {type: FORM_DATA_FETCHED, data, url};
};

export const fetchFormData = url => async (dispatch) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: DEFAULT_HEADERS,
  });
  dispatch(formDataFetched(await response.json(), url));
};

export const updateFormData = (
  url,
  data,
  callback = () => {}
) => async (dispatch) => {
  await fetch(url, {
    method: 'PUT',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(data),
  });
  callback();
};

export const deleteArrayElement = (url, callback) => async (dispatch) => {
  await fetch(url, {
    method: 'DELETE',
    headers: DEFAULT_HEADERS,
  });
  callback();
};
