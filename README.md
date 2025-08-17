# FinFlow - Personal Finance Manager

A modern, minimalistic personal finance web app built with Next.js 15 and Supabase. Track expenses, monitor investments, and achieve your financial goals with a clean, intuitive interface.

![FinFlow Dashboard](https://via.placeholder.com/800x400)

## Features

- **Expense Tracking**: Record and categorize your income and expenses
- **Smart Analytics**: Visualize spending patterns with intuitive charts
- **Financial Goals**: Set and track savings goals with progress indicators
- **Market News**: Stay updated with real-time financial news
- **Dark/Light Mode**: Beautiful UI with theme toggle
- **Secure & Private**: Your data is encrypted and never shared
- **Mobile Responsive**: Works seamlessly on all devices
- **Export Data**: Download your financial data anytime
- **Open Source**: Free forever, with optional donations

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Styling**: Tailwind CSS, Shadcn/UI
- **Charts**: Recharts
- **State Management**: Zustand
- **Deployment**: Vercel

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier available)
- Optional: Finnhub API key for market news

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/finflow.git
cd finflow
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key from project settings

4. Configure environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your values:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
FINNHUB_API_KEY=your_finnhub_key (optional)
NEXT_PUBLIC_BMC_USERNAME=your_buymeacoffee_username
```

5. Run database migrations:
   - Go to Supabase Dashboard > SQL Editor
   - Copy and run the SQL from `supabase/migrations/001_initial_schema.sql`

6. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/finflow)

### Self-Hosting

1. Build the production bundle:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

For Docker deployment:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Database Schema

### Tables

- **personal_finances**: Stores income, expenses, subscriptions
- **goals**: Financial goals and progress
- **market_news**: Cached financial news

All tables include Row Level Security (RLS) for data privacy.

## Project Structure

```
finflow/
├── app/                  # Next.js App Router
│   ├── api/             # API routes
│   ├── dashboard/       # Dashboard page
│   ├── news/           # News feed
│   ├── settings/       # User settings
│   └── auth/           # Authentication
├── components/          # React components
│   ├── ui/             # Base UI components
│   └── charts/         # Chart components
├── lib/                # Utilities
│   ├── supabase/       # Supabase clients
│   └── utils/          # Helper functions
└── supabase/           # Database migrations
```

## API Integration

### Market News

The app can fetch financial news from:
- **Finnhub**: Free tier available, real-time market news
- **Alpha Vantage**: Free tier for news sentiment
- **Custom sources**: Add your own news aggregation

### Setting up Finnhub

1. Get free API key from [finnhub.io](https://finnhub.io)
2. Add to `.env.local`
3. News will auto-refresh hourly

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

If you find FinFlow helpful, consider supporting the project:

[![Buy Me a Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/finflow)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Security

- All user data is encrypted in transit and at rest
- Row Level Security ensures data isolation
- No third-party tracking or analytics
- Export and delete your data anytime

For security issues, please email security@finflow.app

## Roadmap

- [ ] Budget planning tools
- [ ] Recurring transaction automation
- [ ] Investment portfolio tracking
- [ ] Multi-currency support
- [ ] Mobile app (React Native)
- [ ] AI-powered insights
- [ ] Bank account integration (Plaid)
- [ ] Collaborative budgets

## Acknowledgments

- [Next.js](https://nextjs.org) for the amazing framework
- [Supabase](https://supabase.com) for the backend infrastructure
- [Shadcn/UI](https://ui.shadcn.com) for beautiful components
- [Vercel](https://vercel.com) for hosting
- All our contributors and supporters

---

Built with ❤️ by the FinFlow team. Free and open-source forever.