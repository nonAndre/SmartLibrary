## SmartLibrary

This is an app that aims to manage a library with some twists.

This app deals with all the basic operations that a system that deals with an archive of books should like adding/delete and edit a book.

## Let's go behind the scenes

This app is built with React (Typescript) and it uses Firebase for authentication and to store all the data.
It also uses tanstack query for caching , Zustand for State management and tailwind CSS fro styling.
There's also the use of Gemini API and Google Books API.

**Explaination of the coolest thing about this App**

1. Adding a book: There are two ways you can do this simple action:

   - By hand (not so funny).
   - In a automatic way. You can put the ISBN of the book in the dedicated spot and than as if magic (Google Books API) you will see al the field fills up.
  
2. Searching in the archive: there are a lot of ways you can do this

   - using the dedicated searchbar (optimal if you have to search a book in a small archive)
   - using the chatbot implemented with the Google Gemini API. A powerful tool trough you can ask if a book is avaiable or not in the archive (incredible if you have to look for tons of book you can let the AI do it).

**Setup**

First of all you have to clone the project

```bash
https://github.com/nonAndre/AppLibri_VR486033

   
   

