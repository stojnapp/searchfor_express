<template>
  <div id="box_content">
      <div class="search_header">
        <Header closewhitestate bg="none" textColor="#fff" title="快件查询"></Header>
        <div class="flex-box">
          <form @submit="searching">
            <input type="search" v-model="waybillNo" placeholder="请输入查询单号">
            <cite v-if="showhis" @click="waybillNo=''"></cite>
          </form>
          <span @click.stop="scan"></span>
        </div>
      </div>
      <div class="main_box">
        <ul class="history-list" v-if="historystate">
          <li v-if="historylist" v-for="(item,index) in historylist" :key="index">
            <span @click="searchhistory(item)">{{item}}</span>
            <cite @click="delhis(index)"></cite>
          </li>
        </ul>
        <div class="showinfo"  v-if="showinfostate">
          <div style="width: 100%" v-if="showinfo&&showinfo.length">
            <div class="figure_box">
              <p class="title">物流信息:</p>
              <div class="figure_state">
                <dl v-for="(item,index) in expresssatelist" :key="index" :class="{'active':expressactive==index}">
                  <dt>{{item.name}}</dt>
                  <dd></dd>
                </dl>
              </div>
            </div>
            <ul class="infolist">
              <li v-for="(item,index) in showinfo" :class="{'active':index===0}">
                <div class="info_date">
                  <h4>{{item.scanDate|fomartDate}}</h4>
                  <p>{{item.scanDate|fomartDateHour}}</p>
                </div>
                <div class="info_detail">
                  <h4>{{item.scanType}}</h4>
                  <p>
                    {{item.memo}}
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div class="text_c text_999 f_24 pt_20" v-else>
            暂无物流信息...
          </div>
        </div>

      </div>

    </div>
</template>
<script>
  import Header from '@/components/common/header'
  import { mapState } from 'vuex'
  import VueBetterScroll from 'vue2-better-scroll'
  import Notfound from '@/components/common/notfound';
  import {  Step, Steps } from 'vant';
  export default {
    data(){
      return{
        waybillNo:'',
        showinfo:[],
        historylist:[],
        delstate:false,
        showinfostate:false,
        historystate:false,
        expressactive:0,
        expresssatelist:[{name:'发货中',value:0},{name:'运输中',value:1},{name:'派件中',value:2},{name:'已签收',value:3}]
      }
    },
    created(){
      this.$function.DelLoading()
    },
    filters:{
      fomartDate(value){
        var arr=[];
        if(value.length){
          arr=value.split(' ')
        }
        return arr[0]
      },
      fomartDateHour(value){
        var arr=[];
        if(value.length){
          arr=value.split(' ')
        }
        return arr[1]
      }

    },
    computed:{
      showhis(){
        if(this.waybillNo.length){
          this.historystate=false
          return true
        }else{
          this.historystate=true
          this.showinfostate=false
          return false
        }
      },
    },
    methods:{
      scan(){
        alert('扫一扫')
      },
      delhis(index){
        this.historylist.splice(index,1);
        this.showinfostate=false;
      },

      /*过滤物流状态*/
      getExpressState(value){
        /*收件,发件,到件,派件,第三方代收,签收,问题件,留仓件,发包,到包,发车,装车,到车*/
        switch (value){
          case '收件':
            this.expressactive=0;
            break;
          case '发件':
          case '到件':
          case '发包':
          case '到包':
          case '发车':
          case '到车':
            this.expressactive=1;
            break;
          case '派件':
          case '第三方代收':
            this.expressactive=2;
            break;
          case '签收':
            this.expressactive=3;
            break;
        }

      },

      /*点击历史单号查询*/
      searchhistory(item){
        this.showinfo=null;
        this.waybillNo=item;
        this.$store.dispatch('checkExpress',item)
          .then(res=>{
            this.showinfostate=true;
            if (res.length){
              this.historystate=false;
              this.showinfo=res;
              this.getExpressState(res[0].scanType)
            }
          })
      },
      searching(){
        this.historylist.push(this.waybillNo)
        this.showinfo=null;
        this.$store.dispatch('checkExpress',this.waybillNo)
          .then(res=>{
            this.showinfostate=true;
            if(res.length){
              this.historystate=false;
              this.showinfo=res;
              this.getExpressState(res[0].scanType)
            }
          })
      }
    },
    components:{
      Header,
      VueBetterScroll,
      Notfound,
      'van-steps':Steps,
      'van-step':Step
    }
  }

