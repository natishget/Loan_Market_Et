import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Notification } from "@/types";
import { MOCK_NOTIFICATIONS } from "@/data/mockData";

interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: MOCK_NOTIFICATIONS,
};

const generateId = () =>
  Date.now().toString() + Math.random().toString(36).substr(2, 9);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<Omit<Notification, "id" | "read" | "createdAt">>
    ) => {
      const notification: Notification = {
        id: generateId(),
        read: false,
        createdAt: new Date().toISOString(),
        ...action.payload,
      };
      state.notifications.unshift(notification);
    },

    markAsRead: (state, action: PayloadAction<string>) => {
      const notif = state.notifications.find((n) => n.id === action.payload);
      if (notif) {
        notif.read = true;
      }
    },

    markAllAsRead: (state) => {
      state.notifications.forEach((n) => {
        n.read = true;
      });
    },

    clearNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
  },
});

export const { addNotification, markAsRead, markAllAsRead, clearNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
