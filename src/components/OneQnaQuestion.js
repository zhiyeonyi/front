import React from 'react'
import styled from 'styled-components'
import { history } from '../redux/ConfigureStore'
import { Grid, ProfileImage } from '../elements'

const OneQnaQuestion = React.memo(({ question, index }) => {
  const styles = {
    index: index,
  }

  return (
    <>
      <Container {...styles} onClick={() => history.push(`/dict/question/detail/${question?.questionId}`)}>
        <div className="question-box box1">
          <div className="title-box">
            <div className="qna-question-title">{question?.title}</div>
          </div>
          <Grid flex_center padding="10px 0 0">
            <ProfileImage src={question?.profileImage} size="36" border />
          </Grid>
        </div>
        <div className="question-box box2"></div>
      </Container>
    </>
  )
})

const Container = styled.div`
  position: relative;
  width: 150px;
  height: 142px;
  display: flex;
  align-items: center;
  cursor: zoom-in;
  .qna-question-title {
    width: 100%;
    font-weight: 500;
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }
  .question-box {
    width: 150px;
    height: 142px;
    position: absolute;
    border: 2px solid ${({ theme }) => theme.colors.black};

    .title-box {
      width: 100%;
      white-space: normal;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .box1 {
    background-color: ${({ theme }) => theme.colors.white};
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
  }
  .box2 {
    top: 6px;
    left: 6px;
    background-color: ${(props) => (props.index === 0 ? '#FFE330' : props.index === 1 ? '#FF8E00' : props.index === 2 ? '#00A0FF' : '#7b7b7b')};
  }
`

export default OneQnaQuestion
