# Think-o-matic specific guidelines

This is a lightweight spec for a fast prototype called **Think-o-matic**. 
You, AI Assistant, will help me build it interactively. 
I’ll guide the direction — you propose steps, ask for clarifications, and we co-create the code together.
Consider the current directory as the project root folder.

---

## 🎯 Goal

To create a web app that helps people prepare and follow up on workshops. 
The user gives a goal, duration, attendees, and workshop type — the system does the REST using AI and real API integrations.

General flow:
1. Generate a suggested agenda
2. Pick a fitting **Miro template** (not build from scratch)
3. Create a board using that template
4. Analyze board content post-workshop
5. Extract action items
6. Create Trello cards for those items

We’ll use:
- **Bedrock (`nove-lite`)** for AI logic.
- **Miro API** (with templates)
- **Trello API** (to create cards)

All integrations should be real — not mocked. However, we can use dummy data for Miro and Trello boards to keep the first iteration simple and integrate them in later iterations.

---

## 🧱 Stack

Keep it lean and straightforward:

- **Frontend:** React (TypeScript) with Material UI
- **Backend:** Express (TypeScript) on Node.js
- Use `.env` for secrets
- No deployment needed — run locally
- Bedrock integration requires AWS credentials: please use an enviroment variable to pass a profile name to the SDK.
---

## 🚶 User Journey

1. **Workshop Status Tracking**: Users can view the status of each workshop in their dashboard, including whether the agenda has been generated, the Miro board has been created, and the analysis has been completed. They can interact with the dashboard to view details of each workshop and change the status.
2. **Workshop Creation**: User clicks a new workshop button, and a form lets them to fill out a form with: 
   1. Workshop title
   2. Workshop goal
   3. Workshop type (e.g., brainstorming, retrospective, etc.). this would be a dropdown with predefined values, and matches pre-created Miro templates.
   4. Expected outcomes
   5. Date and time
   6. Duration
   7. Participants (number and type)
   8. Miro workspace Id. This is the Miro workspace where the Miro board will be created and must be created before the workshop.
   9. Trello board Id. This is the Trello board where tasks will be created and must be created before the workshop.
3. **Workshop Agenda Creation**: System generates agenda using Bedrock.
4. **Workshop Agenda Review**: User reviews, modifies and approve the agenda.
5. **Miro board generation**: System creates Miro board with the approved agenda. This is done using Miro API and leverages Miro board templates.
6. **Miro board sharing**: User receives a link to the Miro board. Link would be shared as output from the backend API and shown in the frontend.
7. **Workshop conducting**: User conducts the workshop using the Miro board.
8. **Workshop Analysis**: After the workshop, user triggers analysis and summary generation by the system. The output by the system would be a summary of the workshop and next actions.
9.  **Workshop sentiment analysis**: System analyzes Miro board content and generates a sentiment analysis report. This is done using Bedrock and Miro API.
10. **Trello task creation**: System creates Trello tasks based on the generated summary and next actions.

The user journey is designed to be intuitive and user-friendly, allowing users to focus on the workshop content rather than the technical details of the application.
Workshop status changes are tracked in the backend, and the user can view the status of each workshop in the frontend. Status changes are triggered by the user actions, such as creating a workshop, generating an agenda, and conducting the workshop.

---


## 🥇 Expected Outcomes
1. A working prototype of the Think-o-matic web app that demonstrates the core functionality of the application.
2. A user guide that explains how to use the application, including how to create a workshop, generate an agenda, create a Miro board, and create Trello tasks.
3. A README file that provides an overview of the project, including the goals, the technology stack, and the installation instructions.
4. A press release that describes the project and its features, including the benefits of using the application for workshop preparation and follow-up.
5. A technical documentation that explains the architecture of the application, including the backend and frontend components, the API integrations, and the AI logic and possible improvements.

## 🔐 .env Sample

```env
# AWS credentials for Bedrock
AWS_PROFILE_NAME=

# Miro API credentials
MIRO_CLIENT_ID=
MIRO_CLIENT_SECRET=
MIRO_DEFAULT_WORKSPACE_ID=

# Trello API credentials
TRELLO_API_KEY=
TRELLO_API_SECRET=
TRELLO_BOARD_ID=
TRELLO_LIST_ID=

```
---