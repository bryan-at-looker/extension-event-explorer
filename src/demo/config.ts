export const IMAGE_URL = 'https://corporate.comcast.com/media/img/original/2019/02/corporate_Official-Comcast-Logo.png'
export const QUERY_FIELD = 'events.event_type'
export const DATE_FIELD = 'events.event_date'
export const FILTERS = {[DATE_FIELD]: '28 days ago for 28 days'}

export const EXTRA_TABS = [
  {
    [QUERY_FIELD]: 'PABS Insights',
    type: -1
  },
  {
    [QUERY_FIELD]: 'User Journey',
    type: 1
  },
  {
    [QUERY_FIELD]: 'User Retention',
    type: 1
  }
]

export const EVENT_TYPE_QUERY = {
  model: "thelook-snowflake",
  view: "events",
  fields: ["events.event_type"],
  filters: {"events.event_date": "7 days ago for 7 days"},
  sorts: ["events.event_type asc"]
}

export const QUERY = {
  model: 'thelook-snowflake',
  view: 'events',
  fields: ['events.event_date', 'events.count'],
  sorts: ['events.event_type asc']
}

export const VIS_CONFIG = {
  type: 'looker_column',
  show_value_labels: true,
  show_x_axis_label: false,
  y_axis_gridlines: false,
}

export const COLORS = ['#FFBA00', '#F56F02', '#CB1F47', '#645DAC', '#0088D2', '#00B345']

export const TIMEFRAMES = [
  { value: '7 days ago for 7 days', label: '7 days' },
  { value: '14 days ago for 14 days', label: '14 days' },
  { value: '28 days ago for 28 days', label: '28 days' },
  { value: '90 days ago for 90 days', label: '90 days' },
]

export const MEASURE_TYPES = [
  { value: 'events.count', label: 'Events' },
  { value: 'events.sessions_count', label: 'Sessions' },
  { value: 'users.count', label: 'Users' },
]