import React from 'react'
import styled from 'styled-components'
import { history } from '../../redux/ConfigureStore'
import { useDispatch } from 'react-redux'
import { actionCreators as imageActions } from '../../redux/modules/image'

import Grid from '../../elements/Grid'
import { ConfirmModal, ConfirmButton } from '../../components/modal'
import ImageWrapper from '../../components/image/ImageWrapper'
import { ReactComponent as CloseIcon } from '../../styles/icons/X_24dp.svg'

const ImageUpload = ({ preview, fileInput }) => {
  const dispatch = useDispatch()

  const [showModal, setShowModal] = React.useState(false)

  const handleShowModal = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowModal(!showModal)
  }

  const handleUploadImage = () => {
    const uploadFile = fileInput.current.files[0]
    dispatch(imageActions.uploadImageDB(uploadFile))
    setShowModal(!showModal)
  }

  return (
    <>
      <ImageWrapper>
        <Grid flex_between padding="0 16px 16px">
          <CloseIcon
            className="icon"
            onClick={() => {
              history.go('/image')
            }}
          />
          <UploadButton onClick={handleShowModal}>등록</UploadButton>
        </Grid>
        <Grid height="fit-conent" overflow="hidden">
          <img src={preview} style={{ width: '100%', objectFit: 'cover' }} alt="업로드할 이미지" />
        </Grid>
      </ImageWrapper>
      {showModal && (
        <ConfirmModal question="밈짤을 게시하시겠어요?" showModal={showModal} handleShowModal={handleShowModal} setShowModal={setShowModal}>
          <ConfirmButton _onClick={handleUploadImage}>게시</ConfirmButton>
        </ConfirmModal>
      )}
    </>
  )
}

const UploadButton = styled.button`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-family: 'YdestreetB';
  font-style: normal;
  font-weight: normal;
`

export default ImageUpload
