<template>
  <v-app>
    <v-app-bar app color="white" flat>
      <v-container class="py-0 fill-height">

        <router-link v-for="link in links" :key="link[0]" :to="link[1]" class="text-decoration-none">
          <v-btn text>
            {{ link[0] }}
          </v-btn>
        </router-link>

        <v-spacer></v-spacer>

        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" elevation="0" color="white" :ripple="false" class="no-background-hover">
              {{ user.data }}
              <v-icon class="pl-2" small>mdi-arrow-down-drop-circle-outline</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-btn block elevation="0" color="white" @click="signOut">
                Sign out
              </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>

      </v-container>
    </v-app-bar>
    

    <v-main class="grey lighten-3">
      <v-container>
        <v-row>
          <v-col sm="12" md="4" class="order-last order-md-first">
            <v-sheet rounded="lg">
              <v-list color="transparent">
                <div class="text-h5 pl-4">History</div>

                <v-divider class="my-2"></v-divider>
                <v-list-item v-for="vehicle in vehicles.slice(0, 5)" :key="vehicle.id">
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ vehicle.timestamp | moment("DD MMMM YYYY HH:mm:ss") }}
                    </v-list-item-title>
                    <v-list-item-content>
                      <div>
                        {{ vehicle.license_plate }}
                        <v-icon class="ml-2" v-if="vehicle.action === 'Entering'" style="color: green;" size="md">mdi-arrow-collapse-left</v-icon>
                        <v-icon class="ml-2" v-if="vehicle.action === 'Leaving'" style="color: red;" size="md">mdi-arrow-collapse-right</v-icon>
                      </div>
                    </v-list-item-content>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <router-link to="history" class="text-decoration-none" style="width: 100%;">
                    <v-btn text block>
                      Show More
                    </v-btn>
                  </router-link>
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-col>

          <v-col sm="12" md="8" class="order-first order-md-last">
            <v-sheet rounded="lg">
              <div class="text-h5 text-center font-weight-black py-5">
                {{ countCars() }}
              </div>
              <img id="blue-car" src="@/assets/blue-car.svg" style="display: none">
              <img id="green-car" src="@/assets/green-car.svg" style="display: none">
              <img id="red-car" src="@/assets/red-car.svg" style="display: none">
              <img id="white-car" src="@/assets/white-car.svg" style="display: none">
              <div class="canvas-wrapper" style="display: flex;">
                <img src="@/assets/parking-lot.jpg" class="rounded-lg ml-auto mr-auto" style="width: 100%;"/>
                <canvas ref="carCanvas" class="canvas-overlay"></canvas>
              </div>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
import firebase from "firebase";
import store from '../store';

export default {
  props: ['parkingSub'],
  mounted () {
    this.$pnPublish({
      channel: 'init',
      message: 'New init'
    });
    store.dispatch("VehicleModule/getVehicles");
  },
  data () {
    return {
      links: [
        ['Dashboard', 'dashboard'],
        ['History', 'history']
      ],
      parkingSpots: [false, false, false, false],
    }
  },
  watch: {
    parkingSub: function(newVal) {
      this.changeParkingStatus(newVal)
    }
  },
  methods: {
    countCars() {
      let count = 0
      let text = ""
      this.parkingSpots.forEach(parkingSpot => {
        if (parkingSpot) count++
      })
      if (count == 1) text = "There is currently " + count + " car on the premise"
      else text = "There are currently " + count + " cars on the premise"
      return text
    },
    drawCars(data) {
      var left = [34, 94, 155, 216]
      var cars = ['blue-car', 'green-car', 'red-car', 'white-car']
      let c = this.$refs['carCanvas']
      const context = c.getContext('2d')
      context.clearRect(left[data.message.split('|')[0]], 27, 50, 107)
      if (data.message.split('|')[1] === 'true') {
        var random = Math.floor(Math.random()*4)
        var img = document.getElementById(cars[random]);
        context.rotate(0)
        context.drawImage(img, left[data.message.split('|')[0]], 27, 50, 107)
      }
      this.$pnClean('parkingSpots');
    },
    changeParkingStatus(data) {
      this.drawCars(data)
      this.parkingSpots.splice(data.message.split('|')[0], 1, (data.message.split('|')[1] === 'true'))
    },
    signOut() {
      firebase.auth().signOut().then(() => {
        store.dispatch("AuthModule/signOutUser");
        this.$router.replace({
          name: "login"
        });
      });
    }
  },
  computed: {
    ...mapGetters({
      user: "AuthModule/user",
      vehicles: "VehicleModule/vehicles"
    })
  }
};
</script>

<style>
  .canvas-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    width: 100%;
    height: 100%
  }
  .canvas-wrapper {
    position: relative;
  }
  .no-background-hover::before {
    background-color: white !important;
  }
</style>