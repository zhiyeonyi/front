import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { actionCreators as quizActions } from '../redux/modules/quiz'

import { Grid } from '../elements'
import QuizResult from '../pages/QuizResult'

const QuizPaper = (props) => {
  const category = useParams().category
  const dispatch = useDispatch()
  const quiz_list = useSelector((state) => state.quiz.quiz_list)

  const [showResult, setShowResult] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const submitAnswer2 = (e) => {
    if (currentIndex === 9) {
      dispatch(quizActions.addAnswer(e.target.value))
      setShowResult(true)
    } else {
      dispatch(quizActions.addAnswer(e.target.value))
      setCurrentIndex(currentIndex + 1)
    }
  }

  React.useEffect(() => {
    dispatch(quizActions.getQuizListDB(category))
  }, [])

  const quiz = quiz_list ? quiz_list[currentIndex] : null

  return (
    <>
      {!showResult ? (
        // !loading ? (
        <>
          <Wrapper>
            <Grid flex_center>
              <h2 className="quiz-category">Lv. {category === 'lv1' ? '1' : category === 'lv2' ? '2' : '3'}</h2>
            </Grid>
            <QuizTitle>
              <div className="question-number-box box-1">Q. {currentIndex + 1}</div>
              <div className="question-number-box box-2"></div>
              <h2 className="title">{quiz ? quiz.question : null}</h2>
              <Grid flex_center height="100%" overflow="hidden" margin="16px 0 0">
                <img src={quiz ? quiz.quizImage : ''} className="quiz-image" alt="퀴즈 이미지" />
              </Grid>
            </QuizTitle>
            <QuizBox>
              <button className="answer-btn" value={quiz?.choice[0]} onClick={submitAnswer2}>
                {quiz?.choice[0]}
              </button>
              <button className="answer-btn" value={quiz?.choice[1]} onClick={submitAnswer2}>
                {quiz?.choice[1]}
              </button>
              <button className="answer-btn" value={quiz?.choice[2]} onClick={submitAnswer2}>
                {quiz?.choice[2]}
              </button>
              <button className="answer-btn btn-4" value={quiz?.choice[3]} onClick={submitAnswer2}>
                {quiz?.choice[3]}
              </button>
            </QuizBox>
          </Wrapper>
        </>
      ) : (
        // ) : (
        //   <Grid flex_center height="100%">
        //     <CircularProgress color="inherit" />
        //   </Grid>
        // )
        <QuizResult quiz_list={quiz_list} category={category} />
      )}
    </>
  )
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px 0 0;
  display: flex;
  flex-direction: column;
  align-items: start;
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 360px;
  transition: all 0.1s ease-in-out;
  .quiz-category {
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-weight: 600;
  }
`

const QuizTitle = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  padding: 48px 36px 20px;
  margin: 30px 0 0;
  border: 2px solid ${({ theme }) => theme.colors.black};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .question-number-box {
    width: 120px;
    height: 48px;
    position: absolute;
    border: 2px solid ${({ theme }) => theme.colors.black};
    background-color: ${({ theme }) => theme.colors.white};
  }
  .box-1 {
    top: -28px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${({ theme }) => theme.fontSizes.xxl};
    font-family: 'YdestreetB';
    font-style: normal;
    font-weight: normal;
    background-color: ${({ theme }) => theme.colors.yellow};
  }

  .box-2 {
    top: -24px;
    left: calc(50%);
    transform: translateX(calc(-50% + 4px));
    background-color: ${({ theme }) => theme.colors.white};
  }

  .title {
    width: 100%;
    height: fit-content;
    text-align: left;
    font-size: ${({ theme }) => theme.fontSizes.xl};
  }
  .quiz-image {
    max-width: 100%;
    height: auto;
    object-fit: cover;
  }
`

const QuizBox = styled.div`
  position: relative;
  width: 100%;
  border: 2px solid ${({ theme }) => theme.colors.black};
  margin: 20px 0 0;
  transition: background-color 0.1s ease-in-out;

  .answer-btn {
    width: 100%;
    height: fit-content;
    font-size: ${({ theme }) => theme.fontSizes.lg};
    border-bottom: 2px solid ${({ theme }) => theme.colors.black};
    padding: 16px 36px;
    line-height: 1.3;
    transition: background-color 0.1s ease-in-out;
    &:hover {
      background-color: ${({ theme }) => theme.colors.yellow};
    }
  }

  .btn-4 {
    border: 0;
  }
`

export default QuizPaper
