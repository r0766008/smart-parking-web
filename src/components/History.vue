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
          <v-col>
            <v-sheet rounded="lg">
              <v-toolbar dark color="gray" fixed>
                <v-toolbar-title class="white--text">History</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
              </v-toolbar>
              <v-layout column style="padding-top:56px">
                <v-data-table :headers="headers" :items="vehicles" :search="search">
                  <template v-slot:item.timestamp="{ item }">
                    <span>{{ item.timestamp | moment("DD MMMM YYYY HH:mm:ss") }}</span>
                  </template>
                  <template v-slot:item.action="{ item }">
                    <v-icon class="ml-2" v-if="item.action === 'Entering'" style="color: green;" size="md">mdi-arrow-collapse-left</v-icon>
                    <v-icon class="ml-2" v-if="item.action === 'Leaving'" style="color: red;" size="md">mdi-arrow-collapse-right</v-icon>
                  </template>
                  <template v-slot:item.time="{ item }">
                    <span>{{ convertHMS(item.time) }}</span>
                  </template>
                  <v-alert slot="no-results" :value="true" color="error" icon="mdi-alert" class="mt-3">
                    Your search for "{{ search }}" found no results.
                  </v-alert>
                </v-data-table>
              </v-layout>
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
  mounted () {
    store.dispatch("VehicleModule/getVehicles");
  },
  data () {
    return {
      links: [
        ['Dashboard', 'dashboard'],
        ['History', 'history']
      ],
      search: '',
      headers: [{
          text: 'Timestamp',
          align: 'left',
          value: 'timestamp'
        },
        {
          text: 'License Plate',
          value: 'license_plate'
        },
        {
          text: 'Action',
          value: 'action'
        },
        {
          text: 'Time',
          value: 'time'
        }
      ],
    }
  },
  methods: {
    signOut() {
      firebase.auth().signOut().then(() => {
        store.dispatch("AuthModule/signOutUser");
        this.$router.replace({
          name: "login"
        });
      });
    },
    convertHMS(value) {
      const sec = parseInt(value, 10); // convert value to number if it's string
      let hours   = Math.floor(sec / 3600); // get hours
      let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
      let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
      // add 0 if value < 10; Example: 2 => 02
      if (hours   < 10) {hours   = "0"+hours;}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      return hours+':'+minutes+':'+seconds;
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

<style scoped>
.mobile {
      color: #333;
    }

    @media screen and (max-width: 768px) {
      .mobile table.v-table tr {
        max-width: 100%;
        position: relative;
        display: block;
      }

      .mobile table.v-table tr:nth-child(odd) {
        border-left: 6px solid deeppink;
      }

      .mobile table.v-table tr:nth-child(even) {
        border-left: 6px solid cyan;
      }

      .mobile table.v-table tr td {
        display: flex;
        width: 100%;
        border-bottom: 1px solid #f5f5f5;
        height: auto;
        padding: 10px;
      }

      .mobile table.v-table tr td ul li:before {
        content: attr(data-label);
        padding-right: .5em;
        text-align: left;
        display: block;
        color: #999;

      }
      .v-datatable__actions__select
      {
        width: 50%;
        margin: 0px;
        justify-content: flex-start;
      }
      .mobile .theme--light.v-table tbody tr:hover:not(.v-datatable__expand-row) {
        background: transparent;
      }

    }
    .flex-content {
      padding: 0;
      margin: 0;
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      width: 100%;
    }

    .flex-item {
      padding: 5px;
      width: 50%;
      height: 40px;
      font-weight: bold;
    }
</style>