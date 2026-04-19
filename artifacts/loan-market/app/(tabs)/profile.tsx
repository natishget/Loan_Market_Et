import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useAppSelector } from "@/store/hooks";
import { NotificationItem } from "@/components/NotificationItem";
import { useAppDispatch } from "@/store/hooks";
import { markAllAsRead } from "@/store/slices/notificationSlice";

type Section = "profile" | "notifications";

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const notifications = useAppSelector((s) => s.notifications.notifications);
  const loans = useAppSelector((s) => s.loans.loans);

  const [activeSection, setActiveSection] = useState<Section>("profile");

  const unreadCount = notifications.filter((n) => !n.read).length;
  const myLoansCount = loans.filter(
    (l) => l.lenderId === user?.id || l.borrowerId === user?.id
  ).length;

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const InfoRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
    <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
      <View style={styles.infoLeft}>
        <View style={[styles.infoIconBg, { backgroundColor: colors.muted, borderRadius: 8 }]}>
          <Feather name={icon as any} size={15} color={colors.primary} />
        </View>
        <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>{label}</Text>
      </View>
      <Text style={[styles.infoValue, { color: colors.foreground }]}>{value}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.background,
            paddingTop: topPad + 10,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.screenTitle, { color: colors.foreground }]}>
          Profile
        </Text>
        <View style={[styles.tabToggle, { backgroundColor: colors.muted, borderRadius: colors.radius }]}>
          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeSection === "profile" && {
                backgroundColor: colors.card,
                borderRadius: colors.radius / 1.5,
              },
            ]}
            onPress={() => setActiveSection("profile")}
          >
            <Feather name="user" size={14} color={activeSection === "profile" ? colors.primary : colors.mutedForeground} />
            <Text style={[styles.tabText, { color: activeSection === "profile" ? colors.primary : colors.mutedForeground }]}>
              My Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeSection === "notifications" && {
                backgroundColor: colors.card,
                borderRadius: colors.radius / 1.5,
              },
            ]}
            onPress={() => setActiveSection("notifications")}
          >
            <Feather name="bell" size={14} color={activeSection === "notifications" ? colors.primary : colors.mutedForeground} />
            <Text style={[styles.tabText, { color: activeSection === "notifications" ? colors.primary : colors.mutedForeground }]}>
              Notifications
            </Text>
            {unreadCount > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {activeSection === "profile" ? (
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.avatarCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            <View
              style={[
                styles.avatar,
                { backgroundColor: colors.primary, borderRadius: colors.radius },
              ]}
            >
              <Text style={styles.avatarText}>
                {user?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </Text>
            </View>
            <View style={styles.avatarInfo}>
              <Text style={[styles.userName, { color: colors.foreground }]}>
                {user?.name}
              </Text>
              <Text style={[styles.userBiz, { color: colors.mutedForeground }]}>
                {user?.businessType} • {user?.location}
              </Text>
              <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Feather
                    key={star}
                    name="star"
                    size={13}
                    color={
                      star <= Math.round(user?.rating || 0)
                        ? colors.accent
                        : colors.muted
                    }
                    style={{ marginRight: 1 }}
                  />
                ))}
                <Text
                  style={[styles.ratingText, { color: colors.mutedForeground }]}
                >
                  {user?.rating}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View
              style={[
                styles.statCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderRadius: colors.radius,
                },
              ]}
            >
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {user?.totalLoansGiven}
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                Loans Given
              </Text>
            </View>
            <View
              style={[
                styles.statCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderRadius: colors.radius,
                },
              ]}
            >
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                {user?.totalLoansTaken}
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                Loans Taken
              </Text>
            </View>
            <View
              style={[
                styles.statCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderRadius: colors.radius,
                },
              ]}
            >
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                {myLoansCount}
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                Total Deals
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.infoSection,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            <Text style={[styles.infoSectionTitle, { color: colors.foreground }]}>
              Business Information
            </Text>
            <InfoRow icon="phone" label="Phone" value={user?.phone || ""} />
            <InfoRow icon="hash" label="TIN Number" value={user?.tinNumber || ""} />
            <InfoRow icon="briefcase" label="Business Type" value={user?.businessType || ""} />
            <InfoRow icon="map-pin" label="Location" value={user?.location || ""} />
            <InfoRow icon="calendar" label="Member Since" value={user?.joinedAt || ""} />
          </View>

          <View
            style={[
              styles.settingsSection,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            {[
              { icon: "edit-2", label: "Edit Profile" },
              { icon: "lock", label: "Security & Privacy" },
              { icon: "help-circle", label: "Help & Support" },
              { icon: "file-text", label: "Terms & Conditions" },
            ].map((item) => (
              <TouchableOpacity
                key={item.label}
                style={[styles.settingsRow, { borderBottomColor: colors.border }]}
              >
                <View style={styles.settingsLeft}>
                  <View style={[styles.settingsIconBg, { backgroundColor: colors.muted, borderRadius: 8 }]}>
                    <Feather name={item.icon as any} size={15} color={colors.mutedForeground} />
                  </View>
                  <Text style={[styles.settingsLabel, { color: colors.foreground }]}>
                    {item.label}
                  </Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {unreadCount > 0 && (
            <TouchableOpacity
              style={[
                styles.markAllBtn,
                {
                  backgroundColor: colors.secondary,
                  borderRadius: colors.radius / 1.5,
                },
              ]}
              onPress={() => dispatch(markAllAsRead())}
            >
              <Feather name="check" size={14} color={colors.primary} />
              <Text style={[styles.markAllText, { color: colors.primary }]}>
                Mark all as read
              </Text>
            </TouchableOpacity>
          )}
          {notifications.map((notif) => (
            <NotificationItem key={notif.id} notification={notif} />
          ))}
          {notifications.length === 0 && (
            <View style={styles.emptyState}>
              <Feather name="bell-off" size={48} color={colors.mutedForeground} />
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                No Notifications
              </Text>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                You'll be notified about loan updates here.
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 12,
  },
  tabToggle: {
    flexDirection: "row",
    padding: 4,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
    gap: 6,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  content: {
    padding: 16,
    gap: 12,
  },
  avatarCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
    borderWidth: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
  },
  avatarInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "800",
  },
  userBiz: {
    fontSize: 13,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 5,
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 14,
    borderWidth: 1,
    gap: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 11,
    textAlign: "center",
  },
  infoSection: {
    borderWidth: 1,
    padding: 16,
  },
  infoSectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoIconBg: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: {
    fontSize: 13,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "600",
  },
  settingsSection: {
    borderWidth: 1,
    overflow: "hidden",
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderBottomWidth: 1,
  },
  settingsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingsIconBg: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsLabel: {
    fontSize: 14,
  },
  markAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 8,
  },
  markAllText: {
    fontSize: 13,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 10,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
