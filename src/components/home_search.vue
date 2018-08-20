<template>
  <div id="box_content">
    <Header backstate title="无面单查询"></Header>
    <div class="screening-box bg_white mt_10 mb_10">
      <div @click="screeningmethods" :class="{'screen-text':!screeningpage,'screen-text-active':screeningpage}">筛选</div>
      <div @click="$router.push({name:'search'})" class="search-text">搜索</div>
    </div>
    <div class="main_box">
      <div class="list-box bg_white" v-show="defaultlist.length">
        <vue-better-scroll ref="searchscroll" style="height: 100%" :scrollbar="scrollbarObj"  :pullDownRefresh="pullDownRefreshObj" :pullUpLoad="pullUpLoadObj" :startY="parseInt(startY)"  @pullingDown="onPullingDown" @pullingUp="onPullingUp">
          <router-link tag="dl" v-for="(item,index) in defaultlist" :to="{name:'details',query: {id:item.id }}" :key="index">
            <dt><img v-lazy="item.registerThumbnailLink" alt=""></dt>
            <dd>
              <p>登记网点：{{item.registerNetDotName}}<strong>{{item.statusName}}</strong></p>
              <p>登记员工：{{item.registerStaffName}}</p>
              <p>认领状态：{{item.statusName}}</p>
              <div class="basic-info">
                <span>物品类别：{{item.goodsTypeName}}</span>
                <span>包装材质：{{item.baleTextureName}}</span>
              </div>
              <p class="f_24 text_999">登记时间: {{item.registerTime}}</p>
            </dd>
          </router-link>
          <div v-if="deafaultpagestate" class="pt_20 pb_20 text_c text_999 f_24" style="font-size: 12px;text-align: center;color: #999;padding-top: 20px;padding-bottom: 20px">没有更多了...</div>
        </vue-better-scroll>
      </div>
      <div v-if="defaultlist.length==0"  style="height: 100%">
        <Notfound textinfo="暂无相关内容"></Notfound>
      </div>
    </div>
    <div class="footermenu">
      <span @click="$router.push({name:'home'})" class="text_FF964D"><i class="noorder-search-active"></i><cite>无面单查询</cite></span>
      <span @click="$router.push({name:'mineinfo'})"><i class="noorder-info"></i><cite>与我相关</cite></span>
    </div>
    <div class="all_register" @click="$router.push({path:'/checkin'})"></div>
    <div v-show="screeningpage" class="screen-content" @click.stop>
      <div class="screen-center-content">
        <van-cell-group>
          <div class="home-cell">
            <label>登记网点</label>
            <div class="right_box">
              <input class="feldinput" type="text" v-model="registerNetDotText" @input.stop="searchNetDot(registerNetDotText,'reg')" placeholder="请输入" />
              <div class="floatDiv" v-show="registernetDotshow" @click.stop>
                <ul>
                  <li v-for="(item,index) in registernetDotSearchlist" @click.stop="checkedIndexNet(index,'reg')">{{item.fullName}}</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="home-cell">
            <label>认领网点</label>
            <div class="right_box">
              <input class="feldinput" type="text" v-model="claimNetDotText" placeholder="请输入" @input.stop="searchNetDot(claimNetDotText,'cal')"/>
              <div class="floatDiv" v-show="claimNetDotshow" @click.stop>
                <ul>
                  <li v-for="(item,index) in claimNetDotSearchlist" @click.stop="checkedIndexNet(index,'cal')">{{item.fullName}}</li>
                </ul>
              </div>
            </div>
          </div>
          <van-cell @click="upactionMenu('goods')" is-link>
            <div class="text_999 f_24">{{goodstext}}</div>
            <template slot="title">
              <span class="van-cell-text">物品类别</span>
            </template>
          </van-cell>
          <van-cell @click="upactionMenu('state')" is-link>
            <div class="text_999 f_24">{{stateText}}</div>
            <template slot="title">
              <span class="van-cell-text">状态</span>
            </template>
          </van-cell>
          <van-cell @click="upactionMenu('send')" is-link>
            <div class="text_999 f_24">{{sendprovinceStr}}</div>
            <template slot="title">
              <span class="van-cell-text">省市区县</span>
            </template>
          </van-cell>
          <van-cell @click="upactionMenu('starttime')" is-link>
            <div class="text_999 f_24">
              {{starttime}}
            </div>
            <template slot="title">
              <span class="van-cell-text">登记开始时间</span>
            </template>
          </van-cell>
          <van-cell @click="upactionMenu('endtime')" is-link>
            <div class="text_999 f_24">{{endtime}}</div>
            <template slot="title">
              <span class="van-cell-text">登记结束时间</span>
            </template>
          </van-cell>
        </van-cell-group>
      </div>
      <div class="screen-bottom">
        <span @click="formDatereset" class="reset">重置</span>
        <span @click="homesearchPagesubmit" class="submitbtn">查询</span>
      </div>
    </div>

    <van-actionsheet v-model="actionmenushow">
      <van-picker v-if="goodsstate" :columns="goodsTypepage"  show-toolbar :title="title"  @cancel="onCancel"  @confirm="onConfirmgoods" />
      <van-picker v-if="orderstateshow" :columns="orderstate"  show-toolbar :title="title"  @cancel="onCancel"  @confirm="onConfirmstate" />
      <areaComponets v-if="sendareastate" @submitarea="checkedgetAreadata"></areaComponets>
      <van-datetime-picker v-if="startTimestate"  v-model="currentDate" type="date" :min-date="minDate" :max-date="maxDate" @cancel="onCancel"  @confirm="onConfirmstartime" />
      <van-datetime-picker v-if="endTimestate"  v-model="currentDate" type="date" :min-date="minDate" :max-date="maxDate" @cancel="onCancel"  @confirm="onConfirmendtime" />
    </van-actionsheet>
  </div>
