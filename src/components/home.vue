<template>
  <div id="box_content">
      <div class="search_header">
        <Header closewhitestate bg="none" textColor="#fff" title="快件查询"></Header>
        <div class="flex-box">
          <form @submit="searching">
            <input type="search" placeholder="请输入查询单号">
          </form>
          <span @click.stop="scan"></span>
        </div>
      </div>
      <div class="main_box">
        <ul class="history-list">
          <li>
            <span>123456798456789</span>
            <cite></cite>
          </li>
        </ul>
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

      }
    },
    created(){
      this.$function.DelLoading()
    },
    methods:{
      scan(){
        alert('扫一扫')
      },
      searching(){
        alert('aa')
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
      input
        height 60px
        width 100%
        border none
    span
      width 50px
      height 50px
      background-size cover
      bg-image('./src/assets/img/express_scan')
.history-list
  padding 0px 40px
  max-height 100%
  display block
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

</style>

