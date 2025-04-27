# Step 1: Install existing project dependencies
npm install

# Step 2: Install lucide-react
npm install lucide-react

# Step 3: Install dev dependencies: Tailwind, PostCSS, Autoprefixer, @types/node, and shadcn-ui
npm install -D tailwindcss postcss autoprefixer @types/node shadcn-ui

# Step 4: Initialize shadcn-ui
npx shadcn-ui@latest init

# Step 5: (Optional duplicate) Initialize shadcn-ui again (seems repeated, maybe typo?)
npx shadcn@latest init

# Step 6: Initialize Tailwind config and PostCSS config
npx tailwindcss init -p
