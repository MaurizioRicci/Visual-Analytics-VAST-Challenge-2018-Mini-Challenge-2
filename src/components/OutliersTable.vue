<template>
  <div class="container">
    <div class="header">
      <h1>Inquinamento idrico nella riserva di Boonsong Lekagul</h1>

      <ul class="nav nav-tabs">
        <li class="nav-item"></li>
        <li>
          <a class="nav-link" href="/">Home</a>
        </li>
        <b-nav-item-dropdown
          id="my-nav-dropdown"
          text="Grafici"
          toggle-class="nav-link-custom"
          right>
          <b-dropdown-item href="">Calendario misurazioni</b-dropdown-item>
          <b-dropdown-item href="">Separated link</b-dropdown-item>
          <b-dropdown-item href="">Sunburst chart</b-dropdown-item>
          <b-dropdown-item href="">Horizon chart</b-dropdown-item>
        </b-nav-item-dropdown>
        <li>
          <a class="nav-link" href="#/outliers_table">Outliers table</a>
        </li>
        <li>
          <a class="nav-link" href="#">Calendario dei rilevamenti</a>
        </li>
        <li>
          <a class="nav-link" href="#">Conclusioni</a>
        </li>
      </ul>
    </div>

    <div class="container-fluid">
      <p>Here are the top {{this.limit}} outliers found</p>
      <b-pagination
        v-model="currentPage"
        :total-rows="limit"
        :per-page="perPage"
        aria-controls="my-table"></b-pagination>
      <b-table striped hover :items="bigOutliers.items"
        :fields="bigOutliers.fields"
        :per-page="perPage" small
        :current-page="currentPage"></b-table>
    </div>
  </div>
</template>

<script>
import getStatistics from '@/assets/js/getStatistics'

export default {
  name: 'SecondPage',
  data () {
    return {
      limit: 100,
      bigOutliers: [],
      perPage: 20,
      currentPage: 1
    }
  },
  mounted () {
    this.showInfo()
  },
  methods: {
    showInfo: function () {
      getStatistics({
        limit: this.limit,
        order_by: 'standard_val',
        order: 'desc'
      }).then(data => {
        let tmp = {}
        tmp.items = data
        tmp.fields = []
        tmp.fields.push({ key: 'location', sortable: true })
        tmp.fields.push({ key: 'measure', sortable: true })
        tmp.fields.push({ key: 'date', sortable: true })
        tmp.fields.push({ key: 'value', sortable: true })
        tmp.fields.push({ key: 'unit', sortable: true })
        tmp.fields.push({
          key: 'avg_sample_r',
          label: 'Average value',
          sortable: false
        })
        tmp.fields.push({
          key: 'standard_val_r',
          label: 'Normalized value',
          sortable: true
        })
        this.bigOutliers = tmp
      })
    }
  },
  watch: {},
  components: {}
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
</style>
