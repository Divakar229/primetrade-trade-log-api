# PrimeTrade AI – Trade Journal API

A REST API to log and manage crypto trades. Built with FastAPI + PostgreSQL + React.

---

## What this project does

- Register and login users with JWT authentication
- Users can log their crypto trades (buy/sell)
- Admin users can manage all users and trades
- Simple React frontend to interact with the API

---

## Tech Used

- **Backend** → Python, FastAPI
- **Database** → PostgreSQL
- **Auth** → JWT tokens, bcrypt password hashing
- **Frontend** → React, Axios
- **API Docs** → Swagger UI at `/docs`

---

## How to Run

### Step 1 – Setup Database

Make sure PostgreSQL is running then create the database:
```bash
psql -U postgres -c "CREATE DATABASE primetrade_ai;"
```

### Step 2 – Run Backend
```bash
cd backend
python -m venv env
env\Scripts\activate        # Windows
pip install -r requirements.txt
```

Copy the env file and fill in your details:
```bash
copy .env.example .env
```

Your `.env` should look like:
```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/primetrade_ai
SECRET_KEY=any-random-long-string-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Start the server:
```bash
uvicorn app.main:app --reload --port 8000
```

Open API docs at: **http://localhost:8000/docs**

### Step 3 – Run Frontend
```bash
cd frontend
npm install
npm run dev
```

Open app at: **http://localhost:3000**

---

## API Endpoints

### Auth
| Method | URL | What it does |
|--------|-----|--------------|
| POST | `/api/v1/auth/register` | Create new account |
| POST | `/api/v1/auth/login` | Login and get token |
| GET | `/api/v1/auth/me` | Get your profile |
| POST | `/api/v1/auth/make-admin` | Make a user admin |

### Trades
| Method | URL | What it does |
|--------|-----|--------------|
| POST | `/api/v1/trades/` | Log a new trade |
| GET | `/api/v1/trades/` | Get your trades |
| PATCH | `/api/v1/trades/{id}` | Update a trade |
| DELETE | `/api/v1/trades/{id}` | Delete a trade |

### Admin only
| Method | URL | What it does |
|--------|-----|--------------|
| GET | `/api/v1/admin/users` | See all users |
| PATCH | `/api/v1/admin/users/{id}/role` | Change user role |
| PATCH | `/api/v1/admin/users/{id}/deactivate` | Deactivate a user |

---

## How to become Admin

Call this endpoint in Swagger:
```
POST /api/v1/auth/make-admin
email: your@email.com
secret: primetrade-setup-2024
```

---

## Folder Structure
```
├── backend/
│   ├── app/
│   │   ├── api/        → all endpoints
│   │   ├── core/       → JWT and config
│   │   ├── db/         → database connection
│   │   ├── models/     → database tables
│   │   ├── schemas/    → request/response structure
│   │   └── main.py     → app entry point
│   └── requirements.txt
└── frontend/
    └── src/
        ├── pages/      → Login, Register, Dashboard
        ├── context/    → Auth state
        └── api/        → API calls
```