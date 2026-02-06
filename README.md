# Project Nexus: The AI Campus Super-App ⚡

Project Nexus is a unified, intelligent ecosystem designed to revolutionize campus life. Built specifically to address the challenges outlined in the **AIFusiion_PS_feb06** problem statement, it integrates academic management, social exchange, and campus navigation into a single, high-performance interface.

## 🚀 Feature Overview

### 1. Daily Pulse (The Command Center)
*   **AI Mail Intelligence**: Powered by Gemini 3 Pro, paste long college-wide emails to get 1-sentence action-oriented summaries, sentiment analysis, and deadline extraction.
*   **Mess Dashboard**: Real-time tracking of Breakfast, Lunch, Snacks, and Dinner. Includes menu items, nutritional data (calories/protein), and AI crowd predictions to avoid long queues.
*   **Campus Bulletins**: A live alert system for maintenance, events, and festival registrations (e.g., Zeitgeist 2025).

### 2. Academic Cockpit (LMS & Performance)
*   **Live Command Timetable**: Intelligent schedule management where current/live sessions are pinned to the top with remaining time indicators. Includes room and professor details.
*   **LMS Lite**: A streamlined assignment and material repository. Track grades, submission status, and manage course materials (PDF, ZIP, DOCX) in a centralized repo.
*   **Performance Analytics**: Visualized GPA tracking and degree progress bars (Credits vs. Graduation goals).
*   **Nexus Credentials**: Achievement system that rewards academic consistency with badges like "Dean's List" and "Attendance Hero."

### 3. Intel Hub (The AI Tutor)
*   **AI Study Planner**: Custom 7-day milestone generator for any subject using advanced Gemini reasoning.
*   **Flashcard Lab**: Generates high-yield study cards from any topic using Gemini NLP for rapid revision.
*   **Difficulty Prediction**: Analyzes topic complexity and provides "Critical Pitfalls" to help students prioritize their focus.

### 4. Student Exchange (Campus Marketplace)
*   **Intelligent Marketplace**: Buy and sell items with AI-driven price recommendations and condition analysis. Includes category filters for Electronics, Books, and more.
*   **Travel Pool**: A ride-sharing hub to reduce carbon footprints and split costs. Includes route tracking, passenger capacity management, and safety features.
*   **Skill Barter**: A platform for peer tutoring and knowledge exchange (e.g., bartering Python coding for Guitar lessons).
*   **Lost & Found**: A dedicated reporting system for misplaced items with category tagging and photo proof.

### 5. Explorer’s Guide (Smart Navigation)
*   **Interactive Campus Map**: Powered by Leaflet, featuring precision-mapped IIT Ropar buildings and interest points.
*   **Live Occupancy**: Real-time visualization of building crowds (e.g., Library, Gym, Cafeteria) to help students choose quiet study spots.
*   **Transit Hub**: Bus/Shuttle tracking and estimated auto-rickshaw fares for common routes.

### 6. Nexus AI
*   **Context-Aware Assistant**: A central chat interface that has "Live Memory" of your timetable, GPA, and assignments. Ask things like *"What is my GPA?"* or *"When is my next class?"*

---

## 🛠 Tech Stack
*   **Frontend**: React 19 (ESM), TypeScript, Tailwind CSS
*   **AI Engine**: Google Gemini 3 (Flash & Pro) via `@google/genai`
*   **Icons**: Lucide React
*   **Mapping**: Leaflet.js
*   **UI System**: Glassmorphism, Slim-light custom scrollbars, and high-performance CSS animations.

---

## ⚙️ Local Launch Instructions

1.  **Clone the Repository**
2.  **Environment Variables**: Ensure you have a valid Gemini API key.
    *   The app expects `process.env.API_KEY` to be available.
3.  **Install Dependencies**:
    ```bash
    npm install
    ```
4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
5.  **Access App**: Navigate to `http://localhost:5173`.

---

## 👥 Developers
*   **Sobi**
*   **Rishabh**

*Project Nexus was developed as a submission for AIFusiion 2025. All rights reserved.*
