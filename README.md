# What to Eat Wheel 🍜

A Singapore-focused food recommendation wheel that helps solve the daily "what to eat" dilemma by suggesting local dishes while providing nutritional insights and cultural information.

## 🎯 Problem Statement

Every day, Singaporeans face the challenge of deciding what to eat for their meals. With Singapore's rich and diverse food culture, making a choice can be overwhelming. This application aims to make the decision-making process fun and informative while promoting awareness of both local cuisine and healthy eating habits.

## 🌟 Features

### Core Features
- **Interactive Food Wheel**: Spin to get random food recommendations
- **Detailed Food Information**: Get insights about the selected dish
- **Health Ratings**: Understand the nutritional value of each dish
- **Cultural Context**: Learn about the significance of local dishes
- **Location Suggestions**: Find the best places to eat the recommended dish

### Food Categories
- Local Hawker Favorites (orange)
- Healthy Options (green)
- Quick Meals (blue)
- Special Treats (purple)
- Vegetarian/Vegan Options
- Halal Options

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: React Hooks
- **Animations**: Framer Motion (planned)
- **Testing**: Jest, React Testing Library, Cypress, MSW

## 📁 Project Structure 

```
app/
├── (main)/
│   ├── page.tsx              # Home page with wheel
│   ├── layout.tsx            # Main layout
│   └── loading.tsx           # Loading state
├── components/
│   ├── ui/                  # Reusable UI components
│   └── features/            # Feature-specific components
│       ├── wheel/           # Wheel-related components
│       └── food-info/       # Food information components
├── lib/
│   ├── utils/              # Utility functions
│   └── constants/          # Application constants
├── types/                  # TypeScript type definitions
├── public/                 # Static assets
└── __tests__/             # Test files directory
    ├── unit/              # Unit tests
    ├── integration/       # Integration tests
    ├── e2e/              # End-to-end tests
    └── mocks/            # Test mocks and fixtures
```

## 🧪 Testing

The project follows a comprehensive testing strategy:

### Test Structure
- **Unit Tests**: Component rendering, utility functions, state management
- **Integration Tests**: Component interactions, data flow, API integration
- **End-to-End Tests**: Complete user flows, navigation, form submissions
- **Test Coverage**: Minimum 80% coverage for unit tests

### Testing Tools
- Jest for unit and integration tests
- React Testing Library for component tests
- Cypress for E2E tests
- MSW for API mocking

## 🚀 Development Guidelines

### Next.js Conventions
- Use `page.tsx` for routes
- Use `layout.tsx` for layouts
- Use `loading.tsx` for loading states
- Use `error.tsx` for error handling
- Use `not-found.tsx` for 404 pages

### Code Organization
- Components follow single-responsibility principle
- Use composition over inheritance
- Implement proper TypeScript types
- Use React hooks for state management
- Follow TailwindCSS styling conventions

## 📝 License

[Add License Information]

## 👥 Contributing

[Add Contributing Guidelines] 