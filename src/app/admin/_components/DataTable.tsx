'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { decryptKey } from '@/lib/utils'
import { verifyOtp } from '@/lib/actions/auth.action'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const router = useRouter()
  const [Loading, setLoading] = useState(true)
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const verify = async () => {
    const storedKey = sessionStorage.getItem('accessKey')

    if (!storedKey) {
      router.push('/')
      return
    }
    const accessKey = decryptKey(storedKey)
    const verifc = await verifyOtp(accessKey)
    if (!verifc.status) router.push('/')
    else setLoading(false)
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    verify()
  }, [typeof window === 'undefined'])

  if (Loading)
    return (
      <div className="h-[50vh] flex items-center justify-center ">
        <Image src="/assets/icons/loader.svg" width={100} height={100} alt="loading" />
      </div>
    )
  return (
    <div className=" z-10  overflow-hidden   border-dark-400 shadow-lg rounded-lg  w-full  border">
      <Table className="rounded-lg overflow-hidden ">
        <TableHeader className="bg-dark-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              className="border-b border-dark-400 text-light-200 hover:bg-transparent"
              key={headerGroup.id}
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className=" border-b border-dark-400 text-light-200  "
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex w-full items-center justify-between space-x-2 p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="shad-gray-btn"
        >
          <Image src="/assets/icons/arrow.svg" width={24} height={24} alt="arrow" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="shad-gray-btn"
        >
          <Image
            src="/assets/icons/arrow.svg"
            width={24}
            height={24}
            alt="arrow "
            className="rotate-180"
          />
        </Button>
      </div>
    </div>
  )
}
export default DataTable
