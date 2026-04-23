# Finance App

A comprehensive personal finance management platform for tracking bank accounts, stocks, and cryptocurrency portfolios. Built with a FastAPI backend and a Next.js frontend, this application provides real-time insights and tools to master your financial future.

## 🚀 Features

- **Personal Budgeting**: Track income and expenses across various categories with visual indicators.
- **Investment Tracking**: Monitor stock and crypto holdings with real-time price updates and gain/loss analysis.
- **Portfolio Management**: Holistic view of your assets and financial health.
- **Financial Advisor**: AI-driven or automated insights to help you reach your goals.
- **Secure Authentication**: Industry-standard security using JWT and bcrypt for data protection.
- **Modern UI**: Clean, responsive dashboard built with Tailwind CSS and Lucide icons.

## 🛠️ Tech Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Database**: [SQLite](https://www.sqlite.org/) with [SQLAlchemy](https://www.sqlalchemy.org/) (Asynchronous)
- **Security**: JWT (python-jose) and Bcrypt (passlib)
- **Validation**: [Pydantic](https://docs.pydantic.dev/)

### Frontend
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **API Client**: [Axios](https://axios-http.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 📂 Project Structure

```text
finance-app/
├── backend/            # FastAPI application
│   ├── main.py         # Entry point
│   ├── models.py       # Database models
│   ├── routes.py       # Auth & general routes
│   ├── finance_routes.py # Budgeting & transactions
│   ├── investment_routes.py # Stock & crypto tracking
│   └── database.py     # DB configuration
└── frontend/           # Next.js application
    ├── src/app/        # Pages and layouts
    ├── src/components/ # Shared UI components
    ├── src/services/   # API service layer
    └── src/types/      # TypeScript definitions
```

## ⚙️ Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the development server:
   ```bash
   python main.py
   ```
   The API will be available at `http://localhost:8000`.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## 🔒 Security
The application uses secure password hashing and JWT-based authentication. Ensure you set up environment variables for production deployments (e.g., `SECRET_KEY`, `DATABASE_URL`).

## 📝 License
This project is licensed under the MIT License.
