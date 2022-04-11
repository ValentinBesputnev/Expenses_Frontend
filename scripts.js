let allExpenses = [];
let countSumm = 0;
let valueInputShop = "";
let valueInputSumm = "";
let inputShop = null;
let inputSumm = null;
let activeEditShop = { index: null, text: null, summ: null, date: null };

const updateValueShop = (event) => valueInputShop = event.target.value;

const updateValueSumm = (event) => valueInputSumm = +event.target.value;

const newDate = new Date();

const options = { year: 'numeric', month: 'numeric', day: 'numeric' };

const todayDate = newDate.toLocaleString("ru", options)

window.onload =  async () => {
  inputShop = document.getElementById("add-shop");
  inputShop.addEventListener("change", updateValueShop);

  inputSumm = document.getElementById("add-summ");
  inputSumm.addEventListener("change", updateValueSumm);

  const response = await fetch("http://localhost:4000/allExpenses", {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });

  const result = await response.json();
  allExpenses = result.data;
  render();
  totalSumm();
};

const onClickButton = async () => {
  if (valueInputShop.trim() != "" && Math.sign(valueInputSumm) === 1 ) {
    const response = await fetch("http://localhost:4000/createExpense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        text: valueInputShop,
        summ: valueInputSumm,
        date: todayDate
      })
    });

    const result = await response.json();
    allExpenses = result.data;
    countSumm += +valueInputSumm;
    inputSumm.value = "";
    inputShop.value = "";
    valueInputShop = "";
    valueInputSumm = "";
    render();
  } else {
    alert('Данные неверны, пожалуйста, введите корректные данные.')
  };
};

const render = () => {
  const allSumm = document.getElementById("allSumm");
  const content = document.getElementById("content-page");

  while (content.firstChild) {
    content.removeChild(content.firstChild);
  };

  while (allSumm.firstChild) {
    allSumm.removeChild(allSumm.firstChild);
  };

  const totalSumm = document.createElement('p');
  totalSumm.className = 'totalSumm';
  totalSumm.innerText = `Итого: ${countSumm} р.`;
  allSumm.appendChild(totalSumm);

  allExpenses.map((item, index) => {
    const container = document.createElement("div");
    container._id = `expense=${index}`;
    container.className = "expense-container";

    if (index === activeEditShop.index) {
      const newInputShop = document.createElement("input");
      newInputShop.type = "text";
      newInputShop.value = item.text;
      newInputShop.className = "newInputShop";
      newInputShop.addEventListener("change", (e) => updateShopText(e));
      container.appendChild(newInputShop);

      const newInputDate = document.createElement('input');
      newInputDate.type = 'date';
      newInputDate.value = item.date;
      newInputDate.className = 'newInputDate';
      newInputDate.addEventListener("change", (e) => updateDateValue(e));
      container.appendChild(newInputDate);

      const newInputSumm = document.createElement('input');
      newInputSumm.type = 'text';
      newInputSumm.value = item.summ;
      newInputSumm.className = 'newInputSumm';
      newInputSumm.addEventListener("change", (e) => updateSummValue(e));
      container.appendChild(newInputSumm);

      const imageDone = document.createElement("img");
      imageDone.src = "imgs/Goto.png";
      imageDone.onclick = () => doneEditTask(index);
      container.appendChild(imageDone);

      const imageCancel = document.createElement("img");
      imageCancel.src = "imgs/close.png";
      imageCancel.onclick = () => cancelEditTask();
      container.appendChild(imageCancel);
      
    } else {
      const text = document.createElement("p");
      text.innerText = (index + 1) + ") Магазин " + item.text;
      text.className = "shop"
      text.addEventListener('click', () => {
        const newInputShop = document.createElement("input");
        newInputShop.type = "text";
        newInputShop.value = item.text;
        newInputShop.className = "newInputShop";
        newInputShop.addEventListener("change", (e) => updateShopText(e));
        newInputShop.addEventListener("blur", () => {
          doneEditTask(index)
        });
        container.replaceChild(newInputShop, text);
        newInputShop.focus();
      })
      container.appendChild(text);

      const date = document.createElement('p');
      date.innerText = item.date;
      date.className = 'date';
      date.addEventListener('dblclick', () => {
        const newInputDate = document.createElement("input");
        newInputDate.type = "date";
        newInputDate.value = item.date;
        newInputDate.className = "newInputDate";
        newInputDate.addEventListener("change", (e) => updateDateValue(e));
        newInputDate.addEventListener("blur", () => {
          doneEditTask(index);
        });
        container.replaceChild(newInputDate, date);
        newInputDate.focus();
      })
      container.appendChild(date);

      const summ = document.createElement('p');
      summ.innerText = `${item.summ} р.`;
      summ.className = 'summ';
      summ.addEventListener('dblclick', () => {
        const newInputSumm = document.createElement("input");
        newInputSumm.type = "text";
        newInputSumm.value = item.summ;
        newInputSumm.className = "newInputSumm";
        newInputSumm.addEventListener("change", (e) => updateSummValue(e));
        newInputSumm.addEventListener("blur", () => {
          doneEditTask(index);
        });
        container.replaceChild(newInputSumm, summ);
        newInputSumm.focus();
      })
      container.appendChild(summ);

      const imageEdit = document.createElement("img");
      imageEdit.className = "imageEdit";
      imageEdit.src = "imgs/edit.png";
      imageEdit.onclick = () => {
        activeEditShop = { 
          index: index, 
          text: allExpenses[index].text,
          summ: allExpenses[index].summ,
          date: allExpenses[index].date
        }
        render();
      };
      container.appendChild(imageEdit);

      const imageDelete = document.createElement("img");
      imageDelete.src = "imgs/close.png";
      imageDelete.onclick = () => onDeleteExpense(index);
      container.appendChild(imageDelete);
    };
    content.appendChild(container);
  });
};

const totalSumm = () => {
  allExpenses.map(item => countSumm += +item.summ);
  render();
};

const updateShopText = (event) => activeEditShop.text = event.target.value;

const updateSummValue = (event) => activeEditShop.summ = event.target.value;

const updateDateValue = (event) => activeEditShop.date = event.target.value.split("-").reverse().join(".");

const doneEditTask = async (index) => {
  allExpenses[index].text = activeEditShop.text;
  allExpenses[index].summ = activeEditShop.summ;
  allExpenses[index].date = activeEditShop.date;
  let _id = allExpenses[index]._id;
  const response = await fetch("http://localhost:4000/updateExpense", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      _id,
      text: activeEditShop.text,
      summ: activeEditShop.summ,
      date: activeEditShop.date
    }),
  });
  const result = await response.json();
  allExpenses = result.data;
  countSumm = null;
  activeEditShop = { index: null, text: null, summ: null, date: null };
  totalSumm()
  render();
};

const onDeleteExpense = async (index) => {
  const response = await fetch(`http://localhost:4000/deleteExpense?_id=${allExpenses[index]._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
  const result = await response.json();
  allExpenses = result.data;
  countSumm = null;
  render();
  totalSumm();
};

const cancelEditTask = () => {
  activeEditShop = { index: null, text: null, summ: null, date: null };
  render();
};