import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { history } from '../redux/ConfigureStore'
import { useDispatch } from 'react-redux'
import { dictApi } from '../shared/api'

function SearchBar({ onAddKeyword }, props) {
  const dispatch = useDispatch()

  const [keyword, setKeyword] = useState('')

  const [pageSize, setPageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const searchDictDB = async () => {
    let response = await dictApi.searchDict(keyword, pageSize, currentPage)
    let searchTotalLength = await dictApi.tellMeTotalLengthSearch(keyword)

    setTotalCount(searchTotalLength.data.data)
  }

  const handleKeyword = (e) => {
    setKeyword(e.target.value)
  }

  const handleEnter = (e) => {
    if (keyword && e.keyCode === 13) {
      //엔터일때 부모의 addkeyword에 전달
      onAddKeyword(keyword)
      setKeyword('')
      searchDictDB(keyword)
      history.push(`/dict/search/${keyword}`)
    }
  }

  const handleClearKeyword = () => {
    setKeyword('')
  }

  //느낌표로 키워드를 갖고있냐 없냐로 boolean 형태로 나옴
  //키워드를 가지고 있다면 active가 발생하여 padding이 발생함. // 패딩이 없으면 x 아이콘까지 글자가 침법하기 때문
  const hasKeyword = !!keyword

  // {
  //keyword가 있으면 true, 없으면 false가 리턴이 되는 것을 확인 할 수 있습니다
  // console.log(!!keyword)
  // }

  return (
    <Container>
      <InputContainer id="SearchBar">
        <Input placeholder="알고 싶은 밈 단어를 검색해보세요" active={hasKeyword} value={keyword} onChange={handleKeyword} onKeyDown={handleEnter} />
        {keyword && <RemoveIcon onClick={handleClearKeyword} />}
      </InputContainer>
    </Container>
  )
}

const horizontalCenter = css`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
`

const Container = styled.div`
  position: relative;
  width: 100%;
  height: fit-content;
  /* border-bottom: 1px solid grey; */
  background-color: #fbfafa;
`

//글자를 입력하면 RemoveIcon이 나오게 되고 누르면 input의 value값이 사라집니다
const RemoveIcon = styled.span`
  ${horizontalCenter}
  right: 16px;
  width: 25px;
  height: 20px;
  background-position: -389px -29px;
  display: inline-block;
  overflow: hidden;
  color: transparent;
  vertical-align: top;
  background-image: url(https://s.pstatic.net/static/www/m/uit/2020/sp_search.623c21.png);
  background-size: 470px 442px;
  background-repeat: no-repeat;
`

const InputContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-self: center;
`

const Input = styled.input`
  width: 100%;
  height: 44px;
  background-color: #e5e5e5;
  font-weight: 500;
  font-size: 14px;
  border: none;
  border-radius: 8px;
  padding: 13px 16px;
  ${({ active }) =>
    active &&
    `
    padding-right: 30px; 
  `};
  &::placeholder {
    font-family: 'YdestreetL';
    font-style: normal;
    font-weight: normal;
    font-size: ${({ theme }) => theme.fontSizes.base};
  }
`

export default SearchBar
