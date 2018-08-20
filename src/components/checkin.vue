<template>
  <div id="box_content">
      <Header backstate title="登记面单">
        <div @click="addOrder" slot="right">提交</div>
      </Header>
      <div class="main_box">

        <van-cell-group>
          <van-cell @click="upactionMenu('goods')" is-link>
            <div class="text_999 f_24">{{goodstext}}</div>
            <template slot="title">
              <span class="van-cell-text"><cite class="text_FF964D">*</cite>物品类别</span>
            </template>
          </van-cell>
          <van-cell is-link @click="upactionMenu('texture')">
            <div class="text_999 f_24">{{baleTexturetext}}</div>
            <template slot="title">
              <span class="van-cell-text"><cite class="text_FF964D">*</cite>包装材质</span>
            </template>
          </van-cell>

          <div class="home-cell">
            <label><cite class="text_FF964D">*</cite>物品重量</label>
            <div class="right_box">
              <input class="feldinput" type="text" v-model="goodsWeight" placeholder="请输入" />
            </div>
          </div>
          <div class="home-cell">
            <label><cite class="text_FF964D">*</cite>联系电话</label>
            <div class="right_box">
              <input class="feldinput" type="text" v-model="contactPhone" placeholder="请输入" />
            </div>
          </div>

        </van-cell-group>

        <van-cell-group class="mt_10">

          <div class="home-cell">
            <label>内件颜色</label>
            <div class="right_box">
              <input class="feldinput" type="text" v-model="internalsColor" placeholder="请输入" />
            </div>
          </div>
          <div class="home-cell">
            <label>运输车牌号</label>
            <div class="right_box">
              <input class="feldinput" type="text" v-model="licencePlate" placeholder="请输入" />
            </div>
          </div>
        </van-cell-group>

        <div class="mt_10 bg_white pl_30 pt_15 pb_15">
          <p>图片</p>
          <div class="clearfix upload_pic_box">
            <li class="btn_add_pic" @click="addClick"><input ref="addBtn_pic" name="file" type="file" style="display: none" accept="image/png,image/gif,image/jpeg" @change="updataPic"/></li>
            <li v-if="picitems.length" v-for="(item,index) in picitems" :key="index">
              <cite @click="delpiclist(index)" />
              <img v-lazy="$CommonApi.netUrl+item.fileThumbnailLink"/>
            </li>
          </div>
        </div>
        <div class="mt_10 bg_white pl_30 pt_15 pb_15 pr_30">
          <p>情况说明</p>
          <textarea class="textareainfo" v-model="registerExplain" placeholder="输入内容"></textarea>
        </div>

      </div>

    <van-actionsheet v-model="actionmenushow">
      <van-picker v-if="goodsstate" :columns="goodsTypepage"  show-toolbar :title="title"  @cancel="onCancel"  @confirm="onConfirmgoods" />
      <van-picker v-if="texturestate" :columns="bale_texturepage"  show-toolbar :title="title"  @cancel="onCancel"  @confirm="onConfirmbale" />
    </van-actionsheet>

  </div>
</template>
<script>
  import Header from '@/components/common/header'
  import { mapState } from 'vuex'
  import { Cell, CellGroup,Actionsheet,Picker } from 'vant';
  import {Commonmixin} from '@/mixins/common'
  import {Commpn_api} from '@/api/api'
  import {Methods} from '@/mixins/methodsmixin'
  /*数据格式未做校验*/
  export default {
    data(){
      return{
        goodsType:'',
        baleTexture:'',
        contactPhone:'',
        goodsWeight:'',
        internalsColor:'',
        licencePlate:'',
        registerExplain:'',
      }
    },
    mixins:[Commonmixin,Methods],

    methods:{
      addOrder(){
        if(!this.goodsType){
          this.$Tools.TestTost('请选择物品类别！')
          return ;
        }

        if(!this.baleTexture){
          this.$Tools.TestTost('请选择包装材质！')
          return ;
        }

        if(!this.contactPhone){
          this.$Tools.TestTost('联系电话不得为空！')
          return ;
        }

        if(!this.goodsWeight){
          this.$Tools.TestTost('物品重量不得为空！')
          return ;
        }

        let goodsType=this.goodsType;
        let baleTexture=this.baleTexture;
        let contactPhone=this.contactPhone;
        let goodsWeight=this.goodsWeight;
        let internalsColor=this.internalsColor;
        let licencePlate=this.licencePlate;
        let registerExplain=this.registerExplain;
        let fileLinkArray=this.formartListPic();
        this.$store.dispatch('addGoods',{goodsType,baleTexture,contactPhone,goodsWeight,internalsColor,licencePlate,registerExplain,fileLinkArray})
          .then(res=>{
            if(res.respCode=='000'){
              this.resetData()
              this.$Tools.TestTost('面单登记成功！')
              this.$router.push({name:'home'})
            }else{
              this.$Tools.getTost(res.resMessage,'fail',3000)
            }
          })
      }
    },
    components:{
      Header,
      'van-cell-group':CellGroup,
      'van-cell':Cell,
      'van-actionsheet':Actionsheet,
      'van-picker':Picker,
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
        background #e8e8e8
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
      &.noorder-search
        bg-image('./src/assets/img/facesheet_search')
        background-size cover
      &.noorder-info
        bg-image('./src/assets/img/facesheet_personalun')
        background-size cover
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

