/*
  name@检测类方法
  data@2018/04/27
  author@344822559@qq.com
*/
const checkFormat={

  /*邮箱*/
  checkEmail : str => {
    let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    return reg.test(str);
  },

  /*密码必须是数字、大小写字母、特殊字符的组合*/
  checkPass:(pass,pattern=/^(?![0-9a-z]+$)(?![0-9A-Z]+$)(?![0-9\\W]+$)(?![a-z\\W]+$)(?![a-zA-Z]+$)(?![A-Z\\W]+$)[a-zA-Z0-9\\W_]+$/i) => {
    let passTest = pattern;
    return passTest.test(pass);
  },

  /*手机可加86等*/
  checkPhone:str=>{
    let pattern = /^(0|86|17951)?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;
    return pattern.test(str);
  },

  /*默认4位纯数字验证码*/
  checkCode:(str,num=6)=>{
    let pattern=/^[0-9]{6}$/;
    return pattern.test(str);
  },

  /*检测不能连续的6位数组*/
  isRealNum:(val)=>{
      // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除
      if(val === "" || val ==null){
        return false;
      }
      if(!isNaN(val)){
        return true;
      }else{
        return false;
      }
  },

  /*格式化时间*/
  gettimeformate(time=new Date(),type=true){

    let year=time.getFullYear()
    let month=time.getMonth()+1
    if(month<10){
      month="0"+month;
    }
    let day=time.getDate();

    if(day<10){
      day="0"+day;
    }

    let hour=time.getHours();
    if(hour<10){
      hour="0"+hour;
    }
    let minte=time.getMinutes();
    if(minte<10){
      minte="0"+minte;
    }
    let seconds=time.getSeconds();
    if(seconds<10){
      seconds="0"+seconds;
    }

    if(type){
      return year+'-'+month+'-'+day
    }else{
      return year+'-'+month+'-'+day+' '+hour+':'+minte+':'+seconds
    }


  },

  /*类别材质数据过滤*/
  checkFormatGoods(arr){
    var newArr=[];
    for(let i=0;i<arr.length;i++){
      newArr=newArr.concat({text:arr[i].itemName,value:arr[i].itemCode});
    }
    return newArr
  }




}

export default checkFormat
