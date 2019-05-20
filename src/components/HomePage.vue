<template>
  <div class='hello'>
    <b-container fluid>
      <b-row>
        <b-col>
          <stationsMap @stations-active="stationsActive"/>
        </b-col>
        <b-col>
          <calendarView :data='calendarData(stats)' :width="300" :height='150' v-if="stats.length"/>
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
  methods: {
    stationsActive: (n) => console.log('Stazioni attive', n),
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
