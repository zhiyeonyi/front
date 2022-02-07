import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

import { Grid } from '../elements'
import SmileIcon from '../styles/image/smileIcon_Blue.png'
import { ReactComponent as DictIcon } from '../styles/icons/Dockbar_dictionary.svg'
import { ReactComponent as MyPageIcon } from '../styles/icons/Dockbar_mypage.svg'
import { ReactComponent as QuizIcon } from '../styles/icons/Dockbar_quiz.svg'
import { ReactComponent as ZzalbangIcon } from '../styles/icons/Dockbar_zzalbang.svg'

const Footer = React.memo((props) => {
  const userId = localStorage.getItem('id')
  const token = localStorage.getItem('token')
  const isLogin = userId !== null && token !== null ? true : false
  const activeStyle = {
    color: '#00A0FF',
    fill: '#00A0FF',
  }
  return (
    <>
      <NavContainer>
        <NavBar>
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink to="/dict" className="nav-link" activeStyle={activeStyle}>
                <Grid flex_center column>
                  <DictIcon className="nav-icon" />
                  <div className="nav-link__text">밈사전</div>
                </Grid>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/image" className="nav-link" activeStyle={activeStyle}>
                <Grid flex_center column>
                  <ZzalbangIcon className="nav-icon" />
                  <div className="nav-link__text">밈짤방</div>
                </Grid>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/" exact className="nav-link fixed" activeStyle={activeStyle}>
                <Grid flex_center column>
                  <Logo src={SmileIcon} />
                </Grid>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/quiz" className="nav-link" activeStyle={activeStyle}>
                <Grid flex_center column>
                  <QuizIcon className="nav-icon" />
                  <div className="nav-link__text">밈퀴즈</div>
                </Grid>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to={isLogin ? '/mypage' : '/login'} className="nav-link" activeStyle={activeStyle}>
                <Grid flex_center column>
                  <MyPageIcon className="nav-icon" />
                  <div className="nav-link__text">MY</div>
                </Grid>
              </NavLink>
            </li>
          </ul>
        </NavBar>
      </NavContainer>
    </>
  )
})

const NavContainer = styled.div`
  width: 100%;
  padding: 0 16px 10px;
  position: absolute;
  left: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5000;
`

const NavBar = styled.nav`
  width: 100%;
  height: 70px;
  background-color: ${({ theme }) => theme.colors.yellow};
  border-radius: 28px;
  border: 2px solid #000;
  padding: 4px 10px 0;
  z-index: 5000;

  .nav-list {
    height: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: space-around;

    .nav-item {
      max-width: 50px;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .nav-link {
        width: 100%;
        .nav-icon {
        }
        &:visited,
        &:link {
          text-decoration: none;
          color: ${({ theme }) => theme.colors.black};
        }
        .nav-link__text {
          font-size: ${({ theme }) => theme.fontSizes.small};
          font-family: 'YdestreetB';
          font-style: normal;
          font-weight: normal;
          padding: 3px 0 0;
        }
      }
    }
  }
`

const Logo = styled.div`
  width: 40px;
  height: 40px;
  border: 2px solid #111;
  cursor: pointer;
  background-size: cover;
  background-image: url('${(props) => props.src}');
  background-position: center;
`

export default Footer
