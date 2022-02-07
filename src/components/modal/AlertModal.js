import React from 'react'
import styled from 'styled-components'
import Backdrop from '@mui/material/Backdrop'
import ModalContainer from './ModalContainer'

const AlertModal = React.memo(({ showModal, children }) => {
  return (
    <>
      <Backdrop open={showModal} sx={{ zIndex: 10000 }}>
        <ModalContainer type="alert">
          <AlertText>{children}</AlertText>
        </ModalContainer>
      </Backdrop>
    </>
  )
})

const AlertText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: 500;
`

export default AlertModal
