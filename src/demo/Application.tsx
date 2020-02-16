import React from 'react'
import {ExtensionContext, LookerSDK} from '@looker/extension-sdk-react'
import { EventNavigation } from './EventNavigation'
import { Box } from '@looker/components'
import { orderBy } from 'lodash'
import { QUERY_FIELD, FILTERS, DATE_FIELD, VIS_CONFIG, COLORS, QUERY, EVENT_TYPE_QUERY, EXTRA_TABS, EVENT_TAB_FIELD, EVENT_TAB_FILTER, EVENT_TAB_PIVOT } from './config'
import { LoadingSvg } from './LoadingSvg'
import { createPreviousPeriod } from '../helper_functions'


export class Application extends React.Component<any, any> {
  static contextType = ExtensionContext
  context!: React.ContextType<typeof ExtensionContext>
  

  constructor(props: any) {
    super(props)
    this.state = {
      loading: true,
      events: {},
      selected_tab: 0,
      query: {},
      result_tabs: [],
      filter_selections: {
        timeframe: '28 days ago for 28 days',
        measure_type: 'events.count',
      },
      last_api: {},
      query_running: false
    }
  }

  componentWillMount() {
    this.newEvents()
  }

  setSelectedTab = (t: any) => {
    this.setState({selected_tab: t})
    const selected_result_tab = this.state.result_tabs[t]
    if ( selected_result_tab && !selected_result_tab.type) {
      this.setQuery(selected_result_tab[QUERY_FIELD], t)
    }
  }

  setFilterSelections = (obj: any) => {
    const {selected_tab} = this.state
    const selected_result_tab = this.state.result_tabs[selected_tab]
    this.setState({query_running: true} )
    this.setState(Object.assign(this.state.filter_selections,obj), ()=> {
      if ( selected_result_tab && !selected_result_tab.type) {
        this.setQuery( selected_result_tab[QUERY_FIELD], selected_tab)
        this.newEvents()
      }
    })
  }

  resetQuery = () => {
    this.setState({query: {}})
  }

  async setQuery( filter_field: string, index: number ) {
    const {filter_selections} = this.state
    let sdk: LookerSDK = this.context.coreSDK
    const new_filters = Object.assign( 
      FILTERS,
      {[QUERY_FIELD]: filter_field},
      {[DATE_FIELD]: filter_selections.timeframe }
      )
    const new_vis_config = Object.assign(VIS_CONFIG, {series_colors: {[filter_selections.measure_type]: COLORS[index % COLORS.length]}})
    const new_fields = [DATE_FIELD, filter_selections.measure_type]


    const query_new = Object.assign( 
      QUERY,
      {filters: new_filters}, 
      {vis_config: new_vis_config},
      {fields: new_fields},
      {sorts: []}
    )
    console.log('Getting New Query', query_new)
    this.setState({last_api: {type: 'create_query', object: query_new}})
    const query = await sdk.ok(sdk.create_query(query_new))
    this.setState({query})
  }

  async newEvents() {
    const {measure_type, timeframe} = this.state.filter_selections
    const dynamic_fields = createPreviousPeriod(measure_type, 'previous period', 'previous_period')
    const fields = [EVENT_TAB_FIELD, measure_type, EVENT_TAB_PIVOT]
    const filters = {[EVENT_TAB_FILTER]: timeframe}

    let sdk: LookerSDK = this.context.coreSDK

    let new_query = Object.assign(EVENT_TYPE_QUERY,
      {fields}, {filters}, {dynamic_fields}      
    )
    console.log(new_query)
    const eq = await sdk.ok(sdk.create_query(new_query))
    this.setState({last_api: {type: 'create_query', object: new_query}})
    const eqt = await sdk.ok(sdk.create_query_task({
      body: { 
        query_id: eq.id!,
        result_format: 'json'
      }
    }))
    while (true) {
      const poll = await sdk.ok(sdk.query_task(eqt.id!))
      if (poll.status === 'failure' || poll.status == 'error') {
        return
      }
      if (poll.status === 'complete') {
        const results = await sdk.ok(sdk.query_task_results(eqt.id!))
        if (results) {
          this.setState({
            events: results, 
            result_tabs: addExtraTabs(results), 
            loading: false ,
            query_running: false
          })
        }
        
        break
      }
      await sleep(2000)
    }
  }

  // async getEvents() {
  //   let sdk: LookerSDK = this.context.coreSDK
  //   const eq = await sdk.ok(sdk.create_query(EVENT_TYPE_QUERY))
  //   this.setState({last_api: {type: 'create_query', object: EVENT_TYPE_QUERY}})
  //   const eqt = await sdk.ok(sdk.create_query_task({
  //     body: { 
  //       query_id: eq.id!,
  //       result_format: 'json'
  //     }
  //   }))
  //   while (true) {
  //     const poll = await sdk.ok(sdk.query_task(eqt.id!))
  //     if (poll.status === 'failure' || poll.status == 'error') {
  //       return
  //     }
  //     if (poll.status === 'complete') {
  //       const results = await sdk.ok(sdk.query_task_results(eqt.id!))
  //       if (results) {
  //         this.setState({
  //           events: results, 
  //           result_tabs: addExtraTabs(results), 
  //           loading: false 
  //         })
  //       }
        
  //       break
  //     }
  //     await sleep(2000)
  //   }
  // }

  render() {
    const {loading} = this.state
    return (
      <>
        <Box p="large">
          { !loading && <EventNavigation
            setSelectedTab={this.setSelectedTab}
            query_field={EVENT_TAB_FIELD}
            result_field={'previous_period'}
            query={this.state.query}
            resetQuery={this.resetQuery}
            filter_selections={this.state.filter_selections}
            setFilterSelections={this.setFilterSelections}
            selected_color={COLORS[this.state.selected_tab % COLORS.length]}
            selected_tab={this.state.selected_tab}
            result_tabs={this.state.result_tabs}
            last_api={this.state.last_api}
            query_running={this.state.query_running}
          ></EventNavigation> }
          { loading && <LoadingSvg></LoadingSvg>}
        </Box>

      </>
    )
  }
}

const sleep = async (ms: number) => {
  return new Promise(resolve  =>{
    setTimeout(resolve, ms)
  })
}

const addExtraTabs = (events: any) => {
  return orderBy(EXTRA_TABS.concat(events),  ({ type }: any ) => type || 0, ['asc'])  
}