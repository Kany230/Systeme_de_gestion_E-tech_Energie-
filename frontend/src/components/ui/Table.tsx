import { type ReactNode } from 'react'

interface Column<T> {
  key: keyof T | string
  header: string
  render?: (value: any, row: T, index: number) => ReactNode
  className?: string
}

interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyField: keyof T
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
}

export default function Table<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  loading = false,
  emptyMessage = 'Aucune donnée trouvée',
  onRowClick,
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`text-left py-3 px-4 font-semibold text-gray-700 ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={String(row[keyField])}
              className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                onRowClick ? 'cursor-pointer' : ''
              }`}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className={`py-3 px-4 ${column.className || ''}`}
                >
                  {column.render
                    ? column.render(row[column.key as keyof T], row, index)
                    : String(row[column.key as keyof T] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