</template>
<script>
  import Header from '@/components/common/header'
  import { mapState } from 'vuex'
  import {Commonmixin} from '@/mixins/common'
  import VueBetterScroll from 'vue2-better-scroll'
  import Notfound from '@/components/common/notfound';
  import { Cell, CellGroup,Actionsheet,Picker,DatetimePicker} from 'vant';
  export default {
    mixins:[Commonmixin],
    data(){
      return{
        screeningpage:false,
        screenconditionBox:true,/*设置是否显示检索条件框*/
        startTimestate:false,
        endTimestate:false,
        starttime:'请选择',
        endtime:'请选择',
        startstmap:null,
        endstmap:null,



        defaultlist:[],
        deafaultpages:0,
        deafaultpagestate:false,
        defaultpageNum:1,



        pageSize:20,

        // 这个配置可以开启滚动条，默认为 false。当设置为 true 或者是一个 Object 的时候，都会开启滚动条，默认是会 fade 的
        scrollbarObj: false,
        // 这个配置用于做下拉刷新功能，默认为 false。当设置为 true 或者是一个 Object 的时候，可以开启下拉刷新，可以配置顶部下拉的距离（threshold） 来决定刷新时机以及回弹停留的距离（stop）
        pullDownRefreshObj: {
          threshold: 50,
          stop: 0
        },
        // 这个配置用于做上拉加载功能，默认为 false。当设置为 true 或者是一个 Object 的时候，可以开启上拉加载，可以配置离底部距离阈值（threshold）来决定开始加载的时机
        pullUpLoadObj: {
          threshold: 0,
          txt: {
            more: '加载更多',
            noMore: '没有更多数据了'
          }
        },


        startY: 0,  // 纵轴方向初始化位置
        scrollToX: 0,
        scrollToY: 0,
        scrollToTime: 500,



        stateText:'请选择',
        status:'',
        goodsType:'',
        sendareastate:false,

        sendprovinceStr:'请选择',
        provinceId:'',
        cityId:'',
        districtId:'',

        minHour: 10,
        maxHour: 20,
        minDate: new Date(new Date().getFullYear()-1,1,1),
        maxDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
        currentDate: new Date(),

        searchObj:null,/*存储检索对象*/


      }
    },
    created(){
        this.searchObj=this.$route.query;
        this.loaddefault()
    },
    mounted(){
      var _self=this;
      document.querySelector('.list-box').style.height=document.querySelector('.main_box').clientHeight+'px'
      document.querySelector('.screen-center-content').onclick=function (e) {
        _self.claimNetDotshow=false
        _self.registernetDotshow=false
        e.stopPropagation()
      }
    },

    methods:{
      checkedgetAreadata(res){
        if(res.provinceactive){
          this.provinceId=res.provinceactive.code
        }
        if(res.cityactive){
          this.cityId=res.cityactive.code
        }
        if(res.regionactive){
          this.districtId=res.regionactive.code
        }
        this.sendprovinceStr=res.provinceactive.fullName+'/'+res.cityactive.fullName+'/'+res.regionactive.fullName
        this.confirmarea();
      },
      /*加载默认数据*/
      loaddefault(){

        this.screeningpage=false
        if(this.deafaultpagestate){
          return ;
        }
        this.$store.dispatch('searchInfo',this.searchObj)
          .then(res=>{
            this.deafaultpages=res.data.pages;
            this.defaultlist=this.defaultlist.concat(res.data.list);
            this.defaultpageNum=(this.defaultpageNum)+1
            if(this.defaultpageNum>this.deafaultpages){
              this.deafaultpagestate=true;
              this.pullUpLoadObj=false;
              this.$refs.searchscroll.forceUpdate(false)
            }else{
              this.$refs.searchscroll.forceUpdate(true);
              this.pullUpLoadObj={
                threshold: 0,
                txt: {
                  more: '加载更多',
                  noMore: '没有更多数据了'
                }
              }
            }
          })

      },


      formDatereset(){
        this.registerNetDot=''/*登记网点*/
        this.claimNetDot=''/*认领网点*/
        this.stateText='请选择'
        this.status=''
        this.goodsType=''
        this.sendareastate=false
        this.sendprovinceStr='请选择'
        this.provinceId=''
        this.cityId=''
        this.districtId=''
        this.endtime='请选择'
        this.starttime='请选择'
        this.startstmap=null
        this.endstmap=null
      },


      onPullingUp(){
        this.loaddefault()
      },

      onPullingDown(){
        this.defaultlist=[]
        this.defaultpageNum=1
        this.deafaultpages=0
        this.deafaultpagestate=false
        this.loaddefault()
      },

      screeningmethods(){
        let screetbox=document.querySelector('.screening-box').clientHeight
        let offsettop=document.querySelector('.screening-box').offsetTop
        let popfloat=document.querySelector('.screen-content');
        popfloat.style.top=(screetbox+offsettop)+'px'
        if(this.screeningpage){
          this.screeningpage=false
          document.querySelector('.main_box').style.overflow='auto'
        }else{
          this.screeningpage=true
          document.querySelector('.main_box').style.overflow='hidden'
        }
      },

    },
    components:{
      Header,
      VueBetterScroll,
      Notfound,
      'van-datetime-picker':DatetimePicker
    }
  }

