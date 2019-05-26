<template>
  <div class="container">
    <div class="title">

      <h1>Inquinamento idrico nella riserva di Boonsong Lekagul</h1>

    <nav class="navbar navbar-toggleable-md fixed-top navbar-inverse bg-inverse">
        <ul class="navbar-nav">
          <li><a class="nav-link" href="#">Home</a></li>
          <li><a class="nav-link" href="#">Calendario dei rilevamenti</a></li>
          <li><a class="nav-link" href="#">Grafici</a></li>
          <li><a class="nav-link" href="#">Conclusioni</a></li>
        </ul>
    </nav>
    </div>
      <div class="row">
        <div class="col-md-7">
          <p>
            L'anno scorso, la Kasios Furniture Company è stata coinvolta in danni ambientali alla Riserva della fauna selvatica di Boonsong Lekagul sia per lo scarico di rifiuti tossici che per inquinare l'aria con prodotti chimici dal suo processo di produzione.
            Ma Kasios non sta prendendo queste accuse a terra e negano ogni accusa di dumping dei rifiuti industriali! I portavoce di Kasios affermano che non vi è alcuna contaminazione del terreno vicino alla stazione remota dei ranger suggerita dai partecipanti
            alla mini-sfida 1 e 3 dello scorso anno,
            e hanno ispezionato quell'area e l'hanno trovata incontaminata come il resto della riserva.
          </p>
          <p>
            Con una prova primaria contro Kasios ormai scomparso, gli investigatori dovranno adottare un altro approccio. I professori del dipartimento di idrologia del Mistford College si sono fatti avanti con diversi anni di letture del sensore dell'acqua da fiumi e torrenti nella riserva.
            Questi campioni sono stati prelevati da diverse località sparse in tutta l'area e contengono misure di diverse sostanze chimiche di possibile interesse, ma non sono mai state analizzate a causa della mancanza di fondi. L'analisi visiva può aiutare a rivelare qualcosa in questi dati che potrebbe compensare la prova del suolo che è stata distrutta?
          </p>
          <div class="col-md-5">
            <stationsMap @stations-active="stationsActive"/>
            <!--<img class="img-responsive col-xs-4" src=""/>-->
          </div>
        </div>
      </div>
      <b-row align-h="center">
        <b-col cols="3">
          <stationsMap @stations-active="stationsActive"/>
        </b-col>
        <b-col cols="9">
          <calendarView :data='calendarData(stats)' :width="300" :height='150'
           v-if="stats.length" :stations="activeStations"/>
        </b-col>
      </b-row>
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
    stationsActive: function (n) {
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
