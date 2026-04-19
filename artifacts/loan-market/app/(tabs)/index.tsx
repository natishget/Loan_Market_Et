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
import { CreateLoanModal } from "@/components/CreateLoanModal";
import { LoanDetailModal } from "@/components/LoanDetailModal";
import { LoanCard } from "@/components/LoanCard";
import { GlobalHeader } from "@/components/GlobalHeader";
import { Loan } from "@/types";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const user = useAppSelector((s) => s.auth.user);
  const loans = useAppSelector((s) => s.loans.loans);
  const [createVisible, setCreateVisible] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  const recentLoans = loans
    .filter((l) => l.lenderId === user?.id || l.borrowerId === user?.id)
    .slice(0, 3);

  const activeLoans = loans.filter(
    (l) =>
      (l.lenderId === user?.id || l.borrowerId === user?.id) &&
      l.status === "approved"
  );

  const totalLent = loans
    .filter((l) => l.lenderId === user?.id && l.status !== "cancelled")
    .reduce((sum, l) => sum + l.amount, 0);

  const totalBorrowed = loans
    .filter((l) => l.borrowerId === user?.id && l.status !== "cancelled")
    .reduce((sum, l) => sum + l.amount, 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <GlobalHeader title="Home" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: 16,
            paddingBottom: insets.bottom + 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
              Welcome back
            </Text>
            <Text style={[styles.name, { color: colors.foreground }]}>
              {user?.name.split(" ")[0]}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.primary,
                borderRadius: colors.radius,
                flex: 1,
              },
            ]}
          >
            <View style={styles.statIcon}>
              <Feather name="trending-up" size={16} color="rgba(255,255,255,0.8)" />
            </View>
            <Text style={styles.statValue}>
              ETB {totalLent.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Total Lent</Text>
          </View>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
                flex: 1,
              },
            ]}
          >
            <View
              style={[
                styles.statIcon,
                { backgroundColor: colors.accent + "25" },
              ]}
            >
              <Feather name="trending-down" size={16} color={colors.accent} />
            </View>
            <Text style={[styles.statValueDark, { color: colors.foreground }]}>
              ETB {totalBorrowed.toLocaleString()}
            </Text>
            <Text style={[styles.statLabelDark, { color: colors.mutedForeground }]}>
              Total Borrowed
            </Text>
          </View>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
                flex: 1,
              },
            ]}
          >
            <View
              style={[
                styles.statIcon,
                { backgroundColor: colors.success + "20" },
              ]}
            >
              <Feather name="check-circle" size={16} color={colors.success} />
            </View>
            <Text style={[styles.statValueDark, { color: colors.foreground }]}>
              {activeLoans.length}
            </Text>
            <Text style={[styles.statLabelDark, { color: colors.mutedForeground }]}>
              Active
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.createBtn,
            { backgroundColor: colors.primary, borderRadius: colors.radius },
          ]}
          onPress={() => setCreateVisible(true)}
          activeOpacity={0.85}
        >
          <View
            style={[
              styles.createIconBg,
              { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 10 },
            ]}
          >
            <Feather name="plus" size={20} color="#fff" />
          </View>
          <View style={styles.createBtnContent}>
            <Text style={styles.createBtnTitle}>Create New Loan</Text>
            <Text style={styles.createBtnSub}>
              Direct agreement or post to Marketplace
            </Text>
          </View>
          <Feather name="chevron-right" size={18} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>

        <View style={styles.quickActions}>
          <View
            style={[
              styles.quickCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            <Feather name="globe" size={22} color={colors.primary} />
            <Text style={[styles.quickTitle, { color: colors.foreground }]}>
              Marketplace
            </Text>
            <Text style={[styles.quickSub, { color: colors.mutedForeground }]}>
              Browse loan requests
            </Text>
          </View>
          <View
            style={[
              styles.quickCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            <Feather name="shield" size={22} color={colors.accent} />
            <Text style={[styles.quickTitle, { color: colors.foreground }]}>
              Agreements
            </Text>
            <Text style={[styles.quickSub, { color: colors.mutedForeground }]}>
              Digital contracts
            </Text>
          </View>
          <View
            style={[
              styles.quickCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            <Feather name="bar-chart-2" size={22} color={colors.success} />
            <Text style={[styles.quickTitle, { color: colors.foreground }]}>
              Analytics
            </Text>
            <Text style={[styles.quickSub, { color: colors.mutedForeground }]}>
              Track performance
            </Text>
          </View>
        </View>

        {recentLoans.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Recent Activity
            </Text>
            {recentLoans.map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                viewpoint={loan.lenderId === user?.id ? "lender" : "borrower"}
                onPress={() => setSelectedLoan(loan)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <CreateLoanModal
        visible={createVisible}
        onClose={() => setCreateVisible(false)}
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
  content: {
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 13,
    marginBottom: 2,
  },
  name: {
    fontSize: 26,
    fontWeight: "800",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    padding: 14,
    borderWidth: 1,
    gap: 4,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: 4,
  },
  statValue: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
  },
  statLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 11,
  },
  statValueDark: {
    fontSize: 14,
    fontWeight: "800",
  },
  statLabelDark: {
    fontSize: 11,
  },
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 12,
    marginBottom: 16,
  },
  createIconBg: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  createBtnContent: {
    flex: 1,
  },
  createBtnTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  createBtnSub: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    marginTop: 2,
  },
  quickActions: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  quickCard: {
    flex: 1,
    padding: 14,
    borderWidth: 1,
    gap: 6,
    alignItems: "flex-start",
  },
  quickTitle: {
    fontSize: 13,
    fontWeight: "700",
  },
  quickSub: {
    fontSize: 11,
    lineHeight: 15,
  },
  recentSection: {
    gap: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },
});
