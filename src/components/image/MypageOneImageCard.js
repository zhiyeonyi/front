import React from 'react'
import styled from 'styled-components'
import { history } from '../../redux/ConfigureStore'
import { imageApi } from '../../shared/api'

import { Grid } from '../../elements'
import { ConfirmModal, ConfirmButton } from '../modal'
import { ReactComponent as DeleteIcon } from '../../styles/icons/bin.svg'
import { ReactComponent as EmptyHeart } from '../../styles/icons/heart_blank.svg'

const MyPageOneImageCard = React.memo(({ image }) => {
  const boardId = image && image.boardId
  const createdDate = image && image.createdAt.split('T')[0]

  const [showModal, setShowModal] = React.useState(false)

  const handleShowModal = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowModal(!showModal)
  }

  const handleDeleteImage = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    await imageApi
      .deleteImage(boardId)
      .then((response) => {})
      .then(() => {
        window.location.reload()
      })
      .catch((error) => {
        console.log('이미지 삭제 문제 발생', error.response)
      })
  }

  return (
    <>
      <Wrapper>
        <ImageSection>
          <ImageBox
            onClick={(e) => {
              history.push(`/image/detail/${image.boardId}`)
            }}
          >
            <Image src={image && image.thumbNail} />
          </ImageBox>
          <div className="delete-icon-box">
            <DeleteIcon className="icon" onClick={handleShowModal} />
          </div>
        </ImageSection>
        <Grid flex_between padding="8px 8px 0 0">
          <Grid flex_align>
            <EmptyHeart className="icon" />
            <span className="like-count">{image && image.likeCnt}</span>
          </Grid>
          <p className="createdDate">{image && createdDate}</p>
        </Grid>
      </Wrapper>
      {showModal && (
        <ConfirmModal question="밈짤을 삭제하시겠어요?" showModal={showModal} handleShowModal={handleShowModal} setShowModal={setShowModal}>
          <ConfirmButton _onClick={handleDeleteImage}>삭제</ConfirmButton>
        </ConfirmModal>
      )}
    </>
  )
})

const Wrapper = styled.div`
  position: relative;
  max-width: 220px;
  width: 100%;
  height: fit-content;
  margin: 10px 0 16px;
  padding: 10px 2px 10px 10px;
  border: 2px solid ${({ theme }) => theme.colors.black};
  display: flex;
  flex-direction: column;
  .createdDate {
    width: 100%;
    font-size: ${({ theme }) => theme.fontSizes.small};
    color: ${({ theme }) => theme.colors.grey};
    text-align: right;
  }
  .delete-icon-box {
    margin: 0 0 0 5px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 24px;
    transition: background-color 0.3s ease-in-out;
    &:hover {
      background-color: #e9e9e9;
    }
  }
  .like-count {
    font-size: ${({ theme }) => theme.fontSizes.base};
    padding: 0 0 0 4px;
    color: ${({ theme }) => theme.colors.grey};
  }
  .icon {
    width: 20px;
    height: 20px;
    fill: ${({ theme }) => theme.colors.grey};
  }
`

const ImageSection = styled.section`
  display: flex;
  width: 100%;
  height: fit-content;
`

const ImageBox = styled.div`
  /* display: flex; */
  width: calc(100% - 33px);
  /* height: fit-content; */
  /* position: relative; */
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${({ theme }) => theme.colors.black};
`

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export default MyPageOneImageCard
