<template>
  <div>
    <v-card class="mb-4 pa-4 mx-auto" width="75%" v-if="formVisible">
      <v-container>
        <div class="mb-4">{{formTitle}}</div>
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field label="Descrive" outlined v-model="actualBill.description" hide-details></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-select :items="types" label="Type" outlined v-model="actualBill.type" hide-details></v-select>
          </v-col>
          <v-col cols="12" sm="4">
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
          <v-col cols="12" sm="12">
            <v-textarea label="Observation" outlined v-model="actualBill.observation" hide-details></v-textarea>
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions class="mx-3">
        <v-row class="justify-sm-space-around">
          <v-btn color="success" @click="save" class="mx-1">add</v-btn>
          <v-btn color="red lighten-1" @click="cancel" class="mx-1">Cancel</v-btn>
        </v-row>
      </v-card-actions>
    </v-card>
    <v-data-table :headers="headers" :items="bills" sort-by="id" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Bills Control</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="form" v-if="!formVisible">Add New Bill</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:body.append>
        <v-toolbar flat color="white">
          <v-toolbar-title>Total</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-card flat :class="(vtotal>=0?'green':'red')+'--text'">R$ {{vtotal.toFixed(2)}}</v-card>
        </v-toolbar>
      </template>

      <template v-slot:item.type="{ item }">
        <div :class="(item.type==='Income'?'green':'red')+'--text'">{{item.type}}</div>
      </template>
      <template v-slot:item.value="{ item }">R$ {{parseFloat(item.value).toFixed(2)}}</template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-1" @click="desc(item)">mdi-magnify</v-icon>
        <v-icon small class="mx-1" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small class="mx-1" @click="confirmDelete(item)">mdi-delete</v-icon>
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
        <v-card-title class="headline">Bill {{deleteBill.description}} deleted</v-card-title>

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
        <v-card-title class="headline">{{actualBillDetail.description}} bill details</v-card-title>
        <v-container>
          <v-row>
            <v-col class="d-flex" cols="12" sm="6">
              <v-select
                :items="types"
                label="Type"
                outlined
                disabled
                :value="actualBillDetail.type"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
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

          <v-btn color="gray darken-1" text @click="dialogDetails=false">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
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
        text: "Actions",
        value: "actions",
        sortable: false,
      },
    ],
    types: ["Income", "Expense"],
    bills: [],
    vtotal: 0,
    actions: "",
    itemEditing: null,
    actualBill: {},
    actualBillDetail: { value: 0 },
    deleteBill: {},
    idGenerator: 4,
    formVisible: false,
    dialog: false,
    dialogDetails: false,
  }),

  computed: {
    formTitle() {
      return this.itemEditing === null ? "New Bill" : "Edit Bill";
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.bills = [
        {
          id: 1,
          description: "salary",
          value: 1500,
          type: "Income",
          observation: "none",
        },
        {
          id: 2,
          description: "internet",
          value: 98,
          type: "Expense",
          observation: "",
        },
        {
          id: 3,
          description: "shopping",
          value: 200,
          type: "Expense",
          observation: "gifts",
        },
      ];
      this.calcTotal();
    },
    form() {
      this.formVisible = true;
    },
    desc(bill) {
      this.dialogDetails = true;
      this.actualBillDetail = bill;
    },
    save() {
      let billCopy = Object.assign({}, this.actualBill);
      billCopy.value = parseFloat(billCopy.value);
      if (!billCopy.id) {
        billCopy.id = this.idGenerator;
        this.idGenerator++;
        this.bills = [...this.bills, billCopy];
      } else {
        this.bills.forEach((bill, i) => {
          if (bill.id === billCopy.id) this.bills.splice(i, 1, billCopy);
        });
      }
      this.calcTotal();
      this.cancel();
    },
    editItem(bill) {
      this.itemEditing = bill;
      Object.assign(this.actualBill, bill);
      this.formVisible = true;
    },
    confirmDelete(bill) {
      this.deleteBill = bill;
      this.dialog = true;
    },
    deleteItem() {
      this.dialog = false;
      this.bills.forEach((b, i) => {
        if (b.id === this.deleteBill.id) this.bills.splice(i, 1);
      });
      this.deleteBill = {};
      this.calcTotal();
    },
    cancel() {
      this.actualBill = {};
      this.itemEditing = null;
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