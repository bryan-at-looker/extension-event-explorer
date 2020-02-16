import React from 'react';
import { Tabs, TabList, Tab, TabPanel, TabPanels, Flex, FlexItem, Box, Card, Heading } from '@looker/components';
import { EmbeddedQuery } from './EmbeddedQuery';
import { FilterFlex } from './FilterFlex';
import { PabsInsights } from './PabsInsights';
import { NumberToColoredPercent } from './NumberToColoredPercent';
import styled from 'styled-components';

export function EventNavigation({
  setSelectedTab, 
  query_field, 
  query, 
  resetQuery, 
  filter_selections, 
  setFilterSelections , 
  selected_color, 
  selected_tab, 
  result_tabs, 
  last_api,
  result_field,
  query_running
}: any
) {
  let tabs = [<></>]
  let tab_panels = [<></>]

  if (result_tabs && result_tabs.length > 0) {

    tabs = result_tabs.map((e: any, i: number)=>{
      const selected_style = (i==selected_tab) ? {borderBottomColor: selected_color, } : {}
      if (!e.type) {
        return <StyledTab 
          fontSize="small"
          style = {selected_style}
          key={e[query_field]}>
      {`${e[query_field]} `}<NumberToColoredPercent 
        val={e[result_field]}
        query_running={query_running}
      ></NumberToColoredPercent></StyledTab>
      } else {
        return <StyledTab 
          fontSize="small"
          style = {selected_style}
          key={e[query_field]}>{e[query_field]}
      </StyledTab>
      }
    })

    tab_panels = result_tabs.map((e: any)=>{
      if (!e.type) {
        return <TabPanel  key={e[query_field]} >
          <Flex>
            <FlexItem width="20%" height="90vh">
              <FilterFlex 
                filter_selections={filter_selections}
                setFilterSelections={setFilterSelections}
              ></FilterFlex>
            </FlexItem>
            <FlexItem width="80%" height="90vh">
              <EmbeddedQuery 
                query_field_filter={e[query_field]}
                query_field={query_field}
                query={query}
              ></EmbeddedQuery>
            </FlexItem>
          </Flex>
        </TabPanel>
      }
      else {
        if (e[query_field] == 'PABS Insights') {
          return <TabPanel key={e[query_field]}>
            <PabsInsights last_api={last_api}></PabsInsights>
          </TabPanel>
        } else {
          return <TabPanel key={e[query_field]}>
            {ComingSoon}
        </TabPanel>
        }
      }
    })
  }

  
  return (
  <>
    {result_tabs && tabs  && tab_panels && result_tabs.length > 0 && <Tabs 
      onChange={(t)=>{
        resetQuery();
        setSelectedTab(t)
      }}
      >
        <TabList> 
          {tabs}
        </TabList>
        <TabPanels>
          {tab_panels}
        </TabPanels>
    </Tabs> }
  </>
  );
}

const ComingSoon = <Box 
    height="85vh"  
    p="large"
    style={{textAlign:'center'}}
  >
    <Card p="large" raised>
      <Heading>
        Coming Soon!!
      </Heading>
    </Card>
</Box>

const StyledTab = styled(Tab)`
width: 90px;
white-space: pre;
display: inline-flex;
align-items: flex-end;
`