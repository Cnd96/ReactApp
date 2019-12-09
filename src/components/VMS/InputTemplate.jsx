import React from 'react';
import XLSX from 'xlsx';
import './VmsContainer.styles.scss'
import './uploadButton.styles.scss'
import inputTemplateNumbers from './inputTemplateRowNos'
import BackupIcon from '@material-ui/icons/Backup';

export default class InputTemplate extends React.Component {
  handleFile=(file)=> {
    this.props.isInputTemplateClicked();
    const readingSheetName='Sheet1'
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = async(e) => {
        const bstr = e.target.result;
        const wb =await XLSX.read(bstr, {type:rABS ? 'binary' : 'array'});
       
        const Sheet1 = wb.Sheets[readingSheetName];
        if(Sheet1==null){
            this.props.getInputTemplateData(false) 
            alert("Wrong sheet")
        }
        else{
             /* Convert sheet1 array of arrays */
            const sheet1Data =await XLSX.utils.sheet_to_json(Sheet1, {header:1});
            const headersLength=sheet1Data[2].length;
        
            const {inputSheetPPSampleReadyIndex,inputSheetCriticalMaterialExpectedIndex,
                inputSheetCriticalMaterialActualIndex,inputSheetStartCuttingExpectedIndex,
                inputSheetStartCuttingActualIndex,inputSheetSewingStartDateExpectedIndex,
                inputSheetStartSewingDateActualIndex,inputSheetStartWashingExpectedIndex,
                inputSheetStartWashingActualIndex,inputSheetGarmentTestDAteIndex,
                inputSheetStartPackingExpectedIndex,inputSheetStartPackingActualIndex,
                inputSheetFinalInspectionExpectedIndex,inputSheetFinalInspectionActualIndex,
                inputSheetACDateOriginalIndex,inputSheetACDateOriginalExpectedIndex,
                inputSheetACDateExpectedIndex,inputSheetACDateActualIndex}=inputTemplateNumbers
                
                for(let i=3;i<sheet1Data.length;i++){
                   //Converting date of excel to date format if it is a number 
                    if(!isNaN(sheet1Data[i][inputSheetACDateOriginalExpectedIndex])){
                        sheet1Data[i][inputSheetACDateOriginalExpectedIndex]=this.convertExcelDateToJsLocaleDateString(sheet1Data[i][inputSheetACDateOriginalExpectedIndex])
                    }
                
                    if(!isNaN(sheet1Data[i][inputSheetACDateExpectedIndex])){
                        sheet1Data[i][inputSheetACDateExpectedIndex]=this.convertExcelDateToJsLocaleDateString(sheet1Data[i][inputSheetACDateExpectedIndex])
                    }
                    if(!isNaN(sheet1Data[i][inputSheetACDateActualIndex])){
                        sheet1Data[i][inputSheetACDateActualIndex]=this.convertExcelDateToJsLocaleDateString(sheet1Data[i][inputSheetACDateActualIndex])
                    }

                    if(!isNaN(sheet1Data[i][inputSheetStartPackingActualIndex])){
                        sheet1Data[i][inputSheetStartPackingActualIndex]=this.convertExcelDateToJsLocaleDateString(sheet1Data[i][inputSheetStartPackingActualIndex])
                    }
                    if(!isNaN(sheet1Data[i][inputSheetFinalInspectionExpectedIndex])){
                        sheet1Data[i][inputSheetFinalInspectionExpectedIndex]=this.convertExcelDateToJsLocaleDateString(sheet1Data[i][inputSheetFinalInspectionExpectedIndex])
                    }

                    if(!isNaN(sheet1Data[i][inputSheetFinalInspectionActualIndex])){
                        sheet1Data[i][inputSheetFinalInspectionActualIndex]=this.convertExcelDateToJsLocaleDateString(sheet1Data[i][inputSheetFinalInspectionActualIndex]) 
                    }


                    if(!isNaN(sheet1Data[i][inputSheetACDateOriginalIndex])){
                        sheet1Data[i][inputSheetACDateOriginalIndex]=this.convertExcelDateToJsLocaleDateString(sheet1Data[i][inputSheetACDateOriginalIndex])
                    }


                    if(!isNaN(sheet1Data[i][inputSheetGarmentTestDAteIndex])){
                        sheet1Data[i][inputSheetGarmentTestDAteIndex]=this.convertExcelDateToJsLocaleDateString(sheet1Data[i][inputSheetGarmentTestDAteIndex])
                    }

                    if(!isNaN(sheet1Data[i][inputSheetStartPackingExpectedIndex])){
                        sheet1Data[i][inputSheetStartPackingExpectedIndex]=this.convertExcelDateToJsLocaleDateString(sheet1Data[i][inputSheetStartPackingExpectedIndex])
                    }

                    if(!isNaN(sheet1Data[i][inputSheetStartWashingExpectedIndex])){
                        sheet1Data[i][inputSheetStartWashingExpectedIndex]=this.convertExcelDateToJsLocaleDateString(sheet1Data[i][inputSheetStartWashingExpectedIndex])
                    }

                    if(!isNaN(sheet1Data[i][inputSheetStartWashingActualIndex])){
                        sheet1Data[i][inputSheetStartWashingActualIndex]=this.convertExcelDateToJsLocaleDateString(sheet1Data[i][inputSheetStartWashingActualIndex])
                    }

                    if(!isNaN(sheet1Data[i][inputSheetPPSampleReadyIndex])){
                        sheet1Data[i][inputSheetPPSampleReadyIndex]=this.convertExcelDateToJsLocaleDateString(sheet1Data[i][inputSheetPPSampleReadyIndex])
                    }

                    if(!isNaN(sheet1Data[i][inputSheetCriticalMaterialExpectedIndex])){
                        sheet1Data[i][inputSheetCriticalMaterialExpectedIndex]=this.convertExcelDateToJsLocaleDateString(sheet1Data[i][inputSheetCriticalMaterialExpectedIndex])
                    }

                    if(!isNaN(sheet1Data[i][inputSheetCriticalMaterialActualIndex])){
                        sheet1Data[i][inputSheetCriticalMaterialActualIndex]=this.convertExcelDateToJsLocaleDateString(sheet1Data[i][inputSheetCriticalMaterialActualIndex])
                    }

                    if(!isNaN(sheet1Data[i][inputSheetStartCuttingExpectedIndex])){
                        sheet1Data[i][inputSheetStartCuttingExpectedIndex]=this.convertExcelDateToJsLocaleDateString(sheet1Data[i][inputSheetStartCuttingExpectedIndex])
                    }

                    if(!isNaN(sheet1Data[i][inputSheetStartCuttingActualIndex])){
                        sheet1Data[i][inputSheetStartCuttingActualIndex]=this.convertExcelDateToJsLocaleDateString(sheet1Data[i][inputSheetStartCuttingActualIndex])
                    }

                    if(!isNaN(sheet1Data[i][inputSheetSewingStartDateExpectedIndex])){
                        sheet1Data[i][inputSheetSewingStartDateExpectedIndex]=this.convertExcelDateToJsLocaleDateString(sheet1Data[i][inputSheetSewingStartDateExpectedIndex])
                    }

                    if(!isNaN(sheet1Data[i][inputSheetStartSewingDateActualIndex])){
                        sheet1Data[i][inputSheetStartSewingDateActualIndex]=this.convertExcelDateToJsLocaleDateString(sheet1Data[i][inputSheetStartSewingDateActualIndex])
                    }    
                    
                    for(let j=0;j<headersLength;j++){
                        if(sheet1Data[i][j]==null){
                            sheet1Data[i][j]=""
                        }
                    }   
                    
                }
            
            const sheet1SplittedData={
                sheetName:readingSheetName,
                headers:sheet1Data[2],
                dataRows:sheet1Data.slice(3,sheet1Data.length+1)
            }
            this.props.getInputTemplateData(sheet1SplittedData) 
        }
        
        
    };
    if(rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
};

convertExcelDateToJsLocaleDateString(dateSerialNumber){
    const utc_days  = Math.floor(dateSerialNumber - 25569);
    const utc_value = utc_days * 86400;                                        
    return new Date(utc_value * 1000).toLocaleDateString();
}

render() { 
    return (
        <div>
            <div className="container">
                <div className="col-xs-12">
                    <DataInput className="btn" handleFile={this.handleFile} />
                </div>
            </div>
            <div className="container">
                <div className="col-xs-12">
                    {/* <button
                    //  disabled={!this.state.data.length} 
                    className="btn btn-success" onClick={this.exportFile}>Download</button> */}
                </div>
            </div>
        </div> 
    ); 
};
};

class DataInput extends React.Component {
constructor(props) {
    super(props);
};
handleChange=(e)=> {
    const files = e.target.files;
    if(files && files[0]) this.props.handleFile(files[0]);
};
render() { return (
    <form className="form-inline">
        <div >
            <label className="uploadButton" >  
                <BackupIcon style={{width:'5vw',height:'5vw'}}></BackupIcon>
            <input type="file" style={{display:'none'}} className="form-control " id="file" accept={SheetJSFT} onChange={this.handleChange} />
            </label>
            
        </div>
     </form>
); };
}

const SheetJSFT = ["xlsx", "xlsb", "xlsm", "xls"].map(function(x) { return "." + x; }).join(",");
