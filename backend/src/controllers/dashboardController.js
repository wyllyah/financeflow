const prisma = require("../lib/prisma");

function sumTransactions(transactions, type) {
  return transactions
    .filter((transaction) => transaction.type === type)
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
}

function groupExpensesByCategory(transactions) {
  const grouped = transactions
    .filter((transaction) => transaction.type === "EXPENSE")
    .reduce((acc, transaction) => {
      const category = transaction.category;

      if (!acc[category]) {
        acc[category] = 0;
      }

      acc[category] += Number(transaction.amount);

      return acc;
    }, {});

  return Object.entries(grouped).map(([category, amount]) => ({
    category,
    amount,
  }));
}

function isInRange(date, start, end) {
  const parsedDate = new Date(date);
  return parsedDate >= start && parsedDate < end;
}

function getMonthLabel(date) {
  return new Intl.DateTimeFormat("pt-BR", {
    month: "short",
  })
    .format(date)
    .replace(".", "");
}

async function getDashboard(req, res) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.userId,
      },
      orderBy: {
        date: "desc",
      },
      include: {
        categoryRef: true,
      },
    });

    const incomeTransactions = transactions.filter(
      (transaction) => transaction.type === "INCOME"
    );
    const expenseTransactions = transactions.filter(
      (transaction) => transaction.type === "EXPENSE"
    );

    const totalIncome = sumTransactions(transactions, "INCOME");
    const totalExpense = sumTransactions(transactions, "EXPENSE");
    const balance = totalIncome - totalExpense;
    const recentTransactions = transactions.slice(0, 5);

    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const currentMonthTransactions = transactions.filter((transaction) =>
      isInRange(transaction.date, currentMonthStart, nextMonthStart)
    );
    const previousMonthTransactions = transactions.filter((transaction) =>
      isInRange(transaction.date, previousMonthStart, currentMonthStart)
    );

    const currentMonthIncome = sumTransactions(
      currentMonthTransactions,
      "INCOME"
    );
    const currentMonthExpense = sumTransactions(
      currentMonthTransactions,
      "EXPENSE"
    );
    const currentMonthBalance = currentMonthIncome - currentMonthExpense;

    const previousMonthIncome = sumTransactions(
      previousMonthTransactions,
      "INCOME"
    );
    const previousMonthExpense = sumTransactions(
      previousMonthTransactions,
      "EXPENSE"
    );
    const previousMonthBalance = previousMonthIncome - previousMonthExpense;

    const incomeExpenseByMonth = Array.from({ length: 6 })
      .map((_, index) => {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - index, 1);
        const monthStart = new Date(
          monthDate.getFullYear(),
          monthDate.getMonth(),
          1
        );
        const monthEnd = new Date(
          monthDate.getFullYear(),
          monthDate.getMonth() + 1,
          1
        );
        const monthTransactions = transactions.filter((transaction) =>
          isInRange(transaction.date, monthStart, monthEnd)
        );

        return {
          month: getMonthLabel(monthDate),
          income: sumTransactions(monthTransactions, "INCOME"),
          expense: sumTransactions(monthTransactions, "EXPENSE"),
        };
      })
      .reverse();

    const highestExpenseSource =
      currentMonthTransactions.filter(
        (transaction) => transaction.type === "EXPENSE"
      ).length > 0
        ? currentMonthTransactions
        : transactions;

    const highestExpense =
      highestExpenseSource
        .filter((transaction) => transaction.type === "EXPENSE")
        .sort((a, b) => Number(b.amount) - Number(a.amount))[0] || null;

    const expensesByCategory = groupExpensesByCategory(expenseTransactions);
    const topExpenseCategory =
      expensesByCategory.sort((a, b) => b.amount - a.amount)[0] || null;

    const transactionsByType = [
      { type: "Receitas", amount: totalIncome },
      { type: "Despesas", amount: totalExpense },
    ];

    return res.json({
      balance,
      totalIncome,
      totalExpense,
      totalTransactions: transactions.length,
      recentTransactions,
      expensesByCategory,
      currentMonthIncome,
      currentMonthExpense,
      currentMonthBalance,
      previousMonthIncome,
      previousMonthExpense,
      previousMonthBalance,
      incomeExpenseByMonth,
      highestExpense,
      topExpenseCategory,
      transactionsByType,
      transactionsByCategory: expensesByCategory,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao carregar dashboard.",
    });
  }
}

module.exports = {
  getDashboard,
};
