import { Client, QuerySuccess, ServiceError, fql } from 'fauna'

export default defineEventHandler(async (event) => {
  // Get Customer ID
  const { id } = event.context.params as { id: string }

  // Initialize Fauna client
  const client = new Client({
    secret: process.env.FAUNA_KEY,
  })

  try {
    const query = fql`
    let customers = Customer.all().where(.id == ${id});
    if (customers.isEmpty()) abort(0);
    customers.first();
    `
    const response = await client.query(query)

    return response
  } catch (error: unknown) {
    console.log(error)
    const serviceError = error as ServiceError
    throw createError({
      statusCode: serviceError.httpStatus,
      statusMessage: 'Customer with this ID does not exist.',
    })
  }
})
