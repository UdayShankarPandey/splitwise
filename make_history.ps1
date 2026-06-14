Remove-Item -Recurse -Force .git
git init
git remote add origin https://github.com/UdayShankarPandey/splitwise.git

# 1. chore: initial project setup
git add .gitignore README.md AI_USAGE.md DECISIONS.md SCOPE.md
git commit -m "chore: initial project setup and configs"

# 2. feat(server): initialize express server
git add server/package.json server/package-lock.json server/src/index.js server/.env.example
git commit -m "feat(server): initialize express server and basic configuration"

# 3. feat(db): add prisma schema
git add server/prisma/schema.prisma server/prisma/migrations
git commit -m "feat(db): define database schema with prisma"

# 4. feat(server): add database seed and setup scripts
git add server/prisma/seed.js server/prisma/reset_db.js server/prisma/supabase_setup.sql server/src/utils/prisma.js
git commit -m "feat(server): add database seed and setup scripts"

# 5. feat(server): implement authentication
git add server/src/middleware/auth.js server/src/routes/auth.js server/src/routes/members.js
git commit -m "feat(server): implement jwt authentication and member routes"

# 6. feat(server): add group and expense management
git add server/src/routes/groups.js server/src/routes/expenses.js server/src/routes/balances.js server/src/services/balanceEngine.js server/src/services/splitCalculator.js
git commit -m "feat(server): add group, expense, and balance calculation logic"

# 7. feat(server): add settlement and import logic
git add server/src/routes/settlements.js server/src/routes/imports.js server/src/services/importEngine.js server/src/utils/anomalyDetector.js server/src/utils/csvParser.js server/src/routes/audit.js server/src/middleware/audit.js
git commit -m "feat(server): add settlement, CSV import logic, and audit logging"

# 8. feat(client): initialize vite react app
git add client/package.json client/package-lock.json client/vite.config.js client/vercel.json client/eslint.config.js client/.env.example
git commit -m "feat(client): initialize vite react app and configuration"

# 9. feat(client): add global styles and layout
git add client/index.html client/src/main.jsx client/src/index.css client/src/App.jsx client/src/components/ client/src/assets/
git commit -m "feat(client): add global styles, theme, and base layout"

# 10. feat(client): implement api services
git add client/src/services/ client/src/utils/
git commit -m "feat(client): implement api service layer and utilities"

# 11. feat(client): add authentication and dashboard views
git add client/src/pages/LoginPage.jsx client/src/pages/RegisterPage.jsx client/src/pages/DashboardPage.jsx
git commit -m "feat(client): add authentication and dashboard views"

# 12. feat(client): add group and expense views
git add client/src/pages/GroupsPage.jsx client/src/pages/ExpensesPage.jsx client/src/pages/BalanceSummaryPage.jsx
git commit -m "feat(client): add group and expense management views"

# 13. feat(client): add import and settlement views
git add client/src/pages/ImportWizardPage.jsx client/src/pages/SettlementsPage.jsx client/src/pages/AuditLogPage.jsx
git commit -m "feat(client): add csv import wizard and settlement views"

# Double check if any files were missed
git add .
git commit -m "chore: final touches and refinements"

git branch -M master
git push -u origin master --force
