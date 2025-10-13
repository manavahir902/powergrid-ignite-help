# POWERGRID AI Helpdesk

## Project Overview

This is an AI-powered IT helpdesk system for POWERGRID employees. The system allows employees to describe their issues to an AI assistant, which either provides immediate solutions or creates support tickets when human intervention is needed.

## Key Features

1. **AI Chat Assistant**: Employees can describe their IT issues in natural language
2. **Automatic Ticket Creation**: When issues require human support, the system pre-fills ticket forms
3. **Knowledge Base**: Repository of articles for common IT issues
4. **User Roles**: 
   - Employee: Can create tickets and chat with AI
   - IT Support: Can view and resolve tickets
   - Admin: Can manage the knowledge base and system settings
5. **Real-time Updates**: Ticket status updates in real-time

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Setup Instructions

See [SETUP.md](SETUP.md) for detailed instructions on setting up test users and sample data.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- Supabase (Authentication, Database, Functions)
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/05deebcf-9099-4988-b2d1-d742cb49b0b7) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)