import { Action } from '@reduxjs/toolkit';
import { interval, of, Observable } from 'rxjs'
import { ajax } from 'rxjs/ajax';
import { takeUntil, mergeMap, catchError, map } from 'rxjs/operators'
import { combineEpics, Epic, ofType } from 'redux-observable'
// import { request } from 'universal-rxjs-ajax' // because standard AjaxObservable only works in browser

import * as actions from './actions'
import * as types from './actionTypes'

export const fetchUsersEpicB: Epic = (action$: Observable<any>, state$) =>
  action$.pipe(
    ofType(types.START_FETCHING_USERS),
    mergeMap((action) => {
      return interval(3000).pipe(
        map((x) => actions.fetchUser(true)),
        takeUntil(
          action$.pipe(ofType(types.STOP_FETCHING_USERS, types.FETCH_USER_FAILURE))
        )
      )
    })
  )

export const fetchUserEpicB: Epic = (action$, state$) =>
  action$.pipe(
    ofType(types.FETCH_USER),
    mergeMap((action) =>
      ajax(`https://jsonplaceholder.typicode.com/users/${state$.value.nextUserIdForB||state$.value.dataB.nextUserIdForB}`).pipe(
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

export const storeBEpic = combineEpics(fetchUsersEpicB, fetchUserEpicB)