import axios from "axios";
import type {
  Budget,
  Category,
  CategoryTotal,
  SummaryTotals,
  Transaction,
  TrendPoint,
} from "../types";

const api = axios.create({ baseURL: "/api" });

// Categories
export const getCategories = () =>
  api.get<Category[]>("/categories").then((r) => r.data);
export const createCategory = (data: Partial<Category>) =>
  api.post<Category>("/categories", data).then((r) => r.data);
export const updateCategory = (id: string, data: Partial<Category>) =>
  api.put<Category>(`/categories/${id}`, data).then((r) => r.data);
export const deleteCategory = (id: string) =>
  api.delete(`/categories/${id}`);

// Transactions
export interface TransactionQuery {
  month?: number;
  year?: number;
  categoryId?: string;
  type?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}
export const getTransactions = (query: TransactionQuery) =>
  api
    .get<{ items: Transaction[]; total: number; page: number; pageSize: number }>(
      "/transactions",
      { params: query }
    )
    .then((r) => r.data);
export const createTransaction = (data: Partial<Transaction>) =>
  api.post<Transaction>("/transactions", data).then((r) => r.data);
export const updateTransaction = (id: string, data: Partial<Transaction>) =>
  api.put<Transaction>(`/transactions/${id}`, data).then((r) => r.data);
export const deleteTransaction = (id: string) =>
  api.delete(`/transactions/${id}`);

// Budgets
export const getBudgets = (month: number, year: number) =>
  api.get<Budget[]>("/budgets", { params: { month, year } }).then((r) => r.data);
export const upsertBudget = (data: {
  categoryId: string;
  amount: number;
  month: number;
  year: number;
}) => api.post<Budget>("/budgets", data).then((r) => r.data);
export const deleteBudget = (id: string) => api.delete(`/budgets/${id}`);

// Analytics
export const getSummary = (month: number, year: number) =>
  api
    .get<{ current: SummaryTotals; previous: SummaryTotals }>("/analytics/summary", {
      params: { month, year },
    })
    .then((r) => r.data);
export const getByCategory = (month: number, year: number) =>
  api
    .get<CategoryTotal[]>("/analytics/by-category", { params: { month, year } })
    .then((r) => r.data);
export const getTrend = (months = 6) =>
  api.get<TrendPoint[]>("/analytics/trend", { params: { months } }).then((r) => r.data);
