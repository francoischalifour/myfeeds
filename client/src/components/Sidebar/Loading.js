import React from 'react'
import Container from './components/Container'
import Content from './components/Content'
import Header from './components/Header'
import ImageContainer from './components/ImageContainer'

const Loading = () => (
  <Container>
    <Header>
      <ImageContainer />
    </Header>
    <Content />
  </Container>
)

export default Loading
