import React from 'react'
import styled from 'styled-components'

const ModalContainer = ({ children, _onClick, type }) => {
  const styles = { type: type }
  return (
    <>
      <Container {...styles} onClick={_onClick}>
        {children}
      </Container>
    </>
  )
}

ModalContainer.defaultProps = {
  children: null,
  _onClick: () => {},
}
const Container = styled.div`
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -40%);
  max-width: 300px;
  min-width: 280px;
  width: 100%;
  height: 130px;
  background-color: #fff;
  padding: 24px 24px 16px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease-in-out;
  display: flex;
  flex-direction: ${(props) => (props.type === 'alert' ? 'row' : 'column')};
  justify-content: ${(props) => (props.type === 'alert' ? 'center' : 'space-between')};
  ${(props) => (props.type === 'alert' ? `align-items: center;` : '')}
  -webkit-appearance: none;
`

export default ModalContainer
