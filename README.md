# Tip Tracking Dashboard

by Colin Trierweiler

## Project Description

This project is based off of the "Build a Data Dashboard" project at https://towardsdatascience.com/build-a-data-dashboard-using-html-css-javascript by Thomas Reid.

I have changed it to track the tips I make as a restaurant server.

Now it is a web-based dashboard for restaurant servers to track and analyze their tips across different shifts, days, and time periods. You can visualize earnings patterns to optimize work schedules and maximize income.

I have changed the mock sales data to include the real data of the tips I made last week, plus other data about how many hours I worked, what day of the week it was, and whether the shift was AM or PM.

This could be developed into a real app to help servers keep track of their tips, and what days and shifts yield the most. It's obviously different in every restaurant, but it's a way to gather data.

I also changed the CSS to fit my brand (green-text on a black background).

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (ES Modules)
- Vite (build tool and dev server)
- Bootstrap (UI components)
- Chart.js (data visualization)
- DataTables (table display)
- Flatpickr (date picker)

### Backend
- Node.js with Express
- ES Modules (modern JavaScript)
- Supabase JavaScript Client

### Database
- PostgreSQL (via Supabase)
- Cloud-hosted with real-time capabilities
- Row Level Security (RLS) enabled

### Authentication (Planned)
- Supabase Auth with Google OAuth

## Setup & Installation

### Prerequisites
- Node.js 18+ installed
- A Supabase account (free tier works great)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/tip-tracking-dashboard.git
cd tip-tracking-dashboard/my-dashboard
```

### 2. Set Up Supabase
1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL Editor, run this query to create your table:
```sql
CREATE TABLE tips (
    shift_id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    day_of_week VARCHAR(3) NOT NULL,
    am_or_pm VARCHAR(2) NOT NULL,
    hours_worked DECIMAL(4,2) NOT NULL,
    tips_earned DECIMAL(8,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX idx_tips_date ON tips(date);
```
3. Get your project credentials from Project Settings → API:
   - Project URL
   - Anon/Public Key

### 3. Install Dependencies

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd ../client
npm install
```

### 4. Configure Environment Variables

**Server** - Create `server/.env`:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Client** - Create `client/.env`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

⚠️ **Important:** Never commit `.env` files to Git! They're already in `.gitignore`.

### 5. Start the Application

**Terminal 1 - Start the backend:**
```bash
cd server
node server.js
```

**Terminal 2 - Start the frontend:**
```bash
cd client
npm run dev
```

### 6. Open the App
Navigate to http://localhost:5173 (or whatever port Vite shows)

## Project Structure

```
my-dashboard/
├── client/                 # Frontend (Vite)
│   ├── db/
│   │   └── supabase.js    # Supabase client config
│   ├── index.html
│   ├── script.js
│   ├── style.css
│   ├── .env               # Client environment variables
│   └── package.json
│
├── server/                 # Backend (Express)
│   ├── db/
│   │   └── supabase.js    # Supabase server config
│   ├── config.js          # Environment config
│   ├── server.js          # Express server
│   ├── .env               # Server environment variables
│   └── package.json
│
└── .gitignore
```

## Features

- ✅ Track tips by shift (AM/PM)
- ✅ Record hours worked and earnings
- ✅ Filter data by date range
- ✅ Visualize earnings over time with charts
- ✅ View raw data in sortable tables
- ✅ Calculate key metrics (total tips, averages)
- 🚧 Input new shifts via modal form (in progress)
- 🚧 Google authentication (planned)
- 🚧 Mobile app version (planned)

## Database Schema

### `tips` Table
| Column | Type | Description |
|--------|------|-------------|
| shift_id | SERIAL | Primary key (auto-increment) |
| date | DATE | Shift date |
| day_of_week | VARCHAR(3) | Mon, Tue, Wed, etc. |
| am_or_pm | VARCHAR(2) | AM or PM shift |
| hours_worked | DECIMAL(4,2) | Hours worked (e.g., 5.5) |
| tips_earned | DECIMAL(8,2) | Tips earned in dollars |
| created_at | TIMESTAMP | Record creation time |

## Future Ideas

- **Mobile App**: Flutter for cross-platform (Android & iOS)
- **Total Sales and Percentages**: Input a user's Total Net Sales, so we can calculate their Tips/Sales percentage, and track it as a metric
- **Advanced Analytics**: Predictive modeling for optimal shift selection
- **Multi-user Support**: Team/restaurant-wide tip tracking
- **Export Features**: PDF reports, CSV downloads
- **Real-time Sync**: Live updates across devices
- **Expense Tracking**: Track tip-outs and other expenses

## Contributions

Contributions are welcome and appreciated! Whether you're fixing bugs, adding features, or improving documentation, your help makes this project better for everyone.

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Feel free to open an issue first to discuss major changes or new features.

## License

This project is released under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Original project inspiration: [Build a Data Dashboard](https://towardsdatascience.com/build-a-data-dashboard-using-html-css-javascript) by Thomas Reid
- Built with ☕ and 💚 by restaurant servers, for restaurant servers

## Support

If you find this project helpful, consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🤝 Contributing code
