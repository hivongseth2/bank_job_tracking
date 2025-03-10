
import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryProgress: {
    width: 100,
    height: 100,
    marginRight: 16,
  },
  progressCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  summaryDetails: {
    flex: 1,
  },
  summaryItem: {
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  budgetListCard: {
    padding: 0,
    overflow: 'hidden',
  },
  budgetItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
  },
  budgetDetails: {
    marginTop: 8,
  },
  budgetProgress: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  budgetValues: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spentValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  limitValue: {
    fontSize: 14,
  },
  percentageText: {
    position: 'absolute',
    right: 0,
    fontSize: 14,
    fontWeight: 'bold',
  },
  addBudgetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  addBudgetText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  goalsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    marginBottom: 16,
    borderWidth: 1,
  },
  goalsButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  goalsButtonText: {
    marginLeft: 12,
    flex: 1,
  },
  goalsButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  goalsButtonSubtitle: {
    fontSize: 12,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    alignSelf: 'flex-start',
  },
  emptyBudget: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBudgetText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyBudgetSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyBudgetButton: {
    minWidth: 200,
  },
});
