# Health Tracker App

A comprehensive health and fitness tracking application built with Next.js, TypeScript, and Base44.

## Features

- **Dashboard**: View your overall health metrics and progress
- **Workout Tracking**: Log and track your exercises and workouts
- **Nutrition**: Monitor your calorie intake and macronutrients
- **Progress**: Track your measurements and weight over time
- **Chat**: AI-powered health assistant
- **Profile**: Manage your personal information and achievements

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Base44 project ID

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Configure your Base44 project ID in `.env.local`:
```
NEXT_PUBLIC_BASE44_PROJECT_ID=your_base44_project_id_here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
health/
├── app/                 # Next.js app directory
├── pages/              # Page components
├── components/         # Reusable UI components
├── Entities/           # Base44 entity definitions
├── api/                # API client configuration
└── utils/              # Utility functions
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Technologies

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Base44** - Backend and authentication
- **Recharts** - Data visualization
- **Lucide React** - Icons
