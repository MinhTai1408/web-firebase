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

export interface Acounts {
  tenDn: string;
  hoTen: string;
  soDt: string;
  email: string;
  vaiTro: string;
  matKhau: string;
  nhapMatKhau: string;
  trangThai: string;
}
export interface AccountsWithId {
  id: string;
  accounts: Acounts;
}
interface AcountsState {
  accountsArray: AccountsWithId[];
}
// add accounts to firestore
export const addAccountsToFirestore = createAsyncThunk<AccountsWithId, Acounts>(
  "accounts/addAccountsToFirestore",
  async (accounts) => {
    const addAccountsRef = await addDoc(collection(db, "Account"), accounts);
    const newAccount: AccountsWithId = { id: addAccountsRef.id, accounts };
    return newAccount;
  }
);
// fetch accounts
export const fetchAccounts = createAsyncThunk<AccountsWithId[]>(
  "accounts/fetchAccounts",
  async () => {
    const querySnapshot = await getDocs(collection(db, "Account"));
    const accounts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      accounts: doc.data() as Acounts,
    }));
    return accounts;
  }
);
// update book
export const updateAccounts = createAsyncThunk<AccountsWithId, AccountsWithId>(
  "accounts/updateAccounts",
  async (editedAccount) => {
    if (!editedAccount.accounts) {
      throw new Error("Invalid book data");
    }
    const accountRef = doc(db, "Account", editedAccount.id);
    await updateDoc(accountRef, editedAccount.accounts as Partial<Acounts>);
    return editedAccount;
  }
);
const accountsSlice = createSlice({
  name: "Accounts",
  initialState: {
    accountsArray: [] as AccountsWithId[],
  } as AcountsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.accountsArray = action.payload;
      })
      .addCase(addAccountsToFirestore.fulfilled, (state, action) => {
        state.accountsArray.push(action.payload);
      })

      .addCase(updateAccounts.fulfilled, (state, action) => {
        const { id, accounts } = action.payload;
        const accountsIndex = state.accountsArray.findIndex(
          (accounts) => accounts.id === id
        );
        if (accountsIndex !== -1) {
          state.accountsArray[accountsIndex] = { id: id, accounts };
        }
      });
  },
});

export default accountsSlice.reducer;
