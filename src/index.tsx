import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {ExtensionProvider} from '@looker/extension-sdk-react'
import {GlobalStyle, theme, Spinner, Flex} from '@looker/components'
import {ThemeProvider} from 'styled-components'
import { Application } from './demo/Application'

window.addEventListener('DOMContentLoaded', async (event) => {
  const root = document.createElement('div')
  document.body.appendChild(root)

  ReactDOM.render(
    // ExtensionProvider provides subcomponents access to the Looker Extension SDK
    <ExtensionProvider loadingComponent={<></>} requiredLookerVersion='>=7.2.0'>
      <ThemeProvider theme={theme}>
        <>
          <GlobalStyle />
          <Application />
        </>
      </ThemeProvider>
    </ExtensionProvider>,
    root
  )
})
