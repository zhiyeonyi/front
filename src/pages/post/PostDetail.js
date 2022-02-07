import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { history } from '../../redux/ConfigureStore'
import { actionCreators as questionActions } from '../../redux/modules/dictquestion'
import styled from 'styled-components'
import { dictQuestionApi } from '../../shared/api'
import { ConfirmModal, AlertModal, ConfirmButton } from '../../components/modal'
import CommentTest from '../CommentTest'
import { Grid } from '../../elements'
import { ReactComponent as ICuriousToo } from '../../styles/icons/quiz_black_24dp.svg'
import { ReactComponent as ArrowBackIcon } from '../../styles/icons/arrow_back_ios_black_24dp.svg'
import { ReactComponent as CloseIcon } from '../../styles/icons/close.svg'
import { ReactComponent as ThreedotIcon } from '../../styles/icons/more.svg'
import '../../index.css'

const PostDetail = (props) => {
  const dispatch = useDispatch()
  const username = localStorage.getItem('username') // 현재 로그인 한 사람의 아이디
  const questionId = Number(props.match.params.questionId)
  const userId = localStorage.getItem('id')
  const token = localStorage.getItem('token')
  const isLogin = userId !== null && token !== null ? true : false

  const [question, setQuestion] = useState([])
  const [isCuriousToo, setIsCuriousToo] = useState(false)
  const [curiousTooCnt, setCuriousTooCnt] = useState(0)
  const [toggleModalChang, setToggleModalChang] = useState(false)
  const [createdAt, setCreatedAt] = useState('')
  const [showModal, setShowModal] = React.useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const [noChangeModal, setNoChangeModal] = useState(false)

  const handleCloseNoChangeModal = () => {
    setTimeout(() => {
      setNoChangeModal(false)
    }, 1000)
  }

  const handleNoChangeModal = () => {
    setNoChangeModal(true)
    handleCloseNoChangeModal()
  }

  const handleShowModal = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowModal(!showModal)
  }

  const getOneQuestionDB = async () => {
    await dictQuestionApi
      .getOneQuestion(questionId)
      .then((response) => {
        setQuestion(response.data.data)
        setIsCuriousToo(response.data.data.isCuriousToo)
        setCuriousTooCnt(response.data.data.curiousTooCnt)
        setCreatedAt(response.data.data.createdAt.split('T')[0])
      })
      .catch((error) => {
        console.log('게시글 상세 정보 불러오기 문제 발생', error.response)
      })
  }

  const handleDeleteQuestion = () => {
    dispatch(questionActions.delQuestionDB(questionId))
  }

  useEffect(() => {
    getOneQuestionDB()
  }, [])

  const handleClickCuriousToo = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isLogin) {
      setShowLoginModal(true)
      return
    }
    if (isCuriousToo) {
      await dictQuestionApi
        .curiousToo(questionId)
        .then((response) => {
          setIsCuriousToo(false)
          setCuriousTooCnt(curiousTooCnt - 1)
        })
        .catch((error) => {
          console.log('나도 궁금해요 취소 문제 발생', error.response.data.message)
        })
    } else {
      await dictQuestionApi
        .curiousToo(questionId)
        .then((response) => {
          setIsCuriousToo(true)
          setCuriousTooCnt(curiousTooCnt + 1)
        })
        .catch((error) => {
          console.log('나도 궁금해요 문제 발생', error.response)
        })
    }
  }

  const clickToggleModalChang = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setToggleModalChang(!toggleModalChang)
  }

  return (
    <>
      <Header>
        <ArrowBackIcon className="icon" onClick={() => history.goBack()} />
        <HeaderQuestion>질문</HeaderQuestion>
        {username === question.username ? <ThreedotIcon className="icon" onClick={clickToggleModalChang} /> : <div className="empty"></div>}
        {toggleModalChang && (
          <ModalChang>
            {question.selectedComment === 0 ? (
              <>
                <Grid flex_end padding="5px 8px">
                  <CloseIcon className="close-icon" onClick={clickToggleModalChang} />
                </Grid>
                <div className="button-box">
                  <button
                    className="button edit"
                    onClick={() => {
                      history.push(`/dict/question/edit/${questionId}`)
                    }}
                  >
                    수정하기
                  </button>
                </div>
                <div className="button-box">
                  <button className="button delete" onClick={handleShowModal}>
                    삭제하기
                  </button>
                </div>
              </>
            ) : (
              <>
                <Grid flex_end padding="5px 8px">
                  <CloseIcon className="close-icon" onClick={clickToggleModalChang} />
                </Grid>
                <div className="button-box">
                  <button className="button edit" onClick={handleNoChangeModal}>
                    수정하기
                  </button>
                </div>
                <div className="button-box">
                  <button className="button delete" onClick={handleNoChangeModal}>
                    삭제하기
                  </button>
                </div>
              </>
            )}
          </ModalChang>
        )}
      </Header>
      <PostWrap>
        <Grid flex_align padding="5px 0 0 20px">
          <CuriousQ>Q</CuriousQ>
          <div>
            <Title>{question.title}</Title>
            <div className="profile-box">
              <Writer>{question.writer}</Writer>
              <CreatedAt>{question && createdAt}</CreatedAt>
            </div>
          </div>
        </Grid>

        <Middle>
          <Content>{question.content}</Content>
          <ImageBox>
            <ContentImg src={question ? question.thumbNail : null} alt="" />
          </ImageBox>
          <div className="views">조회 {question.views}회</div>
        </Middle>

        <ViewLikeComment>
          {isCuriousToo ? (
            <div className="icon-box" onClick={handleClickCuriousToo}>
              <ICuriousToo fill="#00A0FF" />
              <div style={{ color: '#00A0FF' }} className="icon-box__text">
                나도 궁금해요 {curiousTooCnt}
              </div>
            </div>
          ) : (
            <div className="icon-box" onClick={handleClickCuriousToo}>
              <ICuriousToo fill="#333" className="heart-icon" />
              <div className="icon-box__text">나도 궁금해요 {curiousTooCnt} </div>
            </div>
          )}
        </ViewLikeComment>
      </PostWrap>

      <CommentTest question={question} />

      {noChangeModal && <AlertModal showModal={noChangeModal}>질문 답변 채택 후 수정 삭제가 불가능합니다.</AlertModal>}
      {showModal && (
        <ConfirmModal question="질문을 삭제하시겠어요?" showModal={showModal} handleShowModal={handleShowModal} setShowModal={setShowModal}>
          <ConfirmButton _onClick={handleDeleteQuestion}>삭제</ConfirmButton>
        </ConfirmModal>
      )}
      <ConfirmModal showModal={showLoginModal} setShowModal={setShowLoginModal} title="로그인 후 이용할 수 있어요!" question="로그인 페이지로 이동하시겠어요?">
        <ConfirmButton _onClick={() => history.push('/login')}>이동</ConfirmButton>
      </ConfirmModal>
    </>
  )
}

