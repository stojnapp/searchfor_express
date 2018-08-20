<template>
  <div id="box_content">
      <Header backstate title="与我相关"></Header>
      <div class="main_box">
        <div class="tab_title_box">
          <span :class="{'active':active==0}" @click="tabtitlecheck(0,'res')">本网点登记</span>
          <span :class="{'active':active==1}" @click="tabtitlecheck(1,'cla')">本网点认领</span>
        </div>
        <div class="tab_content_box">
          <ul class="tab-box mt_10 bg_white" v-if="active===0">
            <li v-for="(item,index) in resitertitle" @click="restierTitle(index,'res')" :class="{'active':restitleacitive==index}" :key="index">{{item.text}}</li>
          </ul>
          <ul class="tab-box mt_10 bg_white" v-if="active===1">
            <li v-if="index!=0" v-for="(item,index) in resitertitle" @click="restierTitle(index,'cla')" :class="{'active':claimtitleacitive==index}" :key="index">{{item.text}}</li>
          </ul>
          <div class="bg_white tab-box-list">
            <div class="list-box" v-show="defaultlist.length">
              <vue-better-scroll ref="searchscroll" style="height: 100%" :scrollbar="scrollbarObj"  :pullDownRefresh="pullDownRefreshObj" :pullUpLoad="pullUpLoadObj" :startY="parseInt(startY)"  @pullingDown="onPullingDown" @pullingUp="onPullingUp">
                <router-link tag="dl" v-for="(item,index) in defaultlist" :to="{name:'details',query: {id:item.id }}" :key="index">
                  <dt><img v-lazy="item.registerThumbnailLink" alt=""></dt>
                  <dd>
                    <p>登记网点：{{item.registerNetDotName}}<strong>{{item.statusName}}</strong></p>
                    <p>登记员工：{{item.registerStaffName}}</p>
                    <div class="btn-box">
                      <div class="basic-info">
                        <span>物品类别：{{item.goodsTypeName}}</span>
                        <span>包装材质：{{item.baleTextureName}}</span>
                      </div>
                      <p class="f_24 text_999">登记时间: {{item.registerTime}}</p>
                      <div class="btn-do-box" v-if="searchtype=='res'&&status===0" @click.stop="setorderopetion(item.id)">
                        <div class="btn-do">操作</div>
                      </div>
                    </div>

                  </dd>
                </router-link>
                <div v-if="deafaultpagestate" class="pt_20 pb_20 text_c text_999 f_24" style="font-size: 12px;text-align: center;color: #999;padding-top: 20px;padding-bottom: 20px">没有更多了...</div>
              </vue-better-scroll>
            </div>
            <div v-if="defaultlist.length==0"  style="height: 100%">
              <Notfound textinfo="暂无相关内容"></Notfound>
            </div>
          </div>

        </div>


      </div>
      <div class="footermenu">
        <span @click="$router.push({name:'home'})"><i class="noorder-search"></i><cite>无面单查询</cite></span>
        <span @click="$router.push({name:'mineinfo'})" class="text_FF964D"><i class="noorder-info-active"></i><cite>与我相关</cite></span>
      </div>
    <van-actionsheet v-model="show">
      <div @click="dooption(item.value)" v-for="(item,index) in actions" class="bottom_action_btn">{{item.name}}</div>
    </van-actionsheet>
  </div>
