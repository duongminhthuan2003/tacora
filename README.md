[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/YHSq4TPZ)
# To-Do App – Preliminary Assignment Submission
⚠️ Please complete **all sections marked with the ✍️ icon** — these are required for your submission.

👀 Please Check ASSIGNMENT.md file in this repository for assignment requirements.

## 🚀 Project Setup & Usage
**How to install and run your project:**  
✍️  
Example (replace with your actual steps)  
- `npm install`  
- `npm start`

## 🔗 Deployed Web URL or APK file
https://naverhackathon-tacora-bydmt.vercel.app/


## 🎥 Demo Video
**Demo video link (≤ 2 minutes):**  
📌 **Video Upload Guideline:** when uploading your demo video to YouTube, please set the visibility to **Unlisted**.  
- “Unlisted” videos can only be viewed by users who have the link.  
- The video will not appear in search results or on your channel.  
- Share the link in your README so mentors can access it.  

✍️ [Paste your video link here]


## 💻 Project Introduction

### a. Overview

Tacora is a lightweight and simple to‑do app that helps students plan tasks by deadline, priority, and type. It can detect workload conflicts across nearby deadlines, and gives AI suggestions through OpenAI API for estimated time and priority while adding or editing tasks. Data is stored in the browser's local storage, so it’s fast and private.

### b. Key Features & Function Manual

- Add and edit task: Title, deadline, type (School/Work/Group/Club/Other), estimated minutes, priority. After typing title, due date and type of task, Tacora AI can suggest estimated time and priority, then user can decide to use it or not using the "Apply" button.
- Delete task: User can choose which task is completed and can be deleted.
- Views: There're four options to choose how Tacora views all the task, by chronological order of all tasks (All), by calendar date (By date), by task type (By type), or only tasks that are detected to be conflicting tasks (Conflicting).
- Search: Search tasks using their title.
- Import/export: Export all tasks to a "tasks.json" file and import from a JSON file to restore/share.
- Summary: Live counts for Incoming/Warning/Dangerous/Conflicting 
- Settings: Tune conflict rules (window hours, heavy threshold, priority sum).

### c. Unique Features (What’s special about this app?) 

- Detecting tasks having close deadline to each other if they’re heavy or important, helping avoid overload before deadlines.
- AI suggestions for estimated time and priority while typing, one click to apply.
- No sign‑in, everything persists via the browser for speed and privacy.
- One‑click JSON import/export, many choices of tasks views, intuitive status and conflict badges.

### d. Technology Stack and Implementation Methods

React + Typescript + Vite, React Router for pages, Tailwind CSS for styling, Hugeicons for icon, Zustand for state management and local storage, OpenAI API for AI suggestion.

### e. Service Architecture & Database structure (when used)

- Architecture: Client (Vite/React SPA) -> optional serverless Suggest endpoint at "/api/suggest".
- Task: "id", "title", "type", "dueAt" (ISO), "estimatedMins" (number), "priority" (Low/Medium/High).

## 🧠 Reflection

### a. If you had more time, what would you expand?

- Calendar & reminders: Google/ICS sync, Web Push notifications to remind users.
- Customization: Theming, conflict rule presets, per-type colors/icons.
- Weekly reports, estimate vs actual time tracking.
- Sync with optional account across devices, weekly backup.
- Users' description input section for tasks, for better AI analysis

### b. If you integrate AI APIs more for your app, what would you do?

- Smart breakdown: Divide tasks into multiple subtasks.
- Smart input: Users can upload task's requirements (such as assignment PDF files) so that Tacora can generate tasks, predict when to start particular task and remind user to start.
- Search and add task by using natural language.
- Propose solution to resolve conflicting tasks, help user decide what task should be done first.


## ✅ Checklist
- [ ] Code runs without errors  
- [ ] All required features implemented (add/edit/delete/complete tasks)  
- [ ] All ✍️ sections are filled  
