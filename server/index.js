const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// --- REGISTRATION API ---
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check user registered or not 
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "User already exists!" });

    // password encripting or hashing 
    const hashedPassword = await bcrypt.hash(password, 10);

    // saving new user in database 
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong!" });
  }
});

// --- LOGIN API ---
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // finding user 
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "User not found!" });

    // matching password 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials!" });

    // creating login token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Login successful!", token, user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong!" });
  }
});

// --- AUTH MIDDLEWARE (without login data will not be got) ---
const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access Denied! Please log in." });

  try {
    // token verify and user data finding
    const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid Token!" });
  }
};

// --- ADD TRANSACTION API (new transaction save with Balance Check) ---
app.post("/api/transactions", authenticate, async (req, res) => {
  try {
    const { amount, type, category, description, date } = req.body;
    const parsedAmount = parseFloat(amount);

    // ১. যদি খরচ (expense) হয়, তবে আগে ব্যালেন্স চেক করো
    if (type === "expense") {
      const userTransactions = await prisma.transaction.findMany({
        where: { userId: req.user.userId }
      });
      
      let totalIncome = 0;
      let totalExpense = 0;
      userTransactions.forEach(t => {
        if (t.type === "income") totalIncome += Number(t.amount);
        if (t.type === "expense") totalExpense += Number(t.amount);
      });

      const currentBalance = totalIncome - totalExpense;

      // ২. ব্যালেন্সের চেয়ে খরচ বেশি হলে ট্রানজেকশন বাতিল করে ওয়ার্নিং দাও
      if (parsedAmount > currentBalance) {
        return res.status(400).json({ 
          error: `Insufficient balance! You only have ৳${currentBalance.toLocaleString()} available.` 
        });
      }
    }

    // ৩. ব্যালেন্স ঠিক থাকলে ট্রানজেকশন সেভ করো
    const newTransaction = await prisma.transaction.create({
      data: {
        amount: parsedAmount,
        type,
        category,
        description,
        date: date ? new Date(date) : new Date(),
        userId: req.user.userId,
      },
    });
    res.status(201).json({ message: "Transaction added successfully!", transaction: newTransaction });
  } catch (error) {
    res.status(500).json({ error: "Failed to add transaction" });
  }
});

// --- GET TRANSACTIONS API (look for transaction) ---
app.get("/api/transactions", authenticate, async (req, res) => {
  try {
    // only look for new user's transaction and new one shows first(desc)
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.userId },
      orderBy: { date: "desc" },
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// --- ADD BUDGET API (new budget created) ---
app.post("/api/budgets", authenticate, async (req, res) => {
  try {
    const { category, limit, color } = req.body;
    
    // checking is there any budget in this catagory
    const existingBudget = await prisma.budget.findFirst({
      where: { userId: req.user.userId, category }
    });

    if (existingBudget) {
      return res.status(400).json({ error: "Budget for this category already exists!" });
    }

    const newBudget = await prisma.budget.create({
      data: {
        category,
        limit: parseFloat(limit),
        color: color || "bg-brand-500",
        userId: req.user.userId,
      },
    });
    res.status(201).json({ message: "Budget created successfully!", budget: newBudget });
  } catch (error) {
    res.status(500).json({ error: "Failed to create budget" });
  }
});

// --- GET BUDGETS API ---
app.get("/api/budgets", authenticate, async (req, res) => {
  try {
    // collecting user's all budget
    const budgets = await prisma.budget.findMany({
      where: { userId: req.user.userId },
    });

    // all transactions collected
    const expenses = await prisma.transaction.findMany({
      where: { userId: req.user.userId, type: "expense" }
    });

    // all budget calculation being added 
    const budgetsWithSpent = budgets.map(budget => {
      
      // ** Case-insensitive and space removing **
      const totalSpent = expenses
        .filter(t => t.category.toLowerCase().trim() === budget.category.toLowerCase().trim())
        .reduce((sum, t) => sum + Number(t.amount), 0);
        
      return { 
        ...budget, 
        spent: totalSpent 
      };
    });

    res.json(budgetsWithSpent);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch budgets" });
  }
});

// --- ADD GOAL API (Updated with Outflow Transaction & Balance Check) ---
app.post("/api/goals", authenticate, async (req, res) => {
  try {
    const { title, target, saved, deadline, color } = req.body;
    const initialSaved = parseFloat(saved || 0);

    // ১. যদি শুরুতেই টাকা অ্যাড করতে চায়, তবে আগে ব্যালেন্স চেক করো
    if (initialSaved > 0) {
      const userTransactions = await prisma.transaction.findMany({
        where: { userId: req.user.userId }
      });
      
      let totalIncome = 0;
      let totalExpense = 0;
      userTransactions.forEach(t => {
        if (t.type === "income") totalIncome += Number(t.amount);
        if (t.type === "expense") totalExpense += Number(t.amount);
      });

      const currentBalance = totalIncome - totalExpense;

      if (initialSaved > currentBalance) {
        return res.status(400).json({ 
          error: `Insufficient balance! You only have ৳${currentBalance.toLocaleString()} available to save.` 
        });
      }
    }

    const newGoal = await prisma.goal.create({
      data: {
        title,
        target: parseFloat(target),
        saved: initialSaved,
        deadline,
        color: color || "bg-brand-500",
        userId: req.user.userId,
      },
    });

    // If there's an initial saved amount, create an outflow transaction for it
    if (initialSaved > 0) {
      await prisma.transaction.create({
        data: {
          amount: initialSaved,
          type: "expense",
          category: "Savings & Goals",
          description: `Initial deposit for goal: ${title}`,
          date: new Date(),
          userId: req.user.userId,
        },
      });
    }

    res.status(201).json({ message: "Goal created successfully!", goal: newGoal });
  } catch (error) {
    res.status(500).json({ error: "Failed to create goal" });
  }
});

// --- GET GOALS API ---
app.get("/api/goals", authenticate, async (req, res) => {
  try {
    const goals = await prisma.goal.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: "desc" }
    });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch goals" });
  }
});

