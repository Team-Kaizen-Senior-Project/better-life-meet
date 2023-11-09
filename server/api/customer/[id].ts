import { Client, fql } from 'fauna'

export default defineEventHandler(async (event) => {
  // Get Customer ID
  const { id } = event.context.params as { id: string }

  // Initialize Fauna client
  const client = new Client({
    secret: process.env.FAUNA_KEY,
  })

  try {
    // TODO: Create a valid FQL query
    const query = fql`Customer.byId(${id})`
    const document = await client.query(query)

    return document.data
  } catch (error) {
    console.error(error)
  }
})