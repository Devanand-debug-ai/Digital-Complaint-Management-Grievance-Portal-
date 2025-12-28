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
