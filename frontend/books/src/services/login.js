import axios from 'axios'
import userService from './user'
const baseurl =  'http://127.0.0.1:8000/users/login/'

const config = {

         headers: { 'Authorization' :  `TOKEN ${userService.getToken()}` }

    }

     
const login = async (credits)=>{
    const response = await axios.post(baseurl, credits)
    console.log(response.data)
    return response.data
}

const logout = async () =>{
 console.log(userService.getToken())

 const response =  await axios.delete("http://127.0.0.1:8000/users/logout/", config)
 return response.data
}
export default {login, logout}