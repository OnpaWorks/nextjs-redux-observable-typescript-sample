import { Action } from '@reduxjs/toolkit';
import { combineReducers } from "redux";
import * as storeA from "./storeA/store";
import { storeAReducer } from "./storeA/store";
import * as storeB from "./storeB/store";
import { storeBReducer } from "./storeB/store";
import * as epicA from "./storeA/epic";
import * as epicB from "./storeB/epic";
import { createLogger } from 'redux-logger';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import { applyMiddleware, createStore } from "redux";

export interface CombinedState {
    dataA: storeA.State,
    dataB: storeB.State
}

export interface ActionBase extends Action<string> {
    type: string,
    payload?: any,
}

const rootReducer = combineReducers({
    dataA: storeAReducer,
    dataB: storeBReducer
});

const rootEpic = combineEpics(
    epicA.storeAEpic,
    epicB.storeBEpic,
)

export const useRootStore = (state: CombinedState) => {
    const middleWare = createEpicMiddleware();
    const store = createStore(
      rootReducer,
      applyMiddleware(middleWare, createLogger({ collapsed: true }))
    );
    middleWare.run(rootEpic);

    return store;
  }
  