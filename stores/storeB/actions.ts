import { Action } from '@reduxjs/toolkit';
import { ActionBase } from '../rootStore';
import * as types from './actionTypes'

export const startFetchingUsers: () => ActionBase = () => ({
  type: types.START_FETCHING_USERS,
})
export const stopFetchingUsers: () => ActionBase = () => ({
  type: types.STOP_FETCHING_USERS,
})
export const fetchUser: (isServer?: boolean) => ActionBase = (isServer = false) => ({
  type: types.FETCH_USER,
  payload: { isServer },
})
export const fetchUserSuccess: (response: any, isServer: boolean) => ActionBase = (response, isServer) => ({
  type: types.FETCH_USER_SUCCESS,
  payload: { response, isServer },
})

export const fetchUserFailure: (error: any, isServer: boolean) => ActionBase = (error, isServer) => ({
  type: types.FETCH_USER_FAILURE,
  payload: { error, isServer },
})