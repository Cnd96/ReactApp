import baseUrl from './service'
class WareHouseServices{ 
    async getAllWarehouses(){
        const warehouses=[{
            warehouseName:"a03",
            isSaturdayWorking:true,
            destination:"India"
        },{
            warehouseName:"ain",
            isSaturdayWorking:true,
            destination:"India"
        }
        ,{
            warehouseName:"aip",
            isSaturdayWorking:true,
            destination:"India"
        },{
            warehouseName:"aco",
            isSaturdayWorking:false,
            destination:"India"
        },{
            warehouseName:"ais",
            isSaturdayWorking:false,
            destination:"India"
        },{
            warehouseName:"ebc",
            isSaturdayWorking:true,
            destination:"Sri Lanka"
        },{
            warehouseName:"erk",
            isSaturdayWorking:true,
            destination:"Sri Lanka"
        }]
        return warehouses
    } 
}
export default new WareHouseServices()