<template>
  <div id="box_content">
      <Header backstate title="认领面单">
        <div slot="right" @click="getsubmite">提交</div>
      </Header>
      <div class="main_box">
        <p class="f_24 text_999 pl_30 pt_10 pb_10">物品信息</p>

        <van-cell-group>
            <div class="home-cell">
              <label>运单号</label>
              <div class="right_box">
                <input class="feldinput" type="text" v-model="billno" placeholder="请输入" />
              </div>
            </div>
            <div class="home-cell">
              <label>物品名称</label>
              <div class="right_box">
                <input class="feldinput" type="text" v-model="goodsname" placeholder="请输入" />
              </div>
            </div>
            <div class="home-cell">
              <label>物品重量</label>
              <div class="right_box">
                <input class="feldinput" type="text" v-model="weight" placeholder="请输入" />
              </div>
            </div>
        </van-cell-group>
        <p class="f_24 text_999 pl_30 pt_10">寄件信息</p>
        <van-cell-group class="mt_10">
          <div class="home-cell">
            <label>寄件人</label>
            <div class="right_box">
              <input class="feldinput" type="text" v-model="sendperson" placeholder="请输入" />
            </div>
          </div>
          <div class="home-cell">
            <label>联系电话</label>
            <div class="right_box">
              <input class="feldinput" type="text" v-model="sendtel" placeholder="请输入" />
            </div>
          </div>
          <van-cell @click="upactionMenu('send')" is-link>
            <div class="text_999 f_24">{{checkedsendarea}}</div>
            <template slot="title">
              <span class="van-cell-text">省市区县</span>
            </template>
          </van-cell>
          <div class="home-cell">
            <label>详细地址</label>
            <div class="right_box">
              <input class="feldinput" type="text" v-model="sendaddress" placeholder="请输入" />
            </div>
          </div>
        </van-cell-group>
        <p class="f_24 text_999 pl_30 pt_10">收件信息</p>
        <van-cell-group class="mt_10">
          <div class="home-cell">
            <label>收件人</label>
            <div class="right_box">
              <input class="feldinput" type="text" v-model="receiveperson" placeholder="请输入" />
            </div>
          </div>
          <div class="home-cell">
            <label>联系电话</label>
            <div class="right_box">
              <input class="feldinput" type="text" v-model="receivetel" placeholder="请输入" />
            </div>
          </div>

          <van-cell @click="upactionMenu('get')" is-link>
            <div class="text_999 f_24">{{receivegetarea}}</div>
            <template slot="title">
              <span class="van-cell-text">省市区县</span>
            </template>
          </van-cell>
          <div class="home-cell">
            <label>详细地址</label>
            <div class="right_box">
              <input class="feldinput" type="text" v-model="receiveaddress" placeholder="请输入" />
            </div>
          </div>
        </van-cell-group>
        <p class="f_24 text_999 pl_30 pt_10">认领信息</p>

        <div class="mt_10 bg_white pl_30 pt_15 pb_15">
          <p>图片</p>
          <div class="clearfix upload_pic_box">
            <li class="btn_add_pic" @click="addClick"><input ref="addBtn_pic" name="file" type="file" style="display: none" accept="image/png,image/gif,image/jpeg" @change="updataPic"/></li>
            <li v-if="picitems.length" v-for="(item,index) in picitems" :key="index">
              <cite @click="delpiclist(index)" />
              <img v-lazy="item.fileThumbnailLink"/>
            </li>
          </div>
        </div>
        <div class="mt_10 bg_white pl_30 pt_15 pb_15 pr_30">
          <p>情况说明</p>
          <textarea class="textareainfo" v-model="claimExplain" placeholder="输入内容"></textarea>
        </div>

      </div>


    <van-actionsheet v-model="actionmenushow" title="选择省市区县">
      <areaComponets v-if="sendareastate" @submitarea="checkedsendAreadata"></areaComponets>
      <areaComponets v-if="getareastate" @submitarea="checkedgetAreadata"></areaComponets>

    </van-actionsheet>


  </div>
