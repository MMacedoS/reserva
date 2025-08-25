import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table";

import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, LucideListCheck, LucideListCollapse } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterColumn?: keyof TData;
  filterPlaceholder?: string;
  multipleFilters?: Array<{
    column: keyof TData;
    placeholder: string;
  }>;
  actionsRender?: (row: TData) => React.ReactNode;
  initialFilters?: ColumnFiltersState;
  filters?: ColumnFiltersState;
  onFiltersChange?: (filters: ColumnFiltersState) => void;
  pagination?: {
    current_page: number;
    last_page: number;
    total?: number;
    onPageChange: (page: number) => void;
  };
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterColumn,
  filterPlaceholder = "Filtrar...",
  multipleFilters,
  actionsRender,
  pagination,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,

    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  });

  const [toggleAllColumnsVisibility, setToggleAllColumnsVisibility] =
    React.useState(false);

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2 flex-wrap">
        <div className="toggle">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setToggleAllColumnsVisibility(!toggleAllColumnsVisibility)
            }
          >
            {toggleAllColumnsVisibility ? (
              <LucideListCheck className="mr-2 h-4 w-4" />
            ) : (
              <LucideListCollapse className="mr-2 h-4 w-4" />
            )}
          </Button>
        </div>
        {toggleAllColumnsVisibility && (
          <div className="grid grid-cols-1 md:grid-cols-4 items-end gap-2">
            {filterColumn && !multipleFilters && (
              <Input
                placeholder={filterPlaceholder}
                value={
                  (table
                    .getColumn(filterColumn as string)
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table
                    .getColumn(filterColumn as string)
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
            )}

            {multipleFilters &&
              multipleFilters.map((filter, index) => (
                <Input
                  key={`filter-${filter.column as string}-${index}`}
                  placeholder={filter.placeholder}
                  value={
                    (table
                      .getColumn(filter.column as string)
                      ?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn(filter.column as string)
                      ?.setFilterValue(event.target.value)
                  }
                  className="max-w-sm"
                />
              ))}
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Colunas <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table.getAllColumns().map((column) =>
              column.getCanHide() ? (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ) : null
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tabela com headers e corpo */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead className="text-center" key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
                {actionsRender && <TableHead>Ações</TableHead>}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className="text-center break-words"
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  {/* Renderização de ações personalizadas por linha */}
                  {actionsRender && (
                    <TableCell>{actionsRender(row.original)}</TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actionsRender ? 1 : 0)}
                  className="text-center py-6"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end items-center mt-4">
        <span className="text-sm text-gray-600">
          Total de registros: {pagination?.total || data.length}
        </span>
      </div>

      {pagination && (
        <Pagination className="flex justify-end mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className={`text-gray-500 hover:text-gray-700 border ${
                  pagination.current_page === 1 ? "hidden" : ""
                }`}
                lang="pt-br"
                onClick={() =>
                  pagination.onPageChange(pagination.current_page - 1)
                }
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                className={`text-gray-500 hover:text-gray-700 border border-gray-200 pl-4 ${
                  pagination.current_page === pagination.last_page
                    ? "hidden"
                    : ""
                }`}
                onClick={() =>
                  pagination.onPageChange(pagination.current_page + 1)
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
