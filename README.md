## 👥 User Roles

The system supports three clearly defined roles with different access levels:

### 🧑‍💼 1. User
- Register & login  
- Submit new complaints  
- Upload images/documents  
- Track complaint status  
- Edit or delete complaints (before admin review)  
- View complaint history  
- Receive notifications when status changes  

---

### 👨‍🔧 2. Staff
- Login with staff credentials  
- View complaints assigned to them  
- Update progress status (In Progress / Pending More Info)  
- Add internal notes for admin  
- Communicate with users if more details are needed  
- Mark a complaint as resolved (after verification)  

---

### 🛡️ 3. Admin
- Full control over the system  
- Manage all complaints  
- Assign complaints to staff  
- Modify complaint categories  
- Add / remove staff accounts  
- View system-wide analytics & dashboard  
- Generate reports  
- Update complaint statuses  
- Manage user accounts if needed  

---

### 🔐 Role-Based Access Control
The system uses **JWT authentication + middleware** to ensure:

- Users can access **only their complaints**
- Staff can access **only assigned complaints**
- Admin has **full system access**

---

## 🚀 How to Run Locally

If you want to run this project on your local machine, follow these steps:

### 1. Prerequisites
- **Node.js** (v14+ recommended)
- **MySQL** (Database)

### 2. Backend Setup
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure Environment Variables:
   - Create a `.env` file in the `backend` folder.
   - Use `.env.example` as a reference.
   - Update `DB_PASSWORD` and other fields as needed.

4. Start the Server:
   ```sh
   npm run dev
   ```
   (This runs with `nodemon` for hot-reloading. Use `npm start` for production).

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the Angular Development Server:
   ```sh
   npm start
   ```
   (Or `ng serve`).

4. Open `http://localhost:4200` in your browser.
