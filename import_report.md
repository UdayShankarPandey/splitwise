# CSV Import System Report

## 📥 Overview
The Splitwise-like expense tracker features a robust CSV import engine designed to handle messy, real-world expense data. It parses flat files, validates entries against the database schema, and ensures financial integrity.

## ⚙️ The Import Workflow
1. **Upload & Parse (`multer` + `csv-parse`)**: 
   The CSV is uploaded, read into memory, and converted into JSON objects.
2. **Validation & Anomaly Detection**: 
   Before any data touches the database, the engine scans the rows for:
   - **Duplicates**: Exact same expense appearing multiple times.
   - **Zero Amounts**: Expenses logged with a $0 value.
   - **Misclassified Settlements**: Rows that look like expenses but are actually repayments (e.g., "Aisha paid Rohan back").
   - **Missing Users**: Names that don't match active group members.
3. **User Review (The Wizard)**: 
   The parsed data and flagged anomalies are presented to the user. The user must make a decision for each anomaly:
   - `Accept`: Proceed with the engine's suggested correction.
   - `Reject`: Skip the row entirely.
   - `Convert`: Convert a misclassified expense into a proper settlement.
4. **Batch Commit Transaction**: 
   Once approved, the engine uses Prisma's `$transaction` and `createMany` to efficiently insert the records into the database in bulk (reducing cloud latency).

## 📊 Database Impact
- **`imports`**: Tracks the overall status and row counts of the uploaded file.
- **`import_anomalies`**: Stores the flagged issues, suggested corrections, and the user's final decisions for audit purposes.
- **`expenses` & `expense_participants`**: Generated from valid rows.
- **`settlements`**: Generated from converted rows.
- **`audit_logs`**: Records the entire import event.

## 🛠️ Performance Optimizations
Initially, the import engine processed rows one-by-one inside a transaction, which caused significant latency on cloud databases (e.g., Supabase in Seoul). 
The engine was refactored to collect all data in memory first, then execute **3 bulk queries** (`createMany`), reducing a 15-second import down to ~1-2 seconds.
