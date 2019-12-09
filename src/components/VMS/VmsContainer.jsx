import React from 'react';
import InputTemplate from './InputTemplate';
import OrderBook from './OrderBook';
import XLSX from 'xlsx';
import Grid from '@material-ui/core/Grid';
import './VmsContainer.styles.scss'

import orderBookRowNumbers from './orderBookRowNos'
import inputTemplateRowNumbers from './inputTemplateRowNos'
import OrderBookServices from '../../_services/orderBook'
import WareHouseServices from '../../_services/warehouse'

import Header from '../../components/Header/Header'
import ThemeContext from '../../context/ThemeContext'

import HelpOutlinedIcon from '@material-ui/icons/HelpOutlined';
import CheckCircleSharpIcon from '@material-ui/icons/CheckCircleSharp';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import GetAppIcon from '@material-ui/icons/GetApp';

import DateCalculations from '../../_services/DateCalculationClass'


export default class VmsContainer extends React.Component {
  constructor(){
		super();
		this.state = {
            inputSheetName:'',
            inputTemplateDataValidity:'',
            orderBookName:'',
            orderBookDataValidity:'',
            submitButton:true,
            getOrderBookDataStatus:false,
            inputTemplateStatus:"Input Template " ,
            orderBookStatus:"Order Book " ,
            inputTemplateStatusColor:"#ffc107",
            orderBookStatusColor:"#ffc107",
            warehouses:[]
        };
        this.inputSheetData={};
        this.orderBookData={};
  }
  async componentDidMount(){
    this.setState({orderBookDataValidity:'pending',inputTemplateDataValidity:'pending'})
    const warehouses=await WareHouseServices.getAllWarehouses();
    this.setState({warehouses:warehouses})
  }

  getInputTemplateData=async(inputSheetData)=>{
      if(inputSheetData===false){
        this.inputSheetData={}
        await  this.setState({inputTemplateDataValidity:'false',
            inputTemplateStatusColor:"#f86c6b",inputTemplateStatus:"Failed Input Template "})
      }
      else{
          this.inputSheetData=inputSheetData
          await this.setState({inputTemplateDataValidity:'done',
           inputTemplateStatusColor:"#4dbd74",
           inputTemplateStatus:"Uploaded Input Template ",
           inputSheetName:inputSheetData.sheetName})  
      }
      this.checkDownloadButtonValidity();
  }
  getOrderBookData=async(orderBookData)=>{
    if(orderBookData===false){
        await this.setState({orderBookDataValidity:'false'})
    }
    else{
        this.orderBookData=orderBookData
        await this.setState({orderBookDataValidity:'done',
        orderBookStatus:"Uploaded Order Book",
        orderBookStatusColor:"#4dbd74",
        orderBookName:orderBookData.sheetName})     
    }
    this.checkDownloadButtonValidity();
 }

