import React, { useState } from 'react'
import '../../styles/css/Join.css'
import { useDispatch, useSelector } from 'react-redux'
import { history } from '../../redux/ConfigureStore'
import { actionCreators as userActions } from '../../redux/modules/user'
import { userApi } from '../../shared/api'
import styled from 'styled-components'
import { DoubleCheckModal, AlertModal, ConfirmButton } from '../../components/modal'
import { Footer } from '../../components'
import MemegleIcon from '../../styles/image/smileIcon_Yellow.png'
import { Grid } from '../../elements'
import CircularProgress from '@mui/material/CircularProgress'

const Join = () => {
  const dispatch = useDispatch()

  const loading = useSelector((state) => state.user.is_loading)

  //이름, 이메일, 비밀번호, 비밀번호 확인
  const [username, setUsername] = React.useState('')
  const [nickname, setNickname] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [passwordCheck, setPasswordCheck] = React.useState('')

  //오류메시지 상태저장
  const [usernameMessage, setUsernameMessage] = useState('')
  const [nicknameMessage, setNicknameMessage] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordCheckMessage, setPasswordCheckMessage] = useState('')

  // 유효성 검사
  const [isUsername, setIsUsername] = useState(false)
  const [isNickname, setIsNickname] = useState(false)
  const [isPassword, setIsPassword] = useState(false)
  const [isPasswordCheck, setIsPasswordCheck] = useState(false)

  // 아이디 & 닉네임 중복확인
  const [passedUsername, setPassedUsername] = useState('')
  const [passedNickname, setPassedNickname] = useState('')
  const [usedUsername, setUsedUsername] = useState('')
  const [usedNickname, setUsedNickname] = useState('')
  const [doubleCheck, setDoubleCheck] = useState(null)
  const [InputUsernameAlert, setInputUsernameAlert] = useState(false)
  const [InputNicknameAlert, setInputNicknameAlert] = useState(false)
  const [DoubleCheckAlert, setDoubleCheckAlert] = useState(false)

  const [showAlert, setShowAlert] = useState(false)

  // 유저네임 유효성 검사
  const onChangeUsername = (e) => {
    const emailRegex = /^(?=.*[a-z0-9])[a-z0-9]{3,16}$/
    const usernameCurrent = e.target.value
    setUsername(usernameCurrent)

    if (!emailRegex.test(usernameCurrent)) {
      setUsernameMessage('영문+숫자 조합으로 3~16자가 맞는지 확인해주세요')
      setIsUsername(false)
    } else {
      setUsernameMessage('올바른 형식입니다')
      setIsUsername(true)
    }
  }

  // 닉네임 유효성 검사
  const onChangeNickname = (e) => {
    const nicknameRegex = /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,10}$/
    const nicknameCurrent = e.target.value
    setNickname(nicknameCurrent)
    if (!nicknameRegex.test(nicknameCurrent)) {
      setNicknameMessage('영문+한글 조합으로 2~10자리가 맞는지 확인해주세요')
      setIsNickname(false)
    } else {
      setNicknameMessage('올바른 형식입니다')
      setIsNickname(true)
    }
  }

  // 비밀번호 유효성 검사
  const onChangePassword = (e) => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()._-]{6,16}$/
    const passwordCurrent = e.target.value
    setPassword(passwordCurrent)

    if (!passwordRegex.test(passwordCurrent)) {
      setPasswordMessage('숫자+영문 조합으로 6~16자리가 맞는지 확인해주세요')
      setIsPassword(false)
    } else {
      setPasswordMessage('유효한 비밀번호입니다')
      setIsPassword(true)
    }
  }

  // 비밀번호 확인 유효성 검사
  const onChangePasswordCheck = (e) => {
    const PasswordCheckCurrent = e.target.value
    setPasswordCheck(PasswordCheckCurrent)

    if (password === PasswordCheckCurrent) {
      setPasswordCheckMessage('비밀번호가 일치합니다')
      setIsPasswordCheck(true)
    } else {
      setPasswordCheckMessage('비밀번호가 일치하지 않습니다')
      setIsPasswordCheck(false)
    }
  }

  const checkUsername = async () => {
    if (username !== '') {
      await userApi
        .checkUsername(username)
        .then((response) => {
          if (response.data.result === true) {
            /* 중복확인 -> 사용 가능한 아이디 상태 저장 */
            setDoubleCheck(true)
            setPassedUsername(username)
          } else {
            /* 중복확인 -> 사용 불가능한 아이디 상태 저장 */
            setDoubleCheck(false)
            setUsedUsername(username)
          }
        })
        .catch((error) => {
          console.log('아이디를 중복확인하는 데 문제가 발생했습니다.', error.response)
        })
    } else {
      /* 아이디를 입력하지 않고 중복확인 버튼을 클릭하는 경우 */
      /* 아이디를 입력한 후 클릭해달라는 알럿 */
      setInputUsernameAlert(true)
      setTimeout(() => setInputUsernameAlert(false), 1000)
    }
  }

  const checkNickname = async () => {
    if (nickname !== '') {
      await userApi
        .checkNickname(nickname)
        .then((response) => {
          if (response.data.result === true) {
            /* 중복확인 -> 사용 가능한 닉네임 상태 저장 */
            setDoubleCheck(true)
            setPassedNickname(nickname)
          } else {
            /* 중복확인 -> 사용 불가능한 닉네임 상태 저장 */
            setDoubleCheck(false)
            setUsedNickname(nickname)
          }
        })
        .catch((error) => {
          console.log('닉네임을 중복확인하는 데 문제가 발생했습니다.', error.response)
        })
    } else {
      /* 닉네임을 입력하지 않고 중복확인 버튼을 클릭하는 경우 */
      /* 닉네임을 입력한 후 클릭해달라는 알럿 */
      setInputNicknameAlert(true)
      setTimeout(() => setInputNicknameAlert(false), 1000)
    }
  }

  const join = () => {
    if (username === '' || nickname === '' || password === '' || passwordCheck === '') {
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 1000)
      return
    }
    if (username !== passedUsername || username === usedUsername || nickname !== passedNickname || nickname === usedNickname) {
      /* 입력한 아이디 또는 닉네임이 중복확인 -> 사용 가능한 아이디 또는 닉네임과 일치하지 않는 경우 (중복확인 후 입력란을 다시 변경한 경우) */
      /* 입력한 아이디 또는 닉네임이 중복확인 -> 이미 사용 중인 아이디 또는 닉네임과 일치하는 경우 (사용 중이라는 알럿을 띄웠지만 변경하지 않은 경우) */
      /* 아이디와 닉네임 중복확인을 완료할 것을 요청하는 알럿 */
      setDoubleCheckAlert(true)
      setTimeout(() => setDoubleCheckAlert(false), 1000)
      return
    }
    dispatch(userActions.joinDB(username, nickname, password, passwordCheck))
  }

  return (
    <>
      <Grid flex_center padding="40px 0 37px">
        <Logo src={MemegleIcon} />
      </Grid>
      <div className="JoinPageLayout">
        <div className="MultiInputBoxLayout_join">
          <div className="LoginOrJoinButtons_join">
            <div className="JoinButton_join"> 회원가입</div>
            <div className="LoginButton_join" onClick={() => history.push('/login')}>
              로그인
            </div>
          </div>
          <div className="LoginOrJoinInputs_join">
            <label className="JoinInputLabel_Username" htmlFor="UsernameInput_Join">
              아이디
            </label>
            <DoubleCheckBox>
              <input
                className="JoinInputBox input1"
                id="UsernameInput_Join"
                maxLength="16"
                placeholder="영어, 숫자 3~16자"
                type="text"
                value={username}
                onChange={onChangeUsername}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    checkUsername()
                  }
                }}
              />
              <button className="doubleCheckButton" onClick={checkUsername}>
                중복확인
              </button>
            </DoubleCheckBox>
            {username.length > 0 && <SpanUsername className={`message ${isUsername ? 'success' : 'error'}`}>{usernameMessage}</SpanUsername>}
            <label className="JoinInputLabel_Nickname" htmlFor="NicknameInput_Join">
              닉네임
            </label>
            <DoubleCheckBox>
              <input
                className="JoinInputBox input1"
                id="NicknameInput_Join"
                maxLength="10"
                placeholder="한글,영어 대소문자, 숫자 2~10자"
                text="이름"
                type="text"
                value={nickname}
                onChange={onChangeNickname}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    checkNickname()
                  }
                }}
              />
              <button className="doubleCheckButton" onClick={checkNickname}>
                중복확인
              </button>
            </DoubleCheckBox>
            {nickname.length > 0 && <SpanNickname className={`message ${isNickname ? 'success' : 'error'}`}>{nicknameMessage}</SpanNickname>}
            <label className="JoinInputLabel_Password" htmlFor="PasswordInput_Join">
              비밀번호
            </label>
            <input
              className="JoinInputBox input2"
              id="PasswordInput_Join"
              maxLength="16"
              type="password"
              placeholder="영어 대소문자, 숫자, 특수문자(!@#$%^&*()._-) 6~16자"
              onChange={onChangePassword}
              title="비밀번호"
              value={password}
            />
            {password.length > 0 && <SpanPassword className={`message ${isPassword ? 'success' : 'error'}`}>{passwordMessage}</SpanPassword>}
            <label className="JoinInputLabel_PasswordCheck" htmlFor="PasswordCheckInput_Join">
              비밀번호 확인
            </label>
            <input
              className="JoinInputBox input2"
              id="PasswordCheckInput_Join"
              maxLength="16"
              type="password"
              placeholder="영어 대소문자, 숫자, 특수문자(!@#$%^&*()._-) 6~16자"
              onChange={onChangePasswordCheck}
              title="비밀번호 확인"
              value={passwordCheck}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  join()
                }
              }}
            />
            {setPasswordCheck.length > 0 && <SpanPasswordCheck className={`message ${isPasswordCheck ? 'success' : 'error'}`}>{passwordCheckMessage}</SpanPasswordCheck>}
            <div
              className="MemegleButton_JoinSubmit"
              type="submit"
              disabled={!(isNickname && isUsername && isPassword && isPasswordCheck)}
              onClick={join}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  console.log('Enter')
                }
              }}
            >
              <button className="MemegleButton_JoinSubmit Join1" disabled={loading}>
                {loading ? <CircularProgress size={16} sx={{ color: '#FFFFFF' }} /> : '회원가입'}
              </button>
              <div className="MemegleButton_JoinSubmit Join2"></div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {doubleCheck === null && null}
      {doubleCheck === true && (
        <DoubleCheckModal title="사용 가능합니다!" doubleCheck={doubleCheck} setDoubleCheck={setDoubleCheck}>
          <ConfirmButton _onClick={() => setDoubleCheck(null)}>확인</ConfirmButton>
        </DoubleCheckModal>
      )}
      {doubleCheck === false && (
        <DoubleCheckModal type="exist-onlyConfirm" title="이미 사용 중이에요!" doubleCheck={doubleCheck} setDoubleCheck={setDoubleCheck}>
          <ConfirmButton _onClick={() => setDoubleCheck(null)}>확인</ConfirmButton>
        </DoubleCheckModal>
      )}
      <AlertModal showModal={showAlert}>아이디와 비밀번호를 모두 입력해 주세요!</AlertModal>
      <AlertModal showModal={InputUsernameAlert}>아이디를 입력한 후 중복확인 버튼을 클릭해 주세요!</AlertModal>
      <AlertModal showModal={InputNicknameAlert}>닉네임을 입력한 후 중복확인 버튼을 클릭해 주세요!</AlertModal>
      <AlertModal showModal={DoubleCheckAlert}>먼저 아이디와 닉네임의 중복확인을 완료해 주세요!</AlertModal>
    </>
  )
}

const DoubleCheckBox = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin: 0 0 0 0;
`
const SpanUsername = styled.span`
  font-size: 12px;
  margin-top: -5px;
  margin-bottom: -10px;
  color: #ffa07a;
`

const SpanNickname = styled.span`
  font-size: 12px;
  margin-top: -5px;
  margin-bottom: -10px;
  color: #ffa07a;
`
const SpanPassword = styled.span`
  font-size: 12px;
  margin-bottom: -15px;
  color: #ffa07a;
`
const SpanPasswordCheck = styled.span`
  font-size: 12px;
  margin-bottom: -10px;
  color: #ffa07a;
`

const Logo = styled.div`
  width: 40px;
  height: 40px;
  border: 2px solid #111;
  /* cursor: pointer; */
  background-size: cover;
  background-image: url('${(props) => props.src}');
  background-position: center;
`

export default Join
