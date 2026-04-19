import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { MarketplaceLoan } from "@/types";

interface MarketplaceCardProps {
  loan: MarketplaceLoan;
  currentUserId: string;
  onApply: (loan: MarketplaceLoan) => void;
}

export function MarketplaceCard({
  loan,
  currentUserId,
  onApply,
}: MarketplaceCardProps) {
  const colors = useColors();
  const isOwner = loan.borrowerId === currentUserId;
  const isFilled = loan.status === "filled";

  const totalRepayment =
    loan.amount * (1 + (loan.interestRate / 100) * (loan.termMonths / 12));
  const monthlyPayment = Math.round(totalRepayment / loan.termMonths);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: isFilled ? colors.border : colors.primary + "25",
          borderRadius: colors.radius,
          opacity: isFilled ? 0.75 : 1,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.avatarRow}>
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: colors.primary,
                borderRadius: colors.radius,
              },
            ]}
          >
            <Text style={styles.avatarText}>{loan.borrowerInitials}</Text>
          </View>
          <View style={styles.borrowerInfo}>
            <Text style={[styles.borrowerName, { color: colors.foreground }]}>
              {loan.borrowerName.split(" ")[0]} {loan.borrowerName.split(" ")[1]?.[0]}.
            </Text>
            <View style={styles.metaRow}>
              <Feather
                name="map-pin"
                size={11}
                color={colors.mutedForeground}
              />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                {loan.location}
              </Text>
              <Text style={[styles.dot, { color: colors.mutedForeground }]}>
                •
              </Text>
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                {loan.businessType}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.statusChip,
              {
                backgroundColor: isFilled
                  ? colors.muted
                  : colors.primary + "18",
                borderRadius: 999,
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: isFilled ? colors.mutedForeground : colors.primary },
              ]}
            >
              {isFilled ? "Filled" : "Open"}
            </Text>
          </View>
        </View>
      </View>

      <Text
        style={[styles.purpose, { color: colors.foreground }]}
        numberOfLines={1}
      >
        {loan.purpose}
      </Text>
      <Text
        style={[styles.description, { color: colors.mutedForeground }]}
        numberOfLines={2}
      >
        {loan.description}
      </Text>

      <View
        style={[styles.statsRow, { borderColor: colors.border }]}
      >
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.foreground }]}>
            ETB {loan.amount.toLocaleString()}
          </Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
            Amount
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.foreground }]}>
            {loan.interestRate}%
          </Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
            Rate/yr
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.foreground }]}>
            {loan.termMonths}mo
          </Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
            Term
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            ETB {monthlyPayment.toLocaleString()}
          </Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
            /month
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.dateRow}>
          <Feather name="clock" size={12} color={colors.mutedForeground} />
          <Text style={[styles.date, { color: colors.mutedForeground }]}>
            Posted {loan.createdAt}
          </Text>
        </View>

        {!isOwner && !isFilled ? (
          <TouchableOpacity
            style={[
              styles.applyBtn,
              {
                backgroundColor: colors.primary,
                borderRadius: colors.radius / 1.5,
              },
            ]}
            onPress={() => onApply(loan)}
            activeOpacity={0.8}
          >
            <Feather name="zap" size={14} color="#fff" />
            <Text style={styles.applyText}>Apply as Lender</Text>
          </TouchableOpacity>
        ) : isOwner ? (
          <View
            style={[
              styles.ownerChip,
              {
                backgroundColor: colors.secondary,
                borderRadius: colors.radius / 1.5,
              },
            ]}
          >
            <Text style={[styles.ownerText, { color: colors.primary }]}>
              Your Request
            </Text>
          </View>
        ) : (
          <View
            style={[
              styles.filledChip,
              {
                backgroundColor: colors.muted,
                borderRadius: colors.radius / 1.5,
              },
            ]}
          >
            <Text style={[styles.filledText, { color: colors.mutedForeground }]}>
              Filled
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    marginBottom: 14,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#0e7f6e",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  header: {
    marginBottom: 10,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  borrowerInfo: {
    flex: 1,
  },
  borrowerName: {
    fontSize: 14,
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  metaText: {
    fontSize: 11,
  },
  dot: {
    fontSize: 11,
  },
  statusChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  purpose: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  divider: {
    width: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  date: {
    fontSize: 12,
  },
  applyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  applyText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  ownerChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  ownerText: {
    fontSize: 13,
    fontWeight: "600",
  },
  filledChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filledText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
