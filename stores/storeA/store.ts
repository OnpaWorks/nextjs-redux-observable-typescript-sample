import { storeAEpic } from './epic';
import { createLogger } from 'redux-logger';
import { createEpicMiddleware } from 'redux-observable';
import { Action } from '@reduxjs/toolkit';
import { applyMiddleware, createStore } from "redux";
import { ActionBase } from '../rootStore';
import * as types from "./actionTypes";

export interface State {
  nextUserId: number;
  character: any;
  isFetchedOnServer: boolean;
  error: any;
}

export const InitialState: State = {
  nextUserId: 1,
  character: {},
  isFetchedOnServer: false,
  error: null,
}

export const storeAReducer = (state: State = InitialState, action: ActionBase) => {
  switch(action.type) {
    case types.FETCH_USER_SUCCESS:
      return {
        ...state,
        character: action.payload.response,
        isFetchedOnServer: action.payload.isServer,
        nextUserId: state.nextUserId + 1,
      }
    case types.FETCH_USER_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        isFetchedOnServer: action.payload.isServer,
      }
    default:
      return state
  }
}

export const useStoreA = (state: State) => {
  const middleWare = createEpicMiddleware();
  const store = createStore(
    storeAReducer,
    applyMiddleware(middleWare, createLogger({ collapsed: true }))
  );
  middleWare.run(storeAEpic);

  return store;
}
