import 'next'

declare module 'next' {
  import { ApolloClient } from '@apollo/client'

  export interface NextPageContext {
    apolloClient: ApolloClient<any>
  }
}
