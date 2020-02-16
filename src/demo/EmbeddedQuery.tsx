import React, { useState, useContext, useEffect } from 'react';
import {ExtensionContext, ExtensionContextData} from '@looker/extension-sdk-react'
import { LookerEmbedSDK } from '@looker/embed-sdk'
import {LoadingSvg} from './LoadingSvg'
import styled, {keyframes} from 'styled-components'
import { Card } from '@looker/components';

export function EmbeddedQuery( {query}: any) {
  const [loading, setLoading] = useState(true)
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)

  useEffect( ()=>{
    setLoading(true);
    // @ts-ignore
    const host_url = extensionContext?.extensionSDK?.lookerHostData?.hostUrl
    const container = document.getElementById('looker')

    if (host_url && container && query && query.model) {
      if (container && container.childElementCount > 0) {
        const last_child = container.lastChild
        if (last_child) { container.removeChild(last_child) }
      }
      LookerEmbedSDK.init(host_url)
      LookerEmbedSDK.createExploreWithUrl(`${host_url}/embed/query/${query.model}/${query.view}?qid=${query.client_id}&embed_domain=${encodeURI(host_url)}&sdk=2&sandboxed_host=true`)
        .appendTo(container)
        .on('explore:run:complete', (e)=>{
          setLoading(false);
        })
        .build()
        .connect()
        .catch((error: Error) => {
          console.error('Connection error', error)
        })
    }
  },[query])

  const svg_display = (loading) ? '' : 'none'
  const embed_display = (loading) ? {display: 'none'} : {}
  return (
    <>
    <SvgContainer style= {{display: svg_display}}>
      <LoadingSvg></LoadingSvg>
    </SvgContainer>
    <EmbedContainer style= {embed_display} id='looker'>
    </EmbedContainer>
    </>
  );
}


const slide_down_webkit = keyframes`
0% {
  -webkit-transform: translateZ(-1400px) translateY(-800px) translateX(1000px);
          transform: translateZ(-1400px) translateY(-800px) translateX(1000px);
  opacity: 0;
}
100% {
  -webkit-transform: translateZ(0) translateY(0) translateX(0);
          transform: translateZ(0) translateY(0) translateX(0);
  opacity: 1;
}
`

const slide_down = keyframes`
0% {
  -webkit-transform: translateZ(-1400px) translateY(-800px) translateX(1000px);
          transform: translateZ(-1400px) translateY(-800px) translateX(1000px);
  opacity: 0;
}
100% {
  -webkit-transform: translateZ(0) translateY(0) translateX(0);
          transform: translateZ(0) translateY(0) translateX(0);
  opacity: 1;
}
`


const EmbedContainer = styled(Card)`
  display: block;
	-webkit-animation: ${slide_down_webkit} 0.6s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  animation: ${slide_down} 0.6s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  width: 90%;
  margin: auto;
  height: 90%;
  & > iframe {
    width: 100%;
    height: 100%;
  }
`

const SvgContainer = styled.div`
  width: 90%;
  margin: auto;
  height: 90%;
  frameborder: 0;
`