// --- UPDATE GOAL API (Add Funds + Balance Check) ---
app.put("/api/goals/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { amountToAdd } = req.body;
    const addedAmount = parseFloat(amountToAdd);

    if (!addedAmount || addedAmount <= 0) {
      return res.status(400).json({ error: "Please enter a valid amount" });
    }

    // ১. ব্যালেন্স চেক: গোলে টাকা অ্যাড করার আগে দেখো পকেটে টাকা আছে কি না
    const userTransactions = await prisma.transaction.findMany({
      where: { userId: req.user.userId }
    });
    
    let totalIncome = 0;
    let totalExpense = 0;
    userTransactions.forEach(t => {
      if (t.type === "income") totalIncome += Number(t.amount);
      if (t.type === "expense") totalExpense += Number(t.amount);
    });

    const currentBalance = totalIncome - totalExpense;

    if (addedAmount > currentBalance) {
      return res.status(400).json({ 
        error: `Insufficient balance! You only have ৳${currentBalance.toLocaleString()} available to add.` 
      });
    }

    // Check if the goal exists and belongs to the logged-in user
    const existingGoal = await prisma.goal.findUnique({ where: { id } });
    
    if (!existingGoal || existingGoal.userId !== req.user.userId) {
      return res.status(404).json({ error: "Goal not found" });
    }

    // 2. Update the goal's saved amount
    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: { saved: existingGoal.saved + addedAmount },
    });

    // 3. Create an outflow transaction to reflect the added funds
    await prisma.transaction.create({
      data: {
        amount: addedAmount,
        type: "expense",
        category: "Savings & Goals",
        description: `Added funds to goal: ${existingGoal.title}`,
        date: new Date(),
        userId: req.user.userId,
      },
    });

    res.json({ message: "Funds added and transaction logged successfully!", goal: updatedGoal });
  } catch (error) {
    res.status(500).json({ error: "Failed to add funds" });
  }
});

// --- GET USER PROFILE API ---
app.get("/api/user/profile", authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, name: true, email: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// --- UPDATE USER PROFILE API ---
app.put("/api/user/profile", authenticate, async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if the new email is already in use by another user
    const existingUser = await prisma.user.findFirst({
      where: { email, NOT: { id: req.user.userId } },
    });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already in use by another account" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: { name, email },
      select: { id: true, name: true, email: true },
    });

    res.json({ message: "Profile updated successfully!", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// --- CHANGE PASSWORD API ---
app.put("/api/user/password", authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Check if the current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Hash the new password and update it in the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.user.userId },
      data: { password: hashedPassword },
    });

    res.json({ message: "Password changed successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to change password" });
  }
});

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));