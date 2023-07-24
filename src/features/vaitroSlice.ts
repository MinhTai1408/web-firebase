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
export interface VaiTro {
  tenVaiTro: string;
  moTa: string;
  soNguoiDung: string;
  phanQuyenChucNangA: string;
  phanQuyenChucNangB: string;
}
export interface VaiTrosWithId {
  id: string;
  vaitros: VaiTro;
}
interface VaiTroState {
  vaitrosArray: VaiTrosWithId[];
}
// add accounts to firestore
export const addVaiTroToFirestore = createAsyncThunk<VaiTrosWithId, VaiTro>(
  "vaitros/addVaiTroToFirestore",
  async (vaitros) => {
    const addVaiTroRef = await addDoc(collection(db, "VaiTro"), vaitros);
    const newVaiTro: VaiTrosWithId = { id: addVaiTroRef.id, vaitros };
    return newVaiTro;
  }
);
// fetch accounts
export const fetchVaiTro = createAsyncThunk<VaiTrosWithId[]>(
  "vaitros/fetchVaiTro",
  async () => {
    const querySnapshot = await getDocs(collection(db, "VaiTro"));
    const vaitros = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      vaitros: doc.data() as VaiTro,
    }));
    return vaitros;
  }
);
// update book
export const updateVaiTro = createAsyncThunk<VaiTrosWithId, VaiTrosWithId>(
  "vaitros/updateVaiTro",
  async (editedVaiTro) => {
    if (!editedVaiTro.vaitros) {
      throw new Error("Invalid book data");
    }
    const accountRef = doc(db, "VaiTro", editedVaiTro.id);
    await updateDoc(accountRef, editedVaiTro.vaitros as Partial<VaiTro>);
    return editedVaiTro;
  }
);
const vaitrosSlice = createSlice({
  name: "VaiTro",
  initialState: {
    vaitrosArray: [] as VaiTrosWithId[],
  } as VaiTroState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVaiTro.fulfilled, (state, action) => {
        state.vaitrosArray = action.payload;
      })
      .addCase(addVaiTroToFirestore.fulfilled, (state, action) => {
        state.vaitrosArray.push(action.payload);
      })

      .addCase(updateVaiTro.fulfilled, (state, action) => {
        const { id, vaitros } = action.payload;
        const vaitroIndex = state.vaitrosArray.findIndex(
          (accounts) => accounts.id === id
        );
        if (vaitroIndex !== -1) {
          state.vaitrosArray[vaitroIndex] = { id: id, vaitros };
        }
      });
  },
});

export default vaitrosSlice.reducer;
