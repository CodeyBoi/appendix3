'use client';

import ExcelJS from 'exceljs';
import dayjs from 'dayjs';
import Button from 'components/input/button';
import { IconDownload } from '@tabler/icons-react';
import { fullName } from 'utils/corps';
import { downloadXLSX } from 'utils/xlsx';

type Corps = {
  number: number | null;
  firstName: string;
  lastName: string;
};

type Transaction = {
  corps: Corps;
  time: Date;
  item: string;
  pricePer: number;
  amount: number;
  totalPrice: number;
};

type SummaryItem = {
  amount: number;
  totalPrice: number;
};

type DownloadTransactionsButtonProps = {
  transactions: Transaction[];
  summary: Record<string, SummaryItem>;
  items: string[];
  start: Date;
  end: Date;
};

const headerRow = 1;

const generateTransactionsXLSX = (
  transactions: Transaction[],
  items: string[],
  summary: Record<string, SummaryItem>,
  start: Date,
  end: Date,
) => {
  const workbook = new ExcelJS.Workbook();
  workbook.created = new Date();
  const summarySheet = workbook.addWorksheet('Sammanfattning', {
    pageSetup: {
      paperSize: 9,
      orientation: 'portrait',
    },
  });
  summarySheet.pageSetup.printTitlesRow = headerRow.toString();

  const header = summarySheet.getRow(headerRow);
  header.values = ['Artikel', 'Antal', 'Totalpris'];
  summarySheet.getColumn(1).width = 12;

  for (const itemName of items) {
    const item = summary[itemName];
    if (!item) {
      continue;
    }
    summarySheet.addRow([itemName, item.amount, item.totalPrice]);
  }

  const transactionSheet = workbook.addWorksheet('Alla transaktioner', {
    pageSetup: {
      paperSize: 9,
      orientation: 'portrait',
    },
  });
  transactionSheet.pageSetup.printTitlesRow = headerRow.toString();

  transactionSheet.getRow(headerRow).values = [
    'Datum',
    'Corps',
    'Artikel',
    'Styckpris',
    'Antal',
    'Total',
  ];
  transactionSheet.getColumn(1).width = 17;
  transactionSheet.getColumn(2).width =
    Math.max(...transactions.map((t) => fullName(t.corps).length)) * 0.93;
  transactionSheet.getColumn(3).width = Math.max(
    ...transactions.map((t) => t.item.length),
  );
  for (const transaction of transactions) {
    transactionSheet.addRow([
      dayjs(transaction.time).format('YYYY-MM-DD'),
      fullName(transaction.corps),
      transaction.item,
      transaction.pricePer,
      transaction.amount,
      transaction.totalPrice,
    ]);
  }

  const filename = `Strecktransaktioner ${dayjs(start).format(
    'YYYY-MM-DD',
  )} - ${dayjs(end).format('YYYY-MM-DD')}.xlsx`;
  downloadXLSX(workbook, filename);
};

const DownloadTransactionsButton = ({
  transactions,
  items,
  summary,
  start,
  end,
}: DownloadTransactionsButtonProps) => {
  return (
    <Button
      onClick={() =>
        generateTransactionsXLSX(transactions, items, summary, start, end)
      }
    >
      <IconDownload />
      Exportera som XLSX
    </Button>
  );
};

export default DownloadTransactionsButton;
