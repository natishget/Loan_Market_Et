import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { LoanCard } from "@/components/LoanCard";
import { MarketplaceCard } from "@/components/MarketplaceCard";
import { LoanDetailModal } from "@/components/LoanDetailModal";
import { applyToLoan } from "@/store/slices/loanSlice";
import { addNotification } from "@/store/slices/notificationSlice";
import { Loan, MarketplaceLoan } from "@/types";
import * as Haptics from "expo-haptics";
import { Alert } from "react-native";

type Tab = "lending" | "marketplace";

export default function MyLoansScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const loans = useAppSelector((s) => s.loans.loans);
  const marketplaceLoans = useAppSelector((s) => s.loans.marketplaceLoans);

  const [activeTab, setActiveTab] = useState<Tab>("lending");
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  const myLendingLoans = loans.filter((l) => l.lenderId === user?.id);

  const openMarketplaceLoans = marketplaceLoans.filter(
    (l) => l.status === "open"
  );
  const filledMarketplaceLoans = marketplaceLoans.filter(
    (l) => l.status === "filled"
  );

  const handleApply = (loan: MarketplaceLoan) => {
    if (!user) return;
    if (loan.borrowerId === user.id) {
      Alert.alert("Cannot Apply", "You cannot apply to your own loan request.");
      return;
    }
    Alert.alert(
      "Apply as Lender",
      `Confirm applying to lend ETB ${loan.amount.toLocaleString()} for "${loan.purpose}"?`,
      [
        { text: "Cancel" },
        {
          text: "Apply",
          onPress: () => {
            dispatch(
              applyToLoan({
                marketplaceLoanId: loan.id,
                lenderId: user.id,
                lenderName: user.name,
              })
            );
            dispatch(
              addNotification({
                type: "loan_accepted",
                title: "Applied as Lender",
                message: `You applied to lend ETB ${loan.amount.toLocaleString()} to ${loan.borrowerName}.`,
                loanId: loan.id,
              })
            );
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;

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
          My Loans
        </Text>

        <View
          style={[
            styles.tabToggle,
            { backgroundColor: colors.muted, borderRadius: colors.radius },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeTab === "lending" && {
                backgroundColor: colors.card,
                borderRadius: colors.radius / 1.5,
              },
            ]}
            onPress={() => setActiveTab("lending")}
          >
            <Feather
              name="briefcase"
              size={14}
              color={
                activeTab === "lending" ? colors.primary : colors.mutedForeground
              }
            />
            <Text
              style={[
                styles.tabBtnText,
                {
                  color:
                    activeTab === "lending"
                      ? colors.primary
                      : colors.mutedForeground,
                },
              ]}
            >
              My Lending
            </Text>
            {myLendingLoans.length > 0 && (
              <View
                style={[
                  styles.tabCount,
                  {
                    backgroundColor:
                      activeTab === "lending"
                        ? colors.primary
                        : colors.mutedForeground,
                  },
                ]}
              >
                <Text style={styles.tabCountText}>{myLendingLoans.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeTab === "marketplace" && {
                backgroundColor: colors.card,
                borderRadius: colors.radius / 1.5,
              },
            ]}
            onPress={() => setActiveTab("marketplace")}
          >
            <Feather
              name="globe"
              size={14}
              color={
                activeTab === "marketplace"
                  ? colors.primary
                  : colors.mutedForeground
              }
            />
            <Text
              style={[
                styles.tabBtnText,
                {
                  color:
                    activeTab === "marketplace"
                      ? colors.primary
                      : colors.mutedForeground,
                },
              ]}
            >
              Marketplace
            </Text>
            {openMarketplaceLoans.length > 0 && (
              <View
                style={[
                  styles.tabCount,
                  {
                    backgroundColor:
                      activeTab === "marketplace"
                        ? colors.primary
                        : colors.mutedForeground,
                  },
                ]}
              >
                <Text style={styles.tabCountText}>
                  {openMarketplaceLoans.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === "lending" ? (
        <FlatList
          data={myLendingLoans}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            {
              paddingBottom: insets.bottom + 100,
              paddingHorizontal: 16,
            },
          ]}
          renderItem={({ item }) => (
            <LoanCard
              loan={item}
              viewpoint="lender"
              onPress={() => setSelectedLoan(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="briefcase" size={48} color={colors.mutedForeground} />
              <Text
                style={[styles.emptyTitle, { color: colors.foreground }]}
              >
                No Loans Given Yet
              </Text>
              <Text
                style={[styles.emptyText, { color: colors.mutedForeground }]}
              >
                Create a direct loan or apply to a marketplace request to start lending.
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={[
            ...openMarketplaceLoans,
            ...filledMarketplaceLoans,
          ]}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            {
              paddingBottom: insets.bottom + 100,
              paddingHorizontal: 16,
            },
          ]}
          renderItem={({ item }) => (
            <MarketplaceCard
              loan={item}
              currentUserId={user?.id || ""}
              onApply={handleApply}
            />
          )}
          ListHeaderComponent={
            openMarketplaceLoans.length > 0 ? (
              <View style={styles.marketplaceHeader}>
                <Feather name="zap" size={16} color={colors.primary} />
                <Text
                  style={[
                    styles.marketplaceHeaderText,
                    { color: colors.primary },
                  ]}
                >
                  {openMarketplaceLoans.length} Open Opportunities
                </Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="globe" size={48} color={colors.mutedForeground} />
              <Text
                style={[styles.emptyTitle, { color: colors.foreground }]}
              >
                No Requests Available
              </Text>
              <Text
                style={[styles.emptyText, { color: colors.mutedForeground }]}
              >
                Borrowers who request unknown lenders will appear here.
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}

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
  tabBtnText: {
    fontSize: 13,
    fontWeight: "600",
  },
  tabCount: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  tabCountText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  listContent: {
    paddingTop: 14,
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
  marketplaceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  marketplaceHeaderText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
