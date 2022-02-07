import React from 'react'

import '../../styles/css/DictMyMeme.css'

import { DictNavBar, Header, Footer, DictMyScrapbook } from '../../components'
import { Title, Grid } from '../../elements'

const DictMyMeMe = (props) => {
  return (
    <>
      <Header location="오픈 밈사전"></Header>
      <div className="DictLayout">
        <DictNavBar />
        <Grid padding="24px 16px 10px">
          <Title>내가 스크랩한 목록</Title>
        </Grid>
        <div className="MyDictMemeSection">
          <div className="MyDictMemeList">
            <DictMyScrapbook />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default DictMyMeMe
