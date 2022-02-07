import React from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { actionCreators as commentActions } from '../redux/modules/comment'
import { commentApi } from '../shared/api'
import { dictQuestionApi } from '../shared/api'
import { ConfirmModal, AlertModal, ConfirmButton } from '../components/modal'
import { ReactComponent as EmptyHeartIcon } from '../styles/icons/heart_blank.svg'
import { ReactComponent as FullHeartIcon } from '../styles/icons/heart_filled.svg'
import { ReactComponent as DeleteIcon } from '../styles/icons/bin.svg'
import { ReactComponent as SelectedIcon } from '../styles/icons/selected.svg'
import { Grid, ProfileImage } from '../elements'
import { commentApi } from '../shared/api'
import { history } from '../redux/ConfigureStore'

const OneComment = React.memo((props) => {
  const dispatch = useDispatch()

  const username = localStorage.getItem('username') // 현재 로그인 한 사람의 아이디
  const questionUser = props.username //질문작성자
  const commentWriterId = props.commentWriterId
  const questionId = props.questionId
  const commentId = props.commentId
  const createdAt = props.createdAt.split('T')[0] + ' ' + props.createdAt.split('T')[1].split(':')[0] + ':' + props.createdAt.split('T')[1].split(':')[1]
  const userId = localStorage.getItem('id')
  const token = localStorage.getItem('token')
  const isLogin = userId !== null && token !== null ? true : false

  const [isLiked, setIsLiked] = React.useState(props.isLike)
  const [likeCount, setLikeCount] = React.useState(props.likeCount)
  const [isSelected, setIsSelected] = React.useState(props.isSelected)
  const [selectModal, setSelectModal] = React.useState(false)
  const [showModal, setShowModal] = React.useState(false)
  const [showLoginModal, setShowLoginModal] = React.useState(false)



  const handleClickLike = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isLogin) {
      setShowLoginModal(true)
      return
    }
    if (isLiked) {
      await commentApi
        .likeComment(commentId)
        .then((response) => {
          setIsLiked(false)
          setLikeCount(likeCount - 1)
        })
        .catch((error) => {
          console.log('답변 좋아요 취소 문제 발생', error.response)
        })
    } else {
      await commentApi
        .likeComment(commentId)
        .then((response) => {
          setIsLiked(true)
          setLikeCount(likeCount + 1)
        })
        .catch((error) => {
          console.log('답변 좋아요 문제 발생', error.response)
        })
    }
  }

  const handleClickIsSelected = async (e) => {
    if (props.isSelected === true) {
      console.log('이미 채택된 질문입니다.')
    } else if (!isSelected || username !== props.commentwriterId) {
      await dictQuestionApi
        .selectQuestion(commentId)
        .then((response) => {
          setIsSelected(true)
          setSelectModal(false)
          window.location.reload()
        })
        .catch((error) => {
          console.log('질문채택 문제 발생', error.response)
        })
    }
  }

  const handleSelectModal = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectModal(!selectModal)
  }

  const handleShowModal = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowModal(!showModal)
  }

  const delComment = () => {
    dispatch(commentActions.delCommentDB(questionId, commentId))
    setShowModal(false)
  }

  return (
    <>
      <Wrap>
        <Grid flex_align>
          <ProfileImage src={props.profileImageUrl} size="40" border margin="0 12px 0 20px" />
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <UserName>{props.commentWriter}</UserName>
            <CreatedAt>{createdAt}</CreatedAt>
          </div>
        </Grid>

        {props.selectedComment === commentId ? (
          <Select>
            <SelectedIcon fill="#FFFFFF" />
            <SelectTextTure>채택</SelectTextTure>
          </Select>
        ) : questionUser !== username ? (
          <Select>
            <SelectedIcon />
            <SelectText>채택</SelectText>
          </Select>
        ) : questionUser === commentWriterId ? null : (
          <Select onClick={handleSelectModal}>
            <SelectedIcon />
            <SelectText>채택</SelectText>
          </Select>
        )}

        {selectModal && (
          <ConfirmModal question="채택 후 변경이 불가합니다. 이 답변을 채택하시겠습니까?" showModal={selectModal} handleShowModal={handleSelectModal} setShowModal={setSelectModal}>
            <ConfirmButton _onClick={handleClickIsSelected}>채택</ConfirmButton>
          </ConfirmModal>
        )}
      </Wrap>
      <ContentWrap>
        <Content>{props.commentContent}</Content>
        <IconBox>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isLiked ? <FullHeartIcon className="icon" onClick={handleClickLike} /> : <EmptyHeartIcon className="icon" onClick={handleClickLike} />}
            <Number className="like-count">{likeCount}</Number>
          </div>
          {props.selectedComment !== commentId && commentWriterId === username ? <DeleteIcon className="icon" onClick={handleShowModal} /> : null}
        </IconBox>

        {showModal && (
          <ConfirmModal question="댓글을 삭제하시겠어요?" showModal={showModal} handleShowModal={handleShowModal} setShowModal={setShowModal}>
            <ConfirmButton _onClick={delComment}>삭제</ConfirmButton>
          </ConfirmModal>
        )}
        <ConfirmModal showModal={showLoginModal} setShowModal={setShowLoginModal} title="로그인 후 이용할 수 있어요!" question="로그인 페이지로 이동하시겠어요?">
          <ConfirmButton _onClick={() => history.push('/login')}>이동</ConfirmButton>
        </ConfirmModal>
      </ContentWrap>
    </>
  )
})

const Wrap = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid #e5e5e5;
`

const UserName = styled.div`
  font-weight: 500;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  line-height: 22px;
  display: flex;
  align-items: center;
`

const CreatedAt = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: 300;
`
const Select = styled.div`
  width: 80px;
  height: 84px;
  background: #00a0ff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`
const SelectTextTure = styled.div`
  font-family: 'YdestreetL';
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 22px;
  display: flex;
  align-items: center;
  color: white;
`

const SelectText = styled.div`
  font-family: 'YdestreetL';
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 22px;
  display: flex;
  align-items: center;
`

const ContentWrap = styled.div`
  border-bottom: 10px solid #e5e5e5;
  padding: 32px 20px;
`

const Content = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.base};
  line-height: 24px;
  display: flex;
  align-items: center;
  padding: 0 0 20px;
`

const IconBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .icon {
    cursor: pointer;
  }
`
const Number = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: 300;
  margin: 0 0 0 5px;
`
export default OneComment
