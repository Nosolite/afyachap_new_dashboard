import axios from "axios";
import {
  contentTypeFormData,
  contentTypeJson,
  headers,
} from "../utils/constant";

export const getRequest = async (url, onSuccess, onError) => {
  fetch(url, {
    headers: {
      ...contentTypeJson,
      ...headers,
    },
  })
    .then((response) => response.json())
    .then((result) => {
      onSuccess(result);
    })
    .catch((error) => {
      onError(error);
    });
};

export const authGetRequest = async (url, onSuccess, onError) => {
  const token = localStorage.getItem("token");
  fetch(url, {
    headers: {
      ...contentTypeJson,
      ...headers,
      "afya-token-auth": token,
    },
  })
    .then((response) => response.json())
    .then((result) => {
      onSuccess(result);
    })
    .catch((error) => {
      onError(error);
    });
};

export const webGetRequest = async (url, onSuccess, onError) => {
  fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      onSuccess(result);
    })
    .catch((error) => {
      onError(error);
    });
};

// Authenticated requests against webUrl using Bearer token from localStorage
export const webAuthGetRequest = async (url, onSuccess, onError) => {
  const token = localStorage.getItem("token");
  fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      onSuccess(result);
    })
    .catch((error) => {
      onError(error);
    });
};

export const postRequest = async (url, body, onSuccess, onError, formData) => {
  try {
    const response = await axios.post(url, body, {
      headers: {
        ...(formData ? contentTypeFormData : contentTypeJson),
        ...headers,
      },
    });
    onSuccess(response.data);
  } catch (error) {
    onError(error);
  }
};

export const authPostRequest = async (
  url,
  body,
  onSuccess,
  onError,
  formData
) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(url, body, {
      headers: {
        ...(formData ? contentTypeFormData : contentTypeJson),
        ...headers,
        "afya-token-auth": token,
      },
    });
    onSuccess(response.data);
  } catch (error) {
    onError(error);
  }
};

export const webPostRequest = async (
  url,
  body,
  onSuccess,
  onError,
  formData
) => {
  try {
    const response = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`,
        "Content-Type": formData ? "multipart/form-data" : "application/json",
      },
    });
    onSuccess(response.data);
  } catch (error) {
    onError(error);
  }
};

export const webPutRequest = async (
  url,
  body,
  onSuccess,
  onError,
  formData
) => {
  try {
    const response = await axios.put(url, body, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`,
        "Content-Type": formData ? "multipart/form-data" : "application/json",
      },
    });
    onSuccess(response.data);
  } catch (error) {
    onError(error);
  }
};

export const webDeleteRequest = async (url, onSuccess, onError) => {
  try {
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    onSuccess(response.data);
  } catch (error) {
    onError(error);
  }
};

export const webAuthPostRequest = async (
  url,
  body,
  onSuccess,
  onError,
  formData
) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": formData ? "multipart/form-data" : "application/json",
      },
    });
    onSuccess(response.data);
  } catch (error) {
    onError(error);
  }
};
