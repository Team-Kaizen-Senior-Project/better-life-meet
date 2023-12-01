<p align="center">
  <img src="/kaizen.png" width="100"/>
</p>

# TribeMeet
A component-based **web video conferencing application** that integrates with ABetterLife's existing software infrastructure and **resolves** compatibility issues, elevates the user experience, and delivers a robust API for detailed user analytics.

<p align="left">
  <img src="/betterlife_image.png" width="100"/>
</p>

**ABetterLife:** https://abetterlife.com/

## Technology Stack
### Frontend
- **[TailwindCSS](https://tailwindcss.com/)**: To craft a responsive and aesthetically pleasing user interface with a focus on design consistency and usability. 
- **[Nuxt.js](https://nuxt.com/)**: To harness the benefits of server-side rendering for a fast, rich user interface.
### Backend
#### Application Backend
- **[FaunaDB](https://fauna.com/)**: Utilizing this database for its flexibility and ease of scaling to manage user data effectively. Additionally, ABetterLife’s system is using FaunaDB, so integration will be seamless.
#### WebRTC Server
- **[Node.js](https://nodejs.org/en)** and **[Express](https://expressjs.com/)**: For building a fast, scalable WebRTC server capable of handling concurrent video conferencing sessions.
- **[MediaSoup](https://mediasoup.org/)**: A versatile WebRTC Selective Forwarding Unit (SFU) for scalable video conferencing.

## ERD
<p align="center">
  <img src="/ERD.png" width="600"/>
</p>

## Prototype
**UI Dashboard:**
<p align="center">
  <img src="/user_dashboard.png" width="600"/> <br>
  <h4>Shown above is the Dashboard, the central page of TribeMeet where logged-in users can:</h4>
  <ul>
    <li>Configure video & mic settings (center)</li>
    <li>Schedule/join a meeting (right column)</li>
    <li>Assess habits using habit tracker (top left)</li>
    <li>View goals for the quarter (bottom left)</li>
  </ul>

</p> <br>

**Pod Meetings:**
<p align="center">
  <img src="/pod_meetings.png" width="600"/>
  <h4>The core interface of TribeMeet where participants engage in video conferencing:</h4>
  <ul>
    <li>View all particpants' cameras in a grid layout</li>
    <li>Control your video and microphone</li>
    <li>Exit the meeting with a dedicated leave button</li>
  </ul>
</p> <br>

**Robust API**
<p align="center">
  <img src="/api_postman_example.png" width="600"/>
  <h4>The robust API of TribeMeet provides extensive control over meeting management and data retrieval. Developers can:</h4>
  <ul>
    <li>Schedule meetings with customizable settings</li>
    <li>Retrieve detailed detailed analytics on participant engagement, including attendance duration, interaction levels, and more.</li>
    <li>Integrate TribeMeet's functionality into existing workflows or applications for a unified user experience.</li>
  </ul>
</p>

## Developer Instructions
**Clone Repo:**
```bash
git clone https://github.com/Team-Kaizen-Senior-Project/better-life-meet.git
```
With **[npm](https://www.npmjs.com/)** installed:

**Install Dependencies:**
```bash
npm install
```
**Install MediaSoup Server Dependencies:**
```bash
cd mediasoup-server
npm install
```
**Run MediaSoup Server:**
```bash
ts-node server.ts
```
**Run Application:**
```bash
npm run dev
```

## Testing
(_Placeholder for CSC 191_)

## Deployment
(_Placeholder for CSC 191_)

## Timeline
| Sprint | Task | Status | Planned Completion | Actual Completion |
|--------|------|--------|--------------------|-------------------|
| 1      | Initial Setup and Foundations | Done | need to verify date | need to verify |



