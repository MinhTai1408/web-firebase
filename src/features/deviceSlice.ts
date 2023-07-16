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

export interface Device {
  maTb: string;
  loaiTb: string;
  tenTb: string;
  tenDn: string;
  diaChi: string;
  matKhau: string;
  dvsd: string[] | string;
}

export interface DeviceWithId {
  id: string;
  device: Device;
  trangThai?: string | undefined;
}

interface DeviceState {
  deviceArray: DeviceWithId[];
}

// add book to firestore
export const addDeviceToFirestore = createAsyncThunk<DeviceWithId, Device>(
  "devices/addDeviceToFirestore",
  async (device) => {
    const addDeviceRef = await addDoc(collection(db, "Device"), device);
    const newBook: DeviceWithId = { id: addDeviceRef.id, device };
    return newBook;
  }
);

// fetch books
export const fetchDevice = createAsyncThunk<DeviceWithId[]>(
  "devices/fetchDevice",
  async () => {
    const querySnapshot = await getDocs(collection(db, "Device"));
    const devices = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      device: doc.data() as Device,
    }));
    return devices;
  }
);

// update book
export const updateDevice = createAsyncThunk<DeviceWithId, DeviceWithId>(
  "devices/updateDevice",
  async (editedDevice) => {
    if (!editedDevice.device) {
      throw new Error("Invalid book data");
    }
    const deviceRef = doc(db, "Device", editedDevice.id);
    await updateDoc(deviceRef, editedDevice.device as Partial<Device>);
    return editedDevice;
  }
);

const deviceSlice = createSlice({
  name: "Devices",
  initialState: {
    deviceArray: [] as DeviceWithId[],
  } as DeviceState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevice.fulfilled, (state, action) => {
        state.deviceArray = action.payload;
      })
      .addCase(addDeviceToFirestore.fulfilled, (state, action) => {
        state.deviceArray.push(action.payload);
      })

      .addCase(updateDevice.fulfilled, (state, action) => {
        const { id, device } = action.payload;
        const devicendex = state.deviceArray.findIndex(
          (device) => device.id === id
        );
        if (devicendex !== -1) {
          state.deviceArray[devicendex] = { id: id, device };
        }
      });
  },
});

export default deviceSlice.reducer;
