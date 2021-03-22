import '../assets/css/add.scss';
import { getHeader } from '../api/api'

const a = 123;
console.log('首页init ? a = ', a)

getHeader().then(res=>{
  console.log(res)
})

