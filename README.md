# MandoAI (React + Vite)

AI-powered React app that lets you enter a prompt and displays the response returned by a **separate FastAPI backend** (hosted in a different repository).  
This repo contains **frontend only**.

---

## Features

- Prompt input + submit button
- Fetches AI responses from a FastAPI API
- Loading + error handling

---

## Tech Stack

- React
- Vite
- TypeScript
---

## Prerequisites

- Node.js 18+ (recommended)
- npm (or yarn/pnpm)
- A running FastAPI backend (from other repo)

---

## Setup

### 1) Clone and install

```bash
git clone https://github.com/ArmandoDiazGit/MandoAI.git
cd MandoAI
npm install
```

### 2) Start app
```bash
npm run dev
```
- The app will run at: http://localhost:5173

## Backend Requirements
- This frontend expects your FastAPI backend to be running and accessible local.
- Expected endpoint (example): ```{ "prompt": "Tell me a fun fact about San Francisco" } ```
