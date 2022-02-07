import { createAction, handleActions } from 'redux-actions'
import { produce } from 'immer'
import { setCookie, deleteCookie } from '../../shared/cookie'
import { userApi } from '../../shared/api'

const LOG_OUT = 'LOG_OUT'
const GET_USER = 'GET_USER'
const SET_USER = 'SET_USER'
const SET_LOGIN = 'SET_LOGIN'
const INIT_FIRST_LOGIN = 'SET_FIRST_LOGIN'
const LOADING = 'LOADING'
const FAIL_LOGIN = 'FAIL_LOGIN'

// const logIn = createAction(LOG_IN, (user) => ({ user }))
const logOut = createAction(LOG_OUT, (user) => ({ user }))
const getUser = createAction(GET_USER, (user) => ({ user }))
const setUser = createAction(SET_USER, (user) => ({ user }))
const setLogin = createAction(SET_LOGIN, (user_info) => ({ user_info }))
const initFirstLogin = createAction(INIT_FIRST_LOGIN, (init) => ({ init }))
const loading = createAction(LOADING, (is_loading) => ({ is_loading }))
const failLogin = createAction(FAIL_LOGIN, (is_failure) => ({ is_failure }))

const initialState = {
  user: null,
  is_login: false,
  user_info: null,
  is_first: false,
  is_loading: false,
  is_failure: false,
}

//middleware
const kakaoLoginDB = (code) => {
  return function (dispatch, getState, { history }) {
    userApi
      .KakaoLogin(code)
      .then(async (res) => {
        const ACCESS_TOKEN = res.data.accessToken
        const ACCESS_TOKEN_EXP = res.data.accessTokenExpiresIn
        const REFRESH_TOKEN = res.data.refreshToken

        await setCookie('is_login', REFRESH_TOKEN)

        await localStorage.setItem('token', res.data.data.token)
        await localStorage.setItem('username', res.data.data.username)
        await localStorage.setItem('nickname', res.data.data.nickname)
        await localStorage.setItem('id', res.data.data.userId)

        dispatch(setUser({ username: res.data.data.username, nickname: res.data.data.nickname }))
        dispatch(loading(false))

        await history.replace('/')
      })
      .catch((err) => {
        console.log('카카오로그인 에러', err)
        // window.alert('로그인에 실패하였습니다.')
        history.replace('/login') // 로그인 실패하면 로그인화면으로 돌려보냄
        dispatch(loading(false))
      })
  }
}

const naverLoginDB = (code, state) => {
  return function (dispatch, getState, { history }) {
    userApi
      .NaverLogin(code, state)
      .then(async (res) => {
        const ACCESS_TOKEN = res.data.accessToken
        const ACCESS_TOKEN_EXP = res.data.accessTokenExpiresIn
        const REFRESH_TOKEN = res.data.refreshToken

        await setCookie('is_login', REFRESH_TOKEN)

        await localStorage.setItem('token', res.headers.authorization)
        await localStorage.setItem('username', res.data.data.username)
        await localStorage.setItem('nickname', res.data.data.nickname)
        await localStorage.setItem('id', res.data.data.userId)

        dispatch(setUser({ username: res.data.data.username, nickname: res.data.data.nickname }))
        dispatch(loading(false))

        await history.replace('/')
      })
      .catch((err) => {
        console.log('네이버로그인 에러', err)
        // window.alert('로그인에 실패하였습니다.')
        history.replace('/login') // 로그인 실패하면 로그인화면으로 돌려보냄
        dispatch(loading(false))
      })
  }
}

