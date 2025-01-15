'use client';

import ExcelJS, { Workbook } from 'exceljs';
import dayjs from 'dayjs';
import Button from 'components/input/button';
import { downloadXLSX } from 'utils/xlsx';
import ActionIcon, { ActionIconVariant } from 'components/input/action-icon';
import { ReactNode } from 'react';

interface Corps {
  number: number | null;
  firstName: string;
  lastName: string;
}

interface Transaction {
  corps: Corps;
  item: string;
  pricePer: number;
  amount: number;
  totalPrice: number;
  verificationNumber: string | null;
  note: string;
}

interface Summary {
  total: number;
  amount: number;
}

interface StreckList {
  transactions: Transaction[];
  time: Date;
  createdBy: Corps;
  createdAt: Date;
}

interface DownloadTransactionsButtonProps {
  children: ReactNode;
  streckLists: StreckList[];
  filename: string;
  variant?: ActionIconVariant;
}

const headerRow = 1;

const generateStreckListSheet = (workbook: Workbook, name: string) => {
  const sheet = workbook.addWorksheet(name, {
    pageSetup: {
      paperSize: 9,
      orientation: 'portrait',
      printTitlesRow: `${headerRow}:${headerRow}`,
    },
  });

  sheet.getRow(headerRow).values = [
    '#',
    'Förnamn',
    'Efternamn',
    'Artikel',
    'Styckpris',
    'Antal',
    'Total',
    'Verifikatsnr.',
    'Anteckning',
  ];
  sheet.getRow(headerRow).font = {
    name: 'Arial',
    bold: true,
  };
  sheet.getColumn(1).width = 5;
  sheet.getColumn(2).width = 15;
  sheet.getColumn(3).width = 19;
  sheet.getColumn(4).width = 18;

  sheet.getColumn(8).width = 14;
  sheet.getColumn(9).width = 19;

  sheet.getColumn(1).alignment = {
    horizontal: 'center',
  };

  return sheet;
};

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
  header.font = {
    name: 'Arial',
    bold: true,
  };
  summarySheet.getColumn(1).width = 19;

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

  let lastName = null;
  let currentSheet = null;
  for (const streckList of streckLists) {
    const name = dayjs(streckList.time).format('YYYY-MM-DD');
    if (currentSheet === null || lastName !== name) {
      currentSheet = generateStreckListSheet(workbook, name);
    }
    for (const transaction of streckList.transactions) {
      currentSheet.addRow([
        transaction.corps.number ?? 'p.e.',
        transaction.corps.firstName.trim(),
        transaction.corps.lastName.trim(),
        transaction.item,
        transaction.pricePer,
        transaction.amount,
        transaction.totalPrice,
        transaction.verificationNumber,
        transaction.note,
      ]);
    }
    lastName = name;
  }

  downloadXLSX(workbook, filename);
};

const DownloadTransactionsButton = ({
  children,
  streckLists,
  filename,
  variant = 'default',
}: DownloadTransactionsButtonProps) => {
  if (variant === 'default') {
    return (
      <Button onClick={() => generateTransactionsXLSX(streckLists, filename)}>
        {children}
      </Button>
    );
  } else if (variant === 'subtle') {
    return (
      <ActionIcon
        variant='subtle'
        onClick={() => generateTransactionsXLSX(streckLists, filename)}
      >
        {children}
      </ActionIcon>
    );
  }
};

export default DownloadTransactionsButton;
