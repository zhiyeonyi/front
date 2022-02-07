import React, { useCallback } from 'react'
import styled from 'styled-components'
import Backdrop from '@mui/material/Backdrop'
import ModalContainer from './ModalContainer'

const ConfirmModal = React.memo(({ showModal, setShowModal, handleShowModal, title, question, children }) => {
  window.addEventListener('keyup', (e) => {
    if (showModal && e.key === 'Escape') {
      setShowModal(!showModal)
    }
  })

  const handleOverlayClick = useCallback(() => setShowModal(false), [setShowModal])
  const handleContentClick = useCallback((e) => e.stopPropagation(), [])
  return (
    <>
      <Backdrop open={showModal} sx={{ zIndex: 10000 }} onClick={handleOverlayClick}>
        <ModalContainer _onClick={handleContentClick}>
          <div>
            <Content>{title}</Content>
            <Content>{question}</Content>
          </div>
          <ConfirmBox>
            <button
              className="cancel-button"
              onClick={() => {
                setShowModal(!showModal)
              }}
            >
              취소
            </button>
            <div>{children}</div>
          </ConfirmBox>
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

export default ConfirmModal
