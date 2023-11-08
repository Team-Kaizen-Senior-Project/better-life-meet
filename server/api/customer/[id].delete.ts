import { Client, ServiceError, fql } from 'fauna'

export default defineEventHandler(async (event) => {
  // Get Customer ID
  const { id } = event.context.params as { id: string }

  // Initialize Fauna client
  const client = new Client({
    secret: process.env.FAUNA_KEY,
  })

  try {
    const query = fql`Customer.byId(${id})!.delete()`
    return await client.query(query)
  } catch (error: unknown) {
    const serviceError = error as ServiceError
    throw createError({
      statusCode: serviceError.httpStatus,
      statusMessage: 'Customer with this ID does not exist.',
    })
  }
})
