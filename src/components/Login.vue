<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center" dense>
          <v-col cols="12" sm="8" md="4" lg="4">
            <v-card elevation="0">
              <div style="display: flex; justify-content: center;">
                <img src="@/assets/logo.png" height="200"/>
              </div>
              <v-alert v-if="error" class="mt-4 mx-4" border="bottom" color="red" elevation="1" type="error">{{ error }}</v-alert>
              <v-card-text>
                <v-form lazy-validation>
                  <v-text-field label="Enter your email" name="email" prepend-inner-icon="mdi-email" type="email" class="rounded-0" outlined v-model="email" :rules="emailRules" required></v-text-field>
                  <v-text-field label="Enter your password" name="password" prepend-inner-icon="mdi-lock" type="password" class="rounded-0" outlined v-model="password" :rules="passwordRules" required></v-text-field>
                  <v-btn class="rounded-0" color="#000000" x-large block dark @click="submit">Login</v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import firebase from "firebase";

export default {
  data() {
    return {
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      password: '',
      passwordRules: [
        v => !!v || 'Password is required',
      ],
      error: null
    };
  },
  methods: {
    submit() {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(data => {
        this.$router.replace({ name: "dashboard" });
      }).catch(err => {
        if (err.code === 'auth/wrong-password') this.error = "The password is incorrect."
        if (err.code === 'auth/user-not-found') this.error = "This email does not exist in our system."
        if (err.code === 'auth/too-many-requests') this.error = "Access to this account has been temporarily disabled due to many failed login attempts. Please try again later."
      });
    }
  }
};
</script>