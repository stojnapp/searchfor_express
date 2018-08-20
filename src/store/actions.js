import functions from "../functions/function";
import Tools from '../functions/commonTools';
import {SearchOrder} from "../api/api";
const action={
  checkExpress(context,waybillNo){
    return functions.requestHttpMethods(SearchOrder.search,{waybillNo:waybillNo},false,'get')
      .then(res=>{
          if(res.respCode=='000'){
            return Promise.resolve(res.data)
          }else{
            Tools.TestTost(res.resMessage)
          }
      })

  }
}
export default action;
