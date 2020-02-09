import React from 'react';
import { Flex, Card, CardMedia, FlexItem, CardContent, Heading, Text, List, ListItem, Code } from "@looker/components";
import styled from "styled-components";
import { IMAGE_URL } from './config';

export function PabsInsights ({last_api}: any) {
return <>
  <Flex justifyContent="center" >
      <InsightsFlex>
        <Card p="large" raised>
          <CardMedia
            image={IMAGE_URL} 
            title="Comcast" 
          />
          <InsightsCardContent>
            <Heading  mb="large">PABS Insights</Heading>
            <Text>Get analytics at your fingertips</Text>
          </InsightsCardContent>
        </Card>
      </InsightsFlex>
      <InsightsFlex>
        <Card p="large" raised>
          <Heading>
            Extension Framework Demo
          </Heading>
          <Heading mt="small" as='h3'>
            Removing the need for extra infrastructure
          </Heading>
          <Text  mt="small" fontSize="small">
            Looker's extension framework is built to provide new ways to experience data. The extension framework provides a way to embed visualizations and dashboards and use Looker's APIs all without the need for backend services. This means data experiences on top of Looker can be made quickly, with tyhe same level of security already built into Looker. This makes it easy to just develop front end code without the need for backend services just to interact with Looker.
          </Text>
          <Text mt="small" >Benefits include:</Text>
          <List  type="bullet" mt="small">
            <ListItem>Secure API access</ListItem>
            <ListItem>Looker user access and permissions</ListItem>
            <ListItem>Build your own experiences</ListItem>
            <ListItem>Javascript in LookML</ListItem>
          </List>
        </Card>
      </InsightsFlex>
      <InsightsFlex>
      <Card p="large" raised>
          <Heading>
            Most Recent API call: <b>{last_api.type}</b>
          </Heading>
          <Code as='pre' mt="small" fontSize="xsmall">
            {JSON.stringify(last_api.object, null, 2)}
          </Code>
        </Card>
      </InsightsFlex>
    </Flex>
    <Flex justifyContent="center">
    <InsightsFlex>
    <Card p="large" raised>
        <Heading>
          Click here for our training material
        </Heading>
      </Card>
    </InsightsFlex>
    <InsightsFlex>
    <Card p="large" raised>
        <Heading>
          Checkout our data dictionary for definitions
        </Heading>
      </Card>
    </InsightsFlex>
    <InsightsFlex>
    <Card p="large" raised>
        <Heading>
          Got feedback? <i>#slack-channel-here</i>
        </Heading>
      </Card>
    </InsightsFlex>
  </Flex>
  </>
}




const InsightsFlex = styled(FlexItem)`
width: 30vw;
margin: 0.75rem;
`

const InsightsCardContent = styled(CardContent)`
  & > h2 {
    text-align: center;
  }
  & > p {
    text-align: left
  }
`