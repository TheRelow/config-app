<template>
  <div>
    <v-data-table
        :headers="headers"
        :items="tableData"
        :single-expand="singleExpand"
        :expanded.sync="expanded"
        item-key="name"
        show-expand
        :items-per-page="5"
        class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-btn class="save-btn" color="primary" elevation="2" :loading="saving" @click="saveBtn">
            Сохранить
          </v-btn>
          <v-spacer></v-spacer>
          <v-switch
              class="switch-autosave"
              label="Автосохранение"
          ></v-switch>
        </v-toolbar>
      </template>
      <template v-slot:item.name="props">
        <v-edit-dialog
            :return-value.sync="props.item.name"
            @save="save"
            @cancel="cancel"
            @open="open"
            @close="close"
        >
          {{ props.item.name }}
          <template v-slot:input>
            <v-text-field
                v-model="props.item.name"
                :rules="[max25chars]"
                label="Edit"
                single-line
                counter
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:item.calories="{ item }">
        <div class="calories-value" contenteditable="true" :ref="'calories'+item.id">
          {{ item.calories }}
        </div>
      </template>
      <template v-slot:item.iron="props">
        <v-edit-dialog
            :return-value.sync="props.item.iron"
            large
            persistent
            @save="save"
            @cancel="cancel"
            @open="open"
            @close="close"
        >
          <div>{{ props.item.iron }}</div>
          <template v-slot:input>
            <div class="mt-4 title">
              Update Iron
            </div>
            <v-text-field
                v-model="props.item.iron"
                :rules="[max25chars]"
                label="Edit"
                single-line
                counter
                autofocus
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          More info about {{ item.name }}
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: "ComponentTable",
  props: ['tableData'],
  data() {
    return {
      expanded: [],
      singleExpand: true,
      snack: false,
      snackColor: '',
      snackText: '',
      max25chars: v => v.length <= 25 || 'Input too long!',
      pagination: {},
      saving: false
    }
  },
  computed: {
    headers () {
      return [
        {
          text: 'Dessert (100g serving)',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        {
          text: 'Calories',
          value: 'calories',
          // editable: true,
          filter: value => {
            if (!this.calories) return true

            return value < parseInt(this.calories)
          },
        },
        { text: 'Fat (g)', value: 'fat' },
        { text: 'Carbs (g)', value: 'carbs' },
        { text: 'Protein (g)', value: 'protein' },
        { text: 'Iron (%)', value: 'iron' },
        { text: '', value: 'data-table-expand' },
      ]
    },
  },
  methods: {
    saveBtn() {
      this.saving = true
      setTimeout(()=>{
        this.saving = false
      }, 1000)
    },
    save () {
      this.snack = true
      this.snackColor = 'success'
      this.snackText = 'Data saved'
    },
    cancel () {
      this.snack = true
      this.snackColor = 'error'
      this.snackText = 'Canceled'
    },
    open () {
      this.snack = true
      this.snackColor = 'info'
      this.snackText = 'Dialog opened'
    },
    close () {
      console.log('Dialog closed')
    },
  }
}
</script>