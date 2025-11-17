'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const tbody = table.querySelector('tbody');
  const headers = table.querySelectorAll('th');

  let sortDirections = {};

  // ==========================
  // SORTING (ASC / DESC)
  // ==========================
  headers.forEach((th, columnIndex) => {
    sortDirections[columnIndex] = 'asc';

    th.addEventListener('click', () => {
      const rows = Array.from(tbody.querySelectorAll('tr'));

      const sorted = rows.sort((a, b) => {
        const cellA = a.children[columnIndex].textContent.trim();
        const cellB = b.children[columnIndex].textContent.trim();

        const aVal = parseValue(cellA);
        const bVal = parseValue(cellB);

        if (aVal < bVal) return sortDirections[columnIndex] === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirections[columnIndex] === 'asc' ? 1 : -1;
        return 0;
      });

      sortDirections[columnIndex] =
        sortDirections[columnIndex] === 'asc' ? 'desc' : 'asc';

      tbody.innerHTML = '';
      sorted.forEach(row => tbody.appendChild(row));
    });
  });

  function parseValue(value) {
    if (value.startsWith('$')) {
      return Number(value.replace(/[$,]/g, ''));
    }

    if (!isNaN(value)) {
      return Number(value);
    }

    return value.toLowerCase();
  }

  // ==========================
  // ROW SELECTION
  // ==========================
  tbody.addEventListener('click', e => {
    const row = e.target.closest('tr');
    if (!row) return;

    // Remove previous selection
    tbody.querySelectorAll('tr').forEach(r => r.classList.remove('selected'));

    // Add selection
    row.classList.add('selected');
  });

  // ==========================
  // ADD FORM
  // ==========================
  createForm();

  function createForm() {
    const form = document.createElement('form');
    form.className = 'employee-form';

    form.innerHTML = `
      <input name="name" placeholder="Name" />
      <input name="position" placeholder="Position" />
      <input name="office" placeholder="Office" />
      <input name="age" placeholder="Age" />
      <input name="salary" placeholder="Salary ($)" />
      <button type="submit">Add employee</button>
    `;

    document.body.insertBefore(form, table);

    form.addEventListener('submit', e => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(form));

      if (!validate(data)) {
        showNotification('Invalid form data!');
        return;
      }

      addEmployee(data);
      form.reset();
      showNotification('Employee added successfully!');
    });
  }

  function validate(data) {
    if (
      !data.name.trim() ||
      !data.position.trim() ||
      !data.office.trim() ||
      !data.age.trim() ||
      !data.salary.trim()
    ) {
      return false;
    }

    if (isNaN(data.age) || data.age <= 0) return false;

    if (!data.salary.startsWith('$')) return false;

    return true;
  }

  function addEmployee(data) {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${data.name}</td>
      <td>${data.position}</td>
      <td>${data.office}</td>
      <td>${data.age}</td>
      <td>${data.salary}</td>
    `;

    tbody.appendChild(tr);
  }

  // ==========================
  // NOTIFICATION SYSTEM
  // ==========================
  function showNotification(message) {
    let box = document.querySelector('.notification');

    if (!box) {
      box = document.createElement('div');
      box.className = 'notification';
      document.body.appendChild(box);
    }

    box.textContent = message;
    box.classList.add('visible');

    setTimeout(() => {
      box.classList.remove('visible');
    }, 2000);
  }

  // ==========================
  // EDIT CELLS
  // ==========================
  tbody.addEventListener('dblclick', e => {
    const cell = e.target.closest('td');
    if (!cell) return;

    const oldValue = cell.textContent;
    const input = document.createElement('input');
    input.value = oldValue;
    cell.textContent = '';
    cell.appendChild(input);
    input.focus();

    input.addEventListener('blur', () => {
      if (!input.value.trim()) {
        cell.textContent = oldValue;
      } else {
        cell.textContent = input.value.trim();
      }
    });

    input.addEventListener('keydown', evt => {
      if (evt.key === 'Enter') {
        input.blur();
      }
    });
  });
});
