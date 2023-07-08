import { createSlice } from "@reduxjs/toolkit";

import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../Firebase";

export interface Book {
  maTb: string;
  loaiTb: string;
  tenTb: string;
  tenDn: string;
  diaChi: string;
  matKhau: string;
  dvsd: string[];
}

export interface BookWithId {
  id: string;
  book: Book;
}

interface BooksState {
  booksArray: BookWithId[];
}

// add book to firestore
export const addBookToFirestore = createAsyncThunk<BookWithId, Book>(
  "books/addBookToFirestore",
  async (book) => {
    const addBookRef = await addDoc(collection(db, "Device"), book);
    const newBook: BookWithId = { id: addBookRef.id, book };
    return newBook;
  }
);

// fetch books
export const fetchBooks = createAsyncThunk<BookWithId[]>(
  "books/fetchBooks",
  async () => {
    const querySnapshot = await getDocs(collection(db, "Device"));
    const books = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      book: doc.data() as Book,
    }));
    return books;
  }
);

// update book
export const updateBook = createAsyncThunk<BookWithId, BookWithId>(
  "books/updateBook",
  async (editedBook) => {
    if (!editedBook.book) {
      throw new Error("Invalid book data");
    }
    const bookRef = doc(db, "Device", editedBook.id);
    await updateDoc(bookRef, editedBook.book as Partial<Book>);
    return editedBook;
  }
);

const booksSlice = createSlice({
  name: "Books",
  initialState: {
    booksArray: [] as BookWithId[],
  } as BooksState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.booksArray = action.payload;
      })
      .addCase(addBookToFirestore.fulfilled, (state, action) => {
        state.booksArray.push(action.payload);
      })

      .addCase(updateBook.fulfilled, (state, action) => {
        const { id, book } = action.payload;
        const bookIndex = state.booksArray.findIndex((book) => book.id === id);
        if (bookIndex !== -1) {
          state.booksArray[bookIndex] = { id: id, book };
        }
      });
  },
});

export default booksSlice.reducer;
