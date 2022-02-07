import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { likeApi } from '../../shared/api'
import { history } from '../../redux/ConfigureStore'

import ShareBottomSheet from '../ShareBottomSheet'
import { Grid } from '../../elements'
import { ConfirmModal, ConfirmButton } from '../modal'

import { ReactComponent as ShareIcon } from '../../styles/icons/share.svg'
import { ReactComponent as EmptyHeartIcon } from '../../styles/icons/heart_blank.svg'
import { ReactComponent as FullHeartIcon } from '../../styles/icons/heart_filled.svg'

const OneImageCard = React.memo(({ image, type }) => {
  const boardId = image.boardId
  const userId = localStorage.getItem('id')
  const token = localStorage.getItem('token')
  const isLogin = userId !== null && token !== null ? true : false

  const canvasRef = useRef()
  const imgRef = useRef()

  const [hover, setHover] = useState(false)
  const [likeCount, setLikeCount] = useState(image.likeCnt)
  const [isLiked, setIsLiked] = useState(image.isLike)
  const [shareVisible, setShareVisible] = useState(false)
  const [thumbNail, setThumbNail] = useState(image ? image.thumbNail : '')
  const [showModal, setShowModal] = useState(false)

  const handleShareVisible = (e) => {
    e.stopPropagation()
    setShareVisible(!shareVisible)
  }

  const handleClickLike = async (e) => {
    e.stopPropagation()
    if (!isLogin) {
      setShowModal(true)
      return
    }
    if (isLiked) {
      await likeApi
        .likeBoard(image.boardId)
        .then((response) => {
          console.log(response.data)
          setIsLiked(false)
          setLikeCount(likeCount - 1)
        })
        .catch((error) => {
          console.log('이미지 좋아요 취소 문제 발생', error.response)
        })
    } else {
      await likeApi
        .likeBoard(image.boardId)
        .then((response) => {
          console.log(response.data)
          setIsLiked(true)
          setLikeCount(likeCount + 1)
        })
        .catch((error) => {
          console.log('이미지 좋아요 문제 발생', error.response)
        })
    }
  }

  const drawCanvas = function () {
    const img = new Image()
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')

    if (ctx) {
      canvas.maxWidth = 150
      canvas.height = '100%'
      canvas.objectFit = 'cover'
      canvas.backgroundColor = 'rgb(255, 255, 255)'

      img.src = image && image.thumbNail
      img.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, 200, 200)
      }

      canvas.toBlob(function (blob) {
        const reader = new FileReader()
        reader.onload = function (e) {
          imgRef.current.src = reader.result
        }
        reader.readAsDataURL(blob)
      })
    } else {
      throw new Error('Could not get context')
    }
  }

  // useEffect(() => {
  //   drawCanvas()
  // }, [])

  return (
    <>
      <ImageBox
        onMouseOver={() => {
          setHover(true)
        }}
        onMouseLeave={() => {
          setHover(false)
        }}
        onClick={() => {
          history.push(`/image/detail/${image && image.boardId}`)
        }}
      >
        <ImageThumbnail ref={imgRef} src={image && image.thumbNail}></ImageThumbnail>
        {/* <canvas ref={canvasRef}></canvas> */}
        {/* {hover && ( */}
        <Overlay className={`${hover ? 'active' : 'inactive'}`}>
          <Grid flex_between column height="100%" padding="6px">
            <Grid flex_end>
              <ShareIcon fill="#FFF" width="24px" onClick={handleShareVisible} />
            </Grid>
            <Grid flex_start>
              {isLiked ? <FullHeartIcon fill="#FFF" onClick={handleClickLike} /> : <EmptyHeartIcon fill="#FFF" onClick={handleClickLike} />}
              <span className="like-count">{likeCount}</span>
            </Grid>
          </Grid>
        </Overlay>
      </ImageBox>
      <ShareBottomSheet type="image" shareVisible={shareVisible} setShareVisible={setShareVisible} thumbNail={thumbNail} boardId={boardId} />
      <ConfirmModal showModal={showModal} setShowModal={setShowModal} title="로그인 후 이용할 수 있어요!" question="로그인 페이지로 이동하시겠어요?">
        <ConfirmButton _onClick={() => history.push('/login')}>이동</ConfirmButton>
      </ConfirmModal>
    </>
  )
})

const ImageBox = styled.div`
  display: flex;
  display: -webkit-flex;
  display: -ms-flexbox;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  width: 100%;
  margin-bottom: 7px;
  /* box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2); */

  .active {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 100;
    transition: all 0.2s ease-in-out;
    &:hover {
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
  .inactive {
    display: none;
  }
`

const ImageThumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const Overlay = styled.div`
  .like-count {
    color: ${({ theme }) => theme.colors.white};
    font-size: ${({ theme }) => theme.fontSizes.base};
    padding: 0 0 0 3px;
  }
`

export default OneImageCard
