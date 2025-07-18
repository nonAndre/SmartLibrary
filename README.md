# 📚 SmartLibrary

**SmartLibrary** is a modern app designed to manage a library—with some clever twists.

It supports all the basic operations you'd expect from a book archive system: **add**, **delete**, and **edit** books. But there's more behind the scenes!

---

## 🔍 Behind the Scenes

SmartLibrary is built using a powerful modern stack:

- ⚛️ **React (TypeScript)**
- 🔥 **Firebase** – for authentication and data storage
- 🧠 **TanStack Query** – for caching and async data management
- 🪢 **Zustand** – for lightweight state management
- 🎨 **Tailwind CSS** – for elegant and responsive styling
- 🤖 **Gemini API** – for AI-powered search
- 📘 **Google Books API** – for autofilling book details

---

## 🚀 Features

### 1. 📖 Adding a Book

You’ve got **two ways** to add a new book:

- **Manual Entry** (for the nostalgic).
- **Automatic Magic**: Just enter the ISBN and—thanks to the **Google Books API**—the fields will populate automatically. Like magic!

### 2. 🔎 Searching the Archive

Find what you need fast:

- **Search Bar** – Great for quick, small-scale lookups.
- **Chatbot Powered by Gemini API** – Ask in natural language whether a book is available. Perfect for huge archives where AI does the heavy lifting.

---

## ⚙️ Setup

### 1. 📥 Clone the Repository

```bash
git clone https://github.com/nonAndre/SmartLibrary.git
cd SmartLibrary
```

### 2. 💻 Install Dependencies

```bash
nvm use
npm install
```
### 3. 🛠️ Configure Environment Variables

Create a ```.env``` file in the root of the project and add the following:

```bash
VITE_APIKEY=your_key
VITE_AUTHDOMAIN=your_key
VITE_PROJECTID=your_key
VITE_STORAGEBUCKET=your_key
VITE_MESSAGESENDERID=your_key
VITE_APPID=your_key
VITE_GOOGLEAPI=your_key
VITE_GEMINI=your_key
```

### 4. ▶️ Run the App
```bash
npm run dev
```
