import { AbortError, Client, ServiceError, fql } from 'fauna'

export default defineEventHandler(async (event) => {
  // Get Customer ID
  const { id } = event.context.params as { id: string }

  // Initialize Fauna client
  const client = new Client({
    secret: process.env.FAUNA_KEY,
  })

  try {
    const query = fql`
    let customer = Customer.byId(${id});
    if (!customer.exists()) abort({ message: "Customer with this ID does not exist." });
    customer;
    `
    const response = await client.query(query)

    return response
  } catch (error: unknown) {
    if (error instanceof AbortError) {
      const abortError = error as AbortError
      const abort = abortError.abort! as { message: string }
      throw createError({
        statusCode: abortError.httpStatus,
        statusMessage: abort.message,
      })
    } else {
      const serviceError = error as ServiceError
      throw createError({
        statusCode: serviceError.httpStatus,
        statusMessage: serviceError.message,
      })
    }
  }
})
