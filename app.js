const notStartedCol = document.querySelector('.not_started_col');
const progressCol = document.querySelector('.progress_col');
const completedCol = document.querySelector('.completed-col');
const notStartedColUl = document.querySelector('.not_started_col ul');
const progressColUl = document.querySelector('.progress_col ul');
const completedColUl = document.querySelector('.completed-col ul');
let notStartedColLi = document.querySelectorAll('.not_started_col ul li ');
let progressColLi = document.querySelectorAll('.progress_col ul li');
let completedColLi = document.querySelectorAll('.completed-col ul li');
const notStartedBtn = document.querySelector('.not_started');
const progressBtn = document.querySelector('.progress');
const completedBtn = document.querySelector('.completed');

let newTasks = {
  not_started_ul: JSON.parse(
    localStorage.getItem(notStartedColUl.classList[1]),
  ),
  progress_ul: JSON.parse(localStorage.getItem(progressColUl.classList[1])),
  completed_ul: JSON.parse(localStorage.getItem(completedColUl.classList[1])),
};

for (const [key, value] of Object.entries(newTasks)) {
  updateUi(document.querySelector(`.${key}`), value);
}

function updateUi(list, e) {
  list.innerHTML = '';

  if (e === null) {
    localStorage.setItem('not_started_ul', JSON.stringify([]));
    localStorage.setItem('progress_ul', JSON.stringify([]));
    localStorage.setItem('completed_ul', JSON.stringify([]));
    return;
  } else {
    e.forEach((ele, ind) => {
      const teksel = document.createElement('li');
      teksel.setAttribute('draggable', 'true');
      teksel.innerHTML = `            <input type="text" readonly value="${ele}" class="taskin" />
      <button class="editButton">
        <i class="fa-regular fa-pen-to-square edit"></i>
      </button>
      <button class="okbtn off">
        <i class="fa-solid fa-check-double check"></i>
      </button>
      <button class="delbutton">
        <i class="fa-solid fa-trash del"></i>
      </button>
      `;
      list.append(teksel);
    });
  }
}
let editBtn = document.querySelectorAll('.editButton');
let checkBtn = document.querySelectorAll('.check');

let removeBtn = document.querySelectorAll('.delbutton');
// add tasks  and save to locale
function addTask(list) {
  const listClass = list.classList[1];

  const arr = JSON.parse(localStorage.getItem(listClass));

  arr.push(`task ${arr.length + 1}`);

  localStorage.setItem(listClass, JSON.stringify(arr));

  updateUi(list, arr);

  removeBtn = document.querySelectorAll('.delbutton');
  removeTasks();

  editBtn = document.querySelectorAll('.editButton');
  checkBtn = document.querySelectorAll('.check');
  editTasks();

  progressColLi = document.querySelectorAll('.progress_col ul li');
  completedColLi = document.querySelectorAll('.completed-col ul li');
  notStartedColLi = document.querySelectorAll('.not_started_col ul li ');
  dragItem(notStartedColLi, notStartedColUl);

  dragItem(progressColLi, progressColUl);

  dragItem(completedColLi, completedColUl);
}
removeBtn = document.querySelectorAll('.delbutton');
// event listeners

notStartedBtn.addEventListener('click', () => addTask(notStartedColUl));

progressBtn.addEventListener('click', () => addTask(progressColUl));

completedBtn.addEventListener('click', () => addTask(completedColUl));

// console.log(editBtn);

function editTasks() {
  editBtn.forEach((e) => {
    e.addEventListener('click', (el) => {
      const checkButton = e.nextElementSibling;
      const thePrevuesValue = e.previousElementSibling.value;
      let listClass = e.parentElement.parentElement.classList[1];
      e.classList.add('off');
      checkButton.classList.remove('off');
      e.previousElementSibling.removeAttribute('readonly');
      //
      checkButton.addEventListener('click', () => {
        e.previousElementSibling.setAttribute('readonly', '');
        checkButton.classList.add('off');
        e.classList.remove('off');
        //
        const theNewValue = e.previousElementSibling.value;
        const theValueArr = JSON.parse(localStorage.getItem(listClass)).map(
          (e) => (e === thePrevuesValue ? theNewValue : e),
        );
        //
        localStorage.setItem(listClass, JSON.stringify(theValueArr));
      });
    });
  });
}
editTasks();

// remove tasks
function removeTasks() {
  removeBtn.forEach((e) => {
    e.addEventListener('click', () => {
      let listClass = e.parentElement.parentElement.classList[1];
      const theValue = e.parentElement.firstElementChild.value;
      const theValueArr = JSON.parse(localStorage.getItem(listClass)).filter(
        (e) => {
          return e !== theValue;
        },
      );
      localStorage.setItem(listClass, JSON.stringify(theValueArr));
      e.parentElement.remove();
    });
  });
}

let tasksUl = document.querySelectorAll('ul');

progressColLi = document.querySelectorAll('.progress_col ul li');
completedColLi = document.querySelectorAll('.completed-col ul li');
notStartedColLi = document.querySelectorAll('.not_started_col ul li ');

function dragItem(arr, ul) {
  let drag = null;
  let dragValue = null;
  arr.forEach((eleLi) => {
    eleLi.addEventListener('dragstart', (ele) => {
      drag = eleLi;
      eleLi.style.opacity = '0.5';
      eleLi.parentElement.style.backgroundColor = '#ff4949';
    });
    eleLi.addEventListener('dragend', (ele) => {
      drag = null;
      eleLi.style.opacity = '1';
      eleLi.parentElement.style.backgroundColor = 'transparent';
      dragValue = eleLi.querySelector('input').value;
    });

    tasksUl.forEach((list) => {
      list.addEventListener('dragover', (e) => {
        e.preventDefault();

        list.style.backgroundColor = '#ff4949';
      });

      list.addEventListener('dragleave', (e) => {
        list.style.backgroundColor = 'transparent';
      });

      list.addEventListener('drop', function () {
        if (drag !== null) {
          this.append(drag);
          const theArr = JSON.parse(localStorage.getItem(this.classList[1]));

          if (!theArr.includes(drag.querySelector('input').value)) {
            theArr.push(drag.querySelector('input').value);
            localStorage.setItem(this.classList[1], JSON.stringify(theArr));
            tasksUl.forEach((e) => {
              const valueArrays = Array.from(e.querySelectorAll('input')).map(
                (e) => e.value,
              );
              localStorage.setItem(e.classList[1], JSON.stringify(valueArrays));
            });
          }
        } else {
          return;
        }
      });
    });
    // the each for the hole fun
  });
}
dragItem(notStartedColLi, notStartedColUl);

dragItem(progressColLi, progressColUl);

dragItem(completedColLi, completedColUl);

removeTasks();
function saveToLocale(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}
