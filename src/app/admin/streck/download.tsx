'use client';

import ExcelJS, { Borders, Fill } from 'exceljs';
import dayjs from 'dayjs';
import Button from 'components/input/button';
import { IconDownload } from '@tabler/icons-react';
import { downloadXLSX } from 'utils/xlsx';

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
  name: 'Arial',
  size: 10,
};

const bold: Partial<ExcelJS.Font> = {
  ...font,
  bold: true,
};

const headerRow = 1;
const firstNameCol = 2;
const lastNameCol = 3;
const balanceCol = 4;

const corpsPerPage = 32;

const getStyle = (balance: number) => {
  const fill: Fill = {
    type: 'pattern',
    pattern: 'none',
  };
  if (balance < 0) {
    fill.pattern = 'darkGray';
  } else if (balance < 200) {
    fill.pattern = 'mediumGray';
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
      printTitlesRow: '1:1',
      margins: {
        left: 0.1,
        right: 0.1,
        top: 0.55,
        bottom: 0.55,
        header: 0.15,
        footer: 0.15,
      },
      horizontalCentered: true,
    },
    headerFooter: {
      oddHeader:
        '&L< 200p -> Din rad blir grå -> Betala in till CPK!!\nNy och vill kunna strecka? -> Betala in till CPK!!&CUtskriven: &D\n&RInförd:____________\nAv:____________',
      oddFooter:
        '&LStreck införda t.o.m.:____________\nInbetalningar införda t.o.m.:____________&C\nSkriv tydligt!!&R\nbrought to you by Sexporten (och ITK)©',
    },
  });

  const lastCol = 4 + items.length;

  const firstNameColWidth = Math.max(
    ...activeCorps.map((corps) => corps.firstName.trim().length),
  );
  const lastNameColWidth = Math.max(
    ...activeCorps.map((corps) => corps.lastName.trim().length),
  );

  const header = sheet.getRow(headerRow);
  header.values = ['#', 'Förnamn', 'Efternamn', 'p'].concat(
    items.map((item) => `${item.name.trim()} ${item.price}p`),
  );
  header.border = border;
  header.font = bold;
  header.height = 30;

  sheet.getColumn(1).alignment = { horizontal: 'right' };
  sheet.getColumn(1).width = 5;

  sheet.getColumn(firstNameCol).width = firstNameColWidth;

  sheet.getColumn(lastNameCol).width = lastNameColWidth;

  sheet.getColumn(balanceCol).width = 6;
  sheet.getColumn(balanceCol).alignment = { horizontal: 'right' };

  sheet.getRow(headerRow).alignment = { horizontal: 'left', wrapText: true };
  sheet.getCell(headerRow, 1).alignment = { horizontal: 'center' };

  const itemsWidth =
    (145 - 5 - firstNameColWidth - lastNameColWidth - 6) / items.length;
  for (let i = 0; i < items.length; i++) {
    sheet.getColumn(i + balanceCol + 1).width = itemsWidth;
  }

  // Write corps row by row
  let rowIndex = headerRow + 1;
  for (const corps of activeCorps) {
    const row = sheet.getRow(rowIndex);
    row.values = [
      corps.number ? corps.number.toString() + ' ' : '',
      corps.firstName.trim(),
      corps.lastName.trim(),
      corps.balance,
    ];
    row.fill = getStyle(corps.balance);
    row.font = font;
    row.getCell(2).font = { ...font, strike: corps.balance < 0 };
    row.getCell(3).font = { ...font, strike: corps.balance < 0 };
    row.border = border;
    rowIndex++;
  }

  // Fill out the rest of the rows on the last page (to have some empty spots)
  while ((rowIndex - headerRow - 1) % corpsPerPage !== 0) {
    const row = sheet.getRow(rowIndex);
    row.values = [' ', ' ', ' ', ' '];
    row.border = border;
    rowIndex++;
  }

  // Set thick borders for header
  sheet.getColumn(1).border = {
    ...border,
    left: {
      style: 'medium',
    },
  };
  sheet.getColumn(lastCol).border = {
    ...border,
    right: {
      style: 'medium',
    },
  };
  sheet.getRow(headerRow).border = {
    ...border,
    top: {
      style: 'medium',
    },
    bottom: {
      style: 'medium',
    },
  };
  sheet.getColumn(balanceCol).border = {
    ...border,
    right: {
      style: 'medium',
    },
  };
  sheet.getCell(headerRow, 1).border = {
    ...border,
    left: {
      style: 'medium',
    },
    top: {
      style: 'medium',
    },
    bottom: {
      style: 'medium',
    },
  };
  sheet.getCell(headerRow, 4 + items.length).border = {
    ...border,
    right: {
      style: 'medium',
    },
    top: {
      style: 'medium',
    },
    bottom: {
      style: 'medium',
    },
  };
  sheet.getCell(headerRow, balanceCol).border = {
    ...border,
    right: {
      style: 'medium',
    },
    top: {
      style: 'medium',
    },
    bottom: {
      style: 'medium',
    },
  };

  const bottomRight: Partial<Borders> = {
    ...border,
    bottom: {
      style: 'medium',
    },
    right: {
      style: 'medium',
    },
  };

  // Split up into pages and add thick border to bottom of each page
  for (
    rowIndex = headerRow + corpsPerPage;
    rowIndex < activeCorps.length + headerRow + corpsPerPage;
    rowIndex += corpsPerPage
  ) {
    sheet.getRow(rowIndex).addPageBreak();
    sheet.getRow(rowIndex).border = {
      ...border,
      bottom: {
        style: 'medium',
      },
    };
    sheet.getCell(rowIndex, 1).border = {
      ...border,
      bottom: {
        style: 'medium',
      },
      left: {
        style: 'medium',
      },
    };
    sheet.getCell(rowIndex, balanceCol).border = bottomRight;
    sheet.getCell(rowIndex, lastCol).border = bottomRight;
  }

  const filename = `Strecklista ${dayjs().format('YYYY-MM-DD')}.xlsx`;
  downloadXLSX(workbook, filename);
};

const DownloadStrecklistButton = ({
  activeCorps,
  items,
}: DownloadStrecklistButtonProps) => {
  return (
    <Button onClick={() => generateStreckList(activeCorps, items)}>
      <IconDownload />
      Ladda ner tom strecklista
    </Button>
  );
};

export default DownloadStrecklistButton;
