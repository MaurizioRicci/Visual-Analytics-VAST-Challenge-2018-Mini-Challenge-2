<template>
  <div class='hello'>
    <b-container fluid>
      <b-row>
        <b-col>
          <stationsMap ref="stationsMap"></stationsMap>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import stationsMap from './stationsMap'
import dataLoad from '@/assets/js/retriveData'
import calcStatistics from '@/assets/js/calcStatistics'
import filterOutliers from '@/assets/js/filterOutliers'

export default {
  name: 'HomePage',
  data () {
    return {
      dataset: [],
      stats: []
    }
  },
  mounted () {
    dataLoad().then(data => {
      this.dataset = data
      console.log(this.dataset)
      this.stats = calcStatistics(data)
      let outliers = filterOutliers(this.stats, 7)
      console.log('Grandi outliers', outliers)
    })
  },
  methods: {},
  watch: {},
  components: {
    'stationsMap': stationsMap
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
