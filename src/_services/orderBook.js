import baseUrl from './service'
class OrderBookServices{ 
    async getOrderBookDetails(){
        const orderBookStatusResponse=await fetch(
            baseUrl+'orderBook')
        const orderBookData=await orderBookStatusResponse.json();
        return orderBookData
    } 
    async getMinimuPsd(data){
        const minimumPsdResponse=await fetch(
            baseUrl+'minimumPSD/getMinimuPsd',{
                method: "POST",
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body:JSON.stringify(data)
        })
    
        const response=await minimumPsdResponse.json();    
        return response
    } 

}
export default new OrderBookServices()