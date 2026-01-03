let form = document.querySelector("form");
let ValueType = document.querySelector(".value-type");
let ValueAmount = document.querySelector(".value-amount");
let ValueCategory = document.querySelector(".value-category");
let ValueDate = document.querySelector(".value-date");
let mainGrid = document.querySelector(".main-grid");
let income = document.querySelector(".income");
let expense = document.querySelector(".expense");
let netBal = document.querySelector(".net-balance");
const ctx = document.getElementById("pie-chart");
const ctx2 = document.getElementById("bar-chart");
let currencyInput = document.querySelector(".amount-inp");
let convertBtn = document.querySelector(".convert");
let basecurr = document.querySelector("#from");
let toCurr = document.querySelector("#to");
let convertAmount = document.querySelector(".converted-amount");
let cryptoSearch = document.querySelector(".base-div #crypto-search");
let searchBtn = document.querySelector(".search");
let rank = document.querySelector(".rank");
let symbol = document.querySelector(".symbol");
let priceUsd = document.querySelector(".price-crypt");
let cryptoData = document.querySelector(".crypto-data");
let loadIcn = document.querySelector(".loading");

let allTransactions = [];
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const Transaction = {
    type: ValueType.value,
    amount: ValueAmount.value,
    category: ValueCategory.value,
    date: ValueDate.value,
  };

  if (Transaction.amount > 1 && Transaction.amount[0] != 0) {
    allTransactions.push(Transaction);
    localStorage.setItem("transactions", JSON.stringify(allTransactions));
    ValueAmount.value = "";

  } else {
    ValueAmount.value = "";
    ValueAmount.placeholder = "Invalid Amount!!!";
    setTimeout(() => {
      ValueAmount.placeholder = "";
    }, 2000);
  }

  updatingGrid();
  addingFunc();
  expensesData();
  monthlyChart();
  initializeCharts();
  barChart.update();
});

document.addEventListener("DOMContentLoaded", () => {
  const storedTransactions = localStorage.getItem("transactions");
  if (storedTransactions) {
    allTransactions = JSON.parse(storedTransactions);
    updatingGrid();
    addingFunc();
  }
  let infoBtn= document.querySelector(".main-grid")
  infoBtn.addEventListener('click',(e)=>{
    if (e.target.classList.contains('info-type')) {
    const infoType = e.target.closest('.info-type');
    const popupBox = infoType.nextElementSibling;
 popupBox.style.display='block'
 popupBox.animate([
  { transform: ' scale(0.1)', opacity: 0 },
  { transform: ' scale(1)', opacity: 1 }
], { duration: 400, easing: 'ease-in-out' })
  }})

  infoBtn.addEventListener('click',(e)=>{
    if (e.target.classList.contains('closeBtn')) {
      const typeBox = e.target.closest('.type-box')
      const popBox=typeBox.querySelector('.popup')
      popBox.animate([
        { transform: ' scale(1)', opacity: 1 },
        { transform: ' scale(0.1)', opacity: 0 }
      ], { duration: 500, easing: 'ease-out' })
      setTimeout(() => {
        popBox.style.display='none'
      }, 100);
    }
  })

  currencyConversions();
  initializeChart();
  initializeCharts();
  expensesData();
  monthlyChart();


});

const updatingGrid = () => {
  mainGrid.innerHTML = "";
  allTransactions.forEach((transaction, index) => {
    const historyGrid = document.createElement("div");
    historyGrid.id = index;
    parseInt(transaction.amount);

    historyGrid.innerHTML = `
    <div class="type-box same-b"> ${transaction.type}
    <button class="info-type">Info</button>
    <div class="popup"> 
    <div class="style">
    <div><span>Amount:</span><span class="js-style">${transaction.amount}</span></div> 
    <div><span>Category:</span><span class="js-style">${transaction.category}</span></div></div>
    <img class="closeBtn" src="close.png">
    </div>
    </div>
    
    <div class="date">${transaction.date}</div>
    <button id="${index}" class="action-box" >Delete</button>
      `;
    mainGrid.appendChild(historyGrid);
    historyGrid.addEventListener("click", (event) => {
      if (
        event.target.id == index &&
        event.target.classList.contains("action-box")
      ) {
        allTransactions.splice(index, 1);
        localStorage.setItem("transactions", JSON.stringify(allTransactions));
        updatingGrid();
        addingFunc();
        expensesData();
        monthlyChart();
        initializeCharts();
        barChart.update();
      }
    });
  });
};

let addingFunc = () => {
  let totals = allTransactions.reduce(
    (total, transaction) => {
      let toNumber = parseFloat(transaction.amount);
      if (transaction.type == "income") {
        total.Income += toNumber;
      } else if (transaction.type == "expense") {
        total.Expense += toNumber;
      }
      return total;
    },
    { Income: 0, Expense: 0 }
  );
  const netBalance = totals.Income - totals.Expense;

  income.innerHTML = `$${totals.Income.toFixed(2)}`;
  expense.innerHTML = `$${totals.Expense.toFixed(2)}`;
  netBal.innerHTML = `$${netBalance.toFixed(2)}`;
};

let pieChart;
let initializeChart = () => {
  pieChart = new Chart(ctx, {
    type: "doughnut", // Type of chart
    data: {
      labels: [], // Category names
      datasets: [
        {
          data: [], // Totals for each category
          backgroundColor: [
            // Colors for each category
            "#FFD700",
            "#FF6F61",
            "#00A8E8",
            "#A2D5C6",
            "#967BB6",
            "#FFA07A",
          ],
          borderColor: [
            // '#36A2EB'
          ],
        },
      ],
    },
    options: {
      responsive: true, // Make the chart responsive
      // maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#fff",
          },
          position: "left", // Position of the legend
        },
        title: {
          display: false,
          text: "Expense Categories", // Chart title
        },
      },
    },
  });
};

