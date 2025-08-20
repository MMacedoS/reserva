import { Users, Clock, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Table } from "@/http/types/tables/Table";

interface TableCardProps {
  table: Table;
  onEdit?: (table: Table) => void;
  onReserve?: (table: Table) => void;
  onRelease?: (table: Table) => void;
  onSelect?: (table: Table) => void;
  selectable?: boolean;
}

export function TableCard({ 
  table, 
  onEdit, 
  onReserve, 
  onRelease, 
  onSelect, 
  selectable = false 
}: TableCardProps) {
  const getStatusBadge = () => {
    if (table.sale_id) {
      return <Badge className="bg-green-100 text-green-800">Ocupada</Badge>;
    }
    if (table.reservation_id) {
      return <Badge className="bg-yellow-100 text-yellow-800">Reservada</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-800">Disponível</Badge>;
  };

  const getStatusColor = () => {
    if (table.sale_id) return "border-green-300 bg-green-50";
    if (table.reservation_id) return "border-yellow-300 bg-yellow-50";
    return "border-blue-300 bg-blue-50";
  };

  return (
    <Card 
      className={`p-4 ${selectable ? 'cursor-pointer hover:bg-gray-50' : ''} ${getStatusColor()}`}
      onClick={selectable ? () => onSelect?.(table) : undefined}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium">Mesa {table.name || table.id}</h3>
          </div>
          {getStatusBadge()}
        </div>
        
        <div className="space-y-2 text-sm">
          {table.reservation_id && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">
                Reserva: #{table.reservation_id}
              </span>
            </div>
          )}
          
          {table.sale_id && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">
                Venda: #{table.sale_id}
              </span>
            </div>
          )}
          
          {table.sales_total && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-green-600">
                Total: R$ {table.sales_total.toFixed(2)}
              </span>
            </div>
          )}
        </div>
        
        {!selectable && (
          <div className="flex gap-1 pt-2">
            {onEdit && (
              <Button size="sm" variant="outline" onClick={() => onEdit(table)}>
                Editar
              </Button>
            )}
            {!table.sale_id && !table.reservation_id && onReserve && (
              <Button size="sm" variant="outline" onClick={() => onReserve(table)}>
                Reservar
              </Button>
            )}
            {(table.sale_id || table.reservation_id) && onRelease && (
              <Button size="sm" variant="outline" onClick={() => onRelease(table)}>
                Liberar
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
