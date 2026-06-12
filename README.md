
# 🌿 Discover Pakistan — AI-Powered Travel Guide

> **Final Year Project** | BS Computer Science | University of Punjab  
> Govt. Graduate College for Women, Sheikhupura  
> **Supervisor:** Ms. Umm e Hani  
> **Team:** Aisha Amir · Adan Fatima · Seeman Bibi · Sidra Ghafoor

---

## 📌 Project Overview

**Discover Pakistan** is a full-stack web-based travel guide platform designed to help both domestic and international tourists explore Pakistan. It combines a dynamic destination database, AI-powered chatbot, mood-based recommendations, and an admin content management system — all in one platform.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🗺️ Destination Guide | 27+ cities with detailed info: attractions, food, hotels, maps, weather |
| 🤖 AI Chatbot | RAG-based travel assistant powered by Groq LLM (LLaMA 3.3) |
| 🎭 Mood Recommendations | Find destinations by mood: Adventure, Foodie, Cultural, Nature, Family, Historical |
| 🔍 Search | Real-time destination search with province/keyword filtering |
| ⭐ Reviews | JWT-authenticated review system with star ratings |
| 🍛 Food Guide | Regional cuisine database with categories and visuals |
| 🗣️ Urdu Phrases | Interactive phrasebook with audio for tourists |
| ✈️ First-Time Traveler Guide | Cultural etiquette, safety tips, and readiness quiz |
| 🛠️ Admin Dashboard | Full CRUD for destinations, stats, image management |
| 👤 Auth System | Signup/Login with JWT, role-based access (user/admin) |

---

## 🏗️ Tech Stack

### Frontend
- HTML5, CSS3, Vanilla JavaScript
- Responsive design (mobile-friendly)
- Dynamic navbar & chatbot loaded via `fetch()`

### Backend (Node.js)
- **Runtime:** Node.js
- **Framework:** Express.js v5
- **Database:** MySQL (mysql2)
- **Auth:** JWT + bcryptjs
- **API:** RESTful

### AI Service (Python)
- **Framework:** FastAPI (async)
- **LLM:** Groq API — `llama-3.3-70b-versatile`
- **RAG Pipeline:** Sentence Transformers (`all-MiniLM-L6-v2`) + cosine similarity
- **Database:** SQLAlchemy (async) + PostgreSQL
- **Streaming:** Server-Sent Events (SSE)

---

## 📁 Project Structure

```
fyp-discover-pakistan/
├── Frontend/               # All HTML, CSS, JS pages
│   ├── homepage.html
│   ├── destination.html    # Dynamic city page
│   ├── allDestinations.html
│   ├── recommendation.html # Mood-based recommendations
│   ├── food.html
│   ├── basicPhrases.html
│   ├── fttGuide.html       # First-time traveler guide
│   ├── adminDashboard.html
│   ├── login.html / signup.html
│   ├── chatbot.html / chatbot.js
│   └── common.js           # Shared navbar + chatbot loader
│
├── backend/                # Node.js Express API
│   ├── config/db.js        # MySQL connection pool
│   ├── controllers/        # Auth, City, Review, Favourite, Search
│   ├── models/             # Destination, User, Review, Favourite
│   ├── routes/             # Auth, Search, Review, Food, Favourite
│   └── middleware/         # JWT protect + adminOnly
│
├── AI/                     # Python FastAPI AI service
│   ├── app/
│   │   ├── main.py         # FastAPI app entry point
│   │   ├── config.py       # Settings (Groq, DB, CORS)
│   │   ├── database.py     # Async SQLAlchemy setup
│   │   ├── chat/           # LLM chat service + router
│   │   ├── rag/            # RAG indexing, search, upload
│   │   └── pakistan_data/  # Travel knowledge base (.txt files)
│   ├── setup_pakistan_data.py
│   └── requirements.txt
│
├── server.js               # Main Node.js server entry
├── database.sql            # Full MySQL schema + seed data
└── package.json
```

---

## 🗄️ Database Schema

MySQL database (`discover_pakistan`) with 10 tables:

