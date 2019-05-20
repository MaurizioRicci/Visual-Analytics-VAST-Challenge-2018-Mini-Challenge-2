<template>
  <div class='hello'>
    <b-container fluid>
      <b-row>
        <b-col cols="12">
          <stationsMap @stations-active="stationsActive"/>
        </b-col>
        <b-col cols="12">
          <calendarView :data='calendarData(stats)' :width="300" :height='150'
           v-if="stats.length" :stations="activeStations"/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import stationsMap from './StationsMap'
import calendarView from './CalendarView'
import dataLoad from '@/assets/js/retriveData'
import calcStatistics from '@/assets/js/calcStatistics'
import filterOutliers from '@/assets/js/filterOutliers'

export default {
  name: 'HomePage',
  data () {
    return {
      dataset: [],
      stats: [],
      activeStations: []
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
  methods: {
    stationsActive: function(n) {
      console.log('Stazioni attive', n)
      this.activeStations = n
    },
    calendarData: (stats) => filterOutliers(stats, -1)
  },
  watch: {},
  components: {
    'stationsMap': stationsMap,
    'calendarView': calendarView
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
