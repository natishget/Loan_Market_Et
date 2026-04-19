import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useAppSelector } from "@/store/hooks";
import { LoanCard } from "@/components/LoanCard";
import { LoanDetailModal } from "@/components/LoanDetailModal";
import { Loan } from "@/types";

export default function MyDebtsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const user = useAppSelector((s) => s.auth.user);
  const loans = useAppSelector((s) => s.loans.loans);

  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  const myDebts = loans.filter((l) => l.borrowerId === user?.id);
  const activeDebts = myDebts.filter(
    (l) => l.status === "approved" || l.status === "accepted"
  );
  const pendingDebts = myDebts.filter((l) => l.status === "pending");
  const completedDebts = myDebts.filter(
    (l) => l.status === "repaid" || l.status === "cancelled"
  );

  const totalOwed = activeDebts.reduce((sum, l) => sum + l.amount, 0);
  const monthlyDue = activeDebts.reduce(
    (sum, l) => sum + (l.monthlyPayment || 0),
    0
  );

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const allDebts = [
    ...activeDebts,
    ...pendingDebts,
    ...completedDebts,
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={allDebts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: topPad + 16,
            paddingBottom: insets.bottom + 100,
            paddingHorizontal: 16,
          },
        ]}
        ListHeaderComponent={
          <>
            <Text style={[styles.screenTitle, { color: colors.foreground }]}>
              My Debts
            </Text>

            {activeDebts.length > 0 && (
              <View
                style={[
                  styles.summaryCard,
                  {
                    backgroundColor: colors.accent + "15",
                    borderColor: colors.accent + "40",
                    borderRadius: colors.radius,
                  },
                ]}
              >
                <View style={styles.summaryRow}>
                  <View style={styles.summaryItem}>
                    <Text
                      style={[
                        styles.summaryValue,
                        { color: colors.foreground },
                      ]}
                    >
                      ETB {totalOwed.toLocaleString()}
                    </Text>
                    <Text
                      style={[
                        styles.summaryLabel,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      Total Outstanding
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.summaryDivider,
                      { backgroundColor: colors.accent + "40" },
                    ]}
                  />
                  <View style={styles.summaryItem}>
                    <Text
                      style={[
                        styles.summaryValue,
                        { color: colors.accent },
                      ]}
                    >
                      ETB {monthlyDue.toLocaleString()}
                    </Text>
                    <Text
                      style={[
                        styles.summaryLabel,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      Monthly Due
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.summaryDivider,
                      { backgroundColor: colors.accent + "40" },
                    ]}
                  />
                  <View style={styles.summaryItem}>
                    <Text
                      style={[
                        styles.summaryValue,
                        { color: colors.foreground },
                      ]}
                    >
                      {activeDebts.length}
                    </Text>
                    <Text
                      style={[
                        styles.summaryLabel,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      Active
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {pendingDebts.length > 0 && (
              <View
                style={[
                  styles.sectionLabel,
                  {
                    backgroundColor: colors.warning + "15",
                    borderRadius: colors.radius / 2,
                  },
                ]}
              >
                <Feather name="clock" size={14} color={colors.warning} />
                <Text
                  style={[styles.sectionLabelText, { color: colors.warning }]}
                >
                  {pendingDebts.length} Pending
                </Text>
              </View>
            )}
          </>
        }
        renderItem={({ item }) => (
          <LoanCard
            loan={item}
            viewpoint="borrower"
            onPress={() => setSelectedLoan(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather
              name="credit-card"
              size={48}
              color={colors.mutedForeground}
            />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No Debts
            </Text>
            <Text
              style={[styles.emptyText, { color: colors.mutedForeground }]}
            >
              You have no outstanding loans. Request a loan from the Home screen.
            </Text>
          </View>
        }
      />

      <LoanDetailModal
        loan={selectedLoan}
        onClose={() => setSelectedLoan(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    gap: 2,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 16,
  },
  summaryCard: {
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "800",
  },
  summaryLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 32,
  },
  sectionLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  sectionLabelText: {
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
