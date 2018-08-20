/*静态常量*/
// export const BASE_URL='https://appsys.sto.cn/'/*生产环境*/;
export const BASE_URL='http://192.168.124.208:8080/';/*内网*/
// export const BASE_URL='http://222.72.44.130:19999/';/*对应外网测试*/


export const APP_ID='app';
export const APP_SOURCE='jn';
export const APP_CLIENTTYPE='h5';

export const NoneOrderApi={
  /*检索*/
  search:'/face-jn/expressClaim/search',

  /*获取图片列表*/
  piclist:'/face-jn/expressClaim/attachmentList',


  /*获取字典类型*/
  itemlist:'/face-jn/expressClaim/dictionaryItemList',


  /*登记*/
  addOrder:'/face-jn/expressClaim/add',

  /*详情*/
  ordershow:'/face-jn/expressClaim/detail/',

  /*订单详情*/
  orderinfo:'/face-jn/expressClaim/selectByBillno/',


  /*操作*/
  dooption:'/face-jn/expressClaim/operate',

  /*认领*/
  claim:'/face-jn/expressClaim/claim',


  /*核实*/
  verify:'/face-jn/expressClaim/verify',


  /*推送*/
  pushdata:'/face-jn/expressClaim/push',

  /*物流查询*/
  expressSearch:'/face-kdzs/order/getTraceListByWaybillNo',

  /*根据ID获取订单详情,适用于打印面单*/
  printorderApi:'/face-jn/expressClaim/selectExpressOrderById/',

  /*打印成功后的推送*/
  printSucess:'/face-jn/expressClaim/push',

}


/*通用接口*/
export const Commpn_api={


  /*上传文件生产域名*/
  uploadUrl:'https://appfileupload.sto.cn/',

  /*根据父id来检索行政区*/
  Chinaarealist:this.uploadUrl+'region/searchByParentId/',

  /*快速检索组织机构*/
  SearchBaseOrganize:'face-app/basicInfo/fuzzySearchBaseOrganizeFromEs',


  /*上传图片api*/
  uploadPic:'upload/picture',/*生产*/
  // uploadPic:'http://222.72.44.130:8092/upload/picture',/*测试*/


  /*组装的外网域名*/
  netUrl:'http://filedfs.sto.cn:8080/',/*生产*/
  // netUrl:'http://222.72.44.130:22222/dfs/',/*测试*/


}













