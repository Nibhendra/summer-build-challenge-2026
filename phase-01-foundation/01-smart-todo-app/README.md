# Smart To-Do App 📝

A premium, mobile-first Smart To-Do application built for the **Summer Build Challenge 2026** (Phase 01: Foundation). This app is designed to be an Expo Go-compatible MVP that delivers a flawless, card-based user experience for tracking daily tasks.

## 🌟 Features
- **Task Management**: Create, view, complete, and delete tasks.
- **Priority Labels**: Easily categorize tasks with High, Medium, and Low priorities.
- **Due Dates**: Simple tracking for tasks due today or tomorrow.
- **Smart Filters**: Quickly filter between All, Today, Upcoming, and Completed tasks.
- **Local Persistence**: Data is saved locally using AsyncStorage, ensuring you never lose your progress.
- **Premium UI**: Dark mode support, glassmorphic card elements, subtle shadows, and a clean modern aesthetic using `lucide-react-native` icons.
- **Empty States**: Beautiful empty states when no tasks are found.

## 🛠 Tech Stack
- **React Native**: Core framework.
- **Expo & Expo Router**: For scaffolding and file-based navigation.
- **AsyncStorage**: For local, on-device data persistence.
- **Lucide Icons**: For clean and modern vector graphics.

## 🚀 Run Commands

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Expo Development Server**
   ```bash
   npx expo start
   ```

3. **Run on Device / Emulator**
   - Scan the QR code with the **Expo Go** app on your physical device.
   - Or press `a` to open on an Android emulator.
   - Or press `i` to open on an iOS simulator.

## 📸 Screenshots

*(Replace these with actual screenshots of your running app)*

| Home Screen | Add Task | Task Detail | Settings |
|:---:|:---:|:---:|:---:|
| <img src="./screenshots/home.png" width="200" /> | <img src="./screenshots/add.png" width="200" /> | <img src="./screenshots/detail.png" width="200" /> | <img src="./screenshots/settings.png" width="200" /> |

*(Create a `screenshots` folder and place your images there).*

## 🔮 Future Improvements (Post-MVP)

To take this MVP to the next level, the following upgrades are recommended:

1. **Backend Integration (Firebase/Supabase)**
   - Move from local `AsyncStorage` to a cloud database so tasks sync across multiple devices.
   - Add user authentication.

2. **Native Push Notifications**
   - Implement `expo-notifications` to remind users when a task is due or when an upcoming deadline approaches.

3. **AI Task Prioritization (AI API + RAG)**
   - Integrate an LLM (like Gemini or Claude) to automatically suggest priorities based on task descriptions.
   - Use RAG to intelligently group similar tasks or suggest sub-tasks for large, complex to-do items.

4. **File & Image Attachments**
   - Allow users to upload images or PDFs to task details using Expo Image Picker and cloud storage (e.g., AWS S3).

5. **Native Build & Deployment**
   - Transition from Expo Go to a Custom Dev Client (EAS Build).
   - Prepare the app for App Store and Google Play deployment.
