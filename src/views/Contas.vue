<template>
  <div>
    <v-card class="mb-4 pa-4 mx-auto" width="75%" v-if="formVisible">
      <v-container>
        <div class="mb-4">{{ formTitle }}</div>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              label="Descrive"
              outlined
              v-model="actualBill.description"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="12" sm="6">
            <v-select
              :items="types"
              label="Type"
              outlined
              v-model="actualBill.type"
              hide-details
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              type="number"
              min="0.1"
              step="0.1"
              label="Value"
              outlined
              v-model="actualBill.value"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-menu
              ref="menu1"
              v-model="menu1"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="actualBill.dateFormated"
                  label="Date"
                  persistent-hint
                  prepend-icon="mdi-calendar"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="actualBill.date"
                no-title
                @input="
                  menu1 = false;
                  actualBill.dateFormated = formatDate(actualBill.date);
                "
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="12">
            <v-textarea
              label="Observation"
              outlined
              v-model="actualBill.observation"
              hide-details
            ></v-textarea>
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions class="mx-3">
        <v-row class="justify-sm-space-around">
          <v-btn color="success" @click="save" class="mx-1">{{
            this.itemEditing ? "save" : "add"
          }}</v-btn>
          <v-btn color="red lighten-1" @click="cancel" class="mx-1"
            >Cancel</v-btn
          >
        </v-row>
      </v-card-actions>
    </v-card>
    <v-data-table
      :headers="headers"
      :items="bills"
      sort-by="id"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Bills Control</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="form" v-if="!formVisible"
            >Add New Bill</v-btn
          >
        </v-toolbar>
      </template>
      <template v-slot:body.append>
        <v-toolbar flat color="white">
          <v-toolbar-title>Total</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-card flat :class="(vtotal >= 0 ? 'green' : 'red') + '--text'"
            >R$ {{ vtotal.toFixed(2) }}</v-card
          >
        </v-toolbar>
      </template>

      <template v-slot:item.type="{ item }">
        <div :class="(item.type === 'Income' ? 'green' : 'red') + '--text'">
          {{ item.type }}
        </div>
      </template>
      <template v-slot:item.value="{ item }"
        >R$ {{ parseFloat(item.value).toFixed(2) }}</template
      >
      <template v-slot:item.date="{ item }">{{
        formatDate(item.date)
      }}</template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-1" @click="desc(item)">mdi-magnify</v-icon>
        <v-icon small class="mx-1" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small class="mx-1" @click="confirmDelete(item)"
          >mdi-delete</v-icon
        >
      </template>

      <template v-slot:no-data>
        <v-row class="justify-center">
          <v-subheader>No one bill</v-subheader>
        </v-row>
      </template>
    </v-data-table>
    <!-- modal confimation -->
    <v-dialog v-model="dialog" max-width="290" persistent>
      <v-card>
        <v-card-title class="headline"
          >Bill {{ deleteBill.description }} deleted</v-card-title
        >

        <v-card-text>Are you sure?</v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="gray darken-1" text @click="dialog = false">no</v-btn>

          <v-btn color="red darken-1" text @click="deleteItem">yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- modal details -->
    <v-dialog v-model="dialogDetails" max-width="50%">
      <v-card>
        <v-card-title class="headline"
          >{{ actualBillDetail.description }} bill details</v-card-title
        >
        <v-container>
          <v-row>
            <v-col class="d-flex" cols="12" sm="4">
              <v-select
                :items="types"
                label="Type"
                outlined
                disabled
                :value="actualBillDetail.type"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                type="number"
                min="0.1"
                step="0.1"
                label="Value"
                outlined
                disabled
                :value="actualBillDetail.value.toFixed(2)"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                type="date"
                label="Date"
                outlined
                :value="actualBillDetail.date"
                disabled
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12">
              <v-textarea
                label="Observation"
                outlined
                disabled
                :value="actualBillDetail.observation"
                hide-details
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="gray darken-1" text @click="dialogDetails = false"
            >Ok</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import billHttp from "../util/BillHttpUtil";
import formatDate from "../util/dateFormaterUtil";
export default {
  data: () => ({
    menu1: false,
    headers: [
      {
        text: "Description",
        value: "description",
      },
      {
        text: "Value",
        value: "value",
      },
      {
        text: "Type",
        value: "type",
      },
      {
        text: "Date",
        value: "date",
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
      },
    ],
    types: ["Income", "Expense"],
    bills: [],
    vtotal: 0,
    actions: "",
    itemEditing: false,
    actualBill: {},
    actualBillDetail: { value: 0, date: "" },
    deleteBill: {},
    idGenerator: 4,
    formVisible: false,
    dialog: false,
    dialogDetails: false,
  }),

  computed: {
    formTitle() {
      return this.itemEditing ? "Edit Bill" : "New Bill";
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.listAll();
    },
    listAll() {
      billHttp.listAll().then((bills) => {
        this.bills = bills.data;
        this.calcTotal();
      });
    },
    form() {
      this.formVisible = true;
    },
    formatDate(date) {
      return formatDate(date);
    },
    desc(bill) {
      this.dialogDetails = true;
      this.actualBillDetail = bill;
      this.actualBillDetail.date = formatDate(this.actualBillDetail.date, true);
    },
    save() {
      let billCopy = Object.assign({}, this.actualBill);
      billCopy.value = parseFloat(billCopy.value);
      if (!billCopy._id) {
        billHttp.add(billCopy).then((res) => {
          if (res.status === 201) this.listAll();
        });
      } else {
        billCopy.id = billCopy._id;
        billHttp.edit(billCopy).then((res) => {
          if (res.status === 200) this.listAll();
        });
      }
      this.listAll();
      this.cancel();
    },
    editItem(bill) {
      this.itemEditing = true;
      Object.assign(this.actualBill, bill);
      this.actualBill.dateFormated = formatDate(this.actualBill.date);
      this.actualBill.date = formatDate(this.actualBill.date, true);
      this.formVisible = true;
    },
    confirmDelete(bill) {
      this.deleteBill = bill;
      this.dialog = true;
    },
    deleteItem() {
      this.dialog = false;
      billHttp.delete(this.deleteBill).then((res) => {
        if (res.status === 200) this.listAll();
      });
      this.deleteBill = {};
    },
    cancel() {
      this.actualBill = {};
      this.itemEditing = false;
      this.formVisible = false;
    },
    calcTotal() {
      this.vtotal = 0;
      this.bills.forEach((b) => {
        if (b.type === "Income") this.vtotal += b.value;
        else this.vtotal -= b.value;
      });
    },
  },
};
</script>
