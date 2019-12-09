import React from 'react';
import './VmsContainer.styles.scss'
import OrderBookServices from '../../_services/orderBook'
import orderBookRowNumbers from './orderBookRowNos'
export default class OrderBook extends React.Component {
  constructor(props){
		super(props);
		this.state = {
			data: [], 
      cols: [],
      status:"Pending Order Book " ,
      // statusColor:"#ffc107" 
        }
  }
  async componentDidMount(){
    
  }

  async componentDidUpdate(prevProps) {
    if (this.props.getOrderBookDataStatus !== prevProps.getOrderBookDataStatus&&this.props.getOrderBookDataStatus==true) {
      this.setState({status:"Reading Order Book"})
      const orderBookData=await OrderBookServices.getOrderBookDetails()
      
      orderBookData.ckDataRows=[];
      orderBookData.hbDataRows=[];
      orderBookData.otherDataRows=[];

      orderBookData.ckClosedDataRows=[];
      orderBookData.hbClosedDataRows=[];
      orderBookData.otherClosedDataRows=[];

      orderBookData.dataRows.forEach(row => {
          for(let i=0;i<row.length;i++){
              if(row[i]==null){
                  row[i]=""
              }
          }
          row[2]=row[2].trim()
          row[2]=row[2].toLowerCase()
          //row[2]="Group Tech Class"
          //splitting data rows to hb and ck data rows by considering "Group Tech Class"
          if(row[2]=="belpvh"){
            orderBookData.hbDataRows.push(row)
            
          }
          else if(row[2]=="belwgck"){
            orderBookData.ckDataRows.push(row)
          }
          else{
            orderBookData.otherDataRows.push(row)
          }
      });

      orderBookData.closedRows.forEach(row => {
        for(let i=0;i<row.length;i++){
            if(row[i]==null){
                row[i]=''
            }
        }
        row[2]=row[2].trim()
        row[2]=row[2].toLowerCase()
        //row[2]="Group Tech Class"
        //splitting data rows to hb and ck data rows by considering "Group Tech Class"
        if(row[2].includes("belpvh")){
          orderBookData.hbClosedDataRows.push(row)
          
        }
        else if(row[2].includes("belwgck")){
          orderBookData.ckClosedDataRows.push(row)
        }
        else{
          orderBookData.otherClosedDataRows.push(row)
        }
      });

      delete orderBookData.dataRows
      delete orderBookData.closedRows
      this.extractDataFromHB(orderBookData.hbDataRows)
      this.extractDataFromCK(orderBookData.ckDataRows)
      this.extractDataFromHB(orderBookData.hbClosedDataRows)
      this.extractDataFromCK(orderBookData.ckClosedDataRows)

      orderBookData.dataRows=orderBookData.ckDataRows.concat(orderBookData.hbDataRows)
      orderBookData.closedRows=orderBookData.ckClosedDataRows.concat(orderBookData.hbClosedDataRows)
  
      delete orderBookData.hbDataRows
      delete orderBookData.ckDataRows
      delete orderBookData.hbClosedDataRows
      delete orderBookData.ckClosedDataRows
      this.setState({status:"Uploaded Order Book",
      // statusColor:"#4dbd74"
      })
      this.props.getOrderBookData(orderBookData);
    }
  }
  
