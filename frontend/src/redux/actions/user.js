import { server } from '../store';
import axios from 'axios';

export const login = (email, password) => async dispatch => {
  try {
    dispatch({ type: 'loginRequest' });

    const { data } = await axios.post(
      `${server}/api/v1/login`,
      { email, password },
      {
        headers: {
          'Content-type': 'application/json',
        },

        withCredentials: true,
      }
    );
    

    dispatch({ type: 'loginSuccess', payload: data });
  } catch (error) {
    // The ?. prevents the "Cannot read properties of undefined" error
    const message = error.response?.data?.message || "Internal Server Error or Network Issue";
    
    dispatch({ 
      type: 'loginFail', 
      payload: message 
    });
  }
};


export const register = (formdata) => async dispatch => {
  try {
    dispatch({ type: 'registerRequest' });

    const { data } = await axios.post(
      `${server}/api/v1/register`,
      formdata,
      {
        headers: {
          'Content-type': 'multipart/form-data',
        },

        withCredentials: true,
      }
    );
    

    dispatch({ type: 'registerSuccess', payload: data });
  } catch (error) {
    // The ?. prevents the "Cannot read properties of undefined" error
    const message = error.response?.data?.message || "Internal Server Error or Network Issue";
    
    dispatch({ 
      type: 'registerFail', 
      payload: message 
    });
  }
};


export const loadUser = () => async dispatch => {
  try {
    dispatch({ type: 'loadUserRequest' });

    const { data } = await axios.get(
      `${server}/api/v1/me`,
      {
        withCredentials: true,
      }
    );
    

    dispatch({ type: 'loadUserSuccess', payload: data.user });
  } catch (error) {
    // The ?. prevents the "Cannot read properties of undefined" error
    const message = error.response?.data?.message || "Internal Server Error or Network Issue";
    
    dispatch({ 
      type: 'loadUserFail', 
      payload: message 
    });
  }
};

export const logout = () => async dispatch => {
  try {
    dispatch({ type: 'logoutRequest' });

    const { data } = await axios.get(
      `${server}/api/v1/logout`,
      {
        withCredentials: true,
      }
    );
   

    dispatch({ type: 'logoutSuccess', payload: data.message });
  } catch (error) {
    // The ?. prevents the "Cannot read properties of undefined" error
    const message = error.response?.data?.message || "Internal Server Error or Network Issue";
    
    dispatch({ 
      type: 'logoutFail', 
      payload: message 
    });
  }
};


export const buySubscription = () => async dispatch => {
  try {
    dispatch({ type: 'buySubscriptionRequest' });

    const { data } = await axios.get(`${server}/api/v1/subscribe`, {
      withCredentials: true,
    });

    dispatch({ type: 'buySubscriptionSuccess', payload: data.subscriptionId });
  } catch (error) {
    dispatch({
      type: 'buySubscriptionFail',
      payload: error.response.data.message,
    });
  }
};

export const cancelSubscription = () => async dispatch => {
  try {
    dispatch({ type: 'cancelSubscriptionRequest' });

    const { data } = await axios.delete(`${server}/api/v1/subscribe/cancel`, {
      withCredentials: true,
    });

    dispatch({ type: 'cancelSubscriptionSuccess', payload: data.message });
  } catch (error) {
    dispatch({
      type: 'cancelSubscriptionFail',
      payload: error.response.data.message,
    });
  }
};
