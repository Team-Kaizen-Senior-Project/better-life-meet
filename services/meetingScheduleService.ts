export const useScheduleMeetingStore = defineStore('meetingStore', () => {
  const startTimeData = ref({ date: null, time: null })
  const endTimeData = ref({ date: null, time: null })
  const meetingTimeZone = ref('Eastern Time')

  // TEMPORARY
  function generateMeetingId() {
    let randomNumberString = ''
    for (let i = 0; i < 9; i++) {
      const randomDigit = Math.floor(Math.random() * 10)
      randomNumberString += randomDigit
    }
    return randomNumberString
  }
  return { startTimeData, endTimeData, meetingTimeZone, generateMeetingId }
})
