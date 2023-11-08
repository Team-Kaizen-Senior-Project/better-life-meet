import { Client, fql } from 'fauna'

export default defineEventHandler(async (event) => {
  // Initialize Fauna client
  const client = new Client({
    secret: process.env.FAUNA_KEY,
  })

  try {
    // Perform READ query
    const query = fql`Customer.all(){data}`
    const document = await client.query(query)

    // Return 'Not found' 404 if document is empty
    if (!document.data) {
      return createError({
        statusCode: 404,
        statusMessage: 'Resource Not Found',
      })
    }
    // Return query results
    return document.data
  } catch (error) {
    // Throw Server error for all other errors
    return createError({
      statusCode: 500,
      statusMessage: 'Internal Error Occurred',
    })
  }
})
