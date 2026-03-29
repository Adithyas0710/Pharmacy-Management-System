const BASE = "http://localhost:5000/api";

// Calculate total amount
function calculateTotal() {
  const qty = Number(document.getElementById('qty').value);
  const price = Number(document.getElementById('price').value);
  const total = qty * price;
  document.getElementById('total').value = total.toFixed(2);
}

// ➕ ADD TRANSACTION
async function add() {
  const qty = Number(document.getElementById('qty').value);
  const price = Number(document.getElementById('price').value);
  const total = qty * price;

  const data = {
    customer_name: document.getElementById('name').value,
    customer_phone: document.getElementById('phone').value,
    medicines: [{
      name: document.getElementById('med').value,
      quantity: qty,
      price: price
    }],
    total_amount: total,
    payment_mode: document.getElementById('payment').value
  };

  try {
    const response = await fetch(`${BASE}/transactions/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      alert("Transaction saved successfully!");
      document.getElementById('billingForm').reset();
    } else {
      alert("Error saving transaction.");
    }
  } catch (error) {
    alert("Network error.");
  }
}

// 🔍 SEARCH
async function searchData() {
  const phone = document.getElementById('phone').value.trim();
  if (!phone) {
    document.getElementById('result').innerHTML = '<p>Please enter a phone number.</p>';
    return;
  }

  const res = await fetch(`${BASE}/transactions/search/${encodeURIComponent(phone)}`);
  if (!res.ok) {
    document.getElementById('result').innerHTML = `<p>Error: ${res.status} ${res.statusText}</p>`;
    return;
  }

  const data = await res.json();

  if (!Array.isArray(data) || data.length === 0) {
    document.getElementById('result').innerHTML = '<p>No transactions found.</p>';
    return;
  }

  let table = '<table border="1"><thead><tr><th>Customer Name</th><th>Phone</th><th>Date</th><th>Medicines</th><th>Total Amount</th><th>Payment Mode</th></tr></thead><tbody>';

  data.forEach(transaction => {
    const name = transaction.customer_name || transaction.customerName || 'N/A';
    const phone = transaction.customer_phone || transaction.phone || 'N/A';
    const date = transaction.date ? new Date(transaction.date).toLocaleDateString() : 'N/A';

    let medicines = 'N/A';
    if (Array.isArray(transaction.medicines) && transaction.medicines.length > 0) {
      medicines = transaction.medicines
        .map(med => {
          const medName = med.name || med.medicine || med.med || 'Unknown';
          const qty = med.quantity ?? med.qty ?? '';
          return qty ? `${medName} (${qty})` : medName;
        })
        .join(', ');
    } else if (transaction.medicine || transaction.med) {
      const medName = transaction.medicine || transaction.med;
      const qty = transaction.quantity ?? transaction.qty ?? '';
      medicines = qty ? `${medName} (${qty})` : medName;
    } else if (transaction.total_amount && transaction.medicines && !Array.isArray(transaction.medicines)) {
      // fallback for non-array medicines object
      const med = transaction.medicines;
      const medName = med.name || med.medicine || med.med;
      const qty = med.quantity ?? med.qty;
      if (medName) {
        medicines = qty ? `${medName} (${qty})` : `${medName}`;
      }
    }

    const totalVal = transaction.total_amount != null ? transaction.total_amount : transaction.total; 
    const total = totalVal != null ? Number(totalVal).toFixed(2) : 'N/A';
    const payment = transaction.payment_mode || transaction.paymentMode || 'N/A';

    table += `<tr><td>${name}</td><td>${phone}</td><td>${date}</td><td>${medicines}</td><td>${total}</td><td>${payment}</td></tr>`;
  });

  table += '</tbody></table>';
  document.getElementById('result').innerHTML = table;
}

// 📦 ADD INVENTORY ITEM
async function addMedicine() {
  const data = {
    name: document.getElementById('name').value,
    stock: Number(document.getElementById('stock').value),
    price: Number(document.getElementById('price').value)
  };

  await fetch(`${BASE}/inventory/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  alert("Inventory item added!");
}

// 📋 LOAD INVENTORY
async function loadMeds() {
  const res = await fetch(`${BASE}/inventory`);
  const data = await res.json();

  if (data.length === 0) {
    document.getElementById('medList').innerHTML = '<p>No medicines found.</p>';
    return;
  }

  let table = '<table border="1"><thead><tr><th>Name</th><th>Stock</th><th>Price</th></tr></thead><tbody>';

  data.forEach(medicine => {
    const name = medicine.name;
    const stock = medicine.stock;
    const price = medicine.price.toFixed(2);

    table += `<tr><td>${name}</td><td>${stock}</td><td>${price}</td></tr>`;
  });

  table += '</tbody></table>';

  document.getElementById('medList').innerHTML = table;
}

// 📊 SUMMARY
async function getSummary() {
  const res = await fetch(`${BASE}/transactions/summary`);
  const data = await res.json();

  if (data.length === 0 || !data[0].totalSales) {
    document.getElementById('total').innerHTML = '<p>No sales data found.</p>';
    return;
  }

  const totalSales = data[0].totalSales.toFixed(2);

  const table = `<table border="1"><thead><tr><th>Total Sales</th></tr></thead><tbody><tr><td>${totalSales}</td></tr></tbody></table>`;

  document.getElementById('total').innerHTML = table;
}