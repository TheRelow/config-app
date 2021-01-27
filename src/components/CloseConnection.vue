<template>
  <v-dialog v-model="dialog" @keydown.esc="dialog = false" @keydown.enter="onOk" persistent max-width="400">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on"> Close connection </v-btn>
    </template>
    <v-card>
      <v-card-title> Close connection </v-card-title>
      <v-card-text>
        Вы хотите закрыть порт {{fullPath}}?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="onOk"> Закрыть </v-btn>
        <v-btn color="grey lighten-5" text @click="dialog = false">
          Отмена
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "CloseConnection",
  data: ()=>({
    dialog: false
  }),
  props: {
    fullPath: {
      type: String,
    }
  },
  methods: {
    onOk() {
      console.log('this.fullPath', this.fullPath)
      this.$store.commit("closeConnection", this.fullPath);
      this.dialog = false
      this.$router.push('/connections')
    },
  },
}
</script>

<style scoped>

</style>