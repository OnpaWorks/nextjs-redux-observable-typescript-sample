import { Action } from '@reduxjs/toolkit';
import { interval, of, Observable, tap } from 'rxjs'
import { ajax } from 'rxjs/ajax';
import { takeUntil, mergeMap, catchError, map } from 'rxjs/operators'
import { combineEpics, Epic, ofType } from 'redux-observable'
// import { request } from 'universal-rxjs-ajax' // because standard AjaxObservable only works in browser

import * as actions from './actions'
import * as types from './actionTypes'

export const fetchUsersEpic: Epic = (action$: Observable<any>, state$) =>
  action$.pipe(
    ofType(types.START_FETCHING_USERS),
    mergeMap((action) => {
      return interval(5000).pipe(
        map((x) => actions.fetchUser(true)),
        takeUntil(
          action$.pipe(ofType(types.STOP_FETCHING_USERS, types.FETCH_USER_FAILURE))
        )
      )
    })
  )

export const fetchUserEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofType(types.FETCH_USER),
    tap(n => {
      console.log(state$, state$.value);
    }),
    mergeMap((action) =>
      ajax(`https://jsonplaceholder.typicode.com/users/${state$.value.nextUserId||state$.value.dataA.nextUserId}`).pipe(
        map((response) =>
          {
            
            return actions.fetchUserSuccess(response.response, action.payload.isServer)
          }
        ),
        catchError((error) =>
          of(
            actions.fetchUserFailure(
              error.xhr.response,
              action.payload.isServer
            )
          )
        )
      )
    )
  )

export const storeAEpic = combineEpics(fetchUsersEpic, fetchUserEpic)