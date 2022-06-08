/* eslint-disable unicorn/prefer-node-protocol */
import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client'
import { createFragmentArgumentLink } from 'apollo-link-fragment-argument'
import merge from 'deepmerge'
import * as https from 'https'
// eslint-disable-next-line import/no-extraneous-dependencies
import isEqual from 'lodash/isEqual'
import { useMemo } from 'react'

import introspection from '~/__generated__/possibleTypes.json'
import { typePolicies } from '~/apollo/policies'

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__' as const

let apolloClient: ApolloClient<any> | null = null

const httpLink = new HttpLink({
  fetch,
  fetchOptions: {
    agent: new https.Agent({ rejectUnauthorized: !__DEV__ }),
  },
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API || 'http://localhost:4000/graphql',
})

const createApolloClient = () =>
  new ApolloClient({
    ssrMode: typeof window === 'undefined',
    defaultOptions: {
      query: {
        fetchPolicy: 'cache-first',
      },
    },
    cache: new InMemoryCache({
      possibleTypes: introspection.possibleTypes,
      typePolicies,
    }),
    link: from([createFragmentArgumentLink() as any, httpLink]),
  })

export const initializeApollo = (initialState = null) => {
  const _apolloClient = apolloClient ?? createApolloClient()

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract()

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(existingCache ?? {}, initialState ?? {}, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter(d => sourceArray.every(s => !isEqual(d, s))),
      ],
    })

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data)
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export const addApolloState = <P extends { props?: Record<string, unknown> }>(
  client: ApolloClient<any>,
  pageProps: P,
) => {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
  }

  return pageProps
}

export const useApollo = (pageProps: any) => {
  const state = pageProps[APOLLO_STATE_PROP_NAME]
  return useMemo(() => initializeApollo(state), [state])
}
