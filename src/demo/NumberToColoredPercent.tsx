import React from 'react';
import styled, {keyframes} from 'styled-components';
import { Text } from '@looker/components';

export function NumberToColoredPercent( {val, query_running}: any) {
  const color = (val<0) ? 'red' : (val>0) ? 'green' : 'black'
  const val_formatted = Math.abs(val).toLocaleString("en", { style: "percent", minimumFractionDigits: 2 })
  const icon = (val<0) ? '▼' : (val>0) ? '▲' : '—'
  return (<>
    {!query_running && <Text 
      color={color}
      fontWeight="light"
      fontSize="xxsmall"
    >
      {`${icon} ${val_formatted}`}
    </Text> }
    {query_running && <TextLoadingSpan>{''}</TextLoadingSpan>}
  </>
  )
}

const kf = keyframes`
0% {
  background-position: -200px 0px;
}
100% {
  background-position: calc(200px + 100%) 0px;
}`;

const TextLoadingSpan = styled.span`
cursor: pointer;
user-select: none;
box-sizing: border-box;
padding: 0px;
background-size: 200px 100%;
display: flex;
line-height: 1;
width: 100%;
min-width: 30px;
height: 11px;
background-repeat: no-repeat;
border-radius: 4px;
background-color: rgb(245, 246, 247);
background-image: linear-gradient(90deg, rgb(245, 246, 247), rgb(222, 225, 229), rgb(245, 246, 247));
animation: 1.2s ease-in-out 0s infinite normal none running ${kf};
`
