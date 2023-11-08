import { Client, QuerySuccess, fql } from 'fauna'

// Customer interface (read from POST request)
interface Customer {
  firstName: string
  lastName: string
  email: string
  netWorth: string
  [key: string]: any
}

// Endpoint for creating a customer
export default defineEventHandler(async (event) => {
  // Initialize Fauna client
  const client = new Client({
    secret: process.env.FAUNA_KEY,
  })

  try {
    // Read in request body (use type assertion to validate body)
    const customer: Customer = (await readBody(event)) as Customer

    // Validate Body - Return Bad Request error
    if (
      !customer.firstName ||
      !customer.lastName ||
      !customer.email ||
      !customer.netWorth
    ) {
      return createError({
        statusCode: 400,
        statusMessage: `Bad Request`,
      })
    }

    // Create customer instance
    const query = fql`Customer.create({${customer}})`
    const document = await client.query(query)

    // Return the updated document (meeting + attendies)
    return document.data

    // Catch error
  } catch (error) {
    console.log(error)

    // Return Server error for all other errors
    return createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    })
  }
})
