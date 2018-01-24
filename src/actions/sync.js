import 'whatwg-fetch';

export const START_SYNC_ARRAY_BLOCK = 'START_SYNC_ARRAY_BLOCK';
export const SUCCESS_SYNC_ARRAY_BLOCK = 'SUCCESS_SYNC_ARRAY_BLOCK';

export const START_SYNC_BLOCK = 'START_SYNC_BLOCK';
export const SUCCESS_SYNC_BLOCK = 'SUCCESS_SYNC_BLOCK';

export const CREATE_IMAGE_URL = `https://baas.kinvey.com/blob/${window.api.appId}`;
export const SUCCESS_ADDED_IMAGE = 'SUCCESS_ADDED_IMAGE';
export const FIRST_STEP_IMAGE = 'FIRST_STEP_IMAGE';
export const SECOND_STEP_IMAGE = 'SECOND_STEP_IMAGE';

export const syncArrayBlock = (url, id, query, sort) => async (dispatch) => {
  dispatch({ type: START_SYNC_ARRAY_BLOCK, payload: { id } });

  let decodeUrl;

  if (query && url.indexOf('?') > -1) {
    decodeUrl = `${url}&query=${JSON.stringify(query)}`;
  } else if (query) {
    decodeUrl = `${url}?query=${JSON.stringify(query)}`;
  } else {
    decodeUrl = url;
  }

  if (sort && query) {
    decodeUrl += `&sort=${JSON.stringify(sort)}`;
  } else if (!query && sort) {
    decodeUrl += `?sort=${JSON.stringify(sort)}`;
  }

  const res = await fetch(decodeUrl, {
    method: 'GET',
    headers: DEFAULT_HEADERS,
  });
  const response = await res.json();

  dispatch({ type: SUCCESS_SYNC_ARRAY_BLOCK, payload: { response, id } });
};

export const syncBlockElement = (url, id) => async (dispatch) => {
  dispatch({ type: START_SYNC_BLOCK });

  const response = await fetch(url, {
    method: 'GET',
    headers: DEFAULT_HEADERS
  }).then(res => res.json());

  dispatch({ type: SUCCESS_SYNC_BLOCK, payload: { response, id } });
};

export const createImage = (file, binaryImage) => async (dispatch) => {
  const res = await fetch(CREATE_IMAGE_URL, {
    method: 'POST',
    headers: {
      ...DEFAULT_HEADERS,
      Authorization: `Basic ${window.api.adminToken}`,
      'X-Kinvey-Content-Type': file.type,
    },
    body: JSON.stringify({
      _filename: file.name,
      _public: true,
      mimeType: file.type,
      size: file.size,
      _acl: { gr: true },
    }),
  });

  const response = await res.json();

  const googleRes = await fetch(response['_uploadURL'], {
    method: 'PUT',
    headers: {
      'content-type': file.type,
      'content-length': file.size,
      ...response._requiredHeaders
    },
    body: binaryImage
  });

  dispatch({ type: SUCCESS_ADDED_IMAGE, payload: response });

  return googleRes;
};
