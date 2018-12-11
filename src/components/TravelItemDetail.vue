<template>
  <div class="container info-section">
    <div class="breadCrumb mt-4">
        <a href="/">首頁</a> / <span>{{ item.Name }}</span>
    </div>
    <div class="">
        <div class="img-outer">
          <div class="img-inner">
            <div class="img"  :style="{ 'background-image' : 'url(\'' + item.Picture1 + '\')' }">
            </div>
          </div>
        </div>
        <div class="info">
          <h1 class="info-title">{{ item.Name }}</h1>
            <div class="locaAndTime mb-3">
              <span class="loca"><i class="fas fa-map-marker-alt"></i> {{ item.Add }}</span>
              <span class="time"><i class="far fa-calendar-alt"></i> {{ item.Opentime }}</span>
            </div>
          <p class="">{{ item.Description }}</p>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'


export default {
  data () {
    return {
      item: null
    }
  },
  mounted () {
    axios.get('https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97')
    .then(((response) => {
      this.$store.commit('items_fetched', response.data.result.records)
      // this.items = response.data.result.records
      let id = this.$route.params.id
      for (let item of this.$store.state.items) {
        if (item.Id === id) {
          this.item = item
          break
        }
      }

    })).catch((err) => {
      alert('sorry,something is wrong!')
    })


  }
}
</script>

<style lang="scss" scoped>

a{
  color: #9013FE
}
.container.info-section{
  max-width: 780px;
}
.breadCrumb{
  background: #EBEBEB 100%!important;
  border-radius: 4px;
  padding: 8px 16px;
  margin-bottom: 24px;
}

.img-outer{
    position: relative;
    .img-inner{
      width: 100%;
      padding-top: 60%;
      .img{

        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
      }
    }
}
.info{
  background-color: #fff;
  padding: 40px;
  margin-bottom: 80px;
  p{
    line-height: 2rem;
  }
  .info-title{
    color: #9013FE;
    font-size: 2rem;
  }
}
</style>
