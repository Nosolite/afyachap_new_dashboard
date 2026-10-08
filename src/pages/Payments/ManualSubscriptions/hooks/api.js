import {
  authPostRequest,
  postRequest,
  webGetRequest,
  webPostRequest,
} from "../../../../services/api-service";

/**
 * Promise wrappers over the callback-based API service so hooks can use async/await.
 */
export const get = (url) =>
  new Promise((resolve, reject) => webGetRequest(url, resolve, reject));

export const post = (url, body) =>
  new Promise((resolve, reject) => webPostRequest(url, body, resolve, reject));

export const authPost = (url, body) =>
  new Promise((resolve, reject) => authPostRequest(url, body, resolve, reject));

/** POST to a microservice (afya-sign-auth header), e.g. the doctors service. */
export const microPost = (url, body) =>
  new Promise((resolve, reject) => postRequest(url, body, resolve, reject));

/** Extract a human-readable message from an axios-like error. */
export const errorMessage = (e, fallback = "Something went wrong") =>
  e?.response?.data?.message || e?.message || fallback;
