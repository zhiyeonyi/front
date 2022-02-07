import React, { useState } from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { history } from '../redux/ConfigureStore'
import { actionCreators as userActions } from '../redux/modules/user'
import { ReactComponent as CloseIcon } from '../styles/icons/size(28*28)(30*30)/close_28dp.svg'

import { Grid, ProfileImage } from '../elements'
import BottomPopup from './BottomPopup'
import { ConfirmModal, ConfirmButton } from './modal'

const ProfileBottom = React.memo(({ profile, showProfile, setShowProfile }) => {
  const dispatch = useDispatch()

  const [showModal, setShowModal] = useState(false)

  const handleShowModal = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowModal(!showModal)
  }

  const handleClickLogOut = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(userActions.logOutDB())
    setShowModal(false)
    setShowProfile(false)
  }

  return (
    <>
      <BottomPopup isOpen={showProfile} onClose={() => setShowProfile(false)} heightPixel={230}>
        <Container>
          <CloseButtonBox>
            <CloseIcon className="close-icon" onClick={() => setShowProfile(false)} fill="#444" />
          </CloseButtonBox>
          <Grid flex_center column padding="0 0 16px" borderBottom="1px solid #e5e5e5">
            <ProfileImage src={profile?.profileImage} size="60" />
            <Nickname>{profile?.nickname}</Nickname>
          </Grid>
          <Grid flex_around padding="16px 20px">
            <Button className="logout" onClick={handleShowModal}>
              로그아웃
            </Button>
            <Button
              className="mypage"
              onClick={() => {
                history.push('/mypage')
              }}
            >
              마이페이지
            </Button>
          </Grid>
        </Container>
      </BottomPopup>

      {showModal && (
        <ConfirmModal
          title="정말 로그아웃 하시겠어요?"
          question={`밈글밈글은 ${profile?.nickname} 님을 기다리고 있을게요 🥲 `}
          showModal={showModal}
          handleShowModal={handleShowModal}
          setShowModal={setShowModal}
        >
          <ConfirmButton _onClick={handleClickLogOut}>로그아웃</ConfirmButton>
        </ConfirmModal>
      )}
    </>
  )
})

const Container = styled.div`
  width: 100%;
  height: 230px;
  border-radius: 20px 20px 0 0;
  background-color: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.6);
  z-index: 10001;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const CloseButtonBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: right;
  padding: 16px 16px 0;
  .close-icon {
    cursor: pointer;
  }
`

const Nickname = styled.div`
  padding: 16px 0 0;
  font-weight: 600;
  cursor: default;
`

const Button = styled.button`
  border-radius: 20px;
  padding: 8px 0;
  width: 100px;
  height: auto;
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-in-out;
  &.mypage {
    background-color: ${({ theme }) => theme.colors.blue};
    color: ${({ theme }) => theme.colors.white};
    &:hover {
      background-color: #0093e8;
    }
  }
  &.logout {
    background-color: ${({ theme }) => theme.colors.line};
    color: #333;
    &:hover {
      background-color: #dcdcdc;
    }
  }
`

export default ProfileBottom
