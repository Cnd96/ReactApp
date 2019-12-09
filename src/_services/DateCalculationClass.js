
class DateCalculations{
    // deductDaysExcludingSundayWrong(date, daysToShift){
    //     const modulesOfDaysToBeShiftsBySeven=daysToShift%7;
    //     const dateToBeChanged=new Date(date);
    //     const dayOfDate=dateToBeChanged.getDay()

    //     if(dayOfDate===modulesOfDaysToBeShiftsBySeven){
    //         daysToShift++
    //     }
    //     dateToBeChanged.setDate(dateToBeChanged.getDate()-daysToShift)
    //     return dateToBeChanged
    // } 
    
    // deductDaysExcludingWeekEndWrong(date, daysToShift){
    //     const modulesOfDaysToBeShiftsBySeven=daysToShift%7;
    //     const dateToBeChanged=new Date(date);
    //     const dayOfDate=dateToBeChanged.getDay()
    //     if(dayOfDate===6){
    //         if(6===modulesOfDaysToBeShiftsBySeven){
    //             daysToShift+=2
    //         }
    //         else if(0===modulesOfDaysToBeShiftsBySeven){
    //             daysToShift++
    //         }
    //     }
    //     else{
    //         if(dayOfDate===modulesOfDaysToBeShiftsBySeven){
    //             daysToShift+=2
    //         }
    //         else if((dayOfDate+1)===modulesOfDaysToBeShiftsBySeven){
    //             daysToShift++
    //         }
    //     }
    //     dateToBeChanged.setDate(dateToBeChanged.getDate()-daysToShift)
    //     return dateToBeChanged    
    // } 
    convertExcelDateToJsLocaleDateString(dateSerialNumber){
        const utc_days  = Math.floor(dateSerialNumber - 25569);
        const utc_value = utc_days * 86400;                                        
        return new Date(utc_value * 1000);
    }
    calculateDifferenceBetweenDays(day1,day2){
        const diffenrenceBetweenTime=day1.getTime()-day2.getTime()
        return diffenrenceBetweenTime / (1000 * 3600 * 24);
    }

    formatDateToYYYYMMDD(date){
        let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('-');
    }
    deductDaysExcludingWeekEnd(date, daysToShift){
        const dateToBeChanged=new Date(date);
        const dayOfDate=dateToBeChanged.getDay()

        if(dayOfDate===0){
            const daysToShiftMinusOne= daysToShift-1
            daysToShift+=(parseInt(daysToShiftMinusOne/5)*2)+1
        }
        else{
            if(daysToShift>=dayOfDate){
                const daysToShiftMinusTwo= daysToShift-dayOfDate
                daysToShift+=(parseInt(daysToShiftMinusTwo/5)+1)*2 
            } 
        }
        dateToBeChanged.setDate(dateToBeChanged.getDate()-daysToShift)
        
        return dateToBeChanged    
    } 
    deductDaysExcludingSunday(date, daysToShift){
        const dateToBeChanged=new Date(date);
        const dayOfDate=dateToBeChanged.getDay()

        if(dayOfDate===0){
            const daysToShiftMinusOne= daysToShift-1
            daysToShift+=(parseInt(daysToShiftMinusOne/6))
        }
        else{
            if(daysToShift>=dayOfDate){
                const daysToShiftMinusDayOfDate= daysToShift-dayOfDate
                daysToShift+=(parseInt(daysToShiftMinusDayOfDate/6)+1) 
            } 
        }
        dateToBeChanged.setDate(dateToBeChanged.getDate()-daysToShift)
        return dateToBeChanged    
    } 
}
export default new DateCalculations() 