const googleLoginDB = (code) => {
  return function (dispatch, getState, { history }) {
    userApi
      .GoogleLogin(code)
      .then(async (res) => {
        const ACCESS_TOKEN = res.data.accessToken
        const ACCESS_TOKEN_EXP = res.data.accessTokenExpiresIn
        const REFRESH_TOKEN = res.data.refreshToken

        await setCookie('is_login', REFRESH_TOKEN)

        await localStorage.setItem('token', res.data.data.token)
        await localStorage.setItem('username', res.data.data.username)
        await localStorage.setItem('nickname', res.data.data.nickname)
        await localStorage.setItem('id', res.data.data.userId)

        dispatch(setUser({ username: res.data.data.username, nickname: res.data.data.nickname }))
        dispatch(loading(false))

        await history.replace('/')
      })
      .catch((err) => {
        console.log('구글로그인 에러', err)
        // window.alert('로그인에 실패하였습니다.')
        history.replace('/login') // 로그인 실패하면 로그인화면으로 돌려보냄
        dispatch(loading(false))
      })
  }
}

const joinDB = (username, nickname, password, passwordCheck) => {
  return function (dispatch, getState, { history }) {
    dispatch(loading(true))
    userApi
      .join(username, nickname, password, passwordCheck)
      .then((res) => {
        history.push('/login')
        dispatch(loading(false))
      })
      .catch((err) => {
        dispatch(loading(false))
        console.log('회원가입 문제 발생', err.response)
      })
  }
}

const logInDB = (username, password) => {
  return function (dispatch, getState, { history }) {
    dispatch(loading(true))
    userApi
      .login(username, password)
      .then((res) => {
        // setCookie('token', res.headers.authorization, 3)
        localStorage.setItem('token', res.headers.authorization)
        localStorage.setItem('username', res.data.data.username)
        localStorage.setItem('nickname', res.data.data.nickname)
        localStorage.setItem('id', res.data.data.userId)

        dispatch(setUser({ username: res.data.data.username, nickname: res.data.data.nickname }))
        history.replace('/')
      })
      .catch((err) => {
        console.log(err)
        dispatch(loading(false))
        dispatch(failLogin(true))
      })
  }
}

const logOutDB = () => {
  return function (dispatch, getState, { history }) {
    // deleteCookie('token')
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('nickname')
    localStorage.removeItem('id')
    dispatch(logOut())
    dispatch(loading(false))
  }
}

const loginCheckDB = () => {
  return function (dispatch, getState, { history }) {
    const username = localStorage.getItem('username')
    const tokenCheck = document.cookie
    dispatch(loading(false))

    if (tokenCheck) {
      dispatch(setUser({ userId: username }))
    } else {
      dispatch(logOut())
    }
  }
}

const SetLogin = () => {
  return function (dispatch, getState, { history }) {
    const username = localStorage.getItem('username')
    const userId = localStorage.getItem('id')
    const token = document.cookie.split('=')[1]
    dispatch(loading(false))

    if (username !== null && token !== '') {
      dispatch(setLogin({ username: username, userId: userId }))
    }
  }
}

//reducer
export default handleActions(
  {
    [SET_USER]: (state, action) =>
      produce(state, (draft) => {
        draft.user = action.payload.user
        draft.is_login = true
        draft.is_first = true
        draft.is_loading = false
        draft.is_failure = false
      }),
    [LOG_OUT]: (state, action) =>
      produce(state, (draft) => {
        draft.user = null
        draft.is_login = false
        draft.is_loading = false
      }),
    [GET_USER]: (state, action) =>
      produce(state, (draft) => {
        draft.user = action.payload.user
        draft.is_login = true
        draft.is_loading = false
      }),
    [SET_LOGIN]: (state, action) =>
      produce(state, (draft) => {
        draft.user_info = action.payload.user_info
      }),
    [INIT_FIRST_LOGIN]: (state, action) =>
      produce(state, (draft) => {
        draft.is_first = false
      }),
    [LOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.is_loading = action.payload.is_loading
      }),
    [FAIL_LOGIN]: (state, action) =>
      produce(state, (draft) => {
        draft.is_failure = action.payload.is_failure
        draft.is_loading = false
      }),
  },
  initialState
)

const actionCreators = {
  setUser,
  logOut,
  getUser,
  joinDB,
  logInDB,
  logOutDB,
  loginCheckDB,
  kakaoLoginDB,
  naverLoginDB,
  googleLoginDB,
  setLogin,
  SetLogin,
  initFirstLogin,
  loading,
  failLogin,
}

export { actionCreators }
