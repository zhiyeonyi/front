import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { actionCreators as userActions } from '../redux/modules/user'
import { Spinner } from '../components'

import styled from 'styled-components'

const KakaoLoginHandler = (props) => {
  const dispatch = useDispatch()

  const user = useSelector((state) => state.user.user)

  let code = new URL(window.location.href).searchParams.get('code')

  React.useEffect(async () => {
    await dispatch(userActions.kakaoLoginDB(code))
  }, [])

  return (
    <>
      <BackGround>
        <Spinner />
      </BackGround>
    </>
  )
}

const BackGround = styled.div`
  width: 100%;
  height: 100%;
  margin: 100px 0 0 0;
`

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Text = styled.div`
  width: 250px;
  height: 50px;
  margin: 0 0 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 20px;
  font-weight: 600;
`

export default KakaoLoginHandler
