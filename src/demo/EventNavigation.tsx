import React from 'react';
import { Tabs, TabList, Tab, TabPanel, TabPanels, Flex, FlexItem, Box, Card, Heading } from '@looker/components';
import { EmbeddedQuery } from './EmbeddedQuery';
import { FilterFlex } from './FilterFlex';
import { PabsInsights } from './PabsInsights';

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
  last_api}: any
) {
  let tabs = [<></>]
  let tab_panels = [<></>]

  if (result_tabs && result_tabs.length > 0) {

    tabs = result_tabs.map((e: any, i: number)=>{
      const selected_style = (i==selected_tab) ? {borderBottomColor: selected_color} : {}
      if (!e.type) {
        return <Tab 
          style = {selected_style}
          key={e[query_field]}>{e[query_field]}
        </Tab>
      } else {
        return <Tab 
          style = {selected_style}
          key={e[query_field]}>{e[query_field]}
      </Tab>
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

