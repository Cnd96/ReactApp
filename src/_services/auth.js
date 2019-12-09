import baseUrl from './service'
class AuthServices{ 
    async login(userData){
        const response=await fetch(baseUrl+"belApps/login", {
            method: "POST",
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body:JSON.stringify(userData)
          })
        return response
    } 
}

export default new AuthServices()