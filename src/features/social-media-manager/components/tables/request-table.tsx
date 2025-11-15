'use client';

import { Fragment, useMemo, useState } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { DataTablePagination } from '@/components/ui/table/data-table-pagination';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import { RequestItem } from '../../types';
import { requestColumns } from './request-columns';
import { RequestCellAction } from './request-cell-action';

interface RequestTableProps {
  data: RequestItem[];
  totalItems: number;
}

export function RequestTable({ data, totalItems }: RequestTableProps) {
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const pageCount = Math.ceil((totalItems || 0) / (pageSize || 1)) || 1;

  const paginatedData = useMemo(() => {
    if (!pageSize || pageSize <= 0) {
      return data;
    }
    const safePage = page && page > 0 ? page : 1;
    const start = (safePage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page, pageSize]);

  const { table } = useDataTable({
    data: paginatedData,
    columns: requestColumns,
    pageCount,
    shallow: false,
    debounceMs: 500
  });

  const rows = table.getRowModel().rows;
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const formatDate = (value?: string | null) => {
    if (!value) return '';
    const date = new Date(value);
    return date.toLocaleDateString('id-ID');
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='space-y-2'>
        <DataTableToolbar table={table} className='px-1' />

        <div className='bg-background rounded-lg border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Paket</TableHead>
                <TableHead className='text-right'>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => {
                const item = row.original as RequestItem;
                const rowId = String(item.id ?? row.id);
                const isExpanded = expandedRows[rowId];

                const tiktokTotal =
                  (item.tiktokPost ?? 0) +
                  (item.tiktokKomen ?? 0) +
                  (item.tiktokLike ?? 0);
                const instagramTotal =
                  (item.instagramPost ?? 0) +
                  (item.instagramKomen ?? 0) +
                  (item.instagramLike ?? 0);
                const facebookTotal =
                  (item.facebookPost ?? 0) +
                  (item.facebookKomen ?? 0) +
                  (item.facebookLike ?? 0);
                const twitterTotal =
                  (item.twitterPost ?? 0) +
                  (item.twitterKomen ?? 0) +
                  (item.twitterLike ?? 0);
                const youtubeTotal =
                  (item.youtubePost ?? 0) +
                  (item.youtubeKomen ?? 0) +
                  (item.youtubeLike ?? 0);
                const otherTotal =
                  (item.otherPost ?? 0) +
                  (item.otherKomen ?? 0) +
                  (item.otherLike ?? 0);

                return (
                  <Fragment key={rowId}>
                    <TableRow
                      className='cursor-pointer'
                      onClick={() =>
                        setExpandedRows((prev) => ({
                          ...prev,
                          [rowId]: !prev[rowId]
                        }))
                      }
                    >
                      <TableCell className='align-top'>
                        <div className='flex flex-col gap-0.5'>
                          <span className='text-sm font-medium'>
                            {item.namaPaket}
                          </span>
                          <span className='text-muted-foreground text-xs'>
                            {item.tanggalMulai || item.tanggalBerakhir
                              ? `${formatDate(item.tanggalMulai)}${
                                  item.tanggalBerakhir
                                    ? ` - ${formatDate(item.tanggalBerakhir)}`
                                    : ''
                                }`
                              : '-'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell
                        className='text-right align-top'
                        onClick={(e) => e.stopPropagation()}
                      >
                        <RequestCellAction row={row} />
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow className='bg-muted/40'>
                        <TableCell colSpan={2}>
                          <div className='grid w-full grid-cols-2 gap-x-4 gap-y-2 text-xs'>
                            <span className='text-muted-foreground font-medium'>
                              TikTok Post
                            </span>
                            <span>{item.tiktokPost}</span>
                            <span className='text-muted-foreground font-medium'>
                              TikTok Komen
                            </span>
                            <span>{item.tiktokKomen}</span>
                            <span className='text-muted-foreground font-medium'>
                              TikTok Like
                            </span>
                            <span>{item.tiktokLike}</span>
                            <span className='text-foreground font-semibold'>
                              TikTok Total
                            </span>
                            <span className='text-foreground font-semibold'>
                              {tiktokTotal}
                            </span>
                            <div className='col-span-2 my-2 w-full border-t' />

                            <span className='text-muted-foreground font-medium'>
                              Instagram Post
                            </span>
                            <span>{item.instagramPost}</span>
                            <span className='text-muted-foreground font-medium'>
                              Instagram Komen
                            </span>
                            <span>{item.instagramKomen}</span>
                            <span className='text-muted-foreground font-medium'>
                              Instagram Like
                            </span>
                            <span>{item.instagramLike}</span>
                            <span className='text-foreground font-semibold'>
                              Instagram Total
                            </span>
                            <span className='text-foreground font-semibold'>
                              {instagramTotal}
                            </span>
                            <div className='col-span-2 my-2 w-full border-t' />

                            <span className='text-muted-foreground font-medium'>
                              Facebook Post
                            </span>
                            <span>{item.facebookPost}</span>
                            <span className='text-muted-foreground font-medium'>
                              Facebook Komen
                            </span>
                            <span>{item.facebookKomen}</span>
                            <span className='text-muted-foreground font-medium'>
                              Facebook Like
                            </span>
                            <span>{item.facebookLike}</span>
                            <span className='text-foreground font-semibold'>
                              Facebook Total
                            </span>
                            <span className='text-foreground font-semibold'>
                              {facebookTotal}
                            </span>
                            <div className='col-span-2 my-2 w-full border-t' />

                            <span className='text-muted-foreground font-medium'>
                              Twitter Post
                            </span>
                            <span>{item.twitterPost}</span>
                            <span className='text-muted-foreground font-medium'>
                              Twitter Komen
                            </span>
                            <span>{item.twitterKomen}</span>
                            <span className='text-muted-foreground font-medium'>
                              Twitter Like
                            </span>
                            <span>{item.twitterLike}</span>
                            <span className='text-foreground font-semibold'>
                              Twitter Total
                            </span>
                            <span className='text-foreground font-semibold'>
                              {twitterTotal}
                            </span>
                            <div className='col-span-2 my-2 w-full border-t' />

                            <span className='text-muted-foreground font-medium'>
                              YouTube Post
                            </span>
                            <span>{item.youtubePost}</span>
                            <span className='text-muted-foreground font-medium'>
                              YouTube Komen
                            </span>
                            <span>{item.youtubeKomen}</span>
                            <span className='text-muted-foreground font-medium'>
                              YouTube Like
                            </span>
                            <span>{item.youtubeLike}</span>
                            <span className='text-foreground font-semibold'>
                              YouTube Total
                            </span>
                            <span className='text-foreground font-semibold'>
                              {youtubeTotal}
                            </span>
                            <div className='col-span-2 my-2 w-full border-t' />

                            <span className='text-muted-foreground font-medium'>
                              Lainnya Post
                            </span>
                            <span>{item.otherPost}</span>
                            <span className='text-muted-foreground font-medium'>
                              Lainnya Komen
                            </span>
                            <span>{item.otherKomen}</span>
                            <span className='text-muted-foreground font-medium'>
                              Lainnya Like
                            </span>
                            <span>{item.otherLike}</span>
                            <span className='text-foreground font-semibold'>
                              Lainnya Total
                            </span>
                            <span className='text-foreground font-semibold'>
                              {otherTotal}
                            </span>
                            <div className='col-span-2 my-2 w-full border-t' />

                            <span className='text-muted-foreground font-medium'>
                              Bonus / Catatan
                            </span>
                            <span>{item.bonus || '-'}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
