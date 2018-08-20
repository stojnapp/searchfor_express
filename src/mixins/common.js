/*公共混入*/
import { mapState} from 'vuex';
import Header from '@/components/common/header'
import { Cell, CellGroup,Actionsheet,Picker,Area,ImagePreview,Dialog} from 'vant';
import state from "../store/state";
import areaComponets from '@/components/common/chinaArealist'

/*登记*/
export const Commonmixin= {
    data(){
      return {
        actionmenushow: false,
        goodsstate: false,
        texturestate: false,
        title: '请选择',
        goodstext: '请选择',
        baleTexturetext: '请选择',
        orderstateshow:false,
        orderstate: [{text: '未认领', value: 0},{text: '认领中', value: 1},{text: '已核实', value: 2},{text: '已打印', value: 3},{text: '逾期已退件', value: 4},{text: '逾期已销毁', value: 5},{text: '物品腐烂已销毁', value: 6}],

        registerNetDotText:'',/*登记网点显示*/
        claimNetDotText:'',/*认领网点显示*/
        registerNetDot:'',/*登记网点*/
        claimNetDot:'',/*认领网点*/

        registernetDotSearchlist:[],
        registernetDotshow:false,
        claimNetDotSearchlist:[],
        claimNetDotshow:false,

      }

    },
    mounted(){
      this.$function.DelLoading()
    },
    computed:{
      ...mapState({
        goodsTypepage:(state)=>{
          return state.goodsType
        },
        bale_texturepage:(state)=>{
          return state.bale_texture
        }
      }),

    },

    watch:{
        'screeningpage':function (value) {
          if(value){
            this.formDatereset()
          }
        }
    },


    methods:{
        upactionMenu(type='goods'){
          switch (type){
            case 'goods':
              this.goodsstate=true;
              this.sendareastate=false;
              this.texturestate=false;
              this.orderstateshow=false;
              this.endTimestate=false;
              break;
            case 'texture':
              this.goodsstate=false;
              this.texturestate=true;
              this.getareastate=false;
              this.orderstateshow=false;
              this.startTimestate=false;
              this.endTimestate=false;
              break;
            case 'send':
              this.sendareastate=true;
              this.getareastate=false;
              this.goodsstate=false;
              this.orderstateshow=false;
              this.startTimestate=false;
              this.endTimestate=false;
              break;
            case 'get':
              this.sendareastate=false;
              this.getareastate=true;
              this.goodsstate=false;
              this.orderstateshow=false;
              this.startTimestate=false;
              this.endTimestate=false;
              break;
            case 'state':
              this.goodsstate=false;
              this.orderstateshow=true;
              this.sendareastate=false;
              this.getareastate=false;
              this.startTimestate=false;
              this.endTimestate=false;
              break
            case 'starttime':
              this.goodsstate=false;
              this.orderstateshow=false;
              this.sendareastate=false;
              this.getareastate=false;
              this.startTimestate=true;
              this.endTimestate=false;
              break;
            case 'endtime':
              this.goodsstate=false;
              this.orderstateshow=false;
              this.sendareastate=false;
              this.getareastate=false;
              this.startTimestate=false;
              this.endTimestate=true;
              break;
          }
          this.actionmenushow=true
        },
        /*类别选择*/
        onCancel(){
          this.actionmenushow=false
        },
        onConfirmgoods(value, index){
          this.goodstext=value.text;
          this.goodsType=value.value;
          this.onCancel()
        },
        onConfirmbale(value, index){
          this.baleTexture=value.value
          this.baleTexturetext=value.text
          this.onCancel()
        },

        onConfirmstate(value, index){
          this.stateText=value.text;
          this.status=value.value;
          this.onCancel()
        },

        onConfirmstartime(value){
          this.startstmap=new Date(value).getTime();
          if(this.endstmap){
            if(this.startstmap>this.endstmap){
              this.$Tools.TestTost('结束时间不得小于开始时间')
              return ;
            }
          }

          this.starttime=this.$check.gettimeformate(new Date(value))
          this.onCancel()
        },

        onConfirmendtime(value){
          this.endstmap=new Date(value).getTime();
          if(this.startstmap){
            if(this.startstmap>this.endstmap){
              this.$Tools.getTost('结束时间不得小于开始时间','fail',3000)
              return ;
            }
          }
          this.endtime=this.$check.gettimeformate(new Date(value))
          this.onCancel()
        },

        /*省市区县选择*/
        confirmarea(){
          this.cancelarea();
        },

        cancelarea(){
          this.actionmenushow=false
        },
        checkedIndexNet(index,type){
           switch (type){
             case 'reg':
               this.registerNetDot=this.registernetDotSearchlist[index].code;
               this.registerNetDotText=this.registernetDotSearchlist[index].fullName;
               this.registernetDotshow=false;
               this.registernetDotSearchlist=[];
               break;
             case 'cal':
               this.claimNetDot=this.claimNetDotSearchlist[index].code
               this.claimNetDotText=this.claimNetDotSearchlist[index].fullName
               this.claimNetDotshow=false;
               this.claimNetDotSearchlist=[];
               break;
           }
        },

        /*重置*/
        resetData(){
          this.goodstext='请选择'
          this.baleTexturetext='请选择'
          this.goodsType=''
          this.baleTexture=''
          this.contactPhone=''
          this.goodsWeight=''
          this.internalsColor=''
          this.licencePlate=''
          this.registerExplain=''
          this.fileLinkArray=""
          this.registerNetDot=''/*登记网点*/
          this.claimNetDot=''/*认领网点*/
        },

        /*根据关键字检索网点信息*/
        searchNetDot(index,type){
          this.$store.dispatch('searchBaseNetinfo',{index})
            .then(res=>{
              if(type=='reg'){
                console.info(res,'aaa')
                if(res){
                    this.registernetDotSearchlist=res;
                    this.registernetDotshow=true;
                }else{
                  this.registernetDotshow=false;
                }
              }else{
                if(res){
                    this.claimNetDotSearchlist=res;
                    this.claimNetDotshow=true;
                }else{
                  this.claimNetDotshow=false;
                }
              }
            })
        },

        /*home页存储检索信息*/
        savestateSearchinfo(){
          // if(this.registerNetDot==''){
          //   this.$Tools.TestTost('登记网点不得为空！')
          //   return ;
          // }
          // if(this.claimNetDot==''){
          //   this.$Tools.TestTost('认领网点不得为空！')
          //   return ;
          // }
          //
          // if(this.goodsType==''){
          //   this.$Tools.TestTost('请选择物品类别！')
          //   return ;
          // }
          //
          // if(this.status===''){
          //   this.$Tools.TestTost('请选择面单状态！')
          //   return ;
          // }
          //
          // if(this.provinceId==''||this.cityId==''||this.districtId==''){
          //   this.$Tools.TestTost('请选择省市区县！')
          //   return ;
          // }
          //
          // if(this.endtime=='请选择'||this.starttime=='请选择'){
          //   this.$Tools.TestTost('请选择登记开始和结束日期！')
          //   return ;
          // }

          var obj={registerNetDot:this.registerNetDot,claimNetDot:this.claimNetDot,startDate:this.starttime=='请选择'?'':this.starttime,endDate:this.endtime=='请选择'?'':this.endtime,goodsType:this.goodsType,status:this.status,provinceId:this.provinceId,cityId:this.cityId,districtId:this.districtId}
          this.$router.push({name:'homesearch',query:obj})
        },

        homesearchPagesubmit(){
          // if(this.registerNetDot==''){
          //   this.$Tools.TestTost('登记网点不得为空！')
          //   return ;
          // }
          // if(this.claimNetDot==''){
          //   this.$Tools.TestTost('认领网点不得为空！')
          //   return ;
          // }
          //
          // if(this.goodsType==''){
          //   this.$Tools.TestTost('请选择物品类别！')
          //   return ;
          // }
          //
          // if(this.status===''){
          //   this.$Tools.TestTost('请选择面单状态！')
          //   return ;
          // }
          //
          // if(this.provinceId==''||this.cityId==''||this.districtId==''){
          //   this.$Tools.TestTost('请选择省市区县！')
          //   return ;
          // }
          //
          // if(this.endtime=='请选择'||this.starttime=='请选择'){
          //   this.$Tools.TestTost('请选择登记开始和结束日期！')
          //   return ;
          // }

          this.defaultlist=[]
          this.defaultpageNum=1
          this.deafaultpages=0
          this.deafaultpagestate=false

          this.searchObj={pageNum:this.defaultpageNum,pageSize:this.pageSize,registerNetDot:this.registerNetDot,claimNetDot:this.claimNetDot,startDate:this.starttime=='请选择'?'':this.starttime,endDate:this.endtime=='请选择'?'':this.endtime,goodsType:this.goodsType,status:this.status,provinceId:this.provinceId,cityId:this.cityId,districtId:this.districtId}
          this.loaddefault();

        }




    },
    components:{
      'van-cell-group':CellGroup,
      'van-cell':Cell,
      'van-actionsheet':Actionsheet,
      'van-picker':Picker,
      ImagePreview,
      'van-area':Area,
      Header,
      areaComponets
    }
}

