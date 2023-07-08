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

export interface Service {
  maDv: string;
  tenDv: string;
  moTa: string;
}

export interface ServiceWithId {
  id: string;
  service: Service;
}
interface ServiceState {
  serviceArray: ServiceWithId[];
}

// add service to firestore
export const addServiceToFirestore = createAsyncThunk<ServiceWithId, Service>(
  "services/addServiceToFirestore",
  async (service) => {
    const addService = await addDoc(collection(db, "Service"), service);
    const newService: ServiceWithId = { id: addService.id, service };
    return newService;
  }
);

// fetch service
export const fetchService = createAsyncThunk<ServiceWithId[]>(
  "services/fetchService",
  async () => {
    const querySnapshot = await getDocs(collection(db, "Service"));
    const services = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      service: doc.data() as Service,
    }));
    return services;
  }
);

const serviceSlice = createSlice({
  name: "Service",
  initialState: {
    serviceArray: [] as ServiceWithId[],
  } as ServiceState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchService.fulfilled, (state, action) => {
        state.serviceArray = action.payload;
      })
      .addCase(addServiceToFirestore.fulfilled, (state, action) => {
        state.serviceArray.push(action.payload);
      });
  },
});

export default serviceSlice.reducer;
