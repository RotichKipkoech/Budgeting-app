const apiUrl = 'http://localhost:3000/accounts';

let isAdminLoggedIn = false;
let currentUser = null;
let isAdminMode = false;

function switchToUser() {
    isAdminMode = false;
    document.getElementById('user-login').style.display = 'block';
    document.getElementById('admin-login').style.display = 'none';
    resetLoginForms();
}

function switchToAdmin() {
    isAdminMode = true;
    document.getElementById('user-login').style.display = 'none';
    document.getElementById('admin-login').style.display = 'block';
    resetLoginForms();
}

function resetLoginForms() {
    document.getElementById('user-username').value = '';
    document.getElementById('user-password').value = '';
    document.getElementById('admin-username').value = '';
    document.getElementById('admin-password').value = '';
}

async function adminLogin() {
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    const response = await fetch(`${apiUrl}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        isAdminLoggedIn = true;
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('admin-management').style.display = 'block';
        loadUserAccounts();
    } else {
        alert('Invalid admin username or password');
    }
}

async function createUser() {
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;

    if (username && password) {
        const response = await fetch(`${apiUrl}/admin/accounts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        if (response.ok) {
            document.getElementById('new-username').value = '';
            document.getElementById('new-password').value = '';
            loadUserAccounts();
        } else {
            alert('Failed to create user account');
        }
    }
}

async function loadUserAccounts() {
    const response = await fetch(`${apiUrl}/admin/accounts`);
    const accounts = await response.json();
    const userAccountsList = document.getElementById('user-accounts');
    userAccountsList.innerHTML = '';

    accounts.forEach(account => {
        const li = document.createElement('li');
        li.textContent = `Username: ${account.username} || Password: ${account.password}`;
        userAccountsList.appendChild(li);
    });
}

async function userLogin() {
    const username = document.getElementById('user-username').value;
    const password = document.getElementById('user-password').value;

    const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        currentUser = await response.json();
        document.getElementById('user-login').style.display = 'none';
        document.getElementById('user-dashboard').style.display = 'block';
        loadUserBudgets();
    } else {
        alert('Invalid username or password');
    }
}

async function loadUserBudgets() {
    const budgetsList = document.getElementById('budgets');
    budgetsList.innerHTML = '';

    const response = await fetch(`http://localhost:3000/budgets/${currentUser.username}`);
    if (response.ok) {
        const budgets = await response.json();
        budgets.forEach((budget, index) => {
            const li = document.createElement('li');
            li.textContent = `${budget.category}: $${budget.amount} (Month: ${budget.month}, Status: ${budget.status})`;

            // Add an edit button
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.onclick = () => editBudget(index);
            li.appendChild(editButton);

            budgetsList.appendChild(li);
        });
    } else {
        alert('No budgets found for this user.');
    }
}

async function addBudget() {
    const category = prompt("Enter budget category:");
    const amount = prompt("Enter budget amount:");
    const month = prompt("Enter budget month:");
    const status = "Open"; // Default status when adding

    if (category && amount && month) {
        const response = await fetch(`http://localhost:3000/budgets/${currentUser.username}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category, amount: parseFloat(amount), month, status }),
        });

        if (response.ok) {
            loadUserBudgets();
        } else {
            const errorData = await response.json();
            alert(`Failed to add budget: ${errorData.message}`);
        }
    }
}

async function editBudget(index) {
    const budgetsResponse = await fetch(`http://localhost:3000/budgets/${currentUser.username}`);
    const budgets = await budgetsResponse.json();

    const budgetToEdit = budgets[index];
    const newCategory = prompt("Edit budget category:", budgetToEdit.category);
    const newAmount = prompt("Edit budget amount:", budgetToEdit.amount);
    const newMonth = prompt("Edit budget month:", budgetToEdit.month);
    const newStatus = prompt("Edit budget status (Open/Pending/Closed):", budgetToEdit.status);

    if (newCategory && newAmount && newMonth && newStatus) {
        const response = await fetch(`http://localhost:3000/budgets/${currentUser.username}/${index}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category: newCategory, amount: parseFloat(newAmount), month: newMonth, status: newStatus }),
        });

        if (response.ok) {
            loadUserBudgets();
        } else {
            const errorData = await response.json();
            alert(`Failed to edit budget: ${errorData.message}`);
        }
    }
}

function logout() {
    isAdminLoggedIn = false;
    document.getElementById('admin-management').style.display = 'none';
    document.getElementById('admin-login').style.display = 'block';
}

function userLogout() {
    currentUser = null;
    document.getElementById('user-dashboard').style.display = 'none';
    document.getElementById('user-login').style.display = 'block';
}
