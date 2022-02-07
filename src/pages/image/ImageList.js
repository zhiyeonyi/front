import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import Masonry from 'react-masonry-css'
import { useDispatch, useSelector } from 'react-redux'
import { imageApi } from '../../shared/api'
import { actionCreators as imageActions } from '../../redux/modules/image'
import { history } from '../../redux/ConfigureStore'

import { Title, Grid } from '../../elements'
import { Header, Footer, SpeedDialButton, Spinner } from '../../components'
import InfinityScroll from '../../shared/InfinityScroll'
import ImageUpload from '../image/ImageUpload'
import OneImageCard from '../../components/image/OneImageCard'
import { ConfirmModal, ConfirmButton } from '../../components/modal'
import { ReactComponent as WriteIcon } from '../../styles/icons/write.svg'

const ImageList = (props) => {
  const dispatch = useDispatch()
  const fileInput = useRef('')
  const image_data = useSelector((state) => state.image)

  const userId = localStorage.getItem('id')
  const token = localStorage.getItem('token')
  const isLogin = userId !== null && token !== null ? true : false

  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [bestImageList, setBestImageList] = useState([])
  const [showModal, setShowModal] = useState(false)

  const getImageList = () => {
    dispatch(imageActions.getImageListDB(image_data.page))
  }

  const handleClickWrite = () => {
    if (!isLogin) {
      setShowModal(true)
    }
  }

  const handleChangeFile = (e) => {
    setPreview(e.target.value)
    let reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    reader.onload = () => {
      const file = reader.result

      if (file) {
        let fileInfo = file.toString()
        setPreview(fileInfo)
      }
    }
  }

  // useEffect(() => {
  //   setLoading(true)
  //   setTimeout(() => setLoading(false), 700)
  // }, [])

  useEffect(() => {
    dispatch(imageActions.getImageListDB(0))
    imageApi
      .getBestImageList()
      .then((response) => {
        setBestImageList(response.data.data.slice(0, 3))
      })
      .catch((error) => {
        console.log('명예의 전당 이미지 불러오기 문제 발생', error.response)
      })
    dispatch(imageActions.initImageList())
  }, [dispatch])

  return (
    <>
      <Grid flex column padding="60px 0 0" height="100%">
        <Header location="짤방"></Header>
        {loading ? (
          <Spinner />
        ) : (
          <>
            <Grid padding="16px">
              <Title>명예의 밈짤</Title>
              <Container>
                <PopularGridLayout>
                  {bestImageList.map((image) => {
                    return <OneImageCard type="popular" key={image.boardId} image={image} />
                  })}
                </PopularGridLayout>
              </Container>
            </Grid>
            <Grid padding="0 16px 90px">
              <Title>짤 방앗간</Title>
              <Container>
                <InfinityScroll callNext={getImageList} paging={{ next: image_data.has_next }}>
                  <Masonry breakpointCols={3} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
                    {image_data.image_list.map((image) => {
                      return <OneImageCard key={image.boardId} image={image} />
                    })}
                  </Masonry>
                </InfinityScroll>
              </Container>
            </Grid>
            <SpeedDialButton _onClick={handleClickWrite}>
              {isLogin ? (
                <>
                  <FileInputLabel htmlFor="file" className="upload-label">
                    <WriteIcon fill="#FFFFFF" />
                  </FileInputLabel>
                  <FileInput type="file" id="file" className="upload-file" accept="image/jpg, image/jpeg, image/png, image/gif" ref={fileInput} onChange={handleChangeFile} />
                </>
              ) : (
                <WriteIcon fill="#FFFFFF" />
              )}
            </SpeedDialButton>
          </>
        )}
        {preview && <ImageUpload preview={preview} fileInput={fileInput} />}
        <Footer />
      </Grid>
      <ConfirmModal showModal={showModal} setShowModal={setShowModal} title="로그인 후 이용할 수 있어요!" question="로그인 페이지로 이동하시겠어요?">
        <ConfirmButton _onClick={() => history.push('/login')}>이동</ConfirmButton>
      </ConfirmModal>
    </>
  )
}

const FileInputLabel = styled.label`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`

const FileInput = styled.input`
  position: absolute;
  overflow: hidden;
  padding: 0;
  margin: -1px;
  width: 1px;
  height: 1px;
  clip: rect(0, 0, 0, 0);
  border: 0;
`

const Container = styled.div`
  padding: 20px 0 0;
  .my-masonry-grid {
    display: -webkit-box; /* Not needed if autoprefixing */
    display: -ms-flexbox; /* Not needed if autoprefixing */
    display: flex;
    margin-left: -7px; /* gutter size offset */
    width: auto;
  }
  .my-masonry-grid_column {
    padding-left: 7px; /* gutter size */
    background-clip: padding-box;
  }
`

const PopularGridLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: minmax(100px, 180px);
  column-gap: 7px;

  div {
    &:nth-child(1) {
      grid-column: 1 / 2;
      grid-row: 1 / 2;
    }
    &:nth-child(2) {
      grid-column: 2 / 3;
      grid-row: 1 / 3;
    }
    &:nth-child(3) {
      grid-column: 1 / 2;
      grid-row: 2 / 3;
    }
  }
`

export default ImageList
