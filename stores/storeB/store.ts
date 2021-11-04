import { storeBEpic } from './epic';
import { createLogger } from 'redux-logger';
import { createEpicMiddleware } from 'redux-observable';
import { Action } from '@reduxjs/toolkit';
import { applyMiddleware, createStore } from "redux";
import { ActionBase } from '../rootStore';
import * as types from "./actionTypes";

export interface State {
  nextUserIdForB: number;
  characterForB: any;
  isFetchedOnServerForB: boolean;
  errorForB: any;
}

export const InitialState: State = {
  nextUserIdForB: 1,
  characterForB: {},
  isFetchedOnServerForB: false,
  errorForB: null,
}

export const storeBReducer = (state: State = InitialState, action: ActionBase) => {
  switch(action.type) {
    case types.FETCH_USER_SUCCESS:
      return {
        ...state,
        characterForB: action.payload.response,
        isFetchedOnServerForB: action.payload.isServer,
        nextUserIdForB: state.nextUserIdForB + 1,
      }
    case types.FETCH_USER_FAILURE:
      return {
        ...state,
        errorForB: action.payload.error,
        isFetchedOnServerForB: action.payload.isServer,
      }
    default:
      return state
  }
}

export const useStoreB = (state: State) => {
  const middleWare = createEpicMiddleware();
  const store = createStore(
    storeBReducer,
    applyMiddleware(middleWare, createLogger({ collapsed: true }))
  );
  middleWare.run(storeBEpic);

    

  return store;
}