</script>
<style lang="stylus" scoped>
  @import "~staticPath/css/theme.styl";
  @import "~staticPath/css/common.styl";
  #box_content
    position relative
  .all_register
    position fixed
    width 96px
    height 96px
    bg-image('./src/assets/img/facesheet_edit')
    background-size cover
    z-index 99
    bottom 128px
    border-radius 50%
    box-shadow:0px 4px 8px 0px rgba(255,184,139,1);
    right 20px
  .main_box
    box-sizing border-box
    position relative
    .list-box
      background white
      padding-left 20px
      padding-top 20px
      position relative
      overflow auto
      dl
        display flex
        flex-flow row nowrap
        justify-content flex-start
        align-items flex-start
        bd-d(#E8E8E8)
        padding-bottom 20px
        margin-bottom 20px
        font-size 28px
        &:last-child::after
          display none
          border-top none!important

        dt
          width 152px
          height 152px
          display flex
          flex-flow row nowrap
          justify-content center
          align-items center
          background #e8e8e8
          img
            display block
            max-height 152px
            max-width 152px
            margin 0 auto
        dd
          flex 1
          margin-left 20px
          padding-right 20px
          p
            position relative
            padding 3px 0px
            strong
              font-weight bolder
              position absolute
              right 0px
          .basic-info
            display flex
            margin-top 20px
            flex-flow row nowrap
            justify-content flex-start
            align-items center
            span
              flex 1
              font-size 24px
              color #999999
  .footermenu
    display flex
    flex-flow row nowrap
    justify-content center
    align-items center
    background white
    border-top 1px solid #EDEDED
    span
      flex 1
      height 98px
      text-align center
      display flex
      justify-content center
      align-items center
      position relative
      &:first-child::after
        position absolute
        content ""
        right 0px
        top 30px
        bottom 30px
        width 1px
        background #e8e8e8
      i
        display inline-block
        height 40px
        width 40px
        margin-right 10px
        background-size cover
        &.noorder-search
          bg-image('./src/assets/img/facesheet_searchun')
        &.noorder-search-active
          bg-image('./src/assets/img/facesheet_search')
        &.noorder-info-active
          bg-image('./src/assets/img/facesheet_personaluncopy')
        &.noorder-info
          bg-image('./src/assets/img/facesheet_personalun')
  .screening-box
    font-size 28px
    padding 20px;
    display flex
    flex-flow row nowrap
    justify-content space-between
    align-items center
    .screen-text
      padding-right 30px
      bg-image('./src/assets/img/gray')
      background-size 20px auto
      background-position right center
    .screen-text-active
      padding-right 30px
      bg-image('./src/assets/img/orange')
      background-size 20px auto
      background-position right center
    .search-text
      color #999
      position relative
      padding-left 20px
      &::before
        position absolute
        content ""
        left 0px
        top 10px
        bottom 10px
        width 1px
        border-left 1px solid #eee


</style>

