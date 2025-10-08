# 📝 Full Stack To-Do App with Login & Registration

A beautiful full-stack **To-Do List Application** built using  
**Node.js, Express, MySQL, and Vanilla JavaScript** with user authentication (JWT).  
Each user can register, log in, and manage their own tasks — add, edit, delete, and mark as complete.

---

## 🚀 Features

✅ **User Authentication**
- Register and Login system using JWT authentication  
- Each user has their own private to-do list  

✅ **To-Do Management**
- Add, Edit, Delete, and Mark tasks as Complete  
- Completed tasks shown with strikethrough using `<del>` tag  

✅ **Modern UI**
- Gradient background  
- Smooth button animations  
- Colorful buttons (green, blue, red, skyblue)  

✅ **Responsive Design**
- Works on both desktop and mobile  
- Simple, fast, and lightweight frontend  

---

## 📁 Project Structure

├── backend/
│ ├── app.js
│ ├── package.json
│ ├── db/
│ │ └── connection.js
│ ├── controllers/
│ │ ├── taskController.js
│ │ └── userController.js
│ ├── middleware/
│ │ └── authMiddleware.js
│ ├── routes/
│ │ ├── tasks.js
│ │ └── users.js
│ └── frontend/
│ ├── index.html
│ ├── style.css
│ └── script.js
└── README.md
