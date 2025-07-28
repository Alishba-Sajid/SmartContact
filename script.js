const form = document.getElementById("contactForm");
const tableBody = document.querySelector("#contactTable tbody");
const toast = document.getElementById("toast");

let contacts = [];
let editIndex = -1;

form.addEventListener("submit", function (e) {
  e.preventDefault();


  if (!form.checkValidity()) {
   
    form.reportValidity();
    return; 
  }

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  const contact = { firstName, lastName, email, phone };

  if (editIndex === -1) {
    contacts.push(contact);
    showToast("✅ Contact added successfully!");
  } else {
    contacts[editIndex] = contact;
    showToast("✏️ Contact updated successfully!");
    editIndex = -1;
    document.getElementById("submitBtn").innerHTML = '<i class="fas fa-user-plus fa-sm"></i> Submit';
  }

  form.reset();
  renderTable();
});

function renderTable() {
  tableBody.innerHTML = "";

  if (contacts.length === 0) {
    const row = document.createElement("tr");
    const td = document.createElement("td");
    td.setAttribute("colspan", "5");
    td.textContent = "📭 No contacts available.";
    td.style.textAlign = "center";
    td.style.padding = "1rem";
    td.style.color = "#999";
    td.style.fontStyle = "italic";
    row.appendChild(td);
    tableBody.appendChild(row);
    return;
  }

  contacts.forEach((contact, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${contact.firstName}</td>
      <td>${contact.lastName}</td>
      <td>${contact.email}</td>
      <td>${contact.phone}</td>
      <td><button class="update-btn" onclick="editContact(${index})">✏️ Update</button></td>
    `;

    if (editIndex === index) {
      row.classList.add("highlight");
    }

    tableBody.appendChild(row);
  });
}

function editContact(index) {
  const contact = contacts[index];
  document.getElementById("firstName").value = contact.firstName;
  document.getElementById("lastName").value = contact.lastName;
  document.getElementById("email").value = contact.email;
  document.getElementById("phone").value = contact.phone;
  editIndex = index;
  document.getElementById("submitBtn").innerHTML = '<i class="fas fa-save fa-sm"></i> Update';
  renderTable();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

function showModal(message) {
  const modal = document.getElementById("modal");
  const modalMsg = document.getElementById("modal-message");
  modalMsg.textContent = message;
  modal.classList.remove("hidden");
}

document.getElementById("closeModalBtn").addEventListener("click", () => {
  document.getElementById("modal").classList.add("hidden");
});

document.getElementById("exportBtn").addEventListener("click", () => {
  if (contacts.length === 0) {
    showModal("⚠️ No contacts to export.");
    return;
  }

  const worksheetData = [
    ["First Name", "Last Name", "Email", "Phone"],
    ...contacts.map(contact => [contact.firstName, contact.lastName, contact.email, contact.phone])
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");

  XLSX.writeFile(workbook, "ContactList.xlsx");
});

renderTable();