import { parseISO, format } from "date-fns"

export const calculateExpenseByCategory = (transactions) => {
  const expenseCategories = {}

  transactions.forEach((transaction) => {
    const amount = Number.parseFloat(transaction.số_tiền)
    if (amount < 0) {
      // Chỉ tính các giao dịch chi tiêu (số tiền âm)
      const category = transaction.loại_giao_dịch || "Khác"
      if (!expenseCategories[category]) {
        expenseCategories[category] = 0
      }
      expenseCategories[category] += Math.abs(amount)
    }
  })

  // Chuyển đổi kết quả thành mảng để dễ dàng sử dụng trong biểu đồ
  return Object.entries(expenseCategories)
    .map(([category, amount]) => ({
      category,
      amount: Number.parseFloat(amount.toFixed(2)),
    }))
    .sort((a, b) => b.amount - a.amount) // Sắp xếp giảm dần theo số tiền
}

export const calculateSpendingTrend = (transactions) => {
  const monthlySpending = {}

  transactions.forEach((transaction) => {
    const amount = Number.parseFloat(transaction.số_tiền)
    if (amount < 0) {
      // Chỉ tính các giao dịch chi tiêu (số tiền âm)
      const date = parseISO(transaction.ngày_giao_dịch.split("/").reverse().join("-"))
      const monthKey = format(date, "yyyy-MM")

      if (!monthlySpending[monthKey]) {
        monthlySpending[monthKey] = 0
      }
      monthlySpending[monthKey] += Math.abs(amount)
    }
  })

  // Chuyển đổi kết quả thành mảng và sắp xếp theo thời gian
  return Object.entries(monthlySpending)
    .map(([month, amount]) => ({
      month: format(parseISO(month), "MM/yyyy"),
      amount: Number.parseFloat(amount.toFixed(2)),
    }))
    .sort((a, b) => parseISO(a.month) - parseISO(b.month))
}

export const calculateIncomeVsExpense = (transactions) => {
  let totalIncome = 0
  let totalExpense = 0

  transactions.forEach((transaction) => {
    const amount = Number.parseFloat(transaction.số_tiền)
    if (amount > 0) {
      totalIncome += amount
    } else {
      totalExpense += Math.abs(amount)
    }
  })

  return {
    income: Number.parseFloat(totalIncome.toFixed(2)),
    expense: Number.parseFloat(totalExpense.toFixed(2)),
  }
}

export const calculateMonthlyBalance = (transactions) => {
  const monthlyBalance = {}

  transactions.forEach((transaction) => {
    const amount = Number.parseFloat(transaction.số_tiền)
    const date = parseISO(transaction.ngày_giao_dịch.split("/").reverse().join("-"))
    const monthKey = format(date, "yyyy-MM")

    if (!monthlyBalance[monthKey]) {
      monthlyBalance[monthKey] = 0
    }
    monthlyBalance[monthKey] += amount
  })

  // Chuyển đổi kết quả thành mảng và sắp xếp theo thời gian
  return Object.entries(monthlyBalance)
    .map(([month, balance]) => ({
      month: format(parseISO(month), "MM/yyyy"),
      balance: Number.parseFloat(balance.toFixed(2)),
    }))
    .sort((a, b) => parseISO(a.month) - parseISO(b.month))
}

export const calculateTopExpenses = (transactions, limit = 5) => {
  const expenses = transactions
    .filter((transaction) => Number.parseFloat(transaction.số_tiền) < 0)
    .map((transaction) => ({
      description: transaction.mô_tả,
      amount: Math.abs(Number.parseFloat(transaction.số_tiền)),
      date: transaction.ngày_giao_dịch,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit)

  return expenses
}


export const getCurrentBalance = (transactions) => {
  const balanceMap = {};

  transactions.forEach(({ nguồn_tiền, số_dư }) => {
    balanceMap[nguồn_tiền] = số_dư;
  });

  return balanceMap;
};


export const calculateSavingsRate = (transactions) => {
  const { income, expense } = calculateIncomeVsExpense(transactions)
  const savings = income - expense
  const savingsRate = (savings / income) * 100

  return Number.parseFloat(savingsRate.toFixed(2))
}

export const calculateNetWorth = (transactions) => {
  // Giả sử giao dịch cuối cùng có số dư cập nhật nhất
  if (transactions.length === 0) return 0

  const latestTransaction = transactions[transactions.length - 1]
  return Number.parseFloat(latestTransaction.số_dư || 0)
}

export const calculateBalance = (transactions) => {
  if (!transactions || transactions.length === 0) return 0
  return Number.parseFloat(transactions[0].số_dư || 0)
}

export const calculateIncome = (transactions) => {
  if (!transactions || transactions.length === 0) return 0
  return transactions.reduce((sum, transaction) => {
    const amount = Number.parseFloat(transaction.số_tiền || 0)
    return amount > 0 ? sum + amount : sum
  }, 0)
}
export const calculateExpense = (transactions) => {
  if (!transactions || transactions.length === 0) return 0
  return transactions.reduce((sum, transaction) => {
    const amount = Number.parseFloat(transaction.số_tiền || 0)
    return amount < 0 ? sum + Math.abs(amount) : sum
  }, 0)
}
