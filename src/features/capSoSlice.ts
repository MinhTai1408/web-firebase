import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../Firebase";

interface CapSo {
  thuTu: number;
  tenDichVu: string;
  ngayGioCap: string;
  hanSuDung: string;
  trangThai?: string;
}
export interface CapSoWithId {
  id: string;
  capSo: CapSo;
}

interface CapSoState {
  capSoList: CapSoWithId[];
  loading: boolean;
  error: string | null;
}

export const fetchCapSoList = createAsyncThunk<CapSoWithId[]>(
  "capSo/fetchCapSoList",
  async () => {
    const querySnapshot = await getDocs(collection(db, "capSo"));
    const capSoData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      capSo: doc.data() as CapSo,
    }));
    return capSoData;
  }
);

export const addCapSo = createAsyncThunk<CapSoWithId, CapSo>(
  "capSo/addCapSo",
  async (capSo) => {
    const addCapSokRef = await addDoc(collection(db, "capSo"), capSo);
    const newCapSo: CapSoWithId = { id: addCapSokRef.id, capSo };
    return newCapSo;
  }
);

const capSoSlice = createSlice({
  name: "capSo",
  initialState: {
    capSoList: [] as CapSoWithId[],
  } as CapSoState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCapSoList.fulfilled, (state, action) => {
        state.capSoList = action.payload;
      })

      .addCase(addCapSo.fulfilled, (state, action) => {
        state.capSoList.push(action.payload);
      });
  },
});

export default capSoSlice.reducer;
