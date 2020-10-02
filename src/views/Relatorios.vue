<template>
  <div class="pa-4">
    <v-card class="my-4 mx-auto">
      <v-card-title>Graphs</v-card-title>
    </v-card>
    <v-card class="my-4 mx-auto" color="cyan">
      <v-subheader dark>diary balance</v-subheader>
      <v-sparkline
        :labels="dlabels"
        :value="dvalue"
        color="white"
        line-width="1"
        padding="28"
      ></v-sparkline>
    </v-card>
    <v-card class="my-4 mx-auto" color="cyan">
      <v-subheader dark>monthly balance</v-subheader>
      <v-sparkline
        :labels="mlabels"
        :value="mvalue"
        color="white"
        line-width="1"
        padding="28"
      ></v-sparkline>
    </v-card>
    <v-card class="my-4 mx-auto pa-2" color="green" dark>
      <v-card-subtitle>Total Incomes: R$ {{ totalIncomes }}</v-card-subtitle>
    </v-card>
    <v-card class="my-4 mx-auto pa-2" color="red" dark>
      <v-card-subtitle>Total Expenses: R$ {{ totalExpenses }}</v-card-subtitle>
    </v-card>
  </div>
</template>

<script>
import billHttp from "../util/BillHttpUtil";
import formatDate from "../util/dateFormaterUtil";
export default {
  data: () => ({
    today: 0,
    bills: [],
    dlabels: [],
    dvalue: [],
    mlabels: [
      "jan",
      "feb",
      "mar",
      "apl",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ],
    mvalue: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    totalIncomes: 0,
    totalExpenses: 0,
  }),
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
        this.sortBills();
        this.dateLimit();
        this.diary();
        this.monthly();
      });
    },
    sortBills() {
      this.bills.sort((a, b) => {
        if (a.date > b.date) return 1;
        if (a.date < b.date) return -1;
        return 0;
      });
    },
    dateLimit() {
      this.today = new Date().getMonth() + 1;
      this.mlabels = this.mlabels.slice(0, this.today);
      this.mvalue = this.mvalue.slice(0, this.today);
    },
    diary() {
      this.bills.forEach((b, i) => {
        this.dlabels.push(formatDate(b.date));
        let value = b.value;
        if (b.type === "Income") this.totalIncomes += value;
        else this.totalExpenses += value;
        if (i > 0)
          value =
            b.type === "Income"
              ? (value = this.bills[i - 1].value + b.value)
              : (value = this.bills[i - 1].value - b.value);

        this.dvalue.push(value);
      });
    },
    monthly() {
      this.bills.forEach((b, i) => {
        if (this.today >= i) {
          let m = Number(b.date.split("-")[1]) - 1;
          this.mvalue[m] =
            b.type === "Income"
              ? this.mvalue[m] + b.value
              : this.mvalue[m] - b.value;
        }
      });
    },
  },
};
</script>

<style>
</style>