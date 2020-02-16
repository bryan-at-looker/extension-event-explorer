export function createPreviousPeriod(field: string, label: string, name: string) {
  const expression = 'pivot_index({},2) / pivot_index({},1) -1'.replace(/{}/g,"${"+field+"}")
  var out = createDynamicField(
    'table_calculation', 
    expression, 
    label,
    name
  )
  // "dynamic_fields": "[{\"table_calculation\":\"versus_previous\",\"label\":\"versus previous\",\"expression\":\"pivot_index(${events.count},2) / pivot_index(${events.count},1) -1\",\"value_format\":null,\"value_format_name\":\"percent_1\",\"_kind_hint\":\"supermeasure\",\"_type_hint\":\"number\"}]",
  return JSON.stringify([out])
}

function createDynamicField(type: string, expression: string, label: string, name: string) {
  return {
    [type]: name,
    label,
    expression
  }
}