# Project: Expense Tracker

## Overview

This project is a web application designed for personal expense tracking. It enables users to manage their finances by recording income and expenses. The application is built with a modern tech stack, featuring a Next.js frontend and a Firebase backend. It provides a user-friendly interface for adding, editing, and deleting transactions, along with a dashboard that offers a clear overview of the user's financial status.

## Key Technologies

-   **Frontend:**
    -   [Next.js](https://nextjs.org/): A React framework for building server-side rendered and statically generated web applications.
    -   [React](https://reactjs.org/): A JavaScript library for building user interfaces.
    -   [TypeScript](https://www.typescriptlang.org/): A typed superset of JavaScript that compiles to plain JavaScript.
    -   [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework for rapid UI development.
-   **Backend:**
    -   [Firebase](https://firebase.google.com/): A platform developed by Google for creating mobile and web applications.
        -   **Firebase Authentication:** Used for user sign-up and login (email/password and Google).
        -   **Firestore:** A NoSQL database used to store transaction data.
-   **UI Components:**
    -   [Shadcn/ui](https://ui.shadcn.com/): A collection of reusable UI components.
    -   [Recharts](https://recharts.org/): A composable charting library built on React components.
-   **State Management:**
    -   [React Context API](https://reactjs.org/docs/context.html): Used for managing the global authentication state.

## File Structure

The project follows a standard Next.js `app` directory structure:

```
/
├── app/
│   ├── (main)/
│   │   ├── page.tsx        # Main dashboard page (protected route)
│   │   └── layout.tsx      # Main layout
│   ├── login/
│   │   └── page.tsx        # Login page
│   ├── signup/
│   │   └── page.tsx        # Signup page
│   ├── components/
│   │   ├── dashboard/      # Dashboard-specific components
│   │   ├── layout/         # Layout components (e.g., Navbar)
│   │   └── ui/             # Generic UI components
│   ├── context/
│   │   └── AuthContext.tsx # Authentication context
│   ├── lib/
│   │   ├── firebase.ts     # Firebase configuration
│   │   └── firestoreService.ts # Firestore interaction functions
│   └── types/
│       └── index.ts        # TypeScript type definitions
├── public/                 # Static assets
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies and scripts
```

## Functionality

### 1. User Authentication

-   **Sign-up:** New users can create an account using their email and password.
-   **Login:** Existing users can log in using their email and password or with their Google account.
-   **Protected Routes:** The main dashboard page is a protected route. Unauthenticated users are automatically redirected to the login page.

### 2. Transaction Management

-   **Add Transaction:** Authenticated users can add new transactions, specifying the name, amount, type (income or expense), and date.
-   **View Transactions:** The dashboard displays a list of recent transactions, showing the name, date, amount, and type.
-   **Edit Transaction:** Users can edit the details of an existing transaction through a modal form.
-   **Delete Transaction:** Users can delete a transaction from their list.

### 3. Dashboard

-   **Summary Cards:** The dashboard provides a quick overview of the user's financial situation with summary cards for:
    -   Total Revenue (sum of all income)
    -   Total Expense (sum of all expenses)
    -   Balance (Total Revenue - Total Expense)
-   **Expense Chart:** A bar chart visually compares the total income versus the total expense, providing an intuitive understanding of the user's cash flow.
