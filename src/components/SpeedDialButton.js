import React from 'react'
import '../styles/css/SpeedDialButton.css'

const SpeedDialButton = React.memo(({ children, _onClick }) => {
  return (
    <>
      <div className="DictPageAddButton" onClick={_onClick}>
        {children}
      </div>
    </>
  )
})

SpeedDialButton.defaultProps = {
  children: null,
  _onClick: () => {},
}

export default SpeedDialButton
