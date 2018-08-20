<template>
  <div id="box_content">
      <Header backstate title="打印面单"></Header>
      <div class="main_box">
        <div v-if="datainfo">
          <van-cell-group>
            <van-cell @click="checkToothState" is-link>
              <div class="text_999 f_24">{{BlueName}}</div>
              <template slot="title">
                <span class="van-cell-text">蓝牙打印机</span>
              </template>
            </van-cell>
          </van-cell-group>
          <p class="f_24 text_999 pl_30 pt_10 pb_10">物品信息</p>
          <van-cell-group>
            <van-cell title="运单号" :value="datainfo.billno" />
            <van-cell title="物品名称" :value="datainfo.goodsname" />
            <van-cell title="物品重量" :value="datainfo.weight" />
          </van-cell-group>
          <p class="f_24 text_999 pl_30 pt_10">寄件信息</p>
          <van-cell-group class="mt_10">
            <van-cell title="寄件人" :value="datainfo.sendperson" />
            <van-cell title="联系电话" :value="datainfo.sendtel" />
            <van-cell title="省市区县" :value="datainfo.sendprovince+'/'+datainfo.sendcity+'/'+datainfo.sendarea" />
            <van-cell title="详细地址" :value="datainfo.sendaddress" />
          </van-cell-group>
          <p class="f_24 text_999 pl_30 pt_10">收件信息</p>
          <van-cell-group class="mt_10">
            <van-cell title="收件人" :value="datainfo.receiveperson" />
            <van-cell title="联系电话" :value="datainfo.receivetel" />
            <van-cell title="省市区县" :value="datainfo.receiveprovince+'/'+datainfo.receivecity+'/'+datainfo.receivearea" />
            <van-cell title="详细地址" :value="datainfo.receiveaddress" />
          </van-cell-group>
        </div>


      </div>
      <div class="bottom-btn">
        <span @click="print_app"><i class="print-btn"></i><cite>确认打印</cite></span>
      </div>


  </div>
</template>
<script>
  import Header from '@/components/common/header'
  import { Cell, CellGroup,ImagePreview,Dialog,Area,Actionsheet,Picker,Field} from 'vant';
  import JSBASE from 'js-base64';

  export default {
    data(){
      return{
        active:0,
        checkedsendarea:'请选择',
        datainfo:null,
        BlueName:'请选择',
      }
    },
    created(){

      /*获取回调*/
      this.$bridge.registerHandler("blueToothBridgeCallBack", (data, responseCallback) => {
         this.BlueName=data;
      });

      this.checkLinkPrint()

      var loading=this.$Tools.getTost('正在加载...')
      this.$store.dispatch('getPrintorderdetail',this.$route.query.id)
        .then(res=>{
          loading.clear();
          if(res.respCode=='000'){
            this.datainfo=res.data;
          }else{
            this.$Tools.TestTost(res.resMessage)
          }
        })
    },
    methods:{
      /*检测是否已经连接打印机*/
      checkLinkPrint(){
        this.$bridge.callHandler(
          'checkBlueStatus'
          , ''
        )
      },

      checkToothState(){
        /*检测打开蓝牙*/
        this.$bridge.callHandler(
          'openBlueToothConnectPage'
          , ''
        )
      },

      /*选择蓝牙打印*/
      choosePrint(){
        /*获取回调*/
        this.$bridge.registerHandler("blueToothBridgeCallBack", (data, responseCallback) => {
          let data1 = JSON.parse(data)
          this.BlueName=data1.data;
        });

      },

      /*监听是否打印成功*/
      listenSuceessPrint(){
          var isBack=true;
        /*获取回调*/
        setTimeout(()=>{
          if(isBack){
            this.$Tools.AlertTost('超时提醒')
          }
        },300*1000);

        this.$bridge.registerHandler("onBLEPrintFinished", (data, responseCallback) => {
          isBack=false;
          let data1 = JSON.parse(data)
           if(data1.isSucc){
            /*打印成功之后更新当前面单的打印状态*/
            this.$store.dispatch('changePrintstate',this.datainfo.id)
              .then(res=>{
                this.$Tools.TestTost('打印成功!')
                setTimeout(()=>{
                  this.$router.push({name:'home'})
                },1000)
              })
           }else{
             this.$Tools.AlertTost('很遗憾,打印失败!',function(){
               this.$router.go(-1);
             })
           }
        });

      },

      print_app(){
        let Obj={
          wayBillNumber:this.datainfo.billno,
          receiveName:this.datainfo.receiveperson,
          receivePhoneNumber:this.datainfo.receivetel,
          receiverAddress:this.datainfo.receiveprovince+this.datainfo.receivecity+this.datainfo.receivearea+this.datainfo.receiveaddress,
          sendName:this.datainfo.sendperson,
          sendPhoneNumber:this.datainfo.sendtel,
          sendAddress:this.datainfo.sendprovince+this.datainfo.sendcity+this.datainfo.sendarea+this.datainfo.sendaddress,
          goodsName:this.datainfo.goodsname,
          goodsWeight:this.datainfo.weight,
          printTime:this.$check.gettimeformate(new Date(),false),
          remark:this.datainfo.remark?this.datainfo.remark:null
        }
        /*确认打印*/
        this.$bridge.callHandler(
          'doPrinterWithBLE'
          ,JSBASE.Base64.encode(JSON.stringify(Obj))
        )

        /*开启打印监听*/
        this.listenSuceessPrint();
      }
    },
    components:{
      'van-cell-group':CellGroup,
      'van-field':Field,
      'van-cell':Cell,
      Header
    }
  }

</script>
<style lang="stylus" scoped>
  @import "~staticPath/css/theme.styl";
  @import "~staticPath/css/common.styl";
  .textareainfo
    width 100%
    box-sizing border-box
    height 150px
    border none
    font-size 28px
    &::placeholder
      font-size 24px
      color: #999;
</style>

