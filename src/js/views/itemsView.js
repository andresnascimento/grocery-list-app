class ItemsView {
  _itemsList = document.querySelector(".js-items__list");
  _formField = document.querySelector(".js-add-item-form");
  _summaryDetails = document.querySelector(".summary-details");
  _summaryPrice = document.querySelector(".summary-price");
  //   Inputs
  _productNameInput = document.querySelector("#productName");
  _productPriceInput = document.querySelector("#productPrice");
  _quantityValueInput = document.querySelector("#quantityValue");
  _editProductNameInput = document.querySelector("#editProductName");
  _editProductPriceInput = document.querySelector("#editProductPrice");
  _editQuantityValueInput = document.querySelector("#editQuantityValue");
  //   Dialog
  _addItemDialog = document.querySelector("#addItemDialog");
  _editItemDialog = document.querySelector("#editItemDialog");
  _footerItemDialog = document.querySelector(".js-dialog-footer");
  _addFriendDialog = document.querySelector("#addFriendDialog");
  //   Buttons
  _addItemBtn = document.querySelector(".js-add-item-button");
  _submitNewItemBtn = document.querySelector(".js-submit-new-item");
  _changeItemQuantityBtn = document.querySelectorAll(".js-btn-qty");
  _submitEditedItemBtn = document.querySelector(".js-submit-edit-item");
  _addNewFriendBtn = document.querySelector(".js-add-friend-button");

  _data;
  _totalFriends = 1;
  _generateMarkup(item) {
    const lastItem = item.quantity === 1;
    return `<li class="grocery-item" data-id="${item.id}">
                <article>
                    <header class="grocery-item__header">
                        <h3 class="grocery-item__header-title">${item.name}</h3>
                        <p><span class="grocery-item__header-subtitle js-item-price">${item.price}</span> / unit</p>
                        <span class="material-symbols-outlined">edit</span>
                    </header>
                    <div class="js-quantity-selector grocery-item__actions">
                        <button class="js-remove-button" type="button" data-behavior="remove" aria-label="Remove one ${item.name}">
                        <span class="material-symbols-outlined btn-icon btn-${lastItem ? "delete" : "remove"}">${lastItem ? "delete" : "remove"}</span>
                        </button>
                        <output
                        aria-live="polite"
                        aria-label="Quantity of ${item.name}"
                        >
                        ${item.quantity}
                        </output>
                        <button class="js-add-button" type="button" data-behavior="add" aria-label="Add one ${item.name}">
                        <span class="material-symbols-outlined btn-icon">add</span>
                        </button>
                    </div>
                    <p class="grocery-item__total">
                        <output aria-label="Total price for ${item.name}"
                        >${+item.price * +item.quantity} </output
                        >
                    </p>
                </article>
          </li>`;
  }

  _updateDialogButton() {
    const markup = `<button
            type="submit"
            value="confirm"
            class="btn-primary js-submit-new-item"
          >
            Add ${this._quantityValueInput.value} items → R$${+this._quantityValueInput.value * +this._productPriceInput.value}
          </button>`;

    this._footerItemDialog.innerHTML = "";
    this._footerItemDialog.insertAdjacentHTML("afterbegin", markup);
  }

  render(data) {
    if (data.length === 0) return;

    this._data = data;
    this._itemsList.innerHTML = "";
    console.log(data);

    // render the list of items
    this._data.forEach((element) => {
      const markup = this._generateMarkup(element);
      this._itemsList.insertAdjacentHTML("afterbegin", markup);
    });

    // render summary
    this._renderSummary();
  }

  _renderSummary() {
    const totalPrice = this._data
      .map((e) => e.price * e.quantity)
      .reduce((acc, item) => acc + item, 0);

    const totalQuantity = this._data.reduce(
      (acc, item) => acc + item.quantity,
      0,
    );
    this._summaryPrice.textContent = `${totalPrice}`;
    this._summaryDetails.innerHTML = `<strong>${totalQuantity} items</strong> | ${totalPrice / this._totalFriends} for each friend `;
  }

  updateSummary(newItemQuantity, updatedItemID) {
    //update the local data with new item quantity without rendering the items list
    const updateData = this._data.map((item) => {
      return item.id === updatedItemID
        ? { ...item, quantity: newItemQuantity }
        : item;
    });
    this._data = updateData;
    // render the summary with updated data
    this._renderSummary();
  }

  //   -- HANDLERS --

  addNewFriendHandler() {
    this._addNewFriendBtn.addEventListener("click", (e) => {
      this._addFriendDialog.showModal();
    });
  }

  formFieldHandler() {
    this._formField.addEventListener("input", (e) => {
      this._updateDialogButton();
    });
    this._formField.addEventListener("click", (e) => {
      if (e.target.type === "button") {
        this._updateDialogButton();
      }
    });
  }

  _dialogQuantityHandler(quantityBtn) {
    this._changeItemQuantityBtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.behavior === "add") {
          quantityBtn.value++;
        }
        if (btn.dataset.behavior === "remove" && quantityBtn.value >= 2) {
          quantityBtn.value--;
        }
      });
    });
  }

  addItemHandler() {
    this._addItemBtn.addEventListener("click", () => {
      this._addItemDialog.showModal();
    });
    this._dialogQuantityHandler(this._quantityValueInput);
    this._updateDialogButton();
  }
  editItemHandler(handler) {
    let id;
    this._itemsList.addEventListener("click", (e) => {
      const header = e.target.closest(".grocery-item__header");
      if (!header) return;
      // filter the item by it's id
      const currItemID = e.target.closest(".grocery-item").dataset.id;
      const currItem = this._data.filter(
        (item) => item.id === currItemID,
        0,
      )[0];
      // set the input values
      this._editProductNameInput.value = currItem.name;
      this._editProductPriceInput.value = currItem.price;
      this._editQuantityValueInput.value = currItem.quantity;
      id = currItemID;

      this._dialogQuantityHandler(this._editQuantityValueInput);
      // opens dialog
      this._editItemDialog.showModal();
    });
    // update the item's data
    this._submitEditedItemBtn.addEventListener("click", () => {
      handler(
        id,
        this._editProductNameInput.value,
        this._editProductPriceInput.value,
        this._editQuantityValueInput.value,
      );
    });
  }
  submitNewItemHandler(handler) {
    this._footerItemDialog.addEventListener("click", (e) => {
      if (e.target.type === "submit") {
        handler(
          this._productNameInput.value,
          this._productPriceInput.value,
          this._quantityValueInput.value,
        );
      }
    });
  }
  quantityControlHandler(handler) {
    this._itemsList.addEventListener("click", (e) => {
      // get the current elements
      const btn = e.target.closest("button");
      if (!btn) return;

      const groceryItem = btn.closest(".grocery-item");
      const groceryItemId = groceryItem.dataset.id;
      const itemQuantity = groceryItem.querySelector("output");
      const itemTotalPrice = groceryItem.querySelector(
        ".grocery-item__total output",
      );

      let quantity = +itemQuantity.textContent;
      const itemPrice = +groceryItem.querySelector(
        ".grocery-item__header-subtitle",
      ).textContent;

      // updates interface
      // FUTURE IMPROVE: improve the deletion process think about a better way to change buttons based on item quantity
      const btnRemove = groceryItem.querySelector(".js-remove-button");

      if (btn.dataset.behavior === "add") {
        quantity++;
        quantity === 2
          ? (btnRemove.innerHTML = `<span class="material-symbols-outlined btn-icon">remove</span>`)
          : null;
      }
      if (btn.dataset.behavior === "remove") {
        quantity--;
        quantity === 1
          ? (btnRemove.innerHTML = `<span class="material-symbols-outlined btn-icon">delete</span>`)
          : null;
      }

      itemQuantity.textContent = quantity === 0 ? 1 : quantity; // FUTURE IMPROVE
      itemTotalPrice.textContent = itemPrice * quantity;

      // update database
      handler(groceryItemId, quantity, itemPrice);
    });
  }
}

export default new ItemsView();
