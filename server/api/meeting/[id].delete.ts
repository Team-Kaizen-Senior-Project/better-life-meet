import { Client, fql } from 'fauna'

// Endpoint for deleting a meeting given an Id
export default defineEventHandler(async (event) => {
  // Get Meeting ID
  const { id } = event.context.params as { id: string }

  // Initialize Fauna client
  const client = new Client({
    secret: process.env.FAUNA_KEY,
  })

  try {
    // Perform READ query
    const query = fql`Meeting.byId(${id})!.delete`
    const document = await client.query(query)

    // Return query result
    return document.data
  } catch (error) {
    console.error(error)
  }
})
