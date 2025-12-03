# HMBS System - Local Deployment Guide

## 📋 Overview

This guide explains how to deploy and run the **HMBS (Hospitality Management Borrowing System)** locally on the custodian's computer. The system will start automatically on computer startup **in the background**, and the custodian only needs to open a web browser to access it.

---

## ✅ Prerequisites

The following must be installed on the custodian's computer:

- ✅ **Node.js** (v14 or higher)
- ✅ **PostgreSQL** (v12 or higher)
- ✅ **Git** (to clone the repository)

---

## � Installation & Transfer

Since `node_modules` and `.env` files are not on GitHub, follow these steps to set up the system on the custodian's computer:

1. **Clone the Repository**
   Open a terminal (Command Prompt or PowerShell) and run:
   ```bash
   git clone https://github.com/kang1Oh/hmbs_system.git
   cd hmbs_system
   ```

2. **Install Dependencies**
   Run the following commands to install the necessary libraries:
   ```bash
   # Install backend dependencies
   cd express-backend
   npm install

   # Install frontend dependencies
   cd ../react-frontend
   npm install
   
   # Return to root
   cd ..
   ```

3. **Configure Environment Variables**
   - Create a new file named `.env` inside the `express-backend` folder.
   - Copy the contents from your development `.env` file (or use `.env.example` as a template) and paste them into the new file.
   - **Important**: Ensure the database credentials (username, password) match the PostgreSQL setup on the custodian's computer.

4. **Update Paths**
   - Open `start-silent.vbs` in a text editor (Notepad).
   - Update the path to point to the correct location on the custodian's computer:
     `C:\Users\YOUR_USERNAME\Documents\GitHub\hmbs_system\start-hmbs.bat`

---

## 🗄️ Database Migration

To transfer the database from your computer to the custodian's unit:

### Step 1: Export from Your Computer
1. Go to `scripts` folder.
2. Run `db-export-full.bat` to create a full backup (Schema + Data).
   - This creates `hmbs_full_backup.sql` in the project root.
3. OR run `db-export-schema.bat` if you only want the empty tables (Schema only).
   - This creates `hmbs_schema.sql` in the project root.

### Step 2: Import to Custodian's Computer
1. Copy the generated `.sql` file to the custodian's computer (e.g., via Google Drive or USB).
2. Ensure the database specified in `.env` (e.g., `hmbs_db`) exists on the custodian's PostgreSQL.
   - You can create it using pgAdmin or command line: `CREATE DATABASE hmbs_db;`
3. Drag and drop the `.sql` file onto `scripts\db-import.bat`.
4. The script will run and populate the database.

### Step 3: CSV Import (Optional)
If you exported **Schema Only** and want to import data from CSV files:
1. Ensure your CSV files match the table structure.
2. Use pgAdmin's "Import/Export Data" feature on each table.
   - Right-click table → Import/Export Data...
   - Select Import, choose filename, set format to CSV, header to Yes.

---

## ⚙️ Automatic Silent Startup

To make the system start automatically **without showing command windows**:

1. **Press `Win + R`**
2. Type `shell:startup` and press Enter. This opens the Startup folder.
3. **Create a Shortcut**:
   - Right-click in the folder → **New** → **Shortcut**
   - Browse to the `start-silent.vbs` file in your project folder.
   - Click **Next**, then **Finish**.

Now, when the computer restarts, the system will launch silently in the background!

---

## 🚀 Manual Startup

If you need to start the system manually:

- **With Windows**: Double-click `start-hmbs.bat` (shows windows)
- **Silently**: Double-click `start-silent.vbs` (runs in background)

---

## 🌐 Accessing the System

Once the system is running:

1. Open any web browser (Chrome, Edge, Firefox, etc.)
2. Navigate to: **http://localhost:5173**
3. You should see the HMBS login page

---

## 🛠️ Troubleshooting

### Problem: System doesn't start
- Try running `start-hmbs.bat` manually to see any error messages.
- Check if the path in `start-silent.vbs` is correct.

### Problem: "Node.js is not installed" error
- Ensure Node.js is installed and added to PATH.

### Problem: Database connection error
- Check the `.env` file in `express-backend` and verify the PostgreSQL credentials.

---

## 🔄 Stopping the System

Since the windows are hidden, you must stop the processes via Task Manager if needed:

1. Press `Ctrl + Shift + Esc` to open Task Manager.
2. Look for **Node.js JavaScript Runtime** processes.
3. Right-click and select **End task**.

---

**Last Updated**: December 3, 2025
