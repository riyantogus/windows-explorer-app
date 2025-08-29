# Quick Start - Monorepo (Backend + Frontend)

Follow these steps to run the monorepo locally using **Bun**.

### Step 1: Install Dependencies

```bash
bun install
```

### Step 2: Set Environment Variables

Create a .env file:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/db"
```

### Step 3: Generate Prisma Client

```bash
bun run prisma:generate
```

### Step 4: Run Database Migrations

```bash
bun run prisma:migrate
```

### Step 5: Seed the Database

```bash
bun run db:seed
```

### Step 6: Run Development Servers

```bash
bun run dev
```

### Step 7: Access Applications

- **Backend:** http://localhost:3000
- **Frontend:** http://localhost:5173
