import * as actionTypes from "./actionTypes";
import axios from "axios";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = (idToken, localId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: idToken,
    localId: localId
  };
};

export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  };
};

export const logOut = () => {
  localStorage.removeItem("idToken");
  localStorage.removeItem("expirationDate");
  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

export const checkAuthTimeout = expirationTime => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logOut());
    }, expirationTime * 1000);
  };
};

export const setPathRedirect = path => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT,
    path: path
  };
};

export const auth = (email, password, isSignup) => {
  return dispatch => {
    //... authenticate user
    dispatch(authStart());
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true
    };
    let url = isSignup
      ? "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB4UgXFvMEql_PPvv6KH4Szd-rDltPLp9o"
      : "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB4UgXFvMEql_PPvv6KH4Szd-rDltPLp9o";
    axios
      .post(url, authData)
      .then(response => {
        const expirationDate = new Date(
          new Date().getTime() + response.data.expiresIn * 1000
        );
        localStorage.setItem("idToken", response.data.idToken);
        localStorage.setItem("localId", response.data.localId);
        localStorage.setItem("expirationDate", expirationDate);
        dispatch(authSuccess(response.data.idToken, response.data.localId));
        dispatch(checkAuthTimeout(response.data.expiresIn));
      })
      .catch(error => {
        console.log(error.response.data.error.message);
        dispatch(authFail(error.response.data.error.message));
      });
  };
};

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem("idToken");
    if (!token) {
      dispatch(logOut());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        dispatch(logOut());
      } else {
        const userId = localStorage.getItem("localId");
        dispatch(authSuccess(token, userId));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};
