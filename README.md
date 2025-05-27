# BloomVerse AI Creations

BloomVerse is a Next.js application built with Firebase Studio that allows users to generate creative content using AI. It features:

-   **Poem Generation**: Create poems based on themes and styles.
-   **Lyrics Generation**: Generate song lyrics from a given theme.
-   **Image Generation**: Produce images from text prompts using AI.
-   **Interactive UI**: A user-friendly interface with tabs for different generators, an inspiration sparker, and a simple counter.

## Tech Stack

-   Next.js (App Router)
-   React
-   TypeScript
-   Tailwind CSS
-   ShadCN UI Components
-   Genkit (for AI functionalities)
-   Firebase (for deployment and potential backend services)

## Getting Started

### Prerequisites

-   Node.js (version 18 or later recommended)
-   npm, yarn, or pnpm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
    cd YOUR_REPOSITORY_NAME
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
    (or `yarn install` / `pnpm install`)

3.  Set up environment variables:
    Create a `.env` file in the root of the project. You will need to configure your Google AI provider API key for Genkit. Example:
    ```env
    GOOGLE_API_KEY=your_google_api_key_here
    ```

### Running the Development Servers

You need to run two development servers simultaneously: one for Genkit (AI flows) and one for the Next.js frontend.

1.  **Genkit Development Server**:
    In one terminal, run:
    ```bash
    npm run genkit:dev
    ```
    Or for automatic reloading on changes:
    ```bash
    npm run genkit:watch
    ```

2.  **Next.js Development Server**:
    In another terminal, run:
    ```bash
    npm run dev
    ```
    This will typically start the app on `http://localhost:9002`.

### Building for Production

```bash
npm run build
```

Then to start the production server:

```bash
npm run start
```

## Project Structure Highlights

-   `src/app/`: Main Next.js application pages and layouts.
-   `src/components/`: Reusable React components, including ShadCN UI components.
-   `src/ai/`: Genkit related code.
    -   `src/ai/flows/`: Genkit flows for AI interactions (poem, lyrics, image generation).
    -   `src/ai/genkit.ts`: Genkit global configuration.
    -   `src/ai/dev.ts`: Entry point for the Genkit development server.
-   `public/`: Static assets.
-   `src/app/globals.css`: Global styles and Tailwind CSS theme configuration.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue. (Update this section based on your preferences).
