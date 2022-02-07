import React from 'react'
import styled from 'styled-components'

const ConfirmButton = ({ children, _onClick }) => {
  return (
    <>
      <Button onClick={_onClick}>{children}</Button>
    </>
  )
}

ConfirmButton.defaultProps = {
  children: null,
  _onClick: () => {},
}
const Button = styled.button`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.blue};
  padding: 0;
`

export default ConfirmButton
