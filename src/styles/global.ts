import { createGlobalStyle } from 'styled-components'
import bootstrap from '~/styles/bootstrap'
import { MAIN_BACKGROUND } from '~/styles/modules/variables'
import { theme } from '~/styles/themes'

export default createGlobalStyle`
  ${bootstrap};

  * {
    box-sizing: border-box;
  }

  html {
    font-size: 100%;
  }

  body {
    ${MAIN_BACKGROUND};
    color: ${props => theme(props).colors.text};
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: ${props => theme(props).fonts.heading};
  }

  code, pre {
    font-family: ${props => theme(props).fonts.mono};
  }

  p {
    font-family: ${props => theme(props).fonts.body};
  }
`
