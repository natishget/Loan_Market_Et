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
import { Loan } from "@/types";

interface LoanCardProps {
  loan: Loan;
  viewpoint: "lender" | "borrower";
  onPress: () => void;
  onStatusChange?: (status: string) => void;
}

const STATUS_COLORS: Record<string, string> = {
  open: "#3b82f6",
  pending: "#f0ab30",
  accepted: "#8b5cf6",
  approved: "#0e7f6e",
  repaid: "#22c55e",
  cancelled: "#ef4444",
};

const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  pending: "Pending",
  accepted: "Accepted",
  approved: "Active",
  repaid: "Repaid",
  cancelled: "Cancelled",
};

export function LoanCard({ loan, viewpoint, onPress }: LoanCardProps) {
  const colors = useColors();
  const statusColor = STATUS_COLORS[loan.status] || colors.mutedForeground;
  const counterparty =
    viewpoint === "lender" ? loan.borrowerName : loan.lenderName;
  const counterpartyLabel = viewpoint === "lender" ? "Borrower" : "Lender";

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.header}>
        <View style={styles.purposeRow}>
          <View
            style={[
              styles.typeTag,
              {
                backgroundColor:
                  loan.type === "marketplace"
                    ? colors.secondary
                    : colors.muted,
                borderRadius: colors.radius / 2,
              },
            ]}
          >
            <Text
              style={[
                styles.typeText,
                {
                  color:
                    loan.type === "marketplace"
                      ? colors.primary
                      : colors.mutedForeground,
                },
              ]}
            >
              {loan.type === "marketplace" ? "Marketplace" : "Direct"}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: statusColor + "20",
                borderRadius: colors.radius / 2,
              },
            ]}
          >
            <View
              style={[styles.statusDot, { backgroundColor: statusColor }]}
            />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {STATUS_LABELS[loan.status]}
            </Text>
          </View>
        </View>
        <Text
          style={[styles.purpose, { color: colors.foreground }]}
          numberOfLines={1}
        >
          {loan.purpose}
        </Text>
      </View>

      <View style={styles.amountRow}>
        <Text style={[styles.amount, { color: colors.foreground }]}>
          ETB {loan.amount.toLocaleString()}
        </Text>
        <View style={styles.termRow}>
          <Feather name="clock" size={12} color={colors.mutedForeground} />
          <Text style={[styles.term, { color: colors.mutedForeground }]}>
            {loan.termMonths}mo @ {loan.interestRate}%
          </Text>
        </View>
      </View>

      {counterparty && (
        <View
          style={[styles.footer, { borderTopColor: colors.border }]}
        >
          <Text style={[styles.counterLabel, { color: colors.mutedForeground }]}>
            {counterpartyLabel}
          </Text>
          <Text style={[styles.counterName, { color: colors.foreground }]}>
            {counterparty}
          </Text>
        </View>
      )}

      <View style={styles.metaRow}>
        {loan.monthlyPayment && (
          <View style={styles.metaItem}>
            <Feather name="refresh-cw" size={11} color={colors.mutedForeground} />
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
              ETB {loan.monthlyPayment.toLocaleString()}/mo
            </Text>
          </View>
        )}
        {loan.dueDate && (
          <View style={styles.metaItem}>
            <Feather name="calendar" size={11} color={colors.mutedForeground} />
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
              Due {loan.dueDate}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  header: {
    marginBottom: 10,
  },
  purposeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  typeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  purpose: {
    fontSize: 15,
    fontWeight: "700",
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  amount: {
    fontSize: 22,
    fontWeight: "800",
  },
  termRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  term: {
    fontSize: 13,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    marginBottom: 6,
  },
  counterLabel: {
    fontSize: 12,
  },
  counterName: {
    fontSize: 13,
    fontWeight: "600",
  },
  metaRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: 2,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
});
