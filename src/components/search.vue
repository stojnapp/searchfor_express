<template>
  <div id="box_content">
    <div class="search-box">
      <div class="backbtn" @click="$router.go(-1)"></div>
      <div class="search-input">
        <div v-if="ishowclearbtn" class="clearbtn" @click="searchvalue=''"></div>
        <input type="text" v-model="searchvalue" placeholder="输入运输车牌号">
      </div>
    </div>
      <div class="main_box">
        <div class="list-box bg_white" v-show="searchlist.length">
          <vue-better-scroll ref="searchscroll" style="height: 100%" :scrollbar="scrollbarObj"  :pullDownRefresh="pullDownRefreshObj" :pullUpLoad="pullUpLoadObj" :startY="parseInt(startY)"  @pullingDown="onPullingDown" @pullingUp="onPullingUp">
            <router-link tag="dl" v-for="(item,index) in searchlist" :to="{name:'details',query: {id:item.id }}" :key="index">
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
            <div v-if="searchpagestate" class="pt_20 pb_20 text_c text_999 f_12" style="font-size: 12px;text-align: center;color: #999;padding-top: 20px;padding-bottom: 20px">没有更多了...</div>
          </vue-better-scroll>
        </div>
        <div v-if="searchlist.length==0"  style="height: 100%">
          <Notfound textinfo="暂无相关内容"></Notfound>
        </div>
      </div>
  </div>
</template>
<script>
  import Header from '@/components/common/header'
  import Notfound from '@/components/common/notfound'
  import VueBetterScroll from 'vue2-better-scroll'
  export default {
    data(){
      return{
        searchvalue:'',

        searchlist:[],
        searchpages:0,
        searchpagestate:false,
        searchpageNum:1,

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
        searchpullUpLoadObj: {
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
      }
    },
    watch:{
      'searchvalue':function (value) {
        this.searchlist=[]
        this.searchpageNum=1
        this.searchpages=0
        this.searchpagestate=false
        if(value.length){
          this.onSearch();
        }
      }
    },
    mounted(){
      document.querySelector('.list-box').style.height=document.querySelector('.main_box').clientHeight+'px'
    },
    computed:{
      ishowclearbtn(){
        var showstate=false;
        if(this.searchvalue.length){
         showstate=true;
        }
        return showstate
      }
    },
    methods:{
      onSearch(){
        if(this.searchpagestate){
          return ;
        }

       var licencePlate=this.searchvalue;
       this.$store.dispatch('searchInfo',{licencePlate})
         .then(res=>{
           this.searchpages=res.data.pages;
           this.searchlist=this.searchlist.concat(res.data.list);
           this.searchpageNum=(this.searchpageNum)+1

           if(this.searchpageNum>this.searchpages){
             this.searchpagestate=true;
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

      onPullingUp(){
        this.onSearch()
      },

      onPullingDown(){
        this.searchlist=[]
        this.searchpageNum=1
        this.searchpages=0
        this.searchpagestate=false
        this.onSearch()
      },

    },
    components:{
      Header,
      Notfound,
      VueBetterScroll,
    }
  }

</script>
<style lang="stylus" scoped>
  @import "~staticPath/css/theme.styl";
  @import "~staticPath/css/common.styl";
.search-box
  height 98px
  background white
  display flex
  align-items center
  justify-content space-between
  .backbtn
    bg-image('./src/assets/img/back')
    height 100%
    width 80px
    background-size 32px auto
  .search-input
    flex 1
    padding-right 20px
    position relative
    align-items center
    .clearbtn
      bg-image('./src/assets/img/close')
      width 40px
      height 40px
      position absolute
      right 40px
      top 50%
      margin-top -20px
      border-radius 50%
      overflow hidden
      background-size 30px 30px
    input
      border-radius 8px
      padding-left 20px
      box-sizing border-box
      width 100%
      font-size 28px
      padding 15px 80px 15px 70px
      border none
      background #EFEFEF
      bg-image('./src/assets/img/search_search')
      background-size auto 50%
      background-position 20px center
.main_box
  box-sizing border-box
  overflow hidden
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

