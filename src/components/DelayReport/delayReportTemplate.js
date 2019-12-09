let thirdRow=[];
    thirdRow[13]='PO'
    thirdRow[14]='遅延DO'
    thirdRow[15]='遅延DO'
    thirdRow[16]='遅延DO'
    thirdRow[25]='↓'
    thirdRow[31]='↓'
    thirdRow[32]='↓'
    thirdRow[33]='↓'
    thirdRow[34]='↓'
    thirdRow[35]='↓'

let fourthRow=[];
    fourthRow[13]='発注数量'
    fourthRow[14]='発注数量'
    fourthRow[15]='入庫済数量'
    fourthRow[16]='今回輸送数量'
    fourthRow[26]='Person In Charge'
    fourthRow[31]='Input Area'
    

const fifthRow=['Year','Ssn','G Dept','Biz','Planning Sum Code','Planning Sum Name','Item Code','Item','Sales Start Date',
    'Sales End Date','Sample Code','PO No.','DO No_','PO Order Qty(pcs)','DO Order Qty(pcs)','WH Received Qty(pcs) DO','Shipment Qty(Delay pcs) DO',
    'Plan EXF','Actual EXF','PO WH','Plan ETA WH','WH Delay Days','Transport Method','Management Factory','Warehouse','Delay Reason','Production SV',
    'Production Leader','Production Planning','Logistics','DC','Need Overseas Merchandising Planning Confirm(※Input by Production Director/Leader)',
    'Impact on Business(※Input by Oversea Merchandising Planning)','Priority(※Input by Oversea Merchandising Planning)',
    'Acceptable WH Date(※Input by Oversea Merchandising Planning)','Fixed or Not(※Input by Production  PIC or Oversea Merchandising Planning)']

export const delayReportTemplate=[
        ['DeliveryDelayReport'],
        [],
        thirdRow,
        fourthRow,
        fifthRow
    ]

export const merge = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
        { s: { r: 3, c: 26 }, e: { r: 3, c: 30 } },
        { s: { r: 3, c: 31}, e: { r: 3, c: 35 } },
    ];

export const wscols = [
        {wch:5},//year
        {wch:5},
        {wch:7},
        {wch:5},
        {wch:10},//Planning Sum Code
        {wch:10},
        {wch:16},//Item code
        {wch:20},//Item
        {wch:8},
        {wch:8},
        {wch:12},//Sample code
        {wch:18},//Po Number
        {wch:20},//Do Number
        {wch:8},
        {wch:8},
        {wch:8},
        {wch:8},//Shipment qty
        {wch:10},//Plan exf
        {wch:10},
        {wch:10},
        {wch:10},
        {wch:10},//WH delay days
        {wch:8},
        {wch:8},
        {wch:22},//Warehouse
    ];

export const wsrows = [
        {hpt:20},
        {hpt:20},
        {hpt:20},
        {hpt:20},
        {hpt:60},
    ];