'use client';

import { fullName } from 'utils/corps';
import ExcelJS, { Borders, Fill } from 'exceljs';
import dayjs from 'dayjs';
import Button from 'components/input/button';
import { IconDownload } from '@tabler/icons-react';

type Item = {
  name: string;
  price: number;
};

type ActiveCorps = {
  number: number | null;
  firstName: string;
  lastName: string;
  balance: number;
};

type DownloadStrecklistButtonProps = {
  activeCorps: ActiveCorps[];
  items: Item[];
};

const border: Partial<Borders> = {
  bottom: {
    style: 'thin',
  },
  top: {
    style: 'thin',
  },
  left: {
    style: 'thin',
  },
  right: {
    style: 'thin',
  },
};

const font: Partial<ExcelJS.Font> = {
  name: 'Cambria',
  size: 11,
};

const headerRow = 2;

const getStyle = (balance: number) => {
  const fill: Fill = {
    type: 'pattern',
    pattern: 'none',
  };
  if (balance < 0) {
    fill.pattern = 'mediumGray';
  } else if (balance < 200) {
    fill.pattern = 'lightGray';
  }
  return fill;
};

const generateStreckList = (activeCorps: ActiveCorps[], items: Item[]) => {
  const workbook = new ExcelJS.Workbook();
  workbook.created = new Date();
  const sheet = workbook.addWorksheet('Strecklista', {
    pageSetup: {
      paperSize: 9,
      orientation: 'landscape',
    },
  });
  sheet.pageSetup.printTitlesRow = '1:2';
  sheet.pageSetup.margins = {
    left: 0.15,
    right: 0.15,
    top: 0.2,
    bottom: 0.2,
    header: 0.15,
    footer: 0.15,
  };
  sheet.pageSetup.horizontalCentered = true;
  sheet.pageSetup.verticalCentered = true;

  const nameColWidth =
    Math.max(...activeCorps.map((corps) => fullName(corps).length)) * 0.93;

  const header = sheet.getRow(headerRow);
  header.values = ['#', 'Namn', 'Saldo'].concat(
    items.map((item) => `${item.name} ${item.price}p`),
  );
  sheet.getRow(headerRow).border = border;
  sheet.getRow(headerRow).font = font;

  sheet.getColumn(1).alignment = { horizontal: 'right' };
  sheet.getColumn(1).width = 5;

  sheet.getColumn(2).width = nameColWidth;
  sheet.getColumn(2).alignment = { wrapText: true };

  sheet.getColumn(3).width = 6;
  sheet.getColumn(3).alignment = { horizontal: 'right' };

  sheet.getRow(headerRow).alignment = { horizontal: 'left' };
  sheet.getCell(headerRow, 1).alignment = { horizontal: 'center' };

  const itemsWidth = (115 - 5 - nameColWidth - 6) / items.length;
  for (let i = 0; i < items.length; i++) {
    sheet.getColumn(i + 4).width = itemsWidth;
  }

  let rowIndex = headerRow + 1;
  for (const corps of activeCorps) {
    const row = sheet.getRow(rowIndex);
    row.values = [
      corps.number ? corps.number.toString() + ' ' : 'p.e. ',
      fullName(corps),
      corps.balance,
    ];
    row.fill = getStyle(corps.balance);
    row.font = font;
    row.getCell(2).font = { ...font, strike: corps.balance < 0 };
    rowIndex++;
    row.border = border;
  }

  const filename = `Strecklista ${dayjs().format('YYYY-MM-DD')}.xlsx`;

  workbook.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    window.URL.revokeObjectURL(url);
  });
};

const DownloadStrecklistButton = ({
  activeCorps,
  items,
}: DownloadStrecklistButtonProps) => {
  return (
    <Button onClick={() => generateStreckList(activeCorps, items)}>
      <IconDownload />
      Ladda ner ny strecklista
    </Button>
  );
};

export default DownloadStrecklistButton;
