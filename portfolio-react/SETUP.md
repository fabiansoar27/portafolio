# Portfolio React - Setup Guide

## Project Structure

The project has been initialized with the following structure:

```
portfolio-react/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API and service functions
│   └── assets/         # Static assets
│       ├── css/        # Stylesheets
│       ├── img/        # Images
│       └── pdf/        # PDF files (CV)
├── .env                # Environment variables
└── package.json        # Dependencies
```

## Installation Steps

1. **Install Dependencies**
   ```bash
   cd portfolio-react
   npm install
   ```

2. **Configure Supabase**
   - Create a Supabase project at https://supabase.com
   - Copy your project URL and anon key
   - Update the `.env` file with your credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

3. **Copy Assets** (if not already done)
   - Copy CSS files from `../assets/css/` to `src/assets/css/`
   - Copy images from `../assets/img/` to `src/assets/img/`
   - Copy PDF from `../assets/pdf/` to `src/assets/pdf/`

## Dependencies Installed

- **react** & **react-dom**: React framework
- **react-router-dom**: Routing for React applications
- **@supabase/supabase-js**: Supabase client for backend integration

## Next Steps

Follow the implementation tasks in `.kiro/specs/portfolio-react-migration/tasks.md` to:
1. Configure Supabase database schema
2. Implement routing system
3. Migrate components from the original portfolio
4. Build the admin panel

## Development

Run the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

## Notes

- The original portfolio styles have been preserved in `src/assets/css/styles.css`
- All color variables and design tokens match the original portfolio
- The project uses Vite for fast development and optimized builds
