import React, { useState, useContext, useEffect, useCallback } from 'react';
import {ExtensionContext, ExtensionContextData} from '@looker/extension-sdk-react'
import { LookerEmbedSDK, LookerEmbedDashboard } from '@looker/embed-sdk'
import {LoadingSvg} from './LoadingSvg'
import styled, {keyframes} from 'styled-components'
import { Card } from '@looker/components';

let gDashboard: any;
let gOriginalOptions: any;
let gFilters: any;
const PRIMARY_FILTER = 'Primary Metric';
const SECONDARY_FILTER = 'Second Metric';
const SIZEPOINTS_FILTER = 'Size Points';
const ANALYSIS_FILTER = 'Analysis';
const SERIES_MAP: any = {
  'Users': 'users.count',
  'Events': 'data_tool.count',
  'Visitors': 'data_tool.unique_visitors',
  'Sessions': 'data_tool.sessions_count',
  'Orders': 'sessions.count_purchase',
  'Bounces': 'data_tool.count_bounces',
  'Bounce Rate': 'data_tool.bounce_rate',
  'Conversion Rate': 'sessions.overall_conversion'
}

export function WebAnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [primary, setPrimary] = useState('');
  const [secondary, setSecondary] = useState('');
  const [size_points, setSizePoints] = useState('');
  const [analysis, setAnalysis] = useState('');
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)

  const runComplete = (e: any) => {
    setLoading(false);
    if (!gFilters) {
      gFilters = e?.dashboard?.dashboard_filters || undefined
      if (gFilters && gFilters[PRIMARY_FILTER]) {
        setPrimary(gFilters[PRIMARY_FILTER]);
      }
      if (gFilters && gFilters[SECONDARY_FILTER]) {
        setSecondary(gFilters[SECONDARY_FILTER]);
      }
      if (gFilters && gFilters[SIZEPOINTS_FILTER]) {
        setSizePoints(gFilters[SIZEPOINTS_FILTER]);
      }
      if (gFilters && gFilters[ANALYSIS_FILTER]) {
        setAnalysis(gFilters[ANALYSIS_FILTER]);
      }
    }
  }

  const setupDashboard = (dashboard: LookerEmbedDashboard) => {
    gDashboard = dashboard
    setTimeout( () => { 
      setLoading(false);
    }, 3000);
  }

  const dashboardLoaded = (e: any) => {
    if (!gOriginalOptions) {
      gOriginalOptions = e?.dashboard?.options || undefined
    }
    if (!gFilters) {
      gFilters = e?.dashboard?.dashboard_filters || undefined
      if (gFilters && gFilters[PRIMARY_FILTER]) {
        setPrimary(gFilters[PRIMARY_FILTER]);
      }
      if (gFilters && gFilters[SECONDARY_FILTER]) {
        setSecondary(gFilters[SECONDARY_FILTER]);
      }
      if (gFilters && gFilters[SIZEPOINTS_FILTER]) {
        setSizePoints(gFilters[SIZEPOINTS_FILTER]);
      }
      if (gFilters && gFilters[ANALYSIS_FILTER]) {
        setAnalysis(gFilters[ANALYSIS_FILTER]);
      }
    }
  }

  const filtersUpdated = (e: any) => {
    const filters = e?.dashboard?.dashboard_filters || undefined
    if (filters && gDashboard) {
      if (filters[PRIMARY_FILTER]) {
        setPrimary(filters[PRIMARY_FILTER]);
      }
      if (filters[SECONDARY_FILTER]) {
        setSecondary(filters[SECONDARY_FILTER]);
      }
      if (filters[SIZEPOINTS_FILTER]) {
        setSizePoints(filters[SIZEPOINTS_FILTER]);
      }
      if (filters[ANALYSIS_FILTER]) {
        setAnalysis(filters[ANALYSIS_FILTER]);
      }
    }    
  }

  useEffect( () => {
    showTilesByTitle({primary, secondary, analysis, size_points}, gDashboard)
  }, [primary, secondary, size_points, analysis])

  useEffect( () => {
    // @ts-ignore
    const hostUrl = extensionContext?.extensionSDK?.lookerHostData?.hostUrl
    const container = document.getElementById('looker-dashboard')

    if (container && hostUrl) {
      if (container && container.childElementCount > 0) {
        const last_child = container.lastChild
        if (last_child) { container.removeChild(last_child) }
      }
      LookerEmbedSDK.init(hostUrl)
      const db = LookerEmbedSDK.createDashboardWithId(3)
      db.appendTo(container)
        .on('dashboard:loaded', dashboardLoaded)
        // .on('dashboard:run:start', updateRunButton.bind(null, true))
        .on('dashboard:run:complete', runComplete)
        .on('dashboard:filters:changed', filtersUpdated)
        // .on('page:properties:changed', (e)=>{ console.log('ppc', e); container.setAttribute('style', `height:${e.height};`) })
        .withNext()
        .withTheme('Looker')
        // .on('drillmenu:click', canceller)
        // .on('drillmodal:explore', canceller)
        // .on('dashboard:tile:explore', canceller)
        // .on('dashboard:tile:view', canceller)
        .build()
        .connect()
        .then(setupDashboard)
        .catch((error: Error) => {
          console.error('Connection error', error)
        })
    }
  }, [])

  const svg_display = (loading) ? '' : 'none'
  const embed_display = (loading) ? {display: 'none'} : {}

  return (
    <>
    <SvgContainer 
      style= {{display: svg_display}}>
      <LoadingSvg></LoadingSvg>
    </SvgContainer>
    <EmbedContainer 
      style= {embed_display} 
      id='looker-dashboard'>
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
  height: 675px;
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

function showTilesByTitle(options: any, dashboard: LookerEmbedDashboard) {
  if (dashboard && gOriginalOptions && gOriginalOptions['layouts'] && gOriginalOptions['elements'] ) {
    let new_elements 
    if (options['analysis'] == 'Web Traffic Breakdown') {
      new_elements = hideOtherFields([options.primary, options.secondary, options.size_points], dashboard)
    } else {
      new_elements = hideOtherFields([options.primary], dashboard)
    }
    let new_layout = getLayout([options.primary, options.secondary, options.analysis])
    dashboard.setOptions( { elements: new_elements, layouts: [new_layout] } )
  }
}

function getLayout(titles: any) {
  let elements_to_show: any[] = []
  const element_keys = Object.keys(gOriginalOptions['elements'])
  element_keys.forEach(el=>{
    if (titles.indexOf( gOriginalOptions['elements'][el]['title'] ) > -1 ) {
      elements_to_show.push(el)
    }
  })
  let layout: any = JSON.parse(JSON.stringify(gOriginalOptions['layouts'][0]))
  let dc: any[] = [];
  layout['dashboard_layout_components'].forEach((c: any)=>{
    if ( elements_to_show.indexOf( String(c['dashboard_element_id']) ) > -1 ) {
      dc.push(c)
    }
  })
  return Object.assign(layout, {dashboard_layout_components: dc})
}

function hideOtherFields(fields_to_show: any, dashboard: LookerEmbedDashboard) {
  if (dashboard && gOriginalOptions && gOriginalOptions['layouts'] && gOriginalOptions['elements'] ) {
    let elements = JSON.parse(JSON.stringify(gOriginalOptions['elements']))
    const labels_to_hide = Object.keys(SERIES_MAP).filter(o=>{ 
      return fields_to_show.indexOf(o) == -1 
    })
    const hidden_fields = labels_to_hide.map(l=> { return SERIES_MAP[l] } )
    let element_keys = Object.keys(elements)
    element_keys.forEach(key=>{
      if (elements && elements[key] && elements[key]['vis_config']) {
        elements[key]['title'] = ''
        if (elements[key]['vis_config']['type'] != 'single_value') {
          elements[key]['vis_config']['hidden_fields'] = hidden_fields
          elements[key]['vis_config']['size_by_field'] = (fields_to_show.slice(-1)[0] == fields_to_show.slice(0)[0]) ? '' : SERIES_MAP[fields_to_show.slice(-1)[0]]
        }      
      }
    })
    return elements
  }
}