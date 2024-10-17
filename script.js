const expenseList = document.getElementById("expensesList");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const date = document.getElementById("date");
const category = document.getElementById("category");

let editId;

function getItemsFromLocalStorage() {
  const itemsList = localStorage.getItem("itemsList");
  return itemsList ? JSON.parse(itemsList) : [];
}

function saveItemsToLocalStorage() {
  localStorage.setItem("itemsList", JSON.stringify(itemsList));
}

let itemsList = getItemsFromLocalStorage();

updateExpenseTable(itemsList);

function addOrUpdateExpense() {
  if (editId !== undefined) {
    const index = itemsList.findIndex((item) => item.id === editId);
    itemsList[index].description = description.value;
    itemsList[index].amount = parseInt(amount.value);
    itemsList[index].date = date.value;
    itemsList[index].category = category.value;

    editId = undefined;
    document.getElementById("submitExpense").textContent = "Submit Expense";

    description.value = "";
    amount.value = "";
    date.value = "";
    category.selectedIndex = 0;
  } else {
    const expense = {
      description: description.value,
      amount: parseInt(amount.value),
      date: date.value,
      category: category.value,
      id: Math.random().toString(16).slice(2),
    };

    if (!description.value || !amount.value || !date.value || !category.value) {
      return alert("Please fill all fields");
    }
    itemsList.push(expense);
  }

  saveItemsToLocalStorage();
  updateExpenseTable(itemsList);

  description.value = "";
  amount.value = "";
  date.value = "";
  category.selectedIndex = 0;
}

function updateExpenseTable(expenseItems) {
  expenseList.innerHTML = "";

  expenseItems.forEach((expense) => {
    const tr = document.createElement("tr");

    Object.entries(expense).forEach(([key, value]) => {
      if (key !== "id") {
        const cell = document.createElement("td");
        if (typeof value === "number") {
          cell.textContent = `$${value}`;
        } else {
          cell.textContent = value;
        }
        tr.appendChild(cell);
      }
    });

    const edit = createButton("edit", ["btn", "btn-info"]);
    edit.style.marginRight = "5px";
    const remove = createButton("delete", ["btn", "btn-danger"]);

    tr.append(edit, remove);
    expenseList.appendChild(tr);

    remove.addEventListener("click", () => {
      removeExpense(tr, expense);
    });

    edit.addEventListener("click", () => {
      editExpense(expense);
    });
  });
}

function createButton(title, classes) {
  const btn = document.createElement("button");
  btn.textContent = title;
  btn.classList.add(...classes);
  btn.setAttribute("type", "button");
  return btn;
}

function removeExpense(element, objectElement) {
  const confirmation = confirm("Are you sure you want to delete this expense?");

  if (confirmation) {
    itemsList = itemsList.filter((el) => el.id !== objectElement.id);
    expenseList.innerHTML = "";
    updateExpenseTable(itemsList);
    element.remove();
    saveItemsToLocalStorage();
  }
}

function editExpense(expense) {
  description.value = expense.description;
  amount.value = expense.amount;
  date.value = expense.date;
  category.value = expense.category;
  editId = expense.id;
  document.getElementById("submitExpense").textContent = "Update";
}

const select = document.getElementById("custom-select");

// immediately invoked function expression (IIFE)
(function createOptions() {
  let selectTracker = [];

  Array.from(category.children).forEach((item) =>
    selectTracker.push(item.value)
  );

  selectTracker.forEach((item) => {
    const option = document.createElement("option");
    option.textContent = item;
    option.value = item;
    select.append(option);
  });
})();

let filteredExpenses = [];

select.addEventListener("change", () => {
  const selectedCategory = select.value;

  if (selectedCategory === select.options[0].value) {
    updateExpenseTable(itemsList);
    filteredExpenses.length = 0;
  } else {
    filteredExpenses = itemsList.filter(
      (expense) => expense.category === selectedCategory
    );
    updateExpenseTable(filteredExpenses);
  }
});

// (Inline) - sort by amount and date
function sortExpenses(field, direction) {
  let expensesToSort =
    filteredExpenses.length > 0 ? filteredExpenses : itemsList;
  // Sort the expenses
  if (field === "amount") {
    expensesToSort.sort((a, b) =>
      direction === "asc" ? a[field] - b[field] : b[field] - a[field]
    );
  } else if (field === "date") {
    expensesToSort.sort((a, b) =>
      direction === "asc"
        ? new Date(a[field]) - new Date(b[field])
        : new Date(b[field]) - new Date(a[field])
    );
  }
  updateExpenseTable(expensesToSort);
}
