# Next GraphQL Apollo Starter

A starter to bootstrap your **Next** application (nice pun gg) with some noice GraphQL
(**🎊 With SSR support 🎊**) with Apollo and [GraphQL code generator](https://graphql-code-generator.com/)

## Usage

```bash
$ yarn
# install dependencies

$ yarn dev
# launch concurrently gql-gen:watch and dev:next

$ yarn gql-gen
# launch GraphQL code generation based on codegen.yaml

$ yarn gql-gen:watch
# same as above, with watch mode

$ yarn dev:next
# launch Next dev script

$ yarn build
# launch Next build script

$ yarn start
# launch Next start script

$ yarn test
# launch test suite

$ yarn ts:check
# check TypeScript

$ yarn lint
# run ESLint
```

## GraphQL support

The starter comes by default with Apollo@3. All Apollo related code and config is located under `~/apollo` folder. It contains
the **HOC** `withApollo` and the client.
It uses environment variables to define the API endpoint, so you have to copy/paste the `.env.sample`
file and rename it to `.env` (not committed). The variable name is `NEXT_PUBLIC_GRAPHQL_API`

To make the codegen work, you must have a `schema.graphql` at the root (can be
modified in the `codegen.yaml`, see [the configuration reference](https://graphql-code-generator.com/docs/getting-started/codegen-config)).
Based on this and your \*.graphql files in `~/graphql/**`, it will auto generate
corresponding hooks.

When writing \*.graphql files, you can also import other \*.graphql files by using
comments

`~/graphql/fragments/ProjectCard_project.graphql`

```graphql
fragment ProjectCard_project on Project {
  title
  body
}
```

`~/graphql/queries/Projects.graphql`

```graphql
#import '~/graphql/fragments/ProjectCard_project.graphql'

query Projects {
  projects {
    id
    ...ProjectCard_project
  }
}
```

### withApollo HOC

The starter comes with a `withApollo` HOC, [taken from here ](https://github.com/zeit/next.js/tree/canary/examples/with-apollo) and
modified it a bit. It must be used within your **Next pages**, otherwise the
Apollo Context will not exist. You can customize it's behaviour by providing
a second optional parameter: `{ ssr: boolean }` (defaulted to `{ ssr: false }`)

```tsx
import { NextPage } from 'next'
import AppHead from '~/components/AppHead'
import Page from '~/components/layout/Page'
import AppBox from '~/ui/AppBox'
import Heading from '~/ui/typography/Heading'
import { withApollo } from '~/apollo'
import { useHelloQuery } from '~/__generated__/hooks'

const Index: NextPage = () => {
  const { data, error } = useHelloQuery()
  // No need to wait for the loading to be finished when using ssr: true
  // it will be already available on the first render on the client when the request
  // is made from the server. If you navigate to this page within the router client,
  // you may still need to handle loading state to avoid flickerings
  if (error) {
    return <div>Error</div>
  }
  return (
    <Page>
      <AppHead title="Homepage" />
      <Heading as="h1">Index Page</Heading>
      <AppBox mt={2}>
        <ul>
          {data.projects.map(p => (
            <li>{p.id}</li>
          ))}
        </ul>
      </AppBox>
    </Page>
  )
}

export default withApollo(Index, { ssr: true })
// Warning, when using ssr: true, you loose
// NextJS Automatic Static Optimization because the page must
// be rendered in the server to collect the GraphQL queries within
// your React tree
```

It works by actually using the [getDataFromTree](https://www.apollographql.com/docs/react/performance/server-side-rendering/#using-getdatafromtree) from `@apollo/react-ssr`.
When using `withApollo`, if ssr is true, the server will render your React Application, starting
from the lowest children and going back up to your top most component in your hierarchy.
By doing it this way, it can collect all the queries needed for your page to render, then
it uses the `getDataFromTree` to get the hydrated tree of your app with the queries executed,
and then it populates the store of the client with these queries to have a synced store
with the queries that has been executed on the server.
If ssr is not true, it will do nothing on the server (thus, enabling Automatic Static Optimization)
and do the loading in the client-side. It is why that when using `ssr: true`, you don't have to,
for the first render, manage the loading state in your client, because the data will
already be available.

### Configuration

All configuration related files are located in the `codegen.yaml` file ([more informations here](https://graphql-code-generator.com/docs/getting-started/codegen-config))
A `.graphqlconfig` file is also provided, if you use a GraphQL extension in your IDE, it will allow you
to introspect the schema of a given endpoint and writing it in a `schema.graphql` file.
You must enter your API url here

### Examples

Example usage for a given query

```graphql
query Projects {
  projects {
    id
    title
    body
  }
}
```

which generate a hook and a component and could be used like this :

```typescript jsx
import React, { FC } from 'react'
import { useHelloQuery } from '~/__generated__/hooks' // This file is generated by gql-codegen

const Projects: FC = () => {
  const { data, loading, error } = useHelloQuery()
  if (error) {
    return <div>Error</div>
  }
  if (loading) {
    return <div>Loading...</div>
  }
  if (data) {
    // ...
  }

  return null
}

const App: FC = () => {
  return (
    <div className="App">
      <main>
        <Projects />
      </main>
    </div>
  )
}

export default App
```

and you get all the nice **autocompletion** from your IDE thanks to Typescript!
And if you change any of \*.graphql files to add a new field for a GraphQL query,
it will be automatically generated and you will be always in sync with your GraphQL files!

## Next config

It comes already configured with some nice plugin. You can see in `next.config.js` what is
used. In short, it allows support of importing images files and fonts within webpack.
It also comes with **NProgress** support, by default so it shows a small loading bar in top of
the page when loading. You can find the component in `~/components/NProgress.tsx`, and it is used in the
custom `_app.tsx`

## Styled component

The template comes with [styled-components](https://github.com/styled-components/styled-components).
Again, you can either choose to not use it, this is a personal choice.
You can also find a `styles` folder, which contains many related
styled-components files to keep things organized. It's also includes all themes-related stuff in here.
It's again a personal convention that I follow, feel free to annihilate this directory if you want 😢

## Styled system

It also comes with [styled-components](https://github.com/styled-system/styled-system). It is a great way to
build reusable UI blocks with a great props API and consistent spaces / typography.
A lot comes from the theme, provided in `~/styles/themes/base.ts` where we define some
breakpoints, spacings and typography stuff. It allows then the custom `AppBox` component (`~/ui/AppBox`)
to be aware of your theme and then build something amazing with the primitives.
By default, this starter provides some basic examples components that uses this pattern, for
example the `AppNav` component (`~/components/layout/AppNav`).

## Framer motion

Again, personal preference here, but the starter comes with framer motion already configured
to handle Next pages changes and enable some smooth transitions when navigating. You
can find the default variant used for the page transitions in `~/common/framer.ts`.

## Testing

[Jest](https://github.com/facebook/jest) and [@testing-library/react](https://github.com/testing-library/react-testing-library) is used to run your tests. It comes preconfigured
with [ts-jest](https://github.com/kulshekhar/ts-jest) so your tests also checks your types.
You can look the **jest.config.js** and the file **setupTest.ts** to see what's in there.
[jest-styled-components](https://github.com/styled-components/jest-styled-components) is also used to have deterministic classNames
within your styled components that you are testing.

## Aliases

It includes by default support for aliases in `tsconfig.json`.
They are 1 defaulted alias, ready to use :

```typescript
// ~ refers to src folder
import { something } from '~/file'
```

You can also use for your convenience the global `__DEV__` variable, which is
injected by webpack with the DefinePlugin (see **next.config.js**).

## @types and extending modules

It also includes a `@types` directory under **src**, so you can easily
separate your types or extends some external modules. They are also included in the `tsconfig.json`
For example, if some package named `foo` does not have any types in [DefinitelyTyped](https://definitelytyped.org/), you could
add a `index.d.ts` under `src/@types/foo/index.d.ts`. It is just my personal convention, so do as you want!

```typescript
// src/@types/foo/index.d.ts

// to make sure Typescript get the original types from the module (if any)
import * as foo from 'foo'

declare module 'foo' {
  declare function foo(bar: string): boolean
}
```

Because the `@types` directory is declared in `typeRoots`, Typescript will no longer complain if you imported your package with missing types

## Tooling

The template includes [Prettier](https://prettier.io/), [ESLint](https://eslint.org/) (with [Typescript-eslint](https://github.com/typescript-eslint/typescript-eslint)), [Babel](https://babeljs.io/) and [lint-staged](https://github.com/okonet/lint-staged).
All their related configurations are in the `*rc` files (except for lint-staged, which is located in the `package.json`).
