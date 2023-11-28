# Better Life Meet

## Overview
The BetterLife Tribe is an online community focused on improving business, personal life, and habits through weekly accountability masterminds. The Tribe utilizes Airmeet for video conferencing and Circle for chat communications.

## Description of Use
BetterLife leverages Airmeet for hosting three weekly accountability calls. These calls begin with a pre-recorded intro video to energize participants, followed by a second video outlining the unique focus of each meeting. Members are divided into "pods" of 2-8 people. Post the videos, members join their respective pods in Airmeet's table system, akin to Zoom breakout rooms. If a member's pod is not present, they can join "lone ranger pods" to interact with other members.

## Pain Points
Technical Issues: Members experience compatibility issues with cameras/mics on mobile devices, particularly on Android. Airmeet sometimes fails to load on standard browsers like Chrome.

API Limitations: Airmeet's API lacks the functionality available in the UI, making automation difficult. Attendance data provided is often incomplete or inaccurate.

## Usability Challenges:

Airmeet charges per event, making user management cumbersome.
No support for Single Sign-On (SSO) for end-users.
Limited collaborative features, such as basic screensharing and no whiteboard functionality.
The requirement of using Airmeet's full website or app disrupts the native feel of the BetterLife Tribe App.
Broken User Experience:

Lack of embedded conferencing in the Tribe app.
Inability to integrate useful features like on-screen agendas or habit trackers.
Goals
Seamless Integration: Create a native video conferencing experience within the Tribe app, eliminating the need for third-party apps or websites.

## Enhanced Functionality:

Host large video presentations with automated breakout sessions.
Full control over the video platform via API.
SSO integration supporting Auth0.
Comprehensive attendance tracking and API exposure.
Sequence and automate video presentations.
Optional live video cut-ins during presentations.
Additional Features: Allow pre-recorded video broadcasts and shared screen options.

## Technical Considerations
Current Tech Stack: Vue and Nuxt for the front end, with a combination of Nuxt API connections, cloud functions, Go, and TypeScript in the backend.
WebRTC: An open standard for real-time communication, supporting video, voice, and data transfer across browsers and native clients.
Project Milestones

## Initial Prototyping:

Establishing basic video functionality.
Interface development for meeting access.
Proof of concept and basic user roles.
MVP Development:

Enhanced UI for a realistic feel.
Implement real authentication and refined user roles.
Provisioning links for meeting access.
Integration Phase:

Incorporate the solution into the existing Tribe app.
Implement attendance tracking and database integration.
Enable launching from other apps.
Feature Expansion:

Introduce pre-recorded video broadcasting.
Implement shared screen functionalities.
User Demographics
The BetterLife Tribe app is used by a diverse age group, including middle-aged and senior members who are generally tech-savvy.

## System Architecture
Database: Users are stored in Fauna, a NoSQL database. The core identifier is the email address.
Attendance Tracking: Attendance data can be sent to Fauna or a time-series database under consideration for habit tracking.
API Integration: The API should expose functionalities necessary for dashboard management, including meeting creation and video uploads.
Screenshots and User Interface
Screenshots from Airmeet illustrate the current user interface and features, including speaker views, chat windows, and breakout group tables.


