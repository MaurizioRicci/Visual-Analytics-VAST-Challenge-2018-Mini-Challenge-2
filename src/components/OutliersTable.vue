<template>
  <div class="container">
    <div class="header">
      <h1>Inquinamento idrico nella riserva di Boonsong Lekagul</h1>

      <ul class="nav nav-tabs">
        <li class="nav-item"></li>
        <li>
          <a class="nav-link" href="/">Home</a>
        </li>
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
      <p v-if="!filter">Here are the top {{this.limit}} outliers found
      </p>
      <p v-if="filter">From the top {{this.limit}} outliers, {{this.filterLength}}
         match your query
      </p>
      <b-row>
        <b-col md="6" class="my-1">
          <b-pagination
            v-model="currentPage"
            :total-rows="filterLength"
            :per-page="perPage"
            aria-controls="my-table"></b-pagination>
        </b-col>

        <b-col md="6" class="my-1">
          <b-form-group label-cols-sm="3" label="Filter" class="mb-0">
            <b-input-group>
              <b-form-input v-model="filter" placeholder="Type to Search"></b-form-input>
              <b-input-group-append>
                <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>

      <b-table striped hover :items="bigOutliers.items"
        :fields="bigOutliers.fields"
        :per-page="perPage" small
        :current-page="currentPage"
        :filter="filter"
        @filtered="onFiltered"></b-table>
    </div>
  </div>
</template>

<script>
import getStatistics from '@/assets/js/getStatistics'

export default {
  name: 'SecondPage',
  data () {
    return {
      limit: 200,
      bigOutliers: [],
      perPage: 20,
      currentPage: 1,
      filter: null,
      filterLength: null
    }
  },
  mounted () {
    this.filterLength = this.limit
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
    },
    onFiltered: function (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.filterLength = filteredItems.length
      this.currentPage = 1
    }
  },
  watch: {},
  components: {}
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
</style>