</script>
<style lang="stylus" scoped>
  @import "~staticPath/css/theme.styl";
  @import "~staticPath/css/common.styl";
.search_header
  background linear-gradient(left, #FE7621 0%,#FFAE45 100%)
  .flex-box
    display flex
    flex-flow nowrap row
    align-items center
    justify-content center
    height 92px
    background white
    padding 0px 40px
    margin 40px
    border-radius 46px
    form
      box-sizing: border-box;
      flex 1
      background white
      border none
      height 60px
      line-height 60px
      padding-right 60px
      position relative
      input
        height 60px
        width 100%
        box-sizing border-box
        border none
      cite
        position absolute
        width 40px
        height 40px
        bg-image('./src/assets/img/close')
        background-size cover
        right 10px
        top 50%
        margin-top -20px
    span
      width 50px
      height 50px
      background-size cover
      bg-image('./src/assets/img/express_scan')
.history-list
  padding 0px 40px
  height 100%
  display block
  overflow-y auto
  li
    background white!important
    bd-d(#e8e8e8)
    display flex
    align-items center
    justify-content flex-start
    flex-flow row nowrap
    span
      flex 1
      padding 25px 20px
    cite
      width 80px
      height 60px
      bg-image('./src/assets/img/search_fork')
      background-size auto 40%
.showinfo
  background white
  overflow-y auto
  height 100%
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
  box-sizing border-box
  .infolist
    width 100%
    flex 1
    box-sizing border-box
    overflow-y auto
    padding 0px 40px 50px 50px
    li
      display flex
      flex-flow row nowrap
      justify-content flex-start
      align-items flex-start
      box-sizing border-box
      color #999999
      .info_date
        padding-right 40px
        h4
          font-size 28px
        p
          font-size 24px
      .info_detail
        padding-left 40px
        flex 1
        padding-bottom 40px
        position relative
        &::before
          content ""
          position absolute
          top: 0px
          width 40px
          height 40px
          bg-image('./src/assets/img/express_gray')
          background-size cover
          left -20px
        &::after
          content ""
          position absolute
          top: 40px
          width 2px
          background #999
          bottom 0px
          left -1px
      &.active
        color #FE7621
        .info_detail::before
          bg-image('./src/assets/img/express_orange')
        .info_detail::after
          background #FE7621
  .figure_box
    padding 40px
    width 100%
    box-sizing border-box
    p.title
      bg-image('./src/assets/img/express_car')
      height 50px
      padding-left 60px
      font-size 36px
      background-position left center
      background-size auto 80%
      color #666
    .figure_state
      width 100%
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
      padding-top 60px
      dl
        flex 1
        text-align center
        dt
          color #999
          display inline-block
          margin 0 auto
          height 54px
          padding 0px 20px
          line-height 54px
          font-size 28px
          margin-bottom 10px
        dd
          height 40px
          position relative
          &::before
            position absolute
            content ""
            width 20px
            height 20px
            border 10px #fff solid
            background #D8D8D8
            border-radius 50%
            left 50%
            top: 50%
            margin-left -20px
            margin-top -20px
            z-index 4
           &::after
            position absolute
            content ""
            height 2px
            left 0px
            right 0px
            top: 50%
            background #D8D8D8
            margin-top -1px
            z-index 3
        &:first-child > dd::after
          left 50%!important
        &:last-child > dd::after
          right 50%!important
        &.active
          dt
            background #FE7621
            border-radius 27px
            color white
            position relative
            &::after
              position absolute
              content ""
              width:0;
              height:0;
              border-width:10px 10px 0;
              border-style:solid;
              border-color:#FE7621 transparent transparent;
              top:54px
              right 50%
              margin-right -10px
              z-index 5
          dd
            &::before
              background #FE7621


</style>

