# LARPlaner Frontend

This directory contains the frontend application for LARPlaner, built with Next.js.

## Technologies Used

- **Framework:** [Next.js](https://nextjs.org/) (v14, App Router)
- **UI Library:** [NextUI v2](https://nextui.org/) & [Tailwind CSS](https://tailwindcss.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [Tailwind Variants](https://tailwind-variants.org)
- **State Management/Data Fetching:** [TanStack React Query](https://tanstack.com/query/latest)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Authentication:** [Firebase Authentication](https://firebase.google.com/docs/auth)
- **Internationalization (i18n):** [React Intl](https://formatjs.io/docs/react-intl/), [FormatJS CLI](https://formatjs.io/docs/tooling/cli/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Animation:** [Framer Motion](https://www.framer.com/motion/)
- **Theming:** [next-themes](https://github.com/pacocoursey/next-themes)
- **Linting/Formatting:** ESLint, Prettier

## Getting Started

### Prerequisites

- Node.js (Check `.nvmrc` or project requirements for specific version)
- npm (or yarn/pnpm/bun)

### Installation

1.  Navigate to the frontend directory:
    ```bash
    cd frontend-next
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or yarn install / pnpm install / bun install
    ```
    _Note for `pnpm` users:_ Ensure your `.npmrc` file includes `public-hoist-pattern[]=*@nextui-org/*` as mentioned in the original template README if you encounter issues.

### Running the Development Server

```bash
npm run dev
```

This will start the Next.js development server, typically on `http://localhost:9000` (as specified in the `dev` script).

## Available Scripts

- `npm run dev`: Starts the development server with Turbo (`--turbo`) on port 9000.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server (requires `npm run build` first).
- `npm run lint`: Lints the codebase using ESLint and attempts to fix issues.
- `npm run extract`: Extracts internationalization messages using FormatJS CLI into `lang/en-US.json`.

## Folder Structure (Key Directories)

- `app/`: Contains the core application routes, pages, and layouts (using Next.js App Router).
- `components/`: Shared UI components used across the application.
- `context/`: React context providers.
- `hooks/`: Custom React hooks.
- `lang/`: Internationalization files (e.g., `en-US.json`).
- `providers/`: Higher-level providers (e.g., ThemeProvider, QueryClientProvider).
- `services/`: API interaction logic (e.g., Axios instances, API call functions).
- `styles/`: Global styles.
- `types/`: TypeScript type definitions.
- `utils/`: Utility functions.
- `public/`: Static assets.

## License

Licensed under the [MIT license](./LICENSE).