</template>
<script>
  import Header from '@/components/common/header'
  import { mapState } from 'vuex'
  import areaComponets from '@/components/common/chinaArealist'
  import { Cell, CellGroup,ImagePreview,Dialog,Area,Actionsheet,Picker,Field} from 'vant';
  import {Commonmixin} from '@/mixins/common'
  import {Methods} from '@/mixins/methodsmixin'

  export default {
    data(){
      return{
        active:0,
        checkedsendarea:'请选择',
        sendareastate:false,
        getareastate:false,

        sendprovince:'',
        sendcity:'',
        sendarea:'',
        sendaddress:'',
        sendtel:'',

        receivegetarea:'请选择',
        receiveprovince:'',
        receivecity:'',
        receivearea:'',
        receiveaddress:'',

        billno:'',
        goodsname:'',
        weight:'',
        sendperson:'',


        receiveperson:'',
        receivetel:'',
        claimExplain:'',
        fileLinkArray:'',

      }
    },
    mixins:[Commonmixin,Methods],
    created(){
      this.billno=this.$route.query.billno;
    },
    methods:{
      imageRead(url='https://img.yzcdn.cn/2.jpg'){
        ImagePreview(['https://img.yzcdn.cn/2.jpg']);
      },

      checkedsendAreadata(res){
        if(res.provinceactive){
          this.sendprovince=res.provinceactive.fullName
        }
        if(res.cityactive){
          this.sendcity=res.cityactive.fullName
        }
        if(res.regionactive){
          this.sendarea=res.regionactive.fullName
        }
        this.checkedsendarea=this.sendprovince+'/'+this.sendcity+'/'+this.sendarea
        this.confirmarea();
      },

      checkedgetAreadata(res){
        if(res.provinceactive){
          this.receiveprovince=res.provinceactive.fullName
        }
        if(res.cityactive){
          this.receivecity=res.cityactive.fullName
        }
        if(res.regionactive){
          this.receivearea=res.regionactive.fullName
        }
        this.receivegetarea=this.receiveprovince+'/'+this.receivecity+'/'+this.receivearea
        this.confirmarea();
      },

      getsubmite(){
        Dialog.confirm({
          title: '认领面单',
          message: '确认提交认领面单？'
        }).then(() => {

          if(!this.billno.length){
            this.$Tools.TestTost('运单号不得为空')
            return false;
          }

          if(!this.goodsname.length){
            this.$Tools.TestTost('物品名称不得为空')
            return false;
          }

          if(!this.weight.length){
            this.$Tools.TestTost('物品重量不得为空')
            return false;
          }

          if(!this.sendperson.length){
            this.$Tools.TestTost('寄件人不得为空')
            return false;
          }

          if(!this.sendtel.length){
            this.$Tools.TestTost('寄件人联系电话不得为空')
            return false;
          }

          if(!this.sendprovince.length||!this.sendcity.length||!this.sendarea.length){
            this.$Tools.TestTost('请选择省市区县')
            return false;
          }

          if(!this.sendaddress.length){
            this.$Tools.TestTost('寄件人联系地址不得为空')
            return false;
          }

          if(!this.receiveperson.length){
            this.$Tools.TestTost('收件人不得为空')
            return false;
          }

          if(!this.receivetel.length){
            this.$Tools.TestTost('收件人电话不得为空')
            return false;
          }

          if(!this.receiveprovince.length||!this.receivecity.length||!this.receivegetarea.length){
            this.$Tools.TestTost('请选择收件人省市区县')
            return false;
          }

          if(!this.receiveaddress.length){
            this.$Tools.TestTost('收件人联系地址不得为空')
            return false;
          }

          this.fileLinkArray=this.formartListPic();

          if(this.fileLinkArray==''){
            this.$Tools.TestTost('请上传认领图片')
            return false;
          }


          this.$store.dispatch('claimDo',{
            id:this.$route.query.id,
            billno:this.billno,
            goodsname:this.goodsname,
            weight:this.weight,
            sendperson:this.sendperson,
            sendtel:this.sendtel,
            sendprovince:this.sendprovince,
            sendcity:this.sendcity,
            sendarea:this.sendarea,
            sendaddress:this.sendaddress,
            receiveperson:this.receiveperson,
            receivetel:this.receivetel,
            receiveprovince:this.receiveprovince,
            receivecity:this.receivecity,
            receivearea:this.receivearea,
            receiveaddress:this.receiveaddress,
            claimExplain:this.claimExplain,
            fileLinkArray:this.fileLinkArray
          })
            .then(res=>{
              if(res){
                this.$router.push({name:'home'})
              }
            })

          // on confirm
        }).catch(() => {
          // on cancel
        });
      }
    },
    components:{
      areaComponets,
      'van-field':Field
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