let expensesData = () => {
  let allExpenses = allTransactions.filter(
    (currElement) => currElement.type == "expense"
  );
  const categoryTotals = allExpenses.reduce((total, expTransaction) => {
    const expCategory = expTransaction.category;

    const expAmount = parseFloat(expTransaction.amount);
    if (!total[expCategory]) {
      total[expCategory] = 0;
    }
    total[expCategory] += expAmount;

    return total;
  }, {});
  pieChart.data.labels = Object.keys(categoryTotals);
  pieChart.data.datasets[0].data = Object.values(categoryTotals);
  pieChart.update();
};

let barChart;
let initializeCharts = () => {
  barChart = Highcharts.chart(ctx2, {
    chart: {
      type: "column",
      backgroundColor: "transparent",
      style: {
        color: "#fff", // White text for all labels
      },
    },
    title: { text: "" },
    xAxis: {
      type: "category",
      labels: {
        style: { color: "#fff" }, // White x-axis labels
      },
    },

    yAxis: {
      title: { text: "Amount", style: { color: "#fff" } },
      labels: {
        style: { color: "#fff" }, // White y-axis labels
      },
      gridLineColor: "rgba(255, 255, 255, 0.1)",
    },
    legend: {
      itemStyle: { color: "#fff" }, // White legend text
    },
    plotOptions: {
      column: {
        pointWidth: 20, // Fixed bar width in pixels
        groupPadding: 0.09,
        pointPadding: 0.09, // Spacing between groups
        borderWidth: 0,
      },
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 1300, // Mobile breakpoint
          },
        },
      ],
    },
    series: [
      {
        name: "Income",
        data: [], // Will be populated by monthlyChart()
        color: "#36A2EB",
      },
      {
        name: "Expense",
        data: [], // Will be populated by monthlyChart()
        color: "#FF6384",
      },
    ],
  });
};

const monthlyChart = () => {
  let monthlyTotals = allTransactions.reduce((total, Transaction) => {
    let date = new Date(Transaction.date);
    let month = date.toLocaleString("default", { month: "short" });
    let year = date.getFullYear();
    let monthYear = month + " " + year;

    if (!total[monthYear]) {
      total[monthYear] = { Income: 0, Expense: 0 };
    }
    if (Transaction.type === "income") {
      total[monthYear].Income += parseFloat(Transaction.amount);
    } else if (Transaction.type === "expense") {
      total[monthYear].Expense += parseFloat(Transaction.amount);
    }
    return total;
  }, {});

  let categories = Object.keys(monthlyTotals);
  const values = Object.values(monthlyTotals);
  let incomeData = values.map((v) => v.Income);
  let expenseData = values.map((v) => v.Expense);

  barChart.xAxis[0].setCategories(categories);
  barChart.series[0].setData(incomeData);
  barChart.series[1].setData(expenseData);

  barChart.update();

  return monthlyTotals;
};

let currencyConversions = () => {
  fetch("https://api.frankfurter.app/currencies")
    .then((res) => res.json())
    .then((data) => {
      for (const [code, name] of Object.entries(data)) {
        const option = new Option(`${code} - ${name}`, code);
        basecurr.add(option);
        toCurr.add(option.cloneNode(true));
        convertAmount.style.display = "none";

        convertBtn.addEventListener("click", () => {
          convertAmount.style.display = "inline";

          convertAmount.innerHTML = `<img src="loading.svg"></img>`;

          if (basecurr.value == toCurr.value) {
            convertAmount.style.display = "inline";
            convertAmount.style.color = "red";
            convertAmount.innerHTML = currencyInput.value;
          } else {
            fetch(
              `https://api.frankfurter.app/latest?amount=${currencyInput.value}&from=${basecurr.value}&to=${toCurr.value}`
            )
              .then((res) => res.json())
              .then((data) => {
                convertAmount.innerHTML = Object.values(data.rates)[0];
                convertAmount.style.color = "white";
              });
          }
        });
      }
    });

  fetch(
    `https://rest.coincap.io/v3/assets?apiKey=edcc152085b01a27602cdb9dac332d64c98f687ee5e0e89c6cb8bfc88b70dd75`
  )
    .then((resp) => resp.json())
    .then((data) => {
      let storedCurrencies = data;
      for (let step = 0; step < 100; step++) {
        let currencyOptns = new Option(storedCurrencies.data[step].id);
        cryptoSearch.add(currencyOptns);
      }
    });

  cryptoData.style.display = "none";

  searchBtn.addEventListener("click", () => {
    if (cryptoSearch.value != "Select") {
      loadIcn.style.display = "inline";
      fetch(
        `https://rest.coincap.io/v3/assets/${cryptoSearch.value}?apiKey=edcc152085b01a27602cdb9dac332d64c98f687ee5e0e89c6cb8bfc88b70dd75`
      )
        .then((response) => response.json())
        .then((data) => {
          let response = data;
          loadIcn.style.display = "none";

          cryptoData.style.display = "inline";

          rank.innerHTML = response.data.rank;
          symbol.innerHTML = response.data.symbol;
          priceUsd.innerHTML = Number(response.data.priceUsd).toFixed(3);
        });
    } else {
      cryptoData.style.display = "none";
    }
  });
};