const Header = styled.header`
  width: 100%;
  height: 56px;
  position: absolute;
  left: 0;
  top: 0;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.bg};
  z-index: 1000;
  margin: 0 0 24px 0;
  border-bottom: 1px solid #e5e5e5;
  box-shadow: 0 0 15px 0 #e5e5e5;
  .icon {
    cursor: pointer;
  }
  .empty {
    width: 24px;
    height: 100%;
  }
`

const HeaderQuestion = styled.div`
  font-family: 'YdestreetB';
  font-style: normal;
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  /* line-height: 29px; */
  display: flex;
  align-items: center;
`

const PostWrap = styled.div`
  padding: 70px 0px 0;
  border-bottom: 2px solid #e5e5e5;
  .profile-box {
    display: flex;
    align-items: center;
    width: 100%;
  }
`
const CuriousQ = styled.div`
  background: #ff8e00;
  width: 40px;
  height: 40px;
  border: 2px solid black;
  border-radius: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'YdestreetB';
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  margin: 0 12px 0 0;
`

const Writer = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.small};
  margin: 0 8px 0 0;
`

const CreatedAt = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: 300;
`

const Middle = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  .views {
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 14px;
    display: flex;
    align-items: center;
  }
`

const Title = styled.div`
  font-weight: 500;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  line-height: 22px;
  display: flex;
  align-items: center;
`

const Content = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.base};
`

const ImageBox = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 12px;
`

const ContentImg = styled.img`
  width: 100%;
  object-fit: cover;
`

const ViewLikeComment = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0 30px;
  .icon-box {
    display: flex;
    align-items: center;
    cursor: pointer;

    .icon-box__text {
      font-size: ${({ theme }) => theme.fontSizes.lg};
      font-family: 'YdestreetL';
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 21px;
      display: flex;
      align-items: center;
      padding: 0 0 0 12px;
    }
  }
`

const ModalChang = styled.div`
  position: absolute;
  top: 50px;
  right: 16px;
  width: 80px;
  height: auto;
  border: 1px solid ${({ theme }) => theme.colors.line};
  box-shadow: 0 4px 35px 4px hsl(0deg 0% 64% / 25%);
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  -webkit-appearance: none;

  .close-icon {
    font-size: 22px;
    cursor: pointer;
    -webkit-appearance: none;
  }
  .button-box {
    width: 100%;
    padding: 8px 12px;
    border-top: 1px solid ${({ theme }) => theme.colors.line};
    display: flex;
    align-items: center;
    justify-content: left;
    --webkit-appearance: none;
    .button {
      font-size: ${({ theme }) => theme.fontSizes.small};
      padding: 0;
    }
  }
`

export default PostDetail