 checkDownloadButtonValidity=()=>{
    if(this.state.inputTemplateDataValidity=='done'&&this.state.orderBookDataValidity=='done'){
        this.setState({submitButton:false})
    }
    else{
        this.setState({submitButton:true})
    }
 }

getSchedule=async()=> {
    this.setState({submitButton:false})
    const inputSheetMasterPoIndex=2
    const inputSheetMasterStyleIndex=15
    const inputSheetColorCodeIndex=17
    const inputSheetCutStartQtyIndex=37
    const inputSheetQuanityIndex=29
    const inputSheetWIPStatusIndex=57
    const inputSheetActualShippedQtyIndex=55

    let scheduleAndLocationData=[]
    
    for(let i=0;i<this.inputSheetData.dataRows.length;i++){
        const inputSheetMasterPo=this.inputSheetData.dataRows[i][inputSheetMasterPoIndex];
        let inputSheetMasterStyle=this.inputSheetData.dataRows[i][inputSheetMasterStyleIndex].trim();
        const inputSheetColorCode=this.inputSheetData.dataRows[i][inputSheetColorCodeIndex];
        const inputSheetQuantity=Number(this.inputSheetData.dataRows[i][inputSheetQuanityIndex]);
        let minimunOrderBookCutQuantity=9007199254740992;
        let minimumOrderBookSewingInQuantity=9007199254740992;
        let orderBookQuantity=0;
        let packMethod=1;
        let scheduleNo='';
        let productionWareHouse='';
        let deliveryDate='';
        let deliveredQty=0;

        this.orderBookData.dataRows.forEach(orderBooksRow=>{
            if(orderBooksRow[2].includes("belpvh")){
                if(orderBooksRow[orderBookRowNumbers.orderBookMasterPoIndex]==inputSheetMasterPo&&
                    orderBooksRow[orderBookRowNumbers.orderBookMasterStyleIndex]==inputSheetMasterStyle&&
                    orderBooksRow[orderBookRowNumbers.orderBookColorCodeIndex]==inputSheetColorCode
                    ){
                    orderBookQuantity+=Number(orderBooksRow[orderBookRowNumbers.orderBookQuantityIndex])
                    packMethod=Number(orderBooksRow[orderBookRowNumbers.PackMethodRowNumber].trim()[0])  
                    scheduleNo=orderBooksRow[orderBookRowNumbers.orderBookScheduleIndex]
                    productionWareHouse=orderBooksRow[orderBookRowNumbers.orderBookProductionWareHouseIndex];
                    deliveryDate=orderBooksRow[orderBookRowNumbers.orderBookPlanDeliveryDateIndex];
                    deliveredQty=orderBooksRow[orderBookRowNumbers.deliveredQty];
                    
                    if(minimunOrderBookCutQuantity>Number(orderBooksRow[orderBookRowNumbers.orderBookCUMCUTQTYIndex])){
                        minimunOrderBookCutQuantity=Number(orderBooksRow[orderBookRowNumbers.orderBookCUMCUTQTYIndex])   
                    }
                    if(minimumOrderBookSewingInQuantity>Number(orderBooksRow[orderBookRowNumbers.orderBookCUMSEWINQTYIndex])){
                        minimumOrderBookSewingInQuantity=Number(orderBooksRow[orderBookRowNumbers.orderBookCUMSEWINQTYIndex])
                    }   
                }
            }
            else if(orderBooksRow[2].includes("belwgck")){
                let inputSheetMasterStyleForCK=inputSheetMasterStyle;
                while(inputSheetMasterStyleForCK.charAt(0) == '0')
                {
                    inputSheetMasterStyleForCK = inputSheetMasterStyleForCK.substr(1);
                }
                if(orderBooksRow[orderBookRowNumbers.orderBookMasterPoIndex]==inputSheetMasterPo&&
                    orderBooksRow[orderBookRowNumbers.orderBookMasterStyleIndex]==inputSheetMasterStyleForCK&&
                    orderBooksRow[orderBookRowNumbers.orderBookColorCodeIndex]==inputSheetColorCode
                    ){
                    orderBookQuantity+=Number(orderBooksRow[orderBookRowNumbers.orderBookQuantityIndex])
                    packMethod=Number(orderBooksRow[orderBookRowNumbers.orderBookItemDescriptionIndex].trim()[0])
                    scheduleNo=orderBooksRow[orderBookRowNumbers.orderBookScheduleIndex]
                    productionWareHouse=orderBooksRow[orderBookRowNumbers.orderBookProductionWareHouseIndex]
                    deliveredQty=orderBooksRow[orderBookRowNumbers.deliveredQty];

                    deliveryDate=orderBooksRow[orderBookRowNumbers.orderBookPlanDeliveryDateIndex] ;
                    if(minimunOrderBookCutQuantity>Number(orderBooksRow[orderBookRowNumbers.orderBookCUMCUTQTYIndex])){
                        minimunOrderBookCutQuantity=Number(orderBooksRow[orderBookRowNumbers.orderBookCUMCUTQTYIndex])
                        
                    }
                    if(minimumOrderBookSewingInQuantity>Number(orderBooksRow[orderBookRowNumbers.orderBookCUMSEWINQTYIndex])){
                        minimumOrderBookSewingInQuantity=Number(orderBooksRow[orderBookRowNumbers.orderBookCUMSEWINQTYIndex])
                    }    
                }
            }    
        })

        if((orderBookQuantity/packMethod)==inputSheetQuantity){
           // pushing schedule number warehouse deliver date of matching rows to input template
           this.inputSheetData.dataRows[i][inputTemplateRowNumbers.inputSheetScheduleIndex]=scheduleNo;
           this.inputSheetData.dataRows[i][inputTemplateRowNumbers.inputSheetWareHouseIndex]=productionWareHouse;
           this.inputSheetData.dataRows[i][inputTemplateRowNumbers.inputSheetDeliveryDateIndex]=deliveryDate;
            
           scheduleAndLocationData.push(scheduleNo)
            this.inputSheetData.dataRows[i][inputSheetActualShippedQtyIndex]=deliveredQty;
            if(minimunOrderBookCutQuantity<900719925474099){
                this.inputSheetData.dataRows[i][inputSheetCutStartQtyIndex]=minimunOrderBookCutQuantity
            }
            else{
                this.inputSheetData.dataRows[i][inputSheetCutStartQtyIndex]=0;
            }
        }

        let closedorderBookQuantity=0
        let closedpackMethod=1;

        this.orderBookData.closedRows.forEach(orderBookClosedRow=>{
            if(orderBookClosedRow[2].includes("belpvh")){
                if(orderBookClosedRow[orderBookRowNumbers.orderBookMasterPoIndex]==inputSheetMasterPo&&
                    orderBookClosedRow[orderBookRowNumbers.orderBookMasterStyleIndex]==inputSheetMasterStyle&&
                    orderBookClosedRow[orderBookRowNumbers.orderBookColorCodeIndex]==inputSheetColorCode
                    ){

                    closedorderBookQuantity+=Number(orderBookClosedRow[orderBookRowNumbers.orderBookQuantityIndex])
                    closedpackMethod=Number(orderBookClosedRow[orderBookRowNumbers.PackMethodRowNumber].trim()[0])  
                }
            }
            else if(orderBookClosedRow[2].includes("belwgck")){
                let inputSheetMasterStyleForCK=inputSheetMasterStyle;
                while(inputSheetMasterStyleForCK.charAt(0) == '0')
                {
                    inputSheetMasterStyleForCK = inputSheetMasterStyleForCK.substr(1);
                }
                if(orderBookClosedRow[orderBookRowNumbers.orderBookMasterPoIndex]==inputSheetMasterPo&&
                    orderBookClosedRow[orderBookRowNumbers.orderBookMasterStyleIndex]==inputSheetMasterStyleForCK&&
                    orderBookClosedRow[orderBookRowNumbers.orderBookColorCodeIndex]==inputSheetColorCode
                ){
                    closedorderBookQuantity+=Number(orderBookClosedRow[orderBookRowNumbers.orderBookQuantityIndex])
                    closedpackMethod=Number(orderBookClosedRow[orderBookRowNumbers.orderBookItemDescriptionIndex].trim()[0])
                    
                }
            }   
        })

        if((closedorderBookQuantity/closedpackMethod)==inputSheetQuantity){
            this.inputSheetData.dataRows[i][inputSheetWIPStatusIndex]="Closed";
        }
    }
    
    let minimumPsdData=await OrderBookServices.getMinimuPsd(scheduleAndLocationData)
    this.printMinimumPsd(minimumPsdData)

    // if(minimumPsdData==false){
    //     alert("Could not Get Minimum PSD")
    // }
    // else{
    //     this.printMinimumPsd(minimumPsdData)
    // }   
};

printMinimumPsd=async(minimumPsdData)=>{  
   
    minimumPsdData.forEach(schedule => {
        for(let i=0;i<this.inputSheetData.dataRows.length;i++){
            if(this.inputSheetData.dataRows[i][inputTemplateRowNumbers.inputSheetScheduleIndex]==schedule.ScheduleNo){
                this.inputSheetData.dataRows[i][inputTemplateRowNumbers.inputSheetMinimumPsdIndex]=schedule.MinimumPSD;
            }
        } 
    });
    this.minimumPsdCalculations()
}

minimumPsdCalculations=async()=>{  
    const inputSheetScheduleIndex=66
    const inputSheetWareHouseIndex=67
    const inputSheetDeliveryDateIndex=68

    const inputSheetMinimumPsdIndex=69
    const inputSheetPPSampleReadyIndex=32
    const inputSheetSewingStartDateExpectedIndex=38
    const inputSheetCriticalMaterialExpectedIndex=33
    const inputSheetCriticalMaterialActualIndex=34
    const inputSheetStartCuttingActualIndex=35
    const inputSheetStartSewingDateActualIndex=39
    const inputSheetStartPackingExpectedIndex=44
    const inputSheetStartPackingActualIndex=45
    const inputSheetACDateExpectedIndex=50
    const inputSheetACDateActualIndex=51
    const inputSheetFinalInspectionIndex=46
    const inputSheetGarmentTestDAteIndex=42
    
   
    for(let i=0;i<this.inputSheetData.dataRows.length;i++){
        if(this.inputSheetData.dataRows[i][inputSheetScheduleIndex]!=null){
            const warehouseData=this.state.warehouses.find(warehouse=>warehouse.warehouseName==this.inputSheetData.dataRows[i][inputSheetWareHouseIndex].trim().toLowerCase())
            if(this.inputSheetData.dataRows[i][inputSheetMinimumPsdIndex]!=null){
                let minimumPSD=new Date(this.inputSheetData.dataRows[i][inputSheetMinimumPsdIndex]);
                let minimumPSDMinus3=new Date(this.inputSheetData.dataRows[i][inputSheetMinimumPsdIndex]);
                let minimumPSDMinus1=new Date(this.inputSheetData.dataRows[i][inputSheetMinimumPsdIndex]);

                //Checking the warehouse if saturday working warehouse and else
                if(warehouseData&&warehouseData.isSaturdayWorking){
                    minimumPSDMinus3=DateCalculations.deductDaysExcludingSunday(minimumPSD,3);
                    minimumPSDMinus1=DateCalculations.deductDaysExcludingSunday(minimumPSD,1);
                }
                else{
                    minimumPSDMinus3=DateCalculations.deductDaysExcludingWeekEnd(minimumPSD,3);
                    minimumPSDMinus1=DateCalculations.deductDaysExcludingWeekEnd(minimumPSD,1);
                }
                
                this.inputSheetData.dataRows[i][inputSheetSewingStartDateExpectedIndex]= minimumPSD.toLocaleDateString();
                this.inputSheetData.dataRows[i][inputSheetStartSewingDateActualIndex]= minimumPSD.toLocaleDateString();
                this.inputSheetData.dataRows[i][inputSheetStartPackingExpectedIndex]= minimumPSD.toLocaleDateString();
                this.inputSheetData.dataRows[i][inputSheetStartPackingActualIndex]= minimumPSD.toLocaleDateString();
                this.inputSheetData.dataRows[i][inputSheetPPSampleReadyIndex]=minimumPSDMinus3.toLocaleDateString();
                this.inputSheetData.dataRows[i][inputSheetCriticalMaterialExpectedIndex]=minimumPSDMinus3.toLocaleDateString();
                this.inputSheetData.dataRows[i][inputSheetCriticalMaterialActualIndex]=minimumPSDMinus3.toLocaleDateString();
                this.inputSheetData.dataRows[i][inputSheetStartCuttingActualIndex]=minimumPSDMinus1.toLocaleDateString();
            }

            let ACDate=new Date(this.inputSheetData.dataRows[i][inputSheetDeliveryDateIndex]);
            let ACDateMinus1=new Date(this.inputSheetData.dataRows[i][inputSheetDeliveryDateIndex]);
            let ACDateMinus4=new Date(this.inputSheetData.dataRows[i][inputSheetDeliveryDateIndex]);
        
            // Checking if India Plant
            if(warehouseData&&warehouseData.destination=="India"){
                ACDate.setDate(ACDate.getDate()+9)
                ACDateMinus1.setDate(ACDateMinus1.getDate()+8)
                ACDateMinus4.setDate(ACDateMinus4.getDate()+5)
            }
            else{
                ACDate.setDate(ACDate.getDate()+6)
                ACDateMinus1.setDate(ACDateMinus1.getDate()+5)
                ACDateMinus4.setDate(ACDateMinus4.getDate()+2)
            }
            
            this.inputSheetData.dataRows[i][inputSheetACDateExpectedIndex]= ACDate.toLocaleDateString();
            this.inputSheetData.dataRows[i][inputSheetACDateActualIndex]= ACDate.toLocaleDateString();
            this.inputSheetData.dataRows[i][inputSheetFinalInspectionIndex]= ACDateMinus1.toLocaleDateString();
            this.inputSheetData.dataRows[i][inputSheetGarmentTestDAteIndex]= ACDateMinus4.toLocaleDateString();
            delete this.inputSheetData.dataRows[i][inputSheetScheduleIndex]
            delete this.inputSheetData.dataRows[i][inputSheetWareHouseIndex]
            delete this.inputSheetData.dataRows[i][inputSheetMinimumPsdIndex]
            delete this.inputSheetData.dataRows[i][inputSheetDeliveryDateIndex]
        }    
    } 

    const data={
        bookName:"VMS"+(new Date().toDateString()),
        bookData: [this.inputSheetData.headers].concat(this.inputSheetData.dataRows),
    }
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data.bookData);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    this.orderBookData=null;
    this.inputSheetData=null;
    XLSX.writeFile(wb, "VMS"+new Date().toDateString()+".xlsx")
    
