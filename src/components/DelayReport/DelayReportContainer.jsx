import React from 'react';
import XLSX from 'xlsx';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import Header from '../../components/Header/Header'
import {doSheetColumnNumbers,poSheetColumnNumbers} from './doAndPoSheetColumnNumbers';
import {delayReportTemplate,merge,wscols,wsrows} from './delayReportTemplate'
import {wsSkucols,skuRowDetails,skuMerge} from './skuDetailsTemplate'
import DateCalculations from '../../_services/DateCalculationClass'
import ThemeContext from '../../context/ThemeContext'

import DataInputComponent from '../DataInputComponent/DataInpuComponent'

export default class DelayReportContainer extends React.Component {
  constructor(){
		super();
		this.state = {
            appName:'EBBU Delay Report',
            doSheetDataRows:[],
            uniqueDoNumbers:[],
            selectedDoDatas:[],
            selectedDoNumber:'',
            poSheetDataRows:[],
            sheetsUploadingStatus:'Upload Sheet'
        };
  }
async componentDidMount (){

    const belAppsToken=await localStorage.getItem('belAppsToken');
    if(!belAppsToken){
      this.props.history.push('/')
    }
    
};

handleFile=async(file)=> {
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    this.setState({sheetsUploadingStatus:'Uploading...'})
    this.resetState()
    reader.onload =async (e) => {
        /* Parse data */
        const bstr = e.target.result;
        const wb =await XLSX.read(bstr, {type:rABS ? 'binary' : 'array'});

        if(!(wb.Sheets['ExcelOut(DO)'])){
            alert("No Sheet Named ExcelOut(DO)")
            this.setState({sheetsUploadingStatus:'Wrong Sheet Uploaded'})
        }
        else if(!(wb.Sheets['ExcelOut(PO)'])){
            alert("No Sheet Named ExcelOut(DO)")
            this.setState({sheetsUploadingStatus:'Wrong Sheet Uploaded'})
        }
        else {
            const doSheet = wb.Sheets['ExcelOut(DO)'];
            const poSheet = wb.Sheets['ExcelOut(PO)'];
            const doSheetData = XLSX.utils.sheet_to_json(doSheet, {header:1});
            const poSheetData = XLSX.utils.sheet_to_json(poSheet, {header:1});
            
             //Extracting data rows excluding headers
            const doSheetDataRows=doSheetData.splice(1,doSheetData.length);
            const doNumbersInDoSheet=doSheetDataRows.map(row=>row[doSheetColumnNumbers.doNo]);
            let uniqueDoNumbers=[];

            const poSheetDataRows=poSheetData.splice(1,poSheetData.length);
        

            doNumbersInDoSheet.forEach(doNumber => {
                doNumber=doNumber.trim()
                if(uniqueDoNumbers.findIndex(uniqueDoNumber=>uniqueDoNumber.doNumber==doNumber)<0){
                    let doDataToPush={
                        doNumber:doNumber,
                        isChecked:false,
                        actualExfDate:new Date().toISOString(),
                        plantEtaWhDate:new Date()
                    }
                    uniqueDoNumbers.push(doDataToPush) 
                }
            });
            this.setState({uniqueDoNumbers,doSheetDataRows,poSheetDataRows})
       }    
    };
    if(rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
};

handleDoNumberChange=(event)=>{
    const { value, name } = event.target;
    this.setState({[name]: value});
}

handleOnDoNumberChecked=async(event)=>{
    //value equals selected do number
    const {value} =event.target;
    const {uniqueDoNumbers,doSheetDataRows,selectedDoDatas}=this.state;
    const {doNo}=doSheetColumnNumbers
    const triggeredDoNumberIndex=uniqueDoNumbers.findIndex(uniqueDoNumber=>uniqueDoNumber.doNumber==value)

    uniqueDoNumbers[triggeredDoNumberIndex].isChecked=!uniqueDoNumbers[triggeredDoNumberIndex].isChecked;
    const {isChecked,actualExfDate,plantEtaWhDate}=uniqueDoNumbers[triggeredDoNumberIndex]

    if(isChecked){
        const relevantDoLinesInDoSheet=doSheetDataRows.filter(doSheetDataRow=>doSheetDataRow[doNo]===value)
        const relevantPoNumber=relevantDoLinesInDoSheet[0][doSheetColumnNumbers.orderNo]
        selectedDoDatas.push({doNumber:value,relevantDoLinesInDoSheet,actualExfDate:actualExfDate,
            poNumber:relevantPoNumber,plantEtaWhDate:plantEtaWhDate})   
    }
    else{
        const indexOfRelevantDoInSelectedDos=selectedDoDatas.findIndex(doData=>doData.doNumber==value)
        selectedDoDatas.splice(indexOfRelevantDoInSelectedDos,1);   
    }
    await this.setState({uniqueDoNumbers,selectedDoDatas})

}

handelOnActualExfDateChange=async(event,doNumber)=>{
    const {value}=event.target
    const {selectedDoDatas,uniqueDoNumbers}=this.state;
    const triggeredDoNumberIndex=uniqueDoNumbers.findIndex(uniqueDoNumber=>uniqueDoNumber.doNumber==doNumber);
    uniqueDoNumbers[triggeredDoNumberIndex].actualExfDate=value;
    const indexOfRelevantDoInSelectedDos=selectedDoDatas.findIndex(doData=>doData.doNumber==doNumber);
    selectedDoDatas[indexOfRelevantDoInSelectedDos].actualExfDate=value
    await this.setState({uniqueDoNumbers,selectedDoDatas})
}

handelOnPlantEtAWhDateChange=async(event,doNumber)=>{
    const {value}=event.target
    const {selectedDoDatas,uniqueDoNumbers}=this.state;
    const triggeredDoNumberIndex=uniqueDoNumbers.findIndex(uniqueDoNumber=>uniqueDoNumber.doNumber==doNumber);
    uniqueDoNumbers[triggeredDoNumberIndex].plantEtaWhDate=value;
    const indexOfRelevantDoInSelectedDos=selectedDoDatas.findIndex(doData=>doData.doNumber==doNumber);
    selectedDoDatas[indexOfRelevantDoInSelectedDos].plantEtaWhDate=value
    await this.setState({uniqueDoNumbers,selectedDoDatas})
   
}

onDownloadClick=async()=>{
    const {poSheetDataRows,selectedDoDatas}=this.state;
    const {quantity,qtyPerSet,wareHouse}=doSheetColumnNumbers
    const {poSheetOrderNo,year,planningSsn,itemCode,bussinesUnit,
           item,representativeSampleCode,orderQtypcs,contractedEtd,
           etaWH,managementFactoryCode}=poSheetColumnNumbers

    selectedDoDatas.forEach(doData=>{
      const relatedPolines=poSheetDataRows.filter(poData=>poData[poSheetOrderNo]==doData.poNumber);
      const doOrderQuantity=doData.relevantDoLinesInDoSheet.reduce((sum, doLine) => sum + (doLine[quantity]*doLine[qtyPerSet]), 0)

      doData.doOrderQuantity=doOrderQuantity
      doData.wareHouse=doData.relevantDoLinesInDoSheet[0][wareHouse]
      doData.plantEtaWhDate=new Date(doData.plantEtaWhDate).toLocaleDateString();
      doData.actualExfDate=new Date(doData.actualExfDate).toLocaleDateString();
     
      if(relatedPolines.length>0){
        const poOrderQuantity = relatedPolines.reduce((sum, poLine) => sum + poLine[orderQtypcs], 0);
        
        doData.poOrderQuantity=poOrderQuantity
        doData.year=relatedPolines[0][year]
        doData.Ssn=relatedPolines[0][planningSsn]
        doData.GDept=relatedPolines[0][itemCode].slice(0,2)
        doData.Biz=relatedPolines[0][bussinesUnit]
        doData.itemCode=relatedPolines[0][itemCode]
        doData.item=relatedPolines[0][item]
        doData.sampleCode=relatedPolines[0][representativeSampleCode]
        doData.managementFactoryCode=relatedPolines[0][managementFactoryCode]

        const contractedEtdDateSerial=relatedPolines[0][contractedEtd]
        const contractedEtdDate=DateCalculations.convertExcelDateToJsLocaleDateString(contractedEtdDateSerial)
        const contractedEtdDateMinusFour=DateCalculations.deductDaysExcludingWeekEnd(contractedEtdDate,4)

        const poWhDateSerial=relatedPolines[0][etaWH]
        const poWhDate=DateCalculations.convertExcelDateToJsLocaleDateString(poWhDateSerial)

        doData.poWh=poWhDate.toLocaleDateString();
        doData.planExf=contractedEtdDateMinusFour.toLocaleDateString();

        doData.whDelayDays=DateCalculations.calculateDifferenceBetweenDays(new Date(doData.poWh),new Date(doData.plantEtaWhDate))
      }
    })
    this.exportDelayReport()
}
resetState=()=>{
    this.setState({doSheetDataRows:[],uniqueDoNumbers:[], selectedDoDatas:[],selectedDoNumber:'',poSheetDataRows:[]})
}
exportDelayReport=()=>{
    const {selectedDoDatas}=this.state;
    const wb = XLSX.utils.book_new();

    let delayReportTemplateToCreate=[...delayReportTemplate]
    selectedDoDatas.forEach(doData=>{
        const {doOrderQuantity,poOrderQuantity,poNumber,doNumber, year,
            Ssn,GDept,Biz,item,itemCode,sampleCode,planExf,actualExfDate,
            poWh,managementFactoryCode,wareHouse,plantEtaWhDate,whDelayDays} =doData

        const {setCode,size,quantity,qtyPerSet} =doSheetColumnNumbers
        const doDataToPush=[year,Ssn,GDept,Biz,,,itemCode,item,,,sampleCode,poNumber,doNumber,
            poOrderQuantity,doOrderQuantity,0,doOrderQuantity,planExf,actualExfDate,poWh,plantEtaWhDate,whDelayDays,"C",managementFactoryCode,wareHouse]

        delayReportTemplateToCreate.push(doDataToPush)

        const skuDetailsTemplate=[
            [],
            ['','Item Code',''],
            ['','Item Name(Local)',''],
            ['','Sample No.',''],
            ['','DO No.',''],
            ['','ETA W/H',''],
            ['','DO Quantity',''],
            [],
            ['','Set Name','Size','SKU','DO数量 \n DO QTTY (packs)','Delay qty (packs) (Assort)','Delay qty (packs) (SOLID)','Total Delay Qty (packs)']
        ]
        
        skuDetailsTemplate[skuRowDetails.itemCode][3]=itemCode
        skuDetailsTemplate[skuRowDetails.itemname][3]=item
        skuDetailsTemplate[skuRowDetails.sampleNo][3]=sampleCode
        skuDetailsTemplate[skuRowDetails.doNo][3]=doNumber
        skuDetailsTemplate[skuRowDetails.etaWH][3]=poWh
        skuDetailsTemplate[skuRowDetails.doQuantity][3]=doOrderQuantity.toString()

        doData.relevantDoLinesInDoSheet.forEach(line=>{
            const doQuantityPacks=line[quantity]*line[qtyPerSet]
            if(line[setCode].includes('-')){
                skuDetailsTemplate.push(['',line[setCode],line[size],'000',doQuantityPacks,0,doQuantityPacks,doQuantityPacks])
            }
            else{
                skuDetailsTemplate.push(['',line[setCode],line[size],'000',doQuantityPacks,doQuantityPacks,0,doQuantityPacks])
            }
        })

        const wsSku = XLSX.utils.aoa_to_sheet(skuDetailsTemplate);
        wsSku['!cols'] = wsSkucols;
        wsSku["!merges"] = skuMerge;
        XLSX.utils.book_append_sheet(wb, wsSku, doNumber);
        
    })

    const ws = XLSX.utils.aoa_to_sheet(delayReportTemplateToCreate);
    ws['!rows'] = wsrows;
    ws['!cols'] = wscols;
    ws["!merges"] = merge;

    XLSX.utils.book_append_sheet(wb, ws, 'Delay');
    XLSX.writeFile(wb, "Delay Report.xlsx")
    this.resetState()
    this.setState({sheetsUploadingStatus:'Upload Input Sheets'})
}

static contextType = ThemeContext;
render() { 
    console.log(this.state)
    const filtereduniqueDoNumbers =this.state.uniqueDoNumbers.filter(uniqueDoNumber=>uniqueDoNumber.doNumber.includes(this.state.selectedDoNumber)).splice(0,5)
    return (
        <div>
            <Header dayTimeClass={this.context.dayTimeClass} appName={this.state.appName} timeOfDay={this.context.timeOfDay} />
            {
                this.state.uniqueDoNumbers.length>0?
                <div className="container" >
                     <div  style={{marginBottom:'2vw',marginTop:'5vw'}}>
                        <Grid container >
                            <Grid item xs={8}>
                                <DataInputComponent classes="btn btn-info"handleFile={this.handleFile}buttonName="Upload" iconSize='2vw'  />
                            </Grid>
                            <Grid item xs={4} >
                                <button className="btn btn-success" disabled={!(this.state.selectedDoDatas.length>0)} style={{float:'right'}} 
                                onClick={this.onDownloadClick}>Download</button>
                            </Grid>
                        </Grid>
                     </div>
                    <Grid container >
                        <Grid item xs={8}>
                        <table align="center" className="table table-bordered">
                            <thead>
                                <tr>
                                <th> 
                                    <input  name='selectedDoNumber' 
                                    placeholder="Search Do"
                                    type='text' 
                                    onChange={this.handleDoNumberChange}
                                    value={this.state.selectedDoNumber}></input>
                                </th>
                                <th>Actual EXF</th>
                                <th>Plan ETA WH</th>
                                <th>Select</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    filtereduniqueDoNumbers.map(
                                        ({doNumber,isChecked,actualExfDate,plantEtaWhDate}) =>
                                        <tr key={doNumber}>
                                            <td>
                                                {doNumber}
                                            </td>
                                            <td  style={{height:'3vw'}}> 
                                             <input style={{height:'2.7vw',float:"right"}} 
                                                disabled={!isChecked}
                                                value={actualExfDate}
                                                onChange={(event)=>this.handelOnActualExfDateChange(event,doNumber)}
                                                name='date' type='date'
                                                className="form-control"/>
                                            </td>
                                            <td style={{height:'3vw'}}>
                                             <input style={{height:'2.7vw',float:"right"}} 
                                                disabled={!isChecked}
                                                value={plantEtaWhDate}
                                                onChange={(event)=>this.handelOnPlantEtAWhDateChange(event,doNumber)}
                                                name='date' type='date'
                                                className="form-control"/>
                                            </td>
                                            <td>
                                            <Checkbox
                                                defaultChecked={isChecked}
                                                onChange={this.handleOnDoNumberChecked}
                                                value={doNumber}
                                                color="primary"
                                            />
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>                                    
                        </table>
                        </Grid>
                        <Grid item xs={4} >
                            <ul style={{float:'right'}}>
                                {
                                    this.state.selectedDoDatas.map(
                                        ({doNumber,actualExfDate,planttaWhDate}) =>
                                        <li key={doNumber}>
                                            {doNumber}
                                        </li>
                                    )
                                }
                            </ul>     
                        </Grid>
                    </Grid>
                </div>:<DelayReportUploadContainer sheetsUploadingStatus={this.state.sheetsUploadingStatus} handleFile={this.handleFile}/>   
            }
            <div>
        </div>
        </div>
    ); 
 };
};

const DelayReportUploadContainer = (props) => (
    <div className="container" style={{marginBottom:'2vw',marginTop:'10vw',border:'0.5px solid #D3D3D3',padding:'2vw',
            borderRadius:"5px",backgroundColor:"white",boxShadow:"0px 2px 2px #D3D3D3",width:'30vw'}}>
        <h6 style={{textAlign:"center",fontFamily:'Public Sans, sans-serif',marginBottom:'2vw'}}>{props.sheetsUploadingStatus}</h6> 
        <div style={{margin:"auto",width:"27%"}}>
          <DataInputComponent classes="excelUploadButton" handleFile={props.handleFile} buttonName="" iconSize='5vw'/>
        </div>
    </div>
);