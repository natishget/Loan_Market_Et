import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { useAppSelector } from "@/store/hooks";

interface GlobalHeaderProps {
  title: string;
  rightSlot?: React.ReactNode;
}

export function GlobalHeader({ title, rightSlot }: GlobalHeaderProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const notifications = useAppSelector((s) => s.notifications.notifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: topPad + 10,
          paddingBottom: 12,
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      <View style={styles.rightRow}>
        {rightSlot}
        <TouchableOpacity
          style={[
            styles.bellBtn,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius / 1.5,
            },
          ]}
          onPress={() => router.push("/notifications")}
          hitSlop={8}
        >
          <Feather name="bell" size={18} color={colors.foreground} />
          {unreadCount > 0 && (
            <View
              style={[styles.badge, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.badgeText}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
  },
  rightRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bellBtn: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800",
  },
});
