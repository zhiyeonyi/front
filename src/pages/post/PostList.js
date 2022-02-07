import React, { useEffect, useState } from 'react'
import { history } from '../../redux/ConfigureStore'
import styled from 'styled-components'
import { PostCard, Header, Footer, DictNavBar, SpeedDialButton } from '../../components'
import Pagination from 'rc-pagination'
import { dictQuestionApi } from '../../shared/api'
import { Grid, Title } from '../../elements'
import '../../index.css'
import { ConfirmModal, ConfirmButton } from '../../components/modal'
import SearchPage from '../../shared/SearchPage'
import { ReactComponent as WriteIcon } from '../../styles/icons/write.svg'

const PostList = (props) => {
  const userId = localStorage.getItem('id')
  const token = localStorage.getItem('token')
  const isLogin = userId !== null && token !== null ? true : false

  const [question, setQuestion] = useState([])
  const [pageSize, setPageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    getQuestionListDB()
  }, [currentPage])

  const getQuestionListDB = async () => {
    let response = await dictQuestionApi.getQuestions(pageSize, currentPage)
    let totalLength = await dictQuestionApi.totalLength()
    setQuestion(response.data.data)
    setTotalCount(totalLength.data.data)
  }

  const handleClickWrite = () => {
    if (!isLogin) {
      setShowModal(true)
    } else {
      history.push('/dict/question/write')
    }
  }

  return (
    <>
      <Header location="오픈 밈사전" />
      <Container>
        <DictNavBar />
        <>
          <SearchBarSection>
            <SearchPage />
          </SearchBarSection>
          <Wrap>
            <CuriousHelp>
              <Title>궁금해요!</Title>
              <div className="wait">답변을 기다리고 있어요~</div>
            </CuriousHelp>
            {question &&
              question.map((question, index) => {
                return <PostCard question={question} key={question.questionId} />
              })}

            <Pagination simple total={totalCount} current={currentPage} pageSize={pageSize} onChange={(page) => setCurrentPage(page)} />
            <Grid height="90px" />
          </Wrap>
        </>
      </Container>
      <Footer />
      <SpeedDialButton _onClick={handleClickWrite}>
        <WriteIcon fill="#FFFFFF" />
      </SpeedDialButton>
      <ConfirmModal showModal={showModal} setShowModal={setShowModal} title="로그인 후 이용할 수 있어요!" question="로그인 페이지로 이동하시겠어요?">
        <ConfirmButton _onClick={() => history.push('/login')}>이동</ConfirmButton>
      </ConfirmModal>
    </>
  )
}

export default PostList

const Container = styled.div`
  padding: 56px 0 0;
  height: 100%;
  position: relative;
`
const SearchBarSection = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px 16px 16px;
`

const Wrap = styled.div`
  /* position: absolute; */
  width: 100%;
  height: 100%;
  padding: 16px 16px 0;
`
const CuriousHelp = styled.div`
  display: flex;
  margin: 0 0 16px;
  .curious {
    font-family: 'YdestreetL';
    font-style: normal;
    font-weight: bold;
    font-size: 22px;
    line-height: 29px;
    display: flex;
    align-items: center;
  }
  .wait {
    font-size: ${({ theme }) => theme.fontSizes.base};
    display: flex;
    align-items: center;
    margin: 0 0 0 8px;
  }
`
const MoveLoginButton = styled.button`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.blue};
  padding: 0;
`
