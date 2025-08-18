import type { ProductCategory } from "@/http/types/products/Product";

export const DEFAULT_PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: "1",
    name: "Bebidas",
    description: "Bebidas alcoólicas e não alcoólicas",
    is_active: true,
  },
  {
    id: "2",
    name: "Petiscos",
    description: "Aperitivos e petiscos diversos",
    is_active: true,
  },
  {
    id: "3",
    name: "Pratos Principais",
    description: "Pratos principais e refeições completas",
    is_active: true,
  },
  {
    id: "4",
    name: "Sobremesas",
    description: "Doces e sobremesas",
    is_active: true,
  },
  {
    id: "5",
    name: "Entradas",
    description: "Aperitivos e entradas",
    is_active: true,
  },
  {
    id: "6",
    name: "Acompanhamentos",
    description: "Acompanhamentos e guarnições",
    is_active: true,
  },
  {
    id: "7",
    name: "Cafés e Chás",
    description: "Bebidas quentes",
    is_active: true,
  },
  {
    id: "8",
    name: "Sucos",
    description: "Sucos naturais e industrializados",
    is_active: true,
  },
];
