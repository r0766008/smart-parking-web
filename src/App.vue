<template>
  <v-app id="inspire">
    <div>
      <main class="py-4">
        <router-view :parkingSub="parkingSpot"></router-view>
      </main>
    </div>
  </v-app>
</template>

<script>
import store from './store';

export default {
  mounted() {
    this.$pnSubscribe({ 
      channels: ['parkingSpots', 'entrance']
    });
  },
  data () {
    return {
      parkingSpot: null,
      parkingSpotSub: this.$pnGetMessage('parkingSpots', this.changeParkingStatus),
      entranceSub: this.$pnGetMessage('entrance', this.entranceReload)
    }
  },
  methods: {
    changeParkingStatus(data) {
      this.parkingSpot = data
    },
    entranceReload(data) {
      store.dispatch("VehicleModule/getVehicles");
    }
  }
}
</script>