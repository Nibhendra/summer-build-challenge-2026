# NoteSprint 🚀

NoteSprint is a comprehensive, student-focused notes and study planner app built with Expo and React Native.

## Features

- **Smart Dashboard**: Instantly view your total notes, upcoming deadlines, today's schedule, and pending revisions.
- **Enhanced Notes**: Color-coded notes with subjects, priority flags, tags, and favorites.
- **Spaced Repetition**: Rate your confidence after reviewing a note to schedule your next revision automatically.
- **Study Scheduler**: Plan, manage, and log your study sessions by duration and difficulty.
- **Deadline Tracker**: Never miss an assignment or exam. Track deadlines by priority and days left.
- **Study Analytics**: Keep track of your study hours, completed sessions, and overall progress.
- **Local Storage**: All data securely persists locally via AsyncStorage.

## Tech Stack

- React Native & Expo (SDK 54)
- Expo Router (Tabs & Stacks)
- React Native Reanimated (Micro-animations & transitions)
- AsyncStorage (Local persistence)
- React Native Safe Area Context

## Run the App

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npx expo start
   ```

3. Scan the QR code with **Expo Go** (SDK 54) on your mobile device.

## Folder Structure

```
03-notes-organizer/
├── app/                        # Expo Router screens
│   ├── _layout.tsx             # Root Stack layout
│   ├── (tabs)/                 # Bottom Tabs layout
│   │   ├── _layout.tsx
│   │   ├── index.tsx           # Dashboard
│   │   ├── notes.tsx           # Note List
│   │   ├── scheduler.tsx       # Study Schedule
│   │   ├── deadlines.tsx       # Deadlines Tracker
│   │   └── analytics.tsx       # Analytics & Stats
│   ├── add.tsx                 # Add/Edit note screen
│   ├── note/[id].tsx           # Note detail with Spaced Repetition
│   └── settings.tsx            # Settings
├── components/                 # Reusable UI components
├── constants/                  # Colors, Subjects, Sample Data
├── hooks/                      # Custom hooks (useNotes, useSessions, useDeadlines)
├── types/                      # TypeScript definitions
└── utils/                      # Storage wrapper
```

*Made with ❤️ · React Native + Expo · Local-first*