- `users` — Auth with roles (user/admin)
- `destination` — 27+ cities with slug, province, tagline, hero image
- `city_badges` — Destination tags/badges
- `mood` — 7 travel moods
- `destination_mood` — Many-to-many link
- `places` — Top attractions per city
- `restaurants` — Recommended restaurants per city
- `reviews` — User reviews with star ratings
- `favourites` — User saved destinations
- `food_categories` + `food_items` — Full food guide

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- Python 3.10+
- MySQL 8+
- Groq API key (free at [console.groq.com](https://console.groq.com))

### 1. Clone the Repository
```bash
git clone https://github.com/aishaamirkhann-bit/fyp-discover-pakistan.git
cd fyp-discover-pakistan
```

### 2. Setup MySQL Database
```sql
CREATE DATABASE discover_pakistan;
USE discover_pakistan;
-- Run database.sql
SOURCE database.sql;
```

### 3. Backend (Node.js)
```bash
npm install
```
Create `.env` in root:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=discover_pakistan
JWT_SECRET=your_jwt_secret
PORT=3000
```
```bash
npm run dev
```

### 4. AI Service (Python)
```bash
cd AI
pip install -r requirements.txt
```
Create `AI/.env`:
```
DATABASE_URL=postgresql+asyncpg://user:pass@localhost/discover_pakistan_ai
GROQ_API_KEY=your_groq_key
GROQ_API_KEY_BACKUP=your_backup_key   # optional
```
```bash
python app/setup_pakistan_data.py   # Index knowledge base
uvicorn app.main:app --reload --port 8000
```

### 5. Run Frontend
Open `Frontend/homepage.html` with Live Server (VS Code) or any static server.

---

## 🔌 API Endpoints

### Auth
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |

### Cities / Destinations
| Method | Route | Description |
|---|---|---|
| GET | `/api/cities` | Get all destinations |
| GET | `/api/cities/search?q=hunza` | Search destinations |
| GET | `/api/cities/details/:slug` | Get single city |
| GET | `/api/cities/mood/:mood` | Filter by mood |

### Reviews
| Method | Route | Description |
|---|---|---|
| GET | `/api/reviews/:slug` | Get reviews for a city |
| POST | `/api/reviews/:slug` | Submit review (auth required) |

### Food
| Method | Route | Description |
|---|---|---|
| GET | `/api/food-categories` | Get all food categories + items |

### AI Chatbot
| Method | Route | Description |
|---|---|---|
| POST | `/chat/message` | Simple stateless chat |
| POST | `/chat/recommendations` | Mood-based destination recommendations |
| POST | `/chat/conversations` | Create conversation |
| POST | `/chat/conversations/:id` | Send message with history |
| POST | `/chat/conversations/:id/stream` | Streaming SSE response |

---

## 🤖 AI Architecture

```
User Message
     │
     ▼
RAG Search (Sentence Transformers)
     │
     ▼
Relevant chunks from Pakistan knowledge base
     │
     ▼
Groq LLM (LLaMA 3.3-70b) + System Prompt + Context
     │
     ▼
Travel Guide Response (streaming or standard)
```

**Knowledge Base includes:**
- `destinations.txt` — 27+ cities, hotels, restaurants
- `food.txt` — Complete cuisine guide
- `culture.txt` — Etiquette, customs, Urdu phrases
- `travel_tips.txt` — Visa, budget, transport, safety
- `cities.txt` — Detailed city guides

---

## 🌐 Pages Overview

| Page | Description |
|---|---|
| `homepage.html` | Hero, destination carousel, about section |
| `allDestinations.html` | Grid of all 27+ destinations |
| `destination.html?city=lahore` | Individual city page with tabs (Overview, Places, Food, Map, Reviews) |
| `recommendation.html` | Mood + budget + duration based trip finder |
| `food.html` | Pakistani cuisine by category |
| `basicPhrases.html` | Urdu phrasebook with audio |
| `fttGuide.html` | First-time traveler guide + readiness quiz |
| `searchResults.html` | Dynamic search results |
| `adminDashboard.html` | Admin CRUD for destinations |
| `login.html` / `signup.html` | Authentication |

---

## 👩‍💻 Team

| Name | Role |
|---|---|
| **Aisha Amir** |  AI/RAG (Python),Backend (Node.js), Database Design ,Testing |
| **Adan Fatima** | Frontend Development, UI/UX , Database Design ,Testing |
| **Seeman Bibi** | Backend Development  |
| **Sidra Ghafoor** | Database Development |


---

## 📜 License

This project is developed for academic purposes as a Final Year Project.  
© 2026 Discover Pakistan Team — University of Punjab, Lahore, Pakistan.
