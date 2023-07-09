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

export const updateService = createAsyncThunk<ServiceWithId, ServiceWithId>(
  "services/updateService",
  async (editedBook) => {
    if (!editedBook.service) {
      throw new Error("Invalid book data");
    }
    const serviceRef = doc(db, "Service", editedBook.id);
    await updateDoc(serviceRef, editedBook.service as Partial<Service>);
    return editedBook;
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
      })
      .addCase(updateService.fulfilled, (state, action) => {
        const { id, service } = action.payload;
        const serviceIndex = state.serviceArray.findIndex(
          (service) => service.id === id
        );
        if (serviceIndex !== -1) {
          state.serviceArray[serviceIndex] = { id: id, service };
        }
      });
  },
});

export default serviceSlice.reducer;
