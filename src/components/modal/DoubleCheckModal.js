import React, { useCallback } from 'react'
import styled from 'styled-components'
import Backdrop from '@mui/material/Backdrop'
import ModalContainer from './ModalContainer'

const DoubleCheckModal = React.memo(({ type, doubleCheck, setDoubleCheck, title, question, children }) => {
  window.addEventListener('keyup', (e) => {
    if (doubleCheck === true && e.key === 'Escape') {
      setDoubleCheck(null)
    }
    if (doubleCheck === false && e.key === 'Escape') {
      setDoubleCheck(null)
    }
  })

  const handleOverlayClick = useCallback(() => setDoubleCheck(null), [setDoubleCheck])
  const handleContentClick = useCallback((e) => e.stopPropagation(), [])

  if (type === 'exist-onlyConfirm') {
    return (
      <Backdrop open={!doubleCheck} sx={{ zIndex: 10000 }} onClick={handleOverlayClick}>
        <ModalContainer _onClick={handleContentClick}>
          <div>
            <Content>{title}</Content>
            <Content>{question}</Content>
          </div>
          <ConfirmBox>{children}</ConfirmBox>
        </ModalContainer>
      </Backdrop>
    )
  }

  if (type === 'exist') {
    return (
      <Backdrop open={!doubleCheck} sx={{ zIndex: 10000 }}>
        <ModalContainer>
          <div>
            <Content>{title}</Content>
            <Content>{question}</Content>
          </div>
          <ConfirmBox>
            <button className="cancel-button" onClick={() => setDoubleCheck(null)}>
              취소
            </button>
            <div>{children}</div>
          </ConfirmBox>
        </ModalContainer>
      </Backdrop>
    )
  }
  return (
    <>
      <Backdrop open={doubleCheck} sx={{ zIndex: 10000 }} onClick={handleOverlayClick}>
        <ModalContainer _onClick={handleContentClick}>
          <div>
            <Content>{title}</Content>
            <Content>{question}</Content>
          </div>
          <ConfirmBox>{children}</ConfirmBox>
        </ModalContainer>
      </Backdrop>
    </>
  )
})

const Content = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: 500;
`

const ConfirmBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  -webkit-appearance: none;
  -webkit-box-pack: flex-end;
  -ms-flex-pack: flex-end;
  gap: 24px;
  .cancel-button {
    font-size: ${({ theme }) => theme.fontSizes.base};
    color: ${({ theme }) => theme.colors.grey};
    padding: 0;
  }
`

export default DoubleCheckModal
