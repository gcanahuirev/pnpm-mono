import { WorkBook, WorkSheet, read, utils, write } from 'xlsx-js-style';

import { Stream } from 'stream';

/**
 * @description: Service to read and write xlsx files
 * @version: 1.0.0
 * @package: @smartcore/file
 */

export class ExcelService {
  /**
   * @description: Read xlsx file
   * @param stream
   * @returns {Promise<WorkBook>}
   */
  readWorkbook = (stream: Stream): Promise<WorkBook> =>
    new Promise((resolve, reject) => {
      const buffers: Array<Uint8Array> = [];
      stream.on('data', (data: any) => buffers.push(data));
      stream.on('end', () => {
        const buffer = Buffer.concat(buffers);
        const workbook = read(buffer, { type: 'buffer' });
        resolve(workbook);
      });
      stream.on('error', (err: Error) => reject(err));
    });

  /**
   * @description: Parse xlsx file to json
   * @param workbook
   * @param sheetName
   * @returns {Array<T>}
   */
  parseSheetToJson = <T>(workbook: WorkBook, sheetName?: string): Array<T> => {
    if (!sheetName) sheetName = workbook.SheetNames[0];

    if (!workbook.SheetNames.includes(sheetName)) {
      throw new Error(`Sheet [ ${sheetName} ] not found`);
    }

    const worksheet = workbook.Sheets[sheetName];
    const sheet = utils.sheet_to_json(worksheet);
    return sheet as Array<T>;
  };

  /**
   * @description: Write xlsx file
   * @param header
   * @param body
   * @param title
   * @param sheetName
   * @returns {Buffer}
   */
  writeXlsx = (
    header: Array<string>,
    body: Array<any>,
    title = 'Titulo',
    sheetName = 'Sheet1',
  ): Buffer => {
    const workbook = utils.book_new();

    workbook.Props = {
      Title: title,
      Subject: sheetName,
      Author: 'SmartCORE v2',
      CreatedDate: new Date(),
    };
    const sheet: WorkSheet = utils.aoa_to_sheet([[title], header, ...body]);

    /* ------- TITLE -------*/
    // Merge cells title and center
    sheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: header.length - 1 } },
    ];

    // Set style for title
    sheet.A1.s = {
      font: { sz: 16, bold: true },
      alignment: { horizontal: 'center', vertical: 'center' },
    };

    /* ------- HEADERS -------*/
    // Size of headers
    const colWidths = header.map((col) => col.length);
    // Apply size to headers
    sheet['!cols'] = header.map((_, index) => ({ wch: colWidths[index] + 2 }));

    // Generate cells for headers
    const cells = [];
    for (let i = 0; i < header.length; i++) {
      cells.push(`${String.fromCharCode(65 + i)}2`);
    }

    // Set style for header
    cells.forEach((cell) => {
      sheet[cell].s = {
        font: { bold: true, sz: 12, color: { rgb: 'FFFFFF' } },
        fill: {
          patternType: 'solid',
          fgColor: { rgb: '00023047' },
          bgColor: { rgb: '00023047' },
        },
        alignment: { horizontal: 'center', vertical: 'center' },
      };
    });

    utils.book_append_sheet(workbook, sheet, sheetName);

    const buffer: Buffer = write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
    });

    return buffer;
  };

  /**
   * @description: Get headers from sheet
   * @param workbook
   * @param sheetName
   * @returns {Array<any>}
   */
  getSheetHeaders = (workbook: WorkBook, sheetName?: string): Array<any> => {
    if (!sheetName) sheetName = workbook.SheetNames[0];

    if (!workbook.SheetNames.includes(sheetName)) {
      throw new Error(`Sheet [ ${sheetName} ] not found`);
    }
    const sheet = workbook.Sheets[sheetName];
    const headers = [];
    const range = utils.decode_range(sheet['!ref'] ? sheet['!ref'] : 'A1:A1');
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell = sheet[utils.encode_cell({ c: C, r: 0 })];
      if (cell) {
        headers.push(cell.v);
      }
    }
    return headers;
  };
}
