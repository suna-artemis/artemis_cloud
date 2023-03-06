import 'artemis/styles/global.css'

import type { AppProps } from 'next/app'

import { ClientContext, GraphQLClient } from 'graphql-hooks'
const graphClient = new GraphQLClient({
  url: '/api/graphql',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClientContext.Provider value={graphClient}>
      <Component {...pageProps} />
    </ClientContext.Provider>
  )
}
