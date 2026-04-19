import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { Notification } from "@/types";
import { useAppDispatch } from "@/store/hooks";
import { markAsRead } from "@/store/slices/notificationSlice";

interface NotificationItemProps {
  notification: Notification;
}

const NOTIF_ICONS: Record<string, string> = {
  new_marketplace_loan: "trending-up",
  loan_accepted: "check-circle",
  loan_approved: "shield",
  loan_repaid: "dollar-sign",
  payment_due: "alert-triangle",
};

const NOTIF_COLORS: Record<string, string> = {
  new_marketplace_loan: "#3b82f6",
  loan_accepted: "#8b5cf6",
  loan_approved: "#0e7f6e",
  loan_repaid: "#22c55e",
  payment_due: "#f0ab30",
};

export function NotificationItem({ notification }: NotificationItemProps) {
  const colors = useColors();
  const dispatch = useAppDispatch();
  const iconName =
    (NOTIF_ICONS[notification.type] as any) || "bell";
  const iconColor =
    NOTIF_COLORS[notification.type] || colors.primary;

  const handlePress = () => {
    if (!notification.read) {
      dispatch(markAsRead(notification.id));
    }
  };

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return "Just now";
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: notification.read
            ? colors.card
            : colors.primary + "08",
          borderColor: notification.read ? colors.border : colors.primary + "30",
          borderRadius: colors.radius,
        },
      ]}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      <View
        style={[
          styles.iconBg,
          {
            backgroundColor: iconColor + "18",
            borderRadius: colors.radius / 1.5,
          },
        ]}
      >
        <Feather name={iconName} size={18} color={iconColor} />
      </View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            {notification.title}
          </Text>
          {!notification.read && (
            <View
              style={[styles.unreadDot, { backgroundColor: colors.primary }]}
            />
          )}
        </View>
        <Text
          style={[styles.message, { color: colors.mutedForeground }]}
          numberOfLines={2}
        >
          {notification.message}
        </Text>
        <Text style={[styles.time, { color: colors.mutedForeground }]}>
          {formatTime(notification.createdAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    padding: 14,
    marginBottom: 8,
    gap: 12,
  },
  iconBg: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  time: {
    fontSize: 11,
  },
});
