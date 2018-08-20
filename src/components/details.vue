<template>
  <div id="box_content">
      <Header backstate title="面单详情"></Header>
      <div class="main_box">
        <van-tabs v-model="active" @click="tabActive" :line-width="60" class="tab-outline-box">
          <van-tab title="登记">
            <van-cell-group class="mt_10">
              <van-cell title="状态"><span class="text_FF964D">{{detailinfo.statusName}}</span></van-cell>
              <van-cell title="登记时间"><span class="text_999">{{detailinfo.registerTime}}</span></van-cell>
            </van-cell-group>
            <van-cell-group class="mt_10">
              <van-cell title="登记网点"><span class="text_999">{{detailinfo.registerNetDotName}}</span></van-cell>
              <van-cell title="登记员工"><span class="text_999">{{detailinfo.registerStaffName}}</span></van-cell>
              <van-cell title="物品类别"><span class="text_999">{{detailinfo.goodsTypeName}}</span></van-cell>
              <van-cell title="包装材质"><span class="text_999">{{detailinfo.baleTextureName}}</span></van-cell>
              <van-cell title="物品重量"><span class="text_999">{{detailinfo.goodsWeight}}</span></van-cell>
              <van-cell title="内件颜色"><span class="text_999">{{detailinfo.internalsColor}}</span></van-cell>
              <van-cell title="运输车牌号"><span class="text_999">{{detailinfo.licencePlate}}</span></van-cell>
              <van-cell title="情况说明" :label="detailinfo.registerExplain"></van-cell>
            </van-cell-group>

          </van-tab>
          <van-tab title="认领">
            <div v-if="detailinfo.status===1||detailinfo.status==2||detailinfo.status==3">
                <van-cell-group class="mt_10">
                  <van-cell title="认领网点"><span class="text_FF964D">{{detailinfo.claimNetDotName}}</span></van-cell>
                  <van-cell title="认领员工"><span class="text_999">{{detailinfo.claimStaffName}}</span></van-cell>
                  <van-cell v-if="claimInfo.billno" title="运单号"><span class="text_999">{{claimInfo.billno}}</span></van-cell>
                  <van-cell v-if="claimInfo.goodsname" title="物品名称"><span class="text_999">{{claimInfo.goodsname}}</span></van-cell>
                  <van-cell v-if="claimInfo.weight" title="物品重量"><span class="text_999">{{claimInfo.weight}}KG</span></van-cell>
                </van-cell-group>
                <p class="f_24 text_999 pl_30 pt_10">寄件信息</p>
                <van-cell-group class="mt_10">
                  <van-cell v-if="claimInfo.sendperson" title="寄件人"><span class="text_999">{{claimInfo.sendperson}}</span></van-cell>
                  <van-cell v-if="claimInfo.sendtel" title="联系电话"><span class="text_999">{{claimInfo.sendtel}}</span></van-cell>
                  <van-cell v-if="claimInfo.sendprovince||claimInfo.sendcity||claimInfo.sendarea" title="省市区县"><span class="text_999">{{claimInfo.sendprovince}}{{claimInfo.sendcity}}{{claimInfo.sendarea}}</span></van-cell>
                  <van-cell v-if="claimInfo.sendaddress" title="详细地址"><span class="text_999">{{claimInfo.sendaddress}}</span></van-cell>
                </van-cell-group>
                <p class="f_24 text_999 pl_30 pt_10">收件信息</p>
                <van-cell-group class="mt_10">
                  <van-cell v-if="claimInfo.receiveperson" title="收件人"><span class="text_999">{{claimInfo.receiveperson}}</span></van-cell>
                  <van-cell v-if="claimInfo.receivetel" title="联系电话"><span class="text_999">{{claimInfo.receivetel}}</span></van-cell>
                  <van-cell v-if="claimInfo.receiveprovince||claimInfo.receivecity||claimInfo.receivearea" title="省市区县"><span class="text_999">{{claimInfo.receiveprovince}}{{claimInfo.receivecity}}{{claimInfo.receivearea}}</span></van-cell>
                  <van-cell v-if="claimInfo.receiveaddress" title="详细地址"><span class="text_999">{{claimInfo.receiveaddress}}</span></van-cell>
                </van-cell-group>
                <van-cell-group class="mt_10">
                  <van-cell title="情况说明" :label="detailinfo.claimExplain?detailinfo.claimExplain:'暂无说明'"></van-cell>
                </van-cell-group>

            </div>

          </van-tab>
          <van-tab title="图片">

            <div class="bg_white mt_10 pt_20 pb_20 pl_30 pr_20">
              <p>登记图片</p>
              <ul class="pic-list clearfix" v-if="registrationpic.length">
                <li @click="imageRead(item.fileLink)" v-for="(item,index) in registrationpic">
                  <img v-lazy="item.fileLink" :alt="item.uploadTime">
                </li>
              </ul>
              <p class="f_24 text_c text_999 pb_20 pt_20" v-else>暂无图片</p>
            </div>

            <div class="bg_white mt_10 pt_20 pb_20 pl_30 pr_20" v-if="detailinfo.status==1||detailinfo.status==2||detailinfo.status==3">
              <p>认领图片</p>
              <ul class="pic-list clearfix"  v-if="claimpic.length">
                <li @click="imageRead(item.fileLink)" v-for="(item,index) in claimpic">
                  <img v-lazy="item.fileLink" :alt="item.uploadTime">
                </li>
              </ul>
              <p class="f_24 text_c text_999 pb_20 pt_20" v-else>暂无图片</p>
            </div>

          </van-tab>
          <van-tab title="物流">
            <div v-if="detailinfo.waybillNumber">
              <van-steps v-if="billNumberinfo.length" direction="vertical" :active="0" active-color="#f60" class="pb_20 mt_20">
                <van-step v-for="(item,index) in billNumberinfo" :key="index">
                  <h3>{{item.memo}}</h3>
                  <p>{{item.scanDate}}</p>
                </van-step>
              </van-steps>
              <div class="text_c f_24 text_999 bg_white mt_10 pt_20 pb_20" v-else>
                暂无物流信息...
              </div>
            </div>
            <div class="text_c f_24 text_999 bg_white mt_10 pt_20 pb_20" v-else>
                很遗憾,没有找到物流信息...
            </div>

          </van-tab>
        </van-tabs>



      </div>
      <div class="bottom-btn" v-if="detailinfo.status===0" @click="Getorder">
        <span><i class="claimOrder"></i><cite>认领</cite></span>
      </div>
      <div class="bottom-btn" v-if="detailinfo.status===1">
        <span @click="auditDostate(detailinfo.id,0)"><i class="audit-back"></i><cite>审核打回</cite></span>
        <span @click="auditDostate(detailinfo.id,2)"><i class="audit-pass"></i><cite>审核通过</cite></span>
      </div>
      <div class="bottom-btn" v-if="detailinfo.status===2" @click="printOrder">
        <span><i class="print-btn"></i><cite>打印面单</cite></span>
      </div>
  </div>
