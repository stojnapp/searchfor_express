import functions from "../functions/function";
import Tools from '../functions/commonTools';
import {NoneOrderApi,Commpn_api} from "../api/api";
import { Toast } from 'vant';
Toast.allowMultiple();
const action={

  /*检索*/
  searchInfo(context,{startDate,endDate,registerExplain,registerNetDot,licencePlate,internalsColor,contactPhone,status,baleTexture,goodsType,claimNetDot,provinceId,cityId,districtId,source,pageSize,pageNum}){
    var loading=Tools.getTost('正在加载...')
    return functions.requestHttpMethods(NoneOrderApi.search,{startDate,endDate,registerExplain,registerNetDot,licencePlate,internalsColor,contactPhone,status,baleTexture,goodsType,claimNetDot,provinceId,cityId,districtId,source,pageSize,pageNum},false,'get')
      .then(res=>{
        loading.clear();
        if(res.respCode=='000'){
          return Promise.resolve(res)
        }else{
          Tools.TestTost(res.resMessage)
        }
      })
  },

  /*物品类别，默认是类别，材质传参bale_texture*/
  getGoodsType(context,{typeCode='goods_type'}){
    var loading=Tools.getTost('正在加载...')
    functions.requestHttpMethods(NoneOrderApi.itemlist,{typeCode},false,'get')
      .then(res=>{
        loading.clear();
        if(res.respCode=='000'){
          switch (typeCode){
            case 'goods_type':
              context.commit('saveGoodsType',res.data);
              break;
            case 'bale_texture' :
              context.commit('saveBaletexture',res.data);
              break;
          }
        }else{
          Tools.TestTost('属性数据获取失败...')
        }
      })
  },

  /*登记*/
  addGoods(context,{goodsType,baleTexture,contactPhone,goodsWeight,internalsColor,licencePlate,registerExplain,fileLinkArray}){
    return functions.requestHttpMethods(NoneOrderApi.addOrder,{goodsType,baleTexture,contactPhone,goodsWeight,internalsColor,licencePlate,registerExplain,fileLinkArray},false)
  },

  /*无面单详情*/
  getOrdershow(context,{id}){
    return functions.requestHttpMethods(NoneOrderApi.ordershow+id,null,false,'get')
  },

  /*获取认领图片列表
  * businessType@3-登记图片 4-认领图片
  * */
  getOrderpiclist(context,{complainId,businessType=3}){
    return functions.requestHttpMethods(NoneOrderApi.piclist,{complainId,businessType},false,'get')
  },

  /*查询物流信息*/
  checkExpressshow(context,{waybillNo}){
    return functions.requestHttpMethods(NoneOrderApi.expressSearch,{waybillNo},false,'get')
  },

  /*审核状态
  status@0-打回 2-通过
  * */
  auditCheckdo(context,{id,status}){
    return functions.requestHttpMethods(NoneOrderApi.verify,{id,status},false)
  },

  /*认领*/
  claimDo(context,{id,billno,goodsname,weight,sendperson,sendtel,sendprovince,sendcity,sendarea,sendaddress,receiveperson,receivetel,receiveprovince,receivecity,receivearea,receiveaddress,claimExplain,fileLinkArray}){
    var loading=Tools.getTost('正在加载...')
      return functions.requestHttpMethods(NoneOrderApi.claim,{id,billno,goodsname,weight,sendperson,sendtel,sendprovince,sendcity,sendarea,sendaddress,receiveperson,receivetel,receiveprovince,receivecity,receivearea,receiveaddress,claimExplain,fileLinkArray},false)
        .then(res=>{
          loading.clear();
           if(res.respCode=='000'){
             Tools.TestTost('认领信息已提交！')
             return Promise.resolve(true)
           }else{
             Tools.TestTost(res.resMessage)
           }
        })
  },

  /*检索省市区县根据父id*/
  searchArealist(context,{parentId=86}){
    var loading=Tools.getTost('正在加载...')
    return functions.requestHttpMethods(Commpn_api.Chinaarealist+parentId,null,false,'get')
      .then(res=>{
        loading.clear();
        if(res.respCode=='000'){
          return Promise.resolve(res.data)
        }else{
          Tools.TestTost('省市数据获取失败...')
        }
      })
  },


  /*根据id获取打印面单详情数据*/
  getPrintorderdetail(context,id){
    return functions.requestHttpMethods(NoneOrderApi.printorderApi+id,null,false,'get')
  },


  /*
  * 根据id操做无面单状态
  * */
  setOrderstate(context,{id,status}){
    var loading=Tools.getTost('正在加载...')
    return functions.requestHttpMethods(NoneOrderApi.dooption,{id,status},false)
      .then(res=>{
          loading.clear();
          if(res.respCode=='000'){
            return Promise.resolve(res)
          }else{
            Tools.TestTost(res.resMessage)
          }
      })
  },



  /*
  * 模糊检索网点
  * index@关键词
  * */
  searchBaseNetinfo(context,{index}){
    var loading=Tools.getTost('正在加载...')
    return functions.requestHttpMethods(Commpn_api.SearchBaseOrganize,{index},false,'get')
      .then(res=>{
        loading.clear();
        if(res.respCode=='000'){
          return Promise.resolve(res.data)
        }else{
          Tools.TestTost(res.resMessage)
        }
      })
  },


  /*
  * 打印成功之后修改状态
  *
  * */
  changePrintstate(context,id){
    var loading=Tools.getTost('正在修改打印状态...')
    return functions.requestHttpMethods(NoneOrderApi.printSucess,{index},false,'get')
      .then(res=>{
        loading.clear();
        if(res.respCode=='000'){
          return Promise.resolve(res.data)
        }else{
          Tools.TestTost(res.resMessage)
        }
      })
  }

}
export default action;
