import { listData } from './listData.js';
const app = document.querySelector('.app'),
  addForm = document.querySelector('.add-form'),
  sortButtons = document.querySelectorAll('.sort-btn');

const table = document.createElement('table');
const tableBody = document.createElement('tbody');

let sortType = 'fio';
let activeSortButton = document.querySelector(`[data-sortBy="${sortType}"]`);

const addTableStyles = () => {
  table.classList.add('table', 'table-dark');
};
const createTableHeader = () => {
  const tableHead = document.createElement('thead');
  const tableHeadTr = document.createElement('tr');
  const headers = ['ПІБ', 'Вік', 'Рік народження', 'Хобі'];
  headers.forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = headerText;
    tableHeadTr.append(th);
  });

  tableHead.append(tableHeadTr);
  table.append(tableHead);
};

const createTableBody = () => {
  table.append(tableBody);
};

const createTableCell = (tr, text) => {
  const td = document.createElement('td');
  td.textContent = text;
  tr.append(td);
};

const createUserTr = oneUser => {
  const { fio, age, hobby, birthYear } = oneUser;
  const userTr = document.createElement('tr');
  createTableCell(userTr, fio);
  createTableCell(userTr, age);
  createTableCell(userTr, birthYear);
  createTableCell(userTr, hobby);
  return userTr;
};

const sortData = (arrData, sortType) => {
  switch (sortType) {
    case 'fio':
      return arrData.sort((a, b) => a.fio.localeCompare(b.fio));
    case 'age':
      return arrData.sort((a, b) => a.age - b.age);
    default:
      return arrData;
  }
};

const transformUserData = oneUser => {
  const { name, surname, lastname, age } = oneUser;
  const fio = `${name} ${surname} ${lastname}`;
  const currentYear = new Date().getFullYear();
  const birthYear = currentYear - age;
  return {
    ...oneUser,
    fio,
    birthYear,
  };
};

const renderTable = arrData => {
  tableBody.innerHTML = '';
  let copyListData = arrData.map(transformUserData);
  const sortedData = sortData(copyListData, sortType);
  const newRows = sortedData.map(createUserTr);
  tableBody.append(...newRows);
  table.append(tableBody);
};


const getNewUserData = addForm => {
  const formData = new FormData(addForm);
  let formDataObject = {};
  formData.forEach((value, key) => {
    formDataObject[key] =
      typeof value === 'string' ? value.trim() : parseInt(value);
  });

  return formDataObject;
};

const addNewUserToList = formData => {
  listData.push(formData);
};

const validateFormData = form => {
  let result = true;
  const allInputs = form.querySelectorAll('input');

  const validateInput = (input, errorMessage) => {
    removeError(input);
    createError(input, errorMessage);
    result = false;
  };


  const validateSymbols = input => {
    const validInputRegex = /^[a-zA-Z\-']+$/;
    if (!validInputRegex.test(input.value) && !input.dataset.minAge) {
      validateInput(
        input,
        'Дозволено лише літери, символи "-" та \'',
      );
    }
  }
  const validateMinLength = input => {
    const trimmedValue = input.value.trim().length;
    if (trimmedValue < input.dataset.minLength) {
      validateInput(
        input,
        `Мінімальна к-ть символів: ${input.dataset.minLength}`,
      );
    }
  };

  const validateMinAge = input => {
    if (input.value < input.dataset.minAge) {
      validateInput(input, `Мінімальне значення віку: ${input.dataset.minAge}`);
    }
  };

  const validateRequired = input => {
    if (input.value === '') {
      validateInput(input, 'Поле не заповнене');
    }
  };

  for (let input of allInputs) {
    removeError(input);
    validateSymbols(input);
    validateMinLength(input);
    validateMinAge(input);
    if (input.dataset.required === 'true') {
      validateRequired(input);
    }
  }
  return result;
};

const removeError = input => {
  const parent = input.parentNode;
  if (parent.classList.contains('error')) {
    parent.querySelector('.error-text').remove();
    parent.classList.remove('error');
  }
};

const createError = (input, text) => {
  const parent = input.parentNode;
  const errorText = document.createElement('label');
  errorText.classList.add('error-text');
  errorText.textContent = text;
  parent.classList.add('error');
  parent.append(errorText);
};

const handleSortButtonClick = button => {
  const sortBy = button.getAttribute('data-sortBy');
  if(sortType !== sortBy ) {
    if (activeSortButton) {
      activeSortButton.classList.remove('active');
    }
    activeSortButton = button;
    button.classList.add('active');
    sortType = sortBy;
    renderTable(listData);
  }
  
};


const handleFormSubmit = e => {
  e.preventDefault();
  if (validateFormData(addForm)) {
    const newUser = getNewUserData(addForm);
    addNewUserToList(newUser);
    renderTable(listData);
  }
};

const initializeTable = () => {
  app.append(table);
  addTableStyles();
  createTableHeader();
  createTableBody();
  renderTable(listData);
};

initializeTable();
addForm.addEventListener('submit', handleFormSubmit);
sortButtons.forEach(button => {
  button.addEventListener('click', () => handleSortButtonClick(button));
});
