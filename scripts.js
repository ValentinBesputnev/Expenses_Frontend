let allExpenses = [];
let countSumm = 0;
let valueInputShop = "";
let valueInputSumm = "";
let inputShop = null;
let inputSumm = null;
let activeEditShop = { text: null, index: null }

const updateValueShop = (event) => valueInputShop = event.target.value;

const updateValueSumm = (event) => valueInputSumm = +event.target.value;

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
  if (valueInputShop.trim() != "" && valueInputSumm != "") {
    const response = await fetch("http://localhost:4000/createExpense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        text: valueInputShop,
        summ: valueInputSumm,
        date: dateNow
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
    alert('Поля не должны быть пусты. Пожалуйста, введите данные.')
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
    container.id = `expense=${index}`;
    container.className = "expense-container";

    if (index === activeEditShop.index) {
      const newInputShop = document.createElement("input");
      newInputShop.type = "text";
      newInputShop.value = item.text;
      newInputShop.className = "newInputShop";
      newInputShop.addEventListener("input", (e) => updateTaskText(e));
      newInputShop.addEventListener("onclick", () => doneEditTask(index));
      container.appendChild(newInputShop);

      const newInputDate = document.createElement('input');
      newInputDate.type = 'date';
      newInputDate.value = item.date;
      newInputDate.className = 'newInputDate';
      newInputDate.addEventListener('change', updateDateValue());
      container.appendChild(newInputDate);

      const newInputSumm = document.createElement('input');
      newInputSumm.type = 'text';
      newInputSumm.value = item.summ;
      newInputSumm.className = 'newInputSumm';
      newInputSumm.addEventListener('change', updateSummValue());
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
      text.innerText = (index + 1) + ") " +item.text;
      text.className = "shop"
      container.appendChild(text);

      const date = document.createElement('p');
      date.innerText = item.date;
      date.className = 'date';
      container.appendChild(date);

      const summ = document.createElement('p');
      summ.innerText = `${item.summ} р.`;
      summ.className = 'summ';
      container.appendChild(summ);

      const imageEdit = document.createElement("img");
      imageEdit.className = "imageEdit";
      imageEdit.src = "imgs/edit.png";
      imageEdit.onclick = () => {
        activeEditTask = { index: index, text: allExpenses[index].text };
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
}

const totalSumm = () => {
  allExpenses.map(item => countSumm += +item.summ);
  render();
}