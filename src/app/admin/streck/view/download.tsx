'use client';

import ExcelJS from 'exceljs';
import dayjs from 'dayjs';
import Button from 'components/input/button';
import { IconDownload } from '@tabler/icons-react';
import { fullName, numberAndFullName } from 'utils/corps';
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

type Summary = {
  total: number;
  amount: number;
};

type StreckList = {
  transactions: Transaction[];
  createdBy: Corps;
  createdAt: Date;
};

type DownloadTransactionsButtonProps = {
  streckLists: StreckList[];
  filename: string;
};

const headerRow = 1;

const generateTransactionsXLSX = (
  streckLists: StreckList[],
  filename: string,
) => {
  const workbook = new ExcelJS.Workbook();
  workbook.created = new Date();
  const summarySheet = workbook.addWorksheet('Sammanfattning', {
    pageSetup: {
      paperSize: 9,
      orientation: 'portrait',
      printTitlesRow: `${headerRow}:${headerRow}`,
    },
  });

  const header = summarySheet.getRow(headerRow);
  header.values = ['Artikel', 'Antal', 'Totalpris'];
  summarySheet.getColumn(1).width = 12;

  const items: string[] = [];
  const summaries = streckLists.reduce((acc, streckList) => {
    for (const transaction of streckList.transactions) {
      const prev = acc.get(transaction.item);
      if (!prev) {
        items.push(transaction.item);
      }
      acc.set(transaction.item, {
        total: (prev?.total ?? 0) + transaction.totalPrice,
        amount: (prev?.amount ?? 0) + transaction.amount,
      });
    }
    return acc;
  }, new Map<string, Summary>());
  items.sort((a, b) => a.localeCompare(b, 'sv'));

  for (const item of items) {
    const summary = summaries.get(item);
    if (!summary) {
      continue;
    }
    summarySheet.addRow([item, summary.amount, summary.total]);
  }

  const streckListsSheet = workbook.addWorksheet('Alla strecklistor', {
    pageSetup: {
      paperSize: 9,
      orientation: 'portrait',
      printTitlesRow: `${headerRow}:${headerRow}`,
    },
  });

  streckListsSheet.getRow(headerRow).values = [
    'Corps',
    'Artikel',
    'Styckpris',
    'Antal',
    'Total',
  ];
  streckListsSheet.getRow(headerRow).font = {
    name: 'Arial',
    bold: true,
  };
  streckListsSheet.getColumn(1).width = 25;
  streckListsSheet.getColumn(2).width = 17;
  streckListsSheet.getColumn(3).width = 20;

  for (const streckList of streckLists) {
    streckListsSheet.addRow(['']);
    streckListsSheet.addRow([
      `Strecklista införd ${dayjs(streckList.createdAt).format(
        'YYYY-MM-DD',
      )} av ${numberAndFullName(streckList.createdBy)}`,
    ]);
    const streckListHeader = streckListsSheet.lastRow;
    if (!streckListHeader) {
      // streckListHeader should be defined as we just added a row
      continue;
    }
    streckListHeader.height = 22;
    streckListHeader.font = {
      name: 'Arial',
      bold: true,
      size: 12,
    };

    for (const transaction of streckList.transactions) {
      streckListsSheet.addRow([
        fullName(transaction.corps),
        transaction.item,
        transaction.pricePer,
        transaction.amount,
        transaction.totalPrice,
      ]);
    }
  }

  downloadXLSX(workbook, filename);
};

const DownloadTransactionsButton = ({
  streckLists,
  filename,
}: DownloadTransactionsButtonProps) => {
  return (
    <Button onClick={() => generateTransactionsXLSX(streckLists, filename)}>
      <IconDownload />
      Exportera som XLSX
    </Button>
  );
};

export default DownloadTransactionsButton;
