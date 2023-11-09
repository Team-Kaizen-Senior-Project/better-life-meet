import { Client, fql } from 'fauna'

// Attendee update information interface
interface AttendeeUpdateInfo {
    joinTime: string;
    leaveTime: string;
    usedVideo: boolean;
    platform: string;
  }
  
  // Endpoint for updating an attendee
  export default defineEventHandler(async (event) => {
    // Initialize Fauna client
    const client = new Client({
      secret: process.env.FAUNA_KEY,
    });
  
    // Extract the ID from the URL parameters
    const { id } = event.context.params as { id: string };
  
    // Read in request body and assert the type to AttendeeUpdateInfo
    const updateInfo = (await readBody(event)) as AttendeeUpdateInfo;
  
    // Update the attendee record with new information
    try {
      // Construct the update query using the ID from the URL
      const updateQuery = fql`
        Attendee.byId(${id})!.update({
          {
            joinTime: ${updateInfo.joinTime},
            leaveTime: ${updateInfo.leaveTime},
            usedVideo: ${updateInfo.usedVideo},
            platform: ${updateInfo.platform}
          }
        })
      `;
  
      // Execute the update query
      const updatedAttendeeDoc = await client.query(updateQuery);
  
      // Return the updated attendee document
      return updatedAttendeeDoc.data;
  
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
  });