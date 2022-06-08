import 'next'

declare module 'next' {
  import type { ApolloClient } from '@apollo/client'

  export interface NextPageContext {
    apolloClient: ApolloClient<any>
  }
}
