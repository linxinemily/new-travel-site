<template>
  <div id="app">
    <div class="wrapper">
      <div class="header" :class="{'headroom--unpinned': scrolled}"  v-on="handleScroll()">
        <div class="container">
          <div class="logo">
            <img src="https://hexschool.github.io/THE_F2E_Design/week2-filter/assets/logo.png" alt="" class="img-logo">
          </div>
          <div class="search-bar">
                <i class="fas fa-search search-icon"></i>
              <input type="text" name="search" class="search-text" placeholder="Explore your own activities" v-model="searchWords"><br>
          </div>
        </div>
      </div>

      <div class="main">
        <div class="container">
          <div class="nav">
            <div class="nav__outer">
              <div class="location">
                <h4 class="nav__title">Location</h4>
                    <el-checkbox-group v-model="checkZones">
                      <el-checkbox v-for="zone in zones" :label="zone" v-bind:key="zone">{{ zone }}</el-checkbox>
                    </el-checkbox-group>
              </div>
              <div class="categories">
                <h4 class="nav__title">Free</h4>
                  <input type="checkbox" v-model="free" id="free">
                  <label for="free">免費參觀</label>
              </div>
            </div>
          </div>
        <div class="result">
          <h4 class="showResult">共找到<span> {{ filtered.length }} </span>筆資料</h4>
            <div class="tabs" >
               <div class="tab" v-for="result in resultZones" v-bind:key="result">
                <p class="tab__text">{{ result }}</p>
                <div class="mytime" @click="deleteZone(result)">
                  <span></span>
                  <span></span>
                </div>
              </div>
        </div>
        <div class="cards" v-for="(item,i) in filtered" v-bind:key="item._id">
            <div class="mycard" v-show="setPaginate(i)">
              <div class="card__left">
                <div class="imgBox">
                  <div class="imgBox__inner">
                    <div class="img" :style="{ 'background-image' : 'url(\'' + item.Picture1 + '\')' }" ></div>
                  </div>
                </div>
              </div>
              <div class="card__right">
                <div class="content">
                  <h3>{{ item.Name }}</h3>
                  <p class="description">{{ item.Description }}</p>
                  <div class="free" v-show="item.Ticketinfo === '免費參觀'">{{ item.Ticketinfo }}</div>
                  <!-- <div class="authorAndCate">
                    <p class="author">Ethan Foster</p>
                    <p class="cate">Entertainment</p>
                  </div> -->
                  <div class="locaAndTime">
                    <div class="loca"><i class="fas fa-map-marker-alt"></i> {{ item.Add }}</div>
                    <div class="time"><i class="far fa-calendar-alt"></i> {{ item.Opentime }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
           <!-- <b-pagination size="md" :total-rows="filtered.length"  :per-page="10">
    </b-pagination> -->
            <el-pagination
              background
              layout="prev, pager, next"
              :total="filtered.length"
              :current-page.sync="current">
            </el-pagination>
        </div>
      </div>
    </div>
  </div>


  </div>
</template>

<script>
import axios from 'axios';
import bPagination from 'bootstrap-vue/es/components/pagination/pagination';


export default {
  name: 'App',
  components:{
    bPagination
  },
  data () {
    return{
      zones:[],
      checkZones:[],
      free: false,
      value:'',
      items:[],
      searchWords:'',
      current:1,
      paginate: 10,
      limitPosition: 300,
      scrolled: false,
      lastPosition: 0

    }
  },
  mounted () {
    axios.get('https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97')
    .then(((response) => {
      this.items = response.data.result.records
      let arr = []
      let newArr = []
      for(let i = 0 ; i<this.items.length;i++){
        arr.push(response.data.result.records[i].Zone)
      }
      for(let i = 0 ; i < arr.length;i++){
      if(!newArr.includes(response.data.result.records[i].Zone) ){
            newArr.push(response.data.result.records[i].Zone)
        }
      }
      this.zones = newArr
      // this.paginate_total = this.filtered.length/this.paginate;

    })).catch((err) => {
      alert('sorry,something is wrong!')
    })
  },
  computed:{
    filtered () {
      let items = []

      if (this.items.length <= 0) {
        return this.items
      }

      for (let item of this.items) {
        let zoneIsInclude = this.checkZones.length === 0 ? true : (this.checkZones.includes(item.Zone))
        let searchWordsInclude = this.searchWords === '' ? true : item.Name.includes(this.searchWords)

        if (zoneIsInclude && searchWordsInclude) {
          if (!this.free) {
            items.push(item)
          }

          if (this.free && item.Ticketinfo === '免費參觀') {
            items.push(item)
          }
        }
      }

      return items

      // if(this.items.length > 0) {
      //   if(this.checkZones.length !== 0) { //如果目前選中的地區陣列不是空的，執行以下程式
      //     // 現在選中的地區有這些，把包含這些選中的地區的物件顯示出來
      //     for (let i = 0 ; i < this.items.length; i++) {
      //       if (this.checkZones.includes(this.items[i].Zone)) {

      //         if (!this.free) {
      //           items.push(this.items[i])
      //         }

      //         if (this.free && this.items[i].Ticketinfo === '免費參觀') {
      //           items.push(this.items[i])
      //         }

      //       }
      //     }
      //     return items
      //   } else {
      //     //如果目前的選中地區陣列是空的，就顯示所有的物件
      //     for (let item of this.items) {
      //       if (!this.free) {
      //         items.push(item)
      //       }

      //       if (this.free && item.Ticketinfo === '免費參觀') {
      //         items.push(item)
      //       }
      //     }
      //     return items
      //   }
      // } else {
      //   return this.items
      // }
    },
    resultZones () {
      return this.checkZones
    }
  },
  methods:{
    deleteZone (result) {
      let index = this.checkZones.indexOf(result)
      this.checkZones.splice(index,1)
    },

    setPaginate (x) {
       if (this.current == 1) {
         return x <= this.paginate;
       }
       else {
         return (x > (this.paginate * (this.current - 1)) && x < (this.current * this.paginate));
       }
    },
     handleScroll() {
      if (this.lastPosition < window.scrollY && this.limitPosition < window.scrollY) {
        this.scrolled = true;
        // header is hidden
      }

      if (this.lastPosition > window.scrollY) {
        this.scrolled = false;
        // header shows
      }

      this.lastPosition = window.scrollY;
    }
   },
    created() {
      window.addEventListener("scroll", this.handleScroll);
    },
    destroyed() {
      window.removeEventListener("scroll", this.handleScroll);
    }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,500,500i,700,700i,900,900i');
@import url("//unpkg.com/element-ui@2.4.1/lib/theme-chalk/index.css");
// utilities

$color-primary: #7828B4;
$color-secondary: #9013FE;
$color-lightGrey: #f2f2f2;
$color-midLightGrey: #ebebeb;
$color-grey: #d7d7d7;
$color-darkGrey: #9B9B9B;
$color-white: #fff;


::placeholder{
  font-family: 'Roboto';
  font-style: italic;
  font-weight: 300;
  font-size: 20px;
  color: rgba(255,255,255,0.50);

}

// globel

*{
  box-sizing: border-box;
}

html,body{
  width: 100%;
  height: 100%;
  background: $color-lightGrey;
  font-family: 'Roboto';
}
h3{
  font-size: 24px;
  color: $color-secondary;
}
h4{
  font-size: 20px;
  font-style: bold;
}
h5 {
  font-size: 16px;
  font-weight: 400;
}



// header
.header{
  height: 92px;
  z-index: 100;
  width: 100%;
  background: $color-primary;
  position: fixed;
  will-change: transform;
  transition: transform 200ms linear;
}
.headroom--pinned {
    transform: translateY(0%);
}
.headroom--unpinned {
    transform: translateY(-100%);
}

.container{
  display: flex;

}


.logo{
  display: inline-block;
  width: 300px;
  margin: 0 auto;
}
.img-logo{
  padding:33px 0;


}
.search-bar{
  display: inline-block;
  padding:4px 0px;


  margin: 28px 0;
  margin-left: 40px;
  flex:2;
  white-space: nowrap;

}
.search-bar:after{
  content:"";
  display: block;
  width: 388px;
  height: 4px;
  border-bottom: 1px solid #fff;

}

.search-icon{
  font-size: 20px;
  color: $color-white;
   margin-right: 20px;
  display: inline-block;
}

.search-text{
  display: inline-block;
  width: 300px;
  background: transparent;
  border:0;
  outline: none;
  color: $color-white
}

//main
.main{
  padding-top: 92px;
}
.nav{
  float: left;
}

@media(max-width:768px){
  .container{
 flex-direction: column;
}

}
// main__nav
.nav__title{
  font-weight: 600;
}
.location,.date,.categories{
  width: 300px;
  padding: 25px;
  background: $color-midLightGrey;
  border-bottom:1px solid $color-grey;
  .text{
    display: inline-block;
  }
}
.el-date-editor.el-input, .el-date-editor.el-input__inner{
  width: 200px;
  margin-left: 8px;
}
.text__outer{
  text-align: right;
  margin: 8px 0;
}
.el-checkbox-group .el-checkbox{
  display: block;
  margin-left:0;
}

// result
.result{
  width: calc(100% - 300px);
  margin-top: 24px;
  margin-left: 40px;
  margin-bottom: 40px;
  float: left;
}
.showResult{
  font-size: 24px;
  line-height: 28px;
  span{
    color: $color-secondary;
  }
}


.tab{
  display: inline-flex;
  border: 1px solid $color-secondary;
  padding: 8px 16px;
  border-radius:32px;
  align-items: center;
  margin-right: 8px;

}
.tab__text{
  display: inline-block;
  margin: 0;
  color: $color-secondary;
  font-style: italic;
}
.mytime{
  // color: $color-secondary !important;
  border: 1px solid $color-secondary;
  width: 16px;
  height: 16px;
  border-radius:50%;
  position: relative;
  display: inline-block;
  margin-left: 4px;
  cursor: pointer;
  &:hover{
    background-color: $color-secondary;
  }
}
.mytime span{
  display: block;
  height:1px;
  width: 8px;
  background-color:$color-secondary;
  position: absolute;
	top: 50%;
	left: 50%;

}
.mytime:hover span{background: #fff}

.mytime span:nth-child(1){
  transform:translate(-50%,-50%) rotate(45deg);
}
.mytime span:nth-child(2){
  transform:translate(-50%,-50%) rotate(-45deg);
}

.mycard{
  background: #fff;
  box-shadow:0 2px 20px rgba(0,0,0,0.1);
  display: flex;
  margin:24px 0;
  height: 220px;
  width: 780px;
  position: relative;
  overflow: hidden;

}
@media(max-width:1200px){
    .mycard{ width: 600px;}
}

@media(max-width:992px){
  .mycard{
    flex-direction:column;
    height: 414px;
    width: 388px;
  }
  .imgBox{
    width: 100% !important;

    overflow: hidden;

  }
  .imgBox__inner{
  width: 100%;
  padding-top: 196px !important;
  position: relative;

  }
  .img{
  width: 100%;

  position: absolute;
  top: 0;
  background-size: cover;
  background-position: center;
  }

}

@media(max-width:768px){
  .header{
    height: 124px;
    text-align: center;
  }

  .img-logo{
    padding: 20px;
    display: inline-block;
  }
  .search-bar{
    padding: 0;
    margin: 0;
    margin-top: 8px;

  }
  .search-bar:after{
    position: absolute;
    width: 344px;
    left: 50%;
    transform: translateX(-50%);

  }
  .nav{
    position:relative;
    width: 100%;
    margin-top: 30px;
  }

  .location,.date,.categories,.nav__outer{
        width: 100% !important;
  }

  .result{
    width: 100%;
    margin: 0;
    margin-top: 24px;
  }
  .mycard{
    width: 100% !important;
  }

  .text__outer{
    text-align: left;
  }
  #app > div > div > div.date > div:nth-child(3) > h5{
    margin-right: 18px
     ;
  }
}



.card__right{
    h3 {
      margin-top: 0;
    }
    .free {
      position:absolute;
      right: -40px;
      top: 20px;
      background: #e26f6f;
      width: 150px;
      height: 30px;
      transform: rotate(45deg);
      line-height: 30px;
      text-align: center;
      color: $color-white;
      text-shadow: 1px 1px 2px #c65153;
    }

}

.imgBox{
  width: 220px;

}

.imgBox__inner{
  width: 100%;
  padding-top: 100%;
  position: relative;

}
.img{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  background-size: cover;
  background-position: center;
}


// right

.content{
  padding: 24px 28px 20px 24px;

  .description{
   font-size: 16px;
  display: block;
  height: 50px;
  text-overflow: ellipsis;
  overflow: hidden;
  }
}



.author,.cate,.loca,.time{
  display: inline-block;
}
.author{
  font-weight: 600;
}
.cate{
  font-style: italic;
  background-color: #d7d7d7;
  color:$color-white;
  font-weight: 300;
  padding:0 16px ;
  border-radius:16px;
  margin-left: 20px;
}
.loca,.time{
  color:$color-darkGrey;
  i{
    color: #000;
  }
}
.time{margin-left: 20px;}

//page

// panigation
.number.active{
  background-color: $color-secondary!important;
}


</style>