  extractDataFromHB=(hbDataRows)=>{ 
      hbDataRows.forEach(row=>{
        //Extract VPO No.
        //eg-DRO9-342349(-,/, )DROP-T 
        //Firstpart =DRO9
        //Secondpart=342349(-,/, )DROP-T
        //Thirdpart =342349   (this may or may not be a integer)
        let VPONo='';
        if(row[orderBookRowNumbers.VPONoRowNumber].indexOf('-')>0){
          let VPONoFirstPart='';
          let VPONoSecondPart='';
          let VPONoThirdPart='';
          VPONoFirstPart= row[orderBookRowNumbers.VPONoRowNumber].substr(0,  row[orderBookRowNumbers.VPONoRowNumber].indexOf('-')); 
          VPONoSecondPart= (row[orderBookRowNumbers.VPONoRowNumber].substr(row[orderBookRowNumbers.VPONoRowNumber].indexOf('-')+1)).trim(); 
          if(VPONoSecondPart.indexOf('/')>0){
            VPONoThirdPart=VPONoSecondPart.substr(0, VPONoSecondPart.indexOf('/')); 
            if(!isNaN(VPONoThirdPart)){
              VPONo=VPONoFirstPart+VPONoThirdPart
            }
            else{
              VPONo=VPONoFirstPart
            }
          }
          else if(VPONoSecondPart.indexOf('-')>0){
            VPONoThirdPart=VPONoSecondPart.substr(0, VPONoSecondPart.indexOf('-')); 
            if(!isNaN(VPONoThirdPart)){
              VPONo=VPONoFirstPart+VPONoThirdPart
            }
            else{
              VPONo=VPONoFirstPart
            }
          }
          else if(VPONoSecondPart.indexOf(' ')>0){
            VPONoThirdPart=VPONoSecondPart.substr(0, VPONoSecondPart.indexOf(' ')); 
            if(!isNaN(VPONoThirdPart)){
              VPONo=VPONoFirstPart+VPONoThirdPart  
            }
            else{
              VPONo=VPONoFirstPart   
            }
          }
          else{
            if(!isNaN(VPONoSecondPart)){
              VPONo=VPONoFirstPart+VPONoSecondPart
            }
            else{
              VPONo=VPONoFirstPart   
            }
          }
        }
        else{
          VPONo=row[orderBookRowNumbers.VPONoRowNumber]
        }
        //Extract Customer Style No. and color code
        let CUSNo='';
        let colorCode='';
        if(row[orderBookRowNumbers.CUSNORowNumber].indexOf('-')>0){
          let CUSNoFirstPart=row[orderBookRowNumbers.CUSNORowNumber].substr(row[orderBookRowNumbers.CUSNORowNumber].indexOf('-')+1); 
          // console.log(CUSNoFirstPart)
          if(CUSNoFirstPart.indexOf('/')>0){
            CUSNo=CUSNoFirstPart.substr(0,CUSNoFirstPart.indexOf('/'))
          }
          else{
            CUSNo= row[orderBookRowNumbers.CUSNORowNumber].substr(0,row[6].indexOf('-'))
          }
          //Extracting color code 
          let colorCodeFirstPart='';
          let numbericPartFromColorCodeFirstPart='';
          if(row[orderBookRowNumbers.CUSNORowNumber].indexOf('/')>0){
           colorCodeFirstPart=row[orderBookRowNumbers.CUSNORowNumber].substr( row[orderBookRowNumbers.CUSNORowNumber].indexOf('/')+1) 
            if((!isNaN(colorCodeFirstPart[0]))){
              numbericPartFromColorCodeFirstPart=colorCodeFirstPart.match(/\d+/)[0];
            }
            else{
              numbericPartFromColorCodeFirstPart='';
           }
          }
          else{
            colorCodeFirstPart=row[orderBookRowNumbers.CUSNORowNumber].substr( row[orderBookRowNumbers.CUSNORowNumber].indexOf('-')+1) 
            if((!isNaN(colorCodeFirstPart[0]))){
              numbericPartFromColorCodeFirstPart=colorCodeFirstPart.match(/\d+/)[0];
             }
             else{
              numbericPartFromColorCodeFirstPart='';
             }
          }

           if(numbericPartFromColorCodeFirstPart.length==0){
            colorCode="000"
           }
           else if(numbericPartFromColorCodeFirstPart.length==1){
             colorCode="00"+numbericPartFromColorCodeFirstPart
           }
           else if(numbericPartFromColorCodeFirstPart.length==2){
             colorCode="0"+numbericPartFromColorCodeFirstPart
           }
           else if(numbericPartFromColorCodeFirstPart.length==3){
             colorCode=numbericPartFromColorCodeFirstPart
           }
           else{
             colorCode=numbericPartFromColorCodeFirstPart.substr(0,3)
           }

        }
        else if(row[orderBookRowNumbers.CUSNORowNumber].indexOf('/')>0){
          CUSNo= row[orderBookRowNumbers.CUSNORowNumber].substr(0,  row[orderBookRowNumbers.CUSNORowNumber].indexOf('/')); 
          let colorCodeFirstPart=row[orderBookRowNumbers.CUSNORowNumber].substr( row[orderBookRowNumbers.CUSNORowNumber].indexOf('/')+1)
          let numbericPartFromColorCodeFirstPart=colorCodeFirstPart.match(/\d+/)[0];
          if(numbericPartFromColorCodeFirstPart.length==0){
            colorCode="000"
          }
          else if(numbericPartFromColorCodeFirstPart.length==1){
            colorCode="00"+numbericPartFromColorCodeFirstPart
          }
          else if(numbericPartFromColorCodeFirstPart.length==2){
            colorCode="0"+numbericPartFromColorCodeFirstPart
          }
          else if(numbericPartFromColorCodeFirstPart.length==3){
            colorCode=numbericPartFromColorCodeFirstPart
           
          }
          else{
            colorCode=numbericPartFromColorCodeFirstPart.substr(0,3)
          }
        }
        else{
          CUSNo= row[orderBookRowNumbers.CUSNORowNumber];
          colorCode=row[orderBookRowNumbers.CUSNORowNumber]
        }
        row[orderBookRowNumbers.orderBookMasterPoIndex]=VPONo
        row[orderBookRowNumbers.orderBookMasterStyleIndex]=CUSNo
        row[orderBookRowNumbers.orderBookColorCodeIndex]=colorCode
  
      })
  }

