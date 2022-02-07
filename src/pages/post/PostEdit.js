import React, { useState, createRef } from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { actionCreators as QuestionActions } from '../../redux/modules/dictquestion'
import { dictQuestionApi } from '../../shared/api'
import { ReactComponent as AddPhotoIcon } from '../../styles/icons/size(28*28)(30*30)/addphoto_30dp.svg'
import { history } from '../../redux/ConfigureStore'
import { Header } from '../../components'
import { AlertModal } from '../../components/modal'

const PostEdit = (props) => {
  const dispatch = useDispatch()
  const questionId = Number(props.match.params.questionId)

  const textRef = createRef()
  const fileInput = React.useRef('')

  const [post, setPost] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbNail, setThumbNail] = useState('')
  const [showAlert, setShowAlert] = useState(false)

  const getOneQuestionDB = async () => {
    await dictQuestionApi
      .getOneQuestion(questionId)
      .then((response) => {
        const _question = response.data.data
        setPost(response.data.data)
        setTitle(_question.title)
        setContent(_question.content)
        setThumbNail(_question.thumbNail)
      })
      .catch((error) => {
        console.log('게시글 상세 조회 문제 발생', error.response)
      })
  }

  React.useEffect(() => {
    getOneQuestionDB()
  }, [])

  const handleTextareaResize = () => {
    const obj = textRef.current
    obj.style.height = 'auto'
    obj.style.height = obj.scrollHeight + 'px'
  }

  const onChangeTitle = (e) => {
    setTitle(e.target.value)
  }

  const onChangeContent = (e) => {
    setContent(e.target.value)
  }

  const onChangeFile = (e) => {
    setThumbNail(e.target.files)
    let reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])

    reader.onload = () => {
      const file = reader.result

      if (file) {
        let fileInfo = file.toString()
        setThumbNail(fileInfo)
      }
    }
  }

  const editQuestion = () => {
    if (title === '' || content === '') {
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 1000)
      return
    }

    if (fileInput.current.files.length === 0) {
      const uploadFile = post && post.thumbNail
      dispatch(QuestionActions.editQuestionDB(questionId, title, uploadFile, content))
    } else {
      const uploadFile = fileInput.current.files[0]
      dispatch(QuestionActions.editQuestionDB(questionId, title, uploadFile, content))
    }
  }

  return (
    <>
      <>
        <Header type="goBack" location="질문 수정" />
        <Container>
          <PWHeader>
            <input type="text" className="writetitle" placeholder="제목을 입력하세요" value={title} onChange={onChangeTitle} />
          </PWHeader>
          <PWBody>
            <textarea
              value={content}
              onChange={onChangeContent}
              className="writedesc"
              placeholder="내용을 입력하세요"
              ref={textRef}
              onKeyDown={handleTextareaResize}
              onKeyUp={handleTextareaResize}
            ></textarea>
            <Preview>
              <img src={thumbNail} className="thumbNail" alt="" />
            </Preview>
            <UploadSection>
              <label htmlFor="file" className="upload-label">
                <AddPhotoIcon />
              </label>
              <input type="file" id="file" className="upload-input" ref={fileInput} accept="image/jpeg, image/jpg" onChange={onChangeFile} />
            </UploadSection>
          </PWBody>
          <PWFooter>
            <button className="postbtn btn-1" onClick={editQuestion}>
              수정
            </button>
            <div className="postbtn btn-2"></div>
          </PWFooter>
        </Container>
        <AlertModal showModal={showAlert}>제목과 본문을 모두 작성해 주세요!</AlertModal>
      </>
    </>
  )
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 56px 0 0;
`

const PWHeader = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};

  .writetitle {
    width: 100%;
    border: none;
    padding: 16px;
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: 500;
    color: ${({ theme }) => theme.colors.black};
    word-spacing: 1;
    background-color: ${({ theme }) => theme.colors.bg};

    &::placeholder {
      color: ${({ theme }) => theme.colors.grey};
    }
  }
`

const PWBody = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 2px solid #000;
  .writedesc {
    width: 100%;
    /* min-height: 10rem; */
    border: none;
    padding: 16px;
    resize: none;
    line-height: 1.6;
    font-size: ${({ theme }) => theme.fontSizes.base};
    font-family: 'Pretendard Variable';
    font-style: normal;
    font-weight: 300;
    color: ${({ theme }) => theme.colors.black};
    overflow-y: hidden;
    word-spacing: 1;
    background-color: ${({ theme }) => theme.colors.bg};

    &::placeholder {
      color: ${({ theme }) => theme.colors.grey};
    }
  }
`

const Preview = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 16px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  .thumbNail {
    width: 100%;
    object-fit: cover;
  }
`

const UploadSection = styled.div`
  width: 100%;
  padding: 16px 16px 6px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};
  .upload-label {
    height: 100%;
    cursor: pointer;
  }
  .upload-input {
    position: absolute;
    overflow: hidden;
    padding: 0;
    margin: -1px;
    width: 1px;
    height: 1px;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
`

const PWFooter = styled.div`
  position: relative;
  margin: 20px 0;

  .postbtn {
    position: absolute;
    width: 120px;
    height: 48px;
    border: 2px solid ${({ theme }) => theme.colors.black};
  }
  .btn-1 {
    left: 50%;
    transform: translateX(-50%);
    background-color: ${({ theme }) => theme.colors.blue};
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-weight: 700;
    z-index: 100;
    transition-duration: 0.3s;
    font-family: 'YdestreetB';
    font-style: normal;
    font-weight: normal;
    &:active {
      top: 4px;
      left: calc(50%);
      transform: translateX(calc(-50% + 4px));
    }
  }
  .btn-2 {
    top: 4px;
    left: calc(50%);
    transform: translateX(calc(-50% + 4px));
  }
`

export default PostEdit
