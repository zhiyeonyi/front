import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { history } from '../redux/ConfigureStore'
import { actionCreators as mypageActions } from '../redux/modules/mypage'
import { mypageApi } from '../shared/api'

import { Grid, ProfileImage } from '../elements'
import ProfileBottom from './ProfileBottom'
import { AlarmModal } from './modal'
import { ReactComponent as ArrowBackIcon } from '../styles/icons/arrow_back_ios_black_24dp.svg'
import { ReactComponent as BellIcon } from '../styles/icons/notification.svg'

const Header = React.memo(({ children, location, type }) => {
  const dispatch = useDispatch()
  const profile = useSelector((state) => state.mypage.myProfile)
  const userId = localStorage.getItem('id')
  const token = localStorage.getItem('token')
  const isLogin = userId !== null && token !== null ? true : false
  const alarmList = profile?.alarm?.length > 5 ? profile?.alarm.slice(0, 5) : profile?.alarm

  const [showProfile, setShowProfile] = useState(false)
  const [showAlarm, setShowAlarm] = useState(false)
  const [alarmUpdated, setAlarmUpdated] = useState(false)

  const handleShowProfile = () => {
    setShowProfile(!showProfile)
  }

  const handleShowAlarm = async () => {
    setShowAlarm(!showAlarm)
    try {
      const { result } = await mypageApi.checkAlarm()
    } catch (error) {
      console.log(error.response)
    }
  }

  useEffect(() => {
    if (isLogin && profile === null) {
      dispatch(mypageActions.getUserProfileDB())
    }
  }, [dispatch, isLogin, profile])

  useEffect(() => {
    if (alarmList?.length > 0) {
      alarmList.forEach((alarm) => {
        if (alarm.checked === false) {
          setAlarmUpdated(true)
        } else {
          setAlarmUpdated(false)
        }
      })
    }
  }, [alarmList])

  if (type === 'goBack') {
    return (
      <>
        <NavHeader>
          <Grid flex_between height="100%">
            <ArrowBackIcon className="arrow-back-icon" onClick={() => history.goBack()} />
            <div className="header-location">{location}</div>
            <div className="header-back-empty"></div>
          </Grid>
        </NavHeader>
      </>
    )
  }

  return (
    <>
      <NavHeader>
        {isLogin ? (
          <Grid flex_between height="100%">
            <div className="header-empty"></div>
            <div className="header-location">{location}</div>
            <div className="header-icon">
              <div className="header-bell-box" onClick={handleShowAlarm}>
                {showAlarm ? (
                  <BellIcon className="shown" />
                ) : alarmUpdated ? (
                  <>
                    <UpdateCircle />
                    <BellIcon className="hidden" />
                  </>
                ) : (
                  <BellIcon className="hidden" />
                )}
              </div>
              <ProfileImage src={profile?.profileImage} _onClick={handleShowProfile} margin="0 0 0 8px" cursor="pointer" size="30" />
            </div>
          </Grid>
        ) : (
          <Grid flex_center height="100%">
            <div className="header-location">{location}</div>
          </Grid>
        )}
      </NavHeader>
      <ProfileBottom profile={profile} showProfile={showProfile} setShowProfile={setShowProfile} />
      {showAlarm && <AlarmModal showAlarm={showAlarm} setShowAlarm={setShowAlarm} alarmList={alarmList !== undefined ? alarmList : []} profile={profile !== null ? profile : ''} />}
    </>
  )
})

const NavHeader = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  padding: 0 16px;
  width: 100%;
  height: 56px;
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};
  z-index: 1000;
  transition: 0.4s ease;
  box-shadow: 0 4px 8px -4px rgba(0, 0, 0, 0.08);
  .header-empty {
    width: 76px;
    height: 100%;
  }
  .header-location {
    font-family: 'YdestreetB';
    font-style: normal;
    font-weight: normal;
    font-size: ${({ theme }) => theme.fontSizes.xl};
    cursor: default;
  }
  .header-icon {
    display: flex;
    align-items: center;
  }
  .header-bell-box {
    width: 36px;
    height: 36px;
    border-radius: 20px;
    background-color: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: background-color 0.3s ease-in-out;
    &:hover {
      background-color: #e9e9e9;
    }
  }

  .arrow-back-icon {
    cursor: pointer;
  }
  .header-back-empty {
    width: 24px;
    height: 100%;
  }
  .shown {
    width: 22px;
    height: 22px;
    fill: ${({ theme }) => theme.colors.blue};
  }
  .hidden {
    width: 22px;
    height: 22px;
    fill: #000;
  }
`

const UpdateCircle = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.blue};
  position: absolute;
  top: 8px;
  right: 8px;
`

export default Header
