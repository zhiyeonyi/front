import React from 'react'
import styled from 'styled-components'

const ProfileImage = ({ size, margin, cursor, src, border, _onClick }) => {
  const styles = { src: src, size: size, margin: margin, cursor: cursor, border: border }
  return (
    <>
      <ImageDefault {...styles} onClick={_onClick} />
    </>
  )
}

ProfileImage.defaultProps = {
  margin: false,
  cursor: 'default',
  border: false,
  size: 30,
  _onClick: () => {},
}

const ImageDefault = styled.div`
  --size: ${(props) => props.size}px;
  width: var(--size);
  height: var(--size);
  border-radius: var(--size);
  background-size: cover;
  background-image: url('${(props) => props.src}');
  background-position: center;
  background-color: ${({ theme }) => theme.colors.white};
  ${(props) => (props.margin ? `margin: ${props.margin};` : '')};
  ${(props) => (props.cursor ? `cursor: ${props.cursor};` : 'default')};
  ${(props) => (props.border ? 'border: 2px solid #000;' : '')};
`

export default ProfileImage