/*详情*/
export const Detailsmixin={
  data(){
    return{
      id:'',
      detailinfo:{},
      registrationpic:[],/*登记图片*/
      claimpic:[],/*认领图片*/
      billNumberinfo:[],/*物流信息*/
      claimInfo:[],/*认领信息*/
    }
  },
  created(){
    this.id=this.$route.query.id;
    this.getShow();
  },
  methods:{
    /*获取基本信息*/
    getShow(){
      let id=this.id;
      var _self=this;
      var loading=this.$Tools.getTost('正在加载...')
      /*根据状态来加载图片信息*/
      _self.getPiclist();
      this.$store.dispatch('getOrdershow',{id})
        .then(res=>{
          loading.clear()
          if(res.respCode=='000'){
            this.detailinfo=res.data;
            switch (res.data.status){
              case 1:
              case 2:
              case 3:
                _self.getPiclist(4);
                break;
            }
          }else{
            this.$Tools.getTost(res.resMessage,'fail',3000)
          }
        })
    },

    /*获取图片详情*/
    getPiclist(type=3){
      var _self=this;
      var loading=this.$Tools.getTost('正在加载...')
      let complainId=this.id,businessType=type;
      this.$store.dispatch('getOrderpiclist',{complainId,businessType})
        .then(res=>{
          loading.clear()
          if(res.respCode=='000'){
            console.info('图片详情',res.data)
            switch (type){
              case 3:
                _self.registrationpic=res.data
                break;
              case 4:
                _self.claimpic=res.data
                break
            }
          }else {
            this.$Tools.getTost(res.resMessage,'fail',3000)
          }

        })
    },

    /*判断选中tab来加载物流信息*/
    tabActive(index, title){
      switch (index){
        case 1:
          this.claSearchInfo();
          break
        case 3:
          this.checkExpressinfo()
         break;
      }
    },

    /*查询物流信息*/
    checkExpressinfo(){
      if(this.detailinfo.waybillNumber){
        var _self=this;
        var loading=this.$Tools.getTost('正在加载...')
        this.$store.dispatch('checkExpressshow',{waybillNo:this.detailinfo.waybillNumber})
          .then(res=>{
            loading.clear()
            console.info('物流信息',res)
            if(res.respCode=='000'){
              _self.billNumberinfo=res.data;
            }else{
              this.$Tools.getTost(res.resMessage,'fail',3000)
            }
          })
      }
    },

    /*跳转至认领*/
    Getorder(pathname,{id}){
      this.$router.push({name:'claimpage',params: {id}})
    },


    /*审核*/
    auditDostate(id,status){
      var title,msg
      switch (status){
        case 0:
          title='审核打回';
          msg='审核不通过将会打回未认领状态!';
          break;
        case 2:
          title='审核通过';
          msg='你正在对无面单进行核实是否确认?';
          break
      }
      this.$Tools.ConfirmTost(msg,title).then(() => {
        var loading=this.$Tools.getTost('正在处理中...')
        this.$store.dispatch('auditCheckdo',{id,status})
          .then(res=>{
            loading.clear()
            if(res.respCode=='000'){
              this.$Tools.AlertTost('操作成功',()=>{
                this.$router.push({name:'home'})
              })
            }else{
              this.$Tools.getTost(res.resMessage,'fail',3000)
            }
          })
      }).catch(() => {

      });

    },

    /*检索认领信息*/
    claSearchInfo(){
      var loading=this.$Tools.getTost('正在加载...');
      this.$store.dispatch('getPrintorderdetail',this.id)
        .then(res=>{
          loading.clear();
          if(res.respCode=='000'){
            this.claimInfo=res.data;
          }else{
            Tools.getTost(res.resMessage,'fail',3000)
          }
        })
    }

  },

}

