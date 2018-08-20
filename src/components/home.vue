<template>
  <div id="box_content">
      <div class="search_header">
        <Header closewhitestate bg="none" textColor="#fff" title="快件查询"></Header>
        <div class="flex-box">
          <form @submit="searching">
            <input type="search" v-model="waybillNo" placeholder="请输入查询单号">
            <cite v-if="delstate" @click="waybillNo=''"></cite>
          </form>
          <span @click.stop="scan"></span>
        </div>
      </div>
      <div class="main_box">
        <ul class="history-list" v-if="showhis">title
          <li v-if="historylist" v-for="(item,index) in historylist" :key="index">
            <span>{{item}}</span>
            <cite @click="delhis(index)"></cite>
          </li>
        </ul>
        <div class="showinfo" >
          <div class="figure_box">
            <p class="title">物流信息</p>
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
  import { Cell, CellGroup,Actionsheet,Picker,DatetimePicker} from 'vant';
  export default {
    data(){
      return{
        waybillNo:'',
        showinfo:null,
        historylist:[],
        delstate:false
      }
    },
    created(){
      this.$function.DelLoading()
    },
    computed:{

      showhis(){
        if(this.waybillNo.length){
          this.delstate=true;
          return false
        }else{
          this.delstate=false;
          return true
        }
      }
    },
    methods:{
      scan(){
        alert('扫一扫')
      },
      delhis(index){
        this.historylist.splice(index,1);
      },
      searching(){
        this.historylist.push(this.waybillNo)
        this.$store.dispatch('checkExpress',this.waybillNo)
          .then(res=>{
            this.showinfo=res;
          })
      }
    },
    components:{
      Header,
      VueBetterScroll,
      Notfound,
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
  .figure_box
    padding 40px
    p.title
      bg-image('./src/assets/img/express_car')
      height 50px
      padding-left 150px
      background-position left center
      background-size auto 50%
</style>