</template>
<script>
  import Header from '@/components/common/header'
  import { Tab, Tabs,Cell, CellGroup,ImagePreview,Step, Steps} from 'vant';
  import {Detailsmixin} from '@/mixins/common'
  export default {
    data(){
      return{
        active:0
      }
    },
    mixins:[Detailsmixin],
    mounted(){
      document.querySelector('.van-tabs__content').style.height='100%'
      document.querySelector('.van-tabs__content').style.overflowY='auto'
    },
    methods:{
      imageRead(url){
        ImagePreview([url]);
      },
      Getorder(){
        this.$router.push({name:'claimpage',query: {id:this.id,billno:this.detailinfo.waybillNumber?this.detailinfo.waybillNumber:''}})
      },
      printOrder(){
        if(this.detailinfo.registerNetDot==this.$store.state.userinfo.companyCode){
          this.$router.push({name:'print',query: {id:this.id}})
        }else{
          this.$Tools.TestTost('没有打印权限');
          return ;
        }
      }
    },
    components:{
      Header,
      'van-tabs':Tabs,
      'van-tab':Tab,
      'van-cell-group':CellGroup,
      'van-cell':Cell,
      ImagePreview,
      'van-steps':Steps,
      'van-step':Step
    }
  }

</script>
<style lang="stylus" scoped>
  @import "~staticPath/css/theme.styl";
  @import "~staticPath/css/common.styl";
  .tab-outline-box
    height 100%
    overflow-y hidden
  .van-step--vertical:not(:last-child)::after
    border-bottom-width:0px
</style>

