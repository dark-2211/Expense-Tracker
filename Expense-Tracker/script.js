
// Get saved transactions
let transactions = JSON.parse(
    localStorage.getItem("transactions")
) || [];

let form = document.getElementById("transactionForm");
let list = document.getElementById("transactionList");

// Add transaction
form.addEventListener("submit", function (event) {

    event.preventDefault();

    let name = document.getElementById("name").value.trim();
    let amount = Number(document.getElementById("amount").value);
    let type = document.getElementById("type").value;
    let category = document.getElementById("category").value;

    if (name === "" || amount <= 0 || !Number.isFinite(amount)) {
        alert("Please enter valid details.");
        return;
    }

    let transaction = {
        id: Date.now(),
        name: name,
        amount: amount,
        type: type,
        category: category
    };

    transactions.push(transaction);

    saveTransactions();
    displayTransactions();

    form.reset();
});


// Display transactions
function displayTransactions() {

    list.innerHTML = "";

    let income = 0;
    let expense = 0;

    transactions.forEach(function (transaction) {

        if (transaction.type === "income") {
            income += transaction.amount;
        } else {
            expense += transaction.amount;
        }

        let li = document.createElement("li");

        let color = transaction.type === "income"
            ? "green"
            : "red";

        let sign = transaction.type === "income"
            ? "+"
            : "-";

        li.innerHTML = `
            <div>
                <p class="transaction-name"></p>
                <p class="transaction-category"></p>
            </div>

            <div class="transaction-right">
                <strong class="${color}">
                    ${sign} Rs. ${transaction.amount.toLocaleString()}
                </strong>

                <button class="delete-btn">
                    Delete
                </button>
            </div>
        `;

        li.querySelector(".transaction-name").textContent =
            transaction.name;

        li.querySelector(".transaction-category").textContent =
            transaction.category;

        li.querySelector(".delete-btn").onclick = function () {
            deleteTransaction(transaction.id);
        };

        list.appendChild(li);
    });

    if (transactions.length === 0) {
        list.innerHTML = `
            <p class="empty">No transactions yet.</p>
        `;
    }

    // Update balance cards
    let balance = income - expense;

    document.getElementById("balance").textContent =
        "Rs. " + balance.toLocaleString();

    document.getElementById("income").textContent =
        "Rs. " + income.toLocaleString();

    document.getElementById("expense").textContent =
        "Rs. " + expense.toLocaleString();

    // Update progress bars
    let total = income + expense;

    let incomePercent = total > 0 ? (income / total) * 100 : 0;
    let expensePercent = total > 0 ? (expense / total) * 100 : 0;

    document.getElementById("incomeBar").style.width =
        incomePercent + "%";

    document.getElementById("expenseBar").style.width =
        expensePercent + "%";
}


// Delete transaction
function deleteTransaction(id) {

    transactions = transactions.filter(function (transaction) {
        return transaction.id !== id;
    });

    saveTransactions();
    displayTransactions();
}


// Save transactions in LocalStorage
function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}


// Display saved transactions on page load
displayTransactions();
