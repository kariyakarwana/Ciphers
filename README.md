```markdown
# 🔐 Cipher Tool

A simple **Cipher Tool** with a **React + Vite frontend** and a **C++ backend using cpp-httplib**.  
Supports **Caesar**, **Vigenere**, and **Playfair** ciphers for encoding and decoding messages.

---

## ✨ Features

- Encode and decode using three classical ciphers:
  - **Caesar Cipher**
  - **Vigenere Cipher**
  - **Playfair Cipher**
- Dynamic frontend with **Hacker/Matrix theme**
- **Numeric key enforcement** for Caesar Cipher
- Responsive UI with cipher ring image and matrix animation

---

## 📂 Project Structure

```

cipher-tool/
│
├── frontend/   # React frontend using Vite
├── backend/    # C++ backend using cpp-httplib
└── README.md

````

---

## 🖥️ Frontend

- Built using **React 18** and **Vite**
- Styled with **Tailwind CSS**
- Interactive dropdown menus for selecting cipher and mode
- Dynamic input validation based on selected cipher

### 🚀 Run Frontend

```bash
cd frontend
npm install
npm run dev
````

Then visit **[http://localhost:5173](http://localhost:5173)** (or the port shown in the console).

---

## ⚙️ Backend

* Built using **C++17** with **cpp-httplib**
* Provides a REST API endpoint at **`/cipher`** (`POST`)

### 🔗 Request format

**JSON body:**

```json
{
  "method": "caesar",
  "mode": "encode",
  "text": "HELLO",
  "key": "3"
}
```

**Response:**

```json
{
  "result": "KHOOR"
}
```

### 🛠️ Build Backend

Make sure you have **CMake** and a **C++17 compiler** installed:

```bash
cd backend
mkdir build
cd build
cmake ..
cmake --build .
./CipherToolServer.exe   # On Windows
./CipherToolServer       # On Linux/Mac
```

Backend will run at **[http://localhost:8080](http://localhost:8080)**.

---

## ▶️ Usage

1. Start **backend** first.
2. Start **frontend** next.
3. Open the frontend URL in your browser.
4. Select a cipher, mode, enter the message and key, then submit.

---

## 📦 Requirements

* Node.js **18+**
* C++17 compiler
* CMake
* Tailwind CSS (already installed via frontend setup)

---

## 📝 Notes

* **Caesar Cipher** key accepts only **numbers**.
* **Vigenere** & **Playfair** ciphers accept **text keys**.
* Matrix rain animation runs in the background for a real **“hacker” feel**.

```
