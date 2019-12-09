import React from 'react';
import './uploadButton.scss'
import BackupIcon from '@material-ui/icons/Backup';

export default class DataInputComponent extends React.Component {
    constructor(props) {
        super(props);
    };
    handleChange=(e)=> {
        const files = e.target.files;
        if(files && files[0]) this.props.handleFile(files[0]);
    };
    render() {
     const iconSize=this.props.iconSize
     return (
        <form className="form-inline">
            <div className="form-group">
                <label className={this.props.classes} >  
                   {this.props.buttonName}
                    <BackupIcon style={{width:iconSize,height:iconSize }}></BackupIcon>
                <input type="file" style={{display:'none'}} id="file" accept={SheetJSFT} onChange={this.handleChange} />
                </label>
            </div>
         </form>
    ); };
    }

/* list of supported file types */
const SheetJSFT = [
"xlsx", "xlsb", "xlsm", "xls"].map(function(x) { return "." + x; }).join(",");