</template>
<script>
  import Header from '@/components/common/header'
  import { mapState } from 'vuex'
  import { Tab, Tabs,Actionsheet } from 'vant';
  import VueBetterScroll from 'vue2-better-scroll'
  import Notfound from '@/components/common/notfound';

  export default {
    data(){
      return{
        active:0,
        companyCode:'',
        resitertitle:[{text:'未认领',value:0},{text:'认领中',value:1},{text:'已核实',value:2},{text:'已打印',value:3},{text:'逾期已退件',value:4},{text:'逾期已销毁',value:5},{text:'物品腐烂已销毁',value:6}],
        restitleacitive:0,
        claimtitleacitive:1,
        searchtype:'res',
        status:0,


        defaultlist:[],
        deafaultpages:0,
        deafaultpagestate:false,
        pageNum:1,
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
        show: false,
        actions: [
          {
            name: '删除',
            value:7,
          },
          {
            name: '逾期已退件',
            value:4,
          },
          {
            name: '逾期已销毁',
            value:5,
          },
          {
            name: '物品腐烂已销毁',
            value:6,
          }
        ],
        dooptionid:'',
      }
    },
    computed:{
      ...mapState([
        'bagmoney'
      ])
    },
    created(){
      /*获取网点id*/
      this.companyCode=this.$store.state.userinfo.companyCode;
      this.onPullingUp();
    },
    mounted(){
      let boxheight=document.querySelector('.tab-box-list').clientHeight;
      document.querySelector('.list-box').style.height=boxheight+'px'
    },
    methods:{
      tabtitlecheck(index,type){
        this.active=index;
        this.searchtype=type;
        if(index){
          this.status=1;
        }else {
          this.status=0;
        }
        this.restitleacitive=0;
        this.claimtitleacitive=1;
        this.resetdata();
        this.onPullingUp()

      },
      restierTitle(index,type){
        if(type=='res'){
          this.restitleacitive=index;
        }else{
          this.claimtitleacitive=index;
        }
        this.searchtype=type;
        this.status=this.resitertitle[index].value;
        this.resetdata();
        this.onPullingUp()
      },

      resetdata(){
        this.defaultlist=[]
        this.pageNum=1
        this.deafaultpages=0
        this.deafaultpagestate=false
      },

      /*操作*/
      setorderopetion(id){
        this.show=true;
        this.dooptionid=id;
      },

      /*执行操作回调*/
      dooption(status){
        this.show=false;
        var id=this.dooptionid;
        var title='提醒',msg
        switch (status){
          case 4:
            msg='确定物品逾期已退件!';
            break;
          case 5:
            msg='确定物品逾期已销毁!';
            break
          case 6:
            msg='确定物品腐烂已销毁!';
            break
          case 7:
            msg='确认删除!';
            break
        }
        this.$Tools.ConfirmTost(msg,title).then(() => {
          this.$store.dispatch('setOrderstate',{status,id})
            .then(res=>{
              this.restierTitle(0,'res')
              this.$Tools.TestTost(res.resMessage);
            })
        }).catch(() => {

        });


      },

      onPullingDown(){
        this.resetdata();
        this.onPullingUp();
      },
      onPullingUp(){
        if(this.deafaultpagestate){
          return ;
        }
        if(this.searchtype=='res'){
          /*本网点登记*/
          this.$store.dispatch('searchInfo',{registerNetDot:this.companyCode,status:this.status,pageNum:this.pageNum,pageSize:this.pageSize})
            .then(res=>{
              this.deafaultpages=res.data.pages;
              this.defaultlist=this.defaultlist.concat(res.data.list);
              this.pageNum=(this.pageNum)+1
              if(this.pageNum>this.deafaultpages){
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
        }else{
          /*本网点认领*/
          this.$store.dispatch('searchInfo',{claimNetDot:this.companyCode,status:this.status,pageNum:this.pageNum,pageSize:this.pageSize})
            .then(res=>{
              this.deafaultpages=res.data.pages;
              this.defaultlist=this.defaultlist.concat(res.data.list);
              this.pageNum=(this.pageNum)+1
              if(this.pageNum>this.deafaultpages){
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
        }

      },
    },
    components:{
      Header,
      'van-tabs':Tabs,
      'van-tab':Tab,
      VueBetterScroll,
      Notfound,
      'van-actionsheet':Actionsheet
    }
  }

</script>
<style lang="stylus" scoped>
  @import "~staticPath/css/theme.styl";
  @import "~staticPath/css/common.styl";
  @import "~staticPath/css/mineinfo.styl"
</style>

