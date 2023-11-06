import { Client, QuerySuccess, fql } from 'fauna'

// Body interface (read from POST request)
interface Body {
  meetingId: string
  startTime: string
  endTime: string
  customerRefs: string[]
}

// Attendee interface (defined for reference)
interface Attendee {
  customerRef: string | null
}
// Meeting interface (defined for reference)
interface Meeting {
  meetingId: string
  startTime: string
  endTime: string
  attendeeRefs: Attendee[]
}

// Endpoint for creating a meeting
export default defineEventHandler(async (event) => {
  // Initialize Fauna client
  const client = new Client({
    secret: process.env.FAUNA_KEY,
  })

  // Read in request body (use type assertion to validate body)
  const body = (await readBody(event)) as Body

  // Store customerRef IDs
  const customerRefs: string[] = body.customerRefs

  // Initialize array to store the created attendeeRefs
  let attendeeRefs = []

  // Create new meeting record and assign attendees
  try {
    // Iterates through customerRefs and creates blank attendee records for each customer
    for (let i = 0; i < customerRefs.length; i++) {
      // Create attendee object using customer Id
      const query = fql`Attendee.create({customerRef: Customer.byId(${customerRefs[i]})})`
      const attendeeDoc = await client.query(query)

      // Store reference to newly created attendee object (utilized later to update meeting)
      const attendee = {
        customerRef: attendeeDoc.data?.id,
      }
      // push newly created attendees
      attendeeRefs.push(attendee)
    }

    // Store meeting info into seperate object
    const meeting = {
      meetingId: body.meetingId,
      startTime: body.startTime,
      endTime: body.endTime,
    }
    // Perform POST query for meeting
    const query = fql`Meeting.create(${meeting})`
    const meetingDoc = await client.query(query)

    // Retrieve meeting Id from query (used to update meeting object with attendee info)
    const meetingId = meetingDoc.data?.id

    // Query to update meeting to include attendee info
    const updateQuery = fql`Meeting.byId(${meetingId})!.update({attendeeRefs: ${attendeeRefs}.map(Attendee.create)})`
    const updatedDoc = await client.query(updateQuery)

    // Return the updated document (meeting + attendies)
    return updatedDoc.data

    // Catch error
  } catch (error) {
    // Return Bad Request error
    if (error instanceof TypeError) {
      return createError({
        statusCode: 400,
        statusMessage: `Bad Request`,
      })
    }
    // Return Server error for all other errors
    return createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    })
  }
})
