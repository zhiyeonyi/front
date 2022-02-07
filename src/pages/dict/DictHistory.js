import React, { useState, useEffect } from 'react'
import '../../styles/css/DictHistory.css'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { history } from '../../redux/ConfigureStore'
import { dictApi } from '../../shared/api'
import { Header, Footer } from '../../components'
import SearchPage from '../../shared/SearchPage'
import { ConfirmModal, ConfirmButton } from '../../components/modal'
import { ProfileImage } from '../../elements'

const DictEditHistory = (props) => {
  const dispatch = useDispatch()

  const userId = localStorage.getItem('id')
  const token = localStorage.getItem('token')
  const isLogin = userId !== null && token !== null ? true : false

  const [show, setShow] = useState(false)

  const dictId = Number(props.match.params.dictId)
  const [isDict, setIsDict] = useState([])
  const [dictHistory, setDictHistory] = useState([])
  const [firstCreatedAt, setFirstCreatedAt] = useState('')

  const [showModal, setShowModal] = useState(false)

  React.useEffect(() => {
    getDictHistoryDB()
  }, [])

  const getDictHistoryDB = async () => {
    const dictId = Number(props.match.params.dictId)
    let response = await dictApi.dictEditHistory(dictId)

    setIsDict(response.data.data)
    setDictHistory(response.data.data.history)
    setFirstCreatedAt(response.data.data.firstCreatedAt.split('T')[0])
  }

  const handleClickEdit = () => {
    if (!isLogin) {
      setShowModal(true)
    } else {
      history.push(`/dict/edit/${dictId}`)
    }
  }

  return (
    <>
      <Header type="goBack" location="오픈 밈사전" />
      <SearchBarSection>{show && <SearchPage />}</SearchBarSection>
      <div className="DictHistoryPageLayout">
        <div className="DictHistoryListText">"{isDict.title}"에 대한 편집기록</div>
        <div className="DictHistoryListSection">
          {dictHistory.map((dictId) => (
            <div className="DictHistoryList" key={dictId.historyId}>
              <div className="DictWriterInfo">
                <ProfileImage src={dictId.writerProfileImage} size="35" border margin="0 10px 0 0" />
                <div className="DictWriter">{dictId.writer} 님의 편집 내역</div>
              </div>
              <div className="DictHistoryCreatedAt">편집일 : {dictId.createdAt.split('T', 1)}</div>
            </div>
          ))}
          <div className="DictHistoryList">
            <div className="DictHistoryFirstWriterInfo">
              <ProfileImage src={isDict.firstWriterProfileImage} size="35" border margin="0 10px 0 0" />
              <div className="DictHistoryFirstWriter">{isDict.firstWriter} 님의 단어 등록</div>
            </div>
            <div className="DictHistoryFirstCreatedAt">등록일 : {firstCreatedAt}</div>
          </div>
        </div>
        <div className="DictHistoryModifiedDictGuideTextAndButton">
          <div className="DictHistoryModifiedDictGuideText">직접 단어의 뜻을 업데이트 할 수 있어요!</div>
          <div className="DictHistoryModifiedButton" onClick={handleClickEdit}>
            <div className="DictHistoryModifiedButton_1">편집하기</div>
            <div className="DictHistoryModifiedButton_2"></div>
          </div>
        </div>
      </div>
      <Footer />
      <ConfirmModal showModal={showModal} setShowModal={setShowModal} title="로그인 후 이용할 수 있어요!" question="로그인 페이지로 이동하시겠어요?">
        <ConfirmButton _onClick={() => history.push('/login')}>이동</ConfirmButton>
      </ConfirmModal>
    </>
  )
}

const SearchBarSection = styled.div`
  position: absolute;
  top: 74px;
  width: 100%;
  height: fit-content;
  z-index: 5;
`

export default DictEditHistory
