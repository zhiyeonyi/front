import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { history } from '../../redux/ConfigureStore'
import { imageApi } from '../../shared/api'
import { likeApi } from '../../shared/api'

import { Grid, ProfileImage } from '../../elements'
import { ConfirmModal, ConfirmButton } from '../../components/modal'
import ImageWrapper from '../../components/image/ImageWrapper'
import { ShareBottomSheet } from '../../components'

import { ReactComponent as CloseIcon } from '../../styles/icons/size(28*28)(30*30)/close_28dp.svg'
import { ReactComponent as DeleteIcon } from '../../styles/icons/size(28*28)(30*30)/bin_28dp.svg'
import { ReactComponent as ShareIcon } from '../../styles/icons/size(28*28)(30*30)/share_28dp.svg'
import { ReactComponent as EmptyHeartIcon } from '../../styles/icons/size(28*28)(30*30)/heart_blank_28dp.svg'
import { ReactComponent as FullHeartIcon } from '../../styles/icons/size(28*28)(30*30)/heart_filled_28dp.svg'

const ImageDetail = (props) => {
  const boardId = useParams().imageId
  const username = localStorage.getItem('username')
  const userId = localStorage.getItem('id')
  const token = localStorage.getItem('token')
  const isLogin = userId !== null && token !== null ? true : false

  const [imageData, setImageData] = useState('')
  const [likeCount, setLikeCount] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [createdAt, setCreatedAt] = useState('')
  const [thumbNail, setThumbNail] = useState('')
  const [shareVisible, setShareVisible] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleShowModal = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowModal(!showModal)
  }

  const handleShareVisible = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShareVisible(!shareVisible)
  }

  const handleClickLike = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isLogin) {
      setShowLoginModal(true)
      return
    }
    if (isLiked) {
      await likeApi
        .likeBoard(boardId)
        .then((response) => {
          setIsLiked(false)
          setLikeCount(likeCount - 1)
        })
        .catch((error) => {
          console.log('이미지 좋아요 취소 문제 발생', error.response)
        })
    } else {
      await likeApi
        .likeBoard(boardId)
        .then((response) => {
          setIsLiked(true)
          setLikeCount(likeCount + 1)
        })
        .catch((error) => {
          console.log('이미지 좋아요 문제 발생', error.response)
        })
    }
  }

  const handleDeleteImage = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    await imageApi
      .deleteImage(boardId)
      .then((response) => {})
      .then(() => {
        window.location.replace('/image')
      })
      .catch((error) => {
        console.log('이미지 삭제 문제 발생', error.response)
      })
  }

  useEffect(() => {
    imageApi
      .getImageDetail(boardId)
      .then((response) => {
        const image_data = response.data.data
        setImageData(image_data)
        setLikeCount(image_data.likeCnt)
        setIsLiked(image_data.isLike)
        setThumbNail(image_data.thumbNail)
        const createdDate = image_data.createdAt.split('T')[0]
        setCreatedAt(createdDate)
      })
      .catch((error) => {
        console.log('상세 이미지를 불러오는 데 문제가 발생했습니다.', error.response)
      })
  }, [boardId])

  return (
    <>
      <ImageWrapper>
        <Grid flex_between padding="0 16px">
          <CloseIcon
            className="icon"
            onClick={() => {
              // history.replace('/image')
              history.goBack()
            }}
          />
        </Grid>
        <Grid flex_between padding="16px">
          <Grid flex_align>
            <ProfileImage src={imageData.profileImageUrl} size="40" />
            <div style={{ paddingLeft: '10px', display: 'flex', flexDirection: 'column' }}>
              <ImageWriter>{imageData.writer}</ImageWriter>
              <ImageCreatedAt>{createdAt}</ImageCreatedAt>
            </div>
          </Grid>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ShareIcon className="icon" onClick={handleShareVisible} />
            {imageData && imageData.username === username && <DeleteIcon className="icon" style={{ margin: '0 0 0 16px' }} onClick={handleShowModal} />}
          </div>
        </Grid>
        <Grid flex_center height="fit-content" overflow="hidden">
          <img src={imageData.thumbNail} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="짤 이미지" />
        </Grid>
        <Grid flex_align padding="10px 16px 16px">
          {isLiked ? <FullHeartIcon className="icon" onClick={handleClickLike} /> : <EmptyHeartIcon className="icon" onClick={handleClickLike} />}
          <ImageLikeCount>{likeCount}</ImageLikeCount>
        </Grid>
        <ShareBottomSheet type="image" shareVisible={shareVisible} setShareVisible={setShareVisible} thumbNail={thumbNail} boardId={boardId} />
      </ImageWrapper>
      <ConfirmModal question="밈짤을 삭제하시겠어요?" showModal={showModal} handleShowModal={handleShowModal} setShowModal={setShowModal}>
        <ConfirmButton _onClick={handleDeleteImage}>삭제</ConfirmButton>
      </ConfirmModal>
      <ConfirmModal showModal={showLoginModal} setShowModal={setShowLoginModal} title="로그인 후 이용할 수 있어요!" question="로그인 페이지로 이동하시겠어요?">
        <ConfirmButton _onClick={() => history.push('/login')}>이동</ConfirmButton>
      </ConfirmModal>
    </>
  )
}

const ImageWriter = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.white};
  font-weight: 500;
`
const ImageCreatedAt = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.white};
`
const ImageLikeCount = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.white};
  padding: 0 0 0 5px;
`

export default ImageDetail