    this.resetState()
}
resetState=async()=>{  
    this.inputSheetData=null;
    this.orderBookData=null;  
    this.setState({
    orderBookDataValidity:'pending',
    inputTemplateDataValidity:'pending',
    inputTemplateStatus:"Input Template",
    orderBookStatus:"Order Book",
    inputSheetName:'',
    orderBookName:'',
    inputTemplateStatusColor:"#ffc107",
    orderBookStatusColor:"#ffc107",
    getOrderBookDataStatus:false,
    submitButton:true
    })
}
isInputTemplateClicked=()=>{
    if(this.state.getOrderBookDataStatus==false){
        this.setState({getOrderBookDataStatus:true}) 
    }
    this.setState({inputTemplateStatus:"Reading Input Template"
        ,inputTemplateDataValidity:'pending'
        ,orderBookStatus:"Reading Order Book"
        ,inputTemplateStatusColor:"#ffc107"}) 
}
static contextType = ThemeContext;
render() { 
    return (
        <div  style={{overflow:"hidden",backgroundColor:''}}>
            <Header dayTimeClass={this.context.dayTimeClass} appName="VMS" timeOfDay={this.context.timeOfDay} />
            <div className="container" style={{marginTop:'7vw',marginLeft:"30vw",marginBottom:'5vw'}}>
                 <Grid container xs={5} style={{border:'1px solid #D3D3D3',borderRadius:"5px",
                    backgroundColor:"",boxShadow:"1px 0.5px 0.5px  #D3D3D3"}}>
                        <Grid item xs={3}>
                            <div style={{display:"flex",justifyContent:"center",marginTop:"4.5vw"}}>
                                <InputTemplate isInputTemplateClicked={this.isInputTemplateClicked} 
                                    getInputTemplateData={this.getInputTemplateData}/>
                                
                            </div>
                        </Grid>
                        <Grid item xs={9} style={{borderLeft:'1px solid #D3D3D3'}}>
                            <Grid container style={{padding:'1vw',marginTop:"1vw"}} >
                                <Grid item xs={10}>
                                    
                                    <h5 style={{fontFamily:"calibri"}}>
                                        {this.state.inputTemplateStatus}
                                    </h5>
                                </Grid>

                                <Grid item xs={1}>
                                    {
                                        this.state.inputTemplateDataValidity =='done'?
                                        <CheckCircleSharpIcon style={{width:'2.3vw',height:'2.3vw',color:'#4dbd74'}}/>:
                                        this.state.inputTemplateDataValidity =='pending'?
                                        <HelpOutlinedIcon style={{width:'2.3vw',height:'2.3vw',color:'#ffc107'}}/>:
                                        <CancelRoundedIcon style={{width:'2.3vw',height:'2.3vw',color:'#f86c6b'}}/>
                                    }
                                </Grid>
                            </Grid> 
                            <Grid container style={{padding:'1vw' }}>
                                <Grid item xs={10}>
                                    <OrderBook orderBookStatusColor={this.state.orderBookStatusColor}
                                    orderBookStatus={this.state.orderBookStatus}
                                    getOrderBookDataStatus={this.state.getOrderBookDataStatus} 
                                    getOrderBookData={this.getOrderBookData}/>
                                </Grid>
                                <Grid item xs={1} >
                                    {
                                        this.state.orderBookDataValidity =='done'?
                                        <CheckCircleSharpIcon style={{width:'2.3vw',height:'2.3vw',color:'#4dbd74'}}/>:
                                        this.state.orderBookDataValidity =='pending'?
                                        <HelpOutlinedIcon style={{width:'2.3vw',height:'2.3vw',color:'#ffc107'}}/>
                                        // <p style={{float:'left',color:'#ffc107'}}>1</p>
                                        :
                                        <CancelRoundedIcon style={{width:'2.3vw',height:'2.3vw',color:'#f86c6b'}}/>
                                    }
                                </Grid>
                                <h6>{this.state.orderBookName}</h6>
                                <div className="container" style={{margin:"auto",marginTop:"3vw",textAlign:"right"}}>
                                    <button className="btn btn-outline-success btn-sm" disabled={this.state.submitButton}  
                                    onClick={this.getSchedule}>Download <GetAppIcon></GetAppIcon></button>
                                </div>
                            </Grid>
                        </Grid>
                 </Grid>      
            </div> 
        </div>
        
    ); 
  };
};

