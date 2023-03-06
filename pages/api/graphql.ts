// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createYoga } from 'graphql-yoga'
import type { NextApiRequest, NextApiResponse } from 'next'

import { schema } from './schema'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default createYoga<{
  req: NextApiRequest
  res: NextApiResponse
}>({
  schema: schema as any,
})