  extractDataFromCK=(ckDataRows)=>{
    ckDataRows.forEach(row=>{
      let VPONo='';
      let CUSNo=row[orderBookRowNumbers.CUSNORowNumber];
      let colorCode='';
      if(row[orderBookRowNumbers.VPONoRowNumber].indexOf('-')>0){
        VPONo=row[orderBookRowNumbers.VPONoRowNumber].substr(0,  row[orderBookRowNumbers.VPONoRowNumber].indexOf('-')); 
      }
      else{
        VPONo= row[orderBookRowNumbers.VPONoRowNumber]
      }
      if(row[orderBookRowNumbers.DestinationRowNumber].toLowerCase().includes('usa')||
         row[orderBookRowNumbers.DestinationRowNumber].toLowerCase().includes('mex')||
         row[orderBookRowNumbers.DestinationRowNumber].toLowerCase().includes('pan')||
         row[orderBookRowNumbers.DestinationRowNumber].toLowerCase().includes('twn')||
         row[orderBookRowNumbers.DestinationRowNumber].toLowerCase().includes('aus')||
         row[orderBookRowNumbers.DestinationRowNumber].toLowerCase().includes('bra')||
         row[orderBookRowNumbers.DestinationRowNumber].toLowerCase().includes('can')){

        colorCode= row[orderBookRowNumbers.PackMethodRowNumber].trim().substr(0,3);
      }else if(
         row[orderBookRowNumbers.DestinationRowNumber].toLowerCase().includes('nld')||
         row[orderBookRowNumbers.DestinationRowNumber].toLowerCase().includes('kor')||
         row[orderBookRowNumbers.DestinationRowNumber].toLowerCase().includes('jpn')||
         row[orderBookRowNumbers.DestinationRowNumber].toLowerCase().includes('ind')){
         
         colorCode= row[orderBookRowNumbers.PackMethodRowNumber].trim().substr(row[orderBookRowNumbers.PackMethodRowNumber].trim().length-3);
      }
      row[orderBookRowNumbers.orderBookMasterPoIndex]=VPONo
      row[orderBookRowNumbers.orderBookMasterStyleIndex]=CUSNo
      row[orderBookRowNumbers.orderBookColorCodeIndex]=colorCode

    })
  }

  render() { 
    return (
        <div >
            <h5 style={{fontFamily:"calibri"}}>
              {this.props.orderBookStatus}
            </h5>
        </div>
    ); 
  };
};
