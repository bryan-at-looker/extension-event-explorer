import React from 'react';
import { Select, Box } from '@looker/components';
import { TIMEFRAMES, MEASURE_TYPES } from './config';

export function FilterFlex( {filter_selections, setFilterSelections} : any ) {
  const getSelect = (dropdown_change: string, options: any, value: string) => {
    return <Select 
      m="small"
      onChange={(e)=> handleChange({ dropdown_change: dropdown_change, value: e })}
      options={options}
      value={value}
    />
  }

  const handleChange = (change: any) => {
    setFilterSelections({[change.dropdown_change]: change.value})
  } 
  
  return (
    <>
      <Box m="large">
        {getSelect('measure_type', MEASURE_TYPES, filter_selections['measure_type'] )}
        {getSelect('timeframe', TIMEFRAMES, filter_selections['timeframe'])}
      </Box>
    </>
  );
}
