const showItemsDiv = document.querySelector('.show-items');
const categorySelect = document.getElementById("categ-list");
const search = document.getElementById("search-box");
const minPrice = document.getElementById("min-price");
const maxPrice = document.getElementById("max-price");
const applyFilterBtn = document.getElementById("apply-filter-btn");
const itemsList = document.querySelector(".items-list");
const totalPrice = document.querySelector(".total-price");
const totalQuantity = document.querySelector(".total-quantity");
let currentPage = 1;
let totalPages = 0;
let allItems = [];
let totalPriceSum = 0;
let totalQuantitySum = 0;

const getItems = async () => {
  const url = "https://fakestoreapi.com/products";
  const response = await fetch(url, {
    method: 'GET'
  });
  const items = await response.json();
  return items;
};

const createItemElement = (item) => {
  const itemDiv = document.createElement('div');
  itemDiv.classList.add('item');
  
  const itemTitle = document.createElement('h2');
  itemTitle.textContent = item.title;

  const itemImage = document.createElement('img');
  itemImage.src = item.image;
  
  const itemPrice = document.createElement('h4');
  itemPrice.textContent = `$${item.price}`;

  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('buttons-container');

  const viewDetailsBtn = document.createElement('button');
  viewDetailsBtn.innerText = "View Details";

  const addCartBtn = document.createElement('button');
  addCartBtn.innerText = "Add to Cart";
  addCartBtn.classList.add('add-cart');

  addCartBtn.addEventListener('click', () => addToCart(item));

  buttonDiv.appendChild(viewDetailsBtn);
  buttonDiv.appendChild(addCartBtn);
  itemDiv.appendChild(itemImage);
  itemDiv.appendChild(itemTitle);
  itemDiv.appendChild(itemPrice);
  itemDiv.appendChild(buttonDiv);

  return itemDiv;
};

const applyFilter = (items) => {
  if (!items) return [];
  
  console.log('apply filter is running');
  const filteredItems = items.filter(item => {
    return (
      (!search.value.toLowerCase() || item.title.toLowerCase().includes(search.value.toLowerCase())) &&
      (categorySelect.value === "All Categories" || item.category === categorySelect.value) &&
      (!minPrice.value || item.price >= parseFloat(minPrice.value)) &&
      (!maxPrice.value || item.price <= parseFloat(maxPrice.value))
    );
  });
  return filteredItems;
};

const showCategories = (items) => {
  const categories = [...new Set(items.map((item) => item.category))];
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.innerText = category;
    categorySelect.appendChild(option);
  });
};

const clearItems = () => {
  while (showItemsDiv.firstChild) {
    showItemsDiv.removeChild(showItemsDiv.firstChild);
  }
};

const paginateItems = (items) => {
  clearItems();
  let itemsNumber = 0;
  let pageNumber = 1;
  let itemsPage = document.createElement('div');
  itemsPage.classList.add(`page-${pageNumber}`, 'page');
      
  items.forEach((item) => {
    if (itemsNumber === 5) {
      itemsNumber = 0;
      pageNumber++;

      showItemsDiv.appendChild(itemsPage);
      itemsPage = document.createElement('div');
      itemsPage.classList.add(`page-${pageNumber}`, 'page');
    }
    
    const itemDiv = createItemElement(item);
    itemsPage.appendChild(itemDiv);

    itemsNumber++;
  });
  showItemsDiv.appendChild(itemsPage);
  totalPages = pageNumber;
  
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.style.display = 'none');
  if (pages.length > 0) {
    pages[0].style.display = 'flex';
  }
};

function navigateTo(pageNumber) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.style.display = 'none');

  const selectedPage = document.querySelector(`.page-${pageNumber}`);
  if(selectedPage){
    selectedPage.style.display = "flex";
  }
}

const addToCart = (item) => {
  itemsList.innerHTML += `<li>${item.title} - $${item.price} <button onclick="removeFromCart(this, ${item.price})">Remove</button></li>`;
  totalPriceSum += item.price;
  totalQuantitySum += 1;
  updateCartSummary();
};

const removeFromCart = (button, itemPrice) => {
  button.parentElement.remove();
  totalPriceSum -= itemPrice;
  totalQuantitySum -= 1;
  updateCartSummary();
};

const updateCartSummary = () => {
  totalPrice.textContent = totalPriceSum.toFixed(2);
  totalQuantity.textContent = totalQuantitySum;
};


getItems()
.then(items => {
  allItems = items;
  paginateItems(items);
  showCategories(items);
})
.catch(reason => console.log(reason.message));

applyFilterBtn.addEventListener("click", () => {
  console.log("Filter button clicked");
  const filteredItems = applyFilter(allItems);
  paginateItems(filteredItems);
});
