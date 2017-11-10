import React from 'react'
import glamorous from 'glamorous'
import MdCloudOff from 'react-icons/lib/md/cloud-off'

const Heading = glamorous.h1({
  fontSize: '3.4rem',
})

const Container = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '80vh',
  textAlign: 'center',
  padding: 24,
})

const Description = glamorous.p({
  fontSize: '1.2rem',
})

const Maintenance = () => (
  <Container>
    <MdCloudOff size={150} color="#777" />
    <Heading>Server unreachable</Heading>
    <Description>
      The MyFeeds server is down for now, please come back later.{' '}
      <span role="img" aria-label="Bye">
        👋
      </span>
    </Description>
  </Container>
)

export default Maintenance
