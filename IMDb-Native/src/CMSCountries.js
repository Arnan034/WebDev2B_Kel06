document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("countryForm");
    const tableBody = document.querySelector("#countriesTable tbody");
  
    let countries = [
      { no: 1, country: "Indonesia" },
      { no: 2, country: "Japan" },
      { no: 3, country: "South Korea" }
    ];
  
    function renderTable() {
      tableBody.innerHTML = "";
      countries.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.no}</td>
          <td>${item.country}</td>
          <td>
            <button class="btn btn-edit" data-index="${index}">Edit</button>
            <button class="btn btn-delete" data-index="${index}">Delete</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    }
  
    function handleAddCountry(event) {
      event.preventDefault();
      const countryInput = document.getElementById("country");
      const newCountry = {
        no: countries.length ? countries[countries.length - 1].no + 1 : 1,
        country: countryInput.value
      };
      countries.push(newCountry);
      countryInput.value = "";
      renderTable();
    }
  
    function handleEditCountry(index) {
      const newCountryName = prompt("Enter new country name:", countries[index].country);
      if (newCountryName) {
        countries[index].country = newCountryName;
        renderTable();
      }
    }
  
    function handleDeleteCountry(index) {
      countries = countries.filter((_, idx) => idx !== index)
                          .map((item, idx) => ({ ...item, no: idx + 1 }));
      renderTable();
    }
  
    form.addEventListener("submit", handleAddCountry);
  
    tableBody.addEventListener("click", (event) => {
      const target = event.target;
      const index = target.dataset.index;
      if (target.classList.contains("btn-edit")) {
        handleEditCountry(index);
      } else if (target.classList.contains("btn-delete")) {
        handleDeleteCountry(index);
      }
    });
  
    renderTable();
  });
  