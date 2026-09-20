import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();

const budgetSchema = z.object({
  categoryId: z.string().min(1),
  amount: z.number().positive(),
  month: z.number().min(1).max(12),
  year: z.number().min(2000),
});

// GET /api/budgets?month=&year=
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const month = Number(req.query.month) || new Date().getMonth() + 1;
    const year = Number(req.query.year) || new Date().getFullYear();

    const budgets = await prisma.budget.findMany({
      where: { month, year },
      include: { category: true },
    });

    // spent-so-far for each budgeted category this month
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const results = await Promise.all(
      budgets.map(async (b) => {
        const agg = await prisma.transaction.aggregate({
          where: {
            categoryId: b.categoryId,
            type: "EXPENSE",
            date: { gte: start, lt: end },
          },
          _sum: { amount: true },
        });
        const spent = Number(agg._sum.amount ?? 0);
        return {
          ...b,
          amount: Number(b.amount),
          spent,
          remaining: Number(b.amount) - spent,
          percentUsed: Number(b.amount) > 0 ? (spent / Number(b.amount)) * 100 : 0,
        };
      })
    );

    res.json(results);
  })
);

// POST /api/budgets  (upsert by categoryId+month+year)
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const data = budgetSchema.parse(req.body);
    const budget = await prisma.budget.upsert({
      where: {
        categoryId_month_year: {
          categoryId: data.categoryId,
          month: data.month,
          year: data.year,
        },
      },
      update: { amount: data.amount },
      create: data,
      include: { category: true },
    });
    res.status(201).json(budget);
  })
);

// DELETE /api/budgets/:id
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await prisma.budget.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

export default router;
