class ItemsView {
  _itemsList = document.querySelector(".js-items__list");
  _formField = document.querySelector(".js-add-item-form");
  _friendFormField = document.querySelector(".js-add-friend-form");
  _summarySection = document.querySelector(".js-summary");
  _summaryDetails = document.querySelector(".summary-details");
  _summaryPrice = document.querySelector(".summary-price");
  //   Inputs
  _productNameInput = document.querySelector("#productName");
  _productPriceInput = document.querySelector("#productPrice");
  _quantityValueInput = document.querySelector("#quantityValue");
  _editProductNameInput = document.querySelector("#editProductName");
  _editProductPriceInput = document.querySelector("#editProductPrice");
  _editQuantityValueInput = document.querySelector("#editQuantityValue");
  _friendNameInput = document.querySelector("#addFriendName");
  //   Dialog
  _addItemDialog = document.querySelector("#addItemDialog");
  _editItemDialog = document.querySelector("#editItemDialog");
  _footerItemDialog = document.querySelector(".js-dialog-footer");
  _addFriendDialog = document.querySelector("#addFriendDialog");
  //   Buttons
  _addItemBtn = document.querySelector(".js-add-item-button");
  _submitNewItemBtn = document.querySelector(".js-submit-new-item");
  _newItemCloseBtn = document.querySelector("js-dialog-close-btn");
  _changeItemQuantityBtn = document.querySelectorAll(".js-btn-qty");
  _submitEditedItemBtn = document.querySelector(".js-submit-edit-item");
  _addNewFriendBtn = document.querySelector(".js-add-friend-button");
  _submitFriendBtn = document.querySelector(".js-submit-add-friend");

  _data;
  _dataFriends;
  _totalFriends = 1;
  _generateMarkup(item) {
    return `<li class="grocery-item" data-id="${item.id}">
                <article>
                    <header class="grocery-item__header">
                        <h3 class="grocery-item__header-title">${item.name}</h3>
                        <p class="grocery-item__header-subtitle-container flex items-center gap-4">
                            <span class="grocery-item__header-subtitle js-item-price">${item.price}</span>
                            <span>/ unit</span>
                            <span class="material-symbols-outlined btn-icon">edit</span>
                        </p>
                    </header>
                    <div class="grocery-item__quantity-container flex justify-between items-center ">
                        <p class="grocery-item__total">
                            <output aria-label="Total price for ${item.name}">
                                ${+item.price * +item.quantity}
                            </output>
                        </p>
                        <div class="js-quantity-selector grocery-item__actions flex justify-between items-center gap-16 ">
                        <div class="js-dynamic-button">  
                            ${this._generateQtyButtonMarkup("remove")}
                        </div>  
                            <output
                            class="js-item-quantity"
                            value="${item.quantity}"
                            aria-live="polite"
                            aria-label="Quantity of ${item.name}"
                            >
                            ${item.quantity}
                            </output>
                            <button class="js-add-button  btn btn__control btn__control-add" type="button" data-behavior="add" aria-label="Add one ${item.name}">
                            <span class="material-symbols-outlined btn-icon">add</span>
                            </button>
                        </div>
                        
                    </div>
                </article>
          </li>`;
  }

  _generateEmptyState() {
    return `<li class="items__empty-state">
                <figure>
                <img src="src/img/empty.png" alt="" />
                <h2>Add your first grocery item</h2>
                </figure>
            </li>`;
  }

  _updateDialogButton() {
    const markup = `<button
            type="submit"
            value="confirm"
            class="btn btn-lg btn-primary js-submit-new-item"
          >
            Add ${this._quantityValueInput.value} items → R$${+this._quantityValueInput.value * +this._productPriceInput.value}
          </button>`;

    this._footerItemDialog.innerHTML = "";
    this._footerItemDialog.insertAdjacentHTML("afterbegin", markup);
  }

  render(data) {
    this._dataItems = data.items;
    this._dataFriends = data.list_friends;
    this._itemsList.innerHTML = "";

    // empty list
    if (this._dataItems.length === 0) {
      //   this._summarySection.classList.add("hidden");
      const emptyMarkup = this._generateEmptyState();
      this._itemsList.insertAdjacentHTML("afterbegin", emptyMarkup);
    } else {
      // render the list of items
      this._dataItems.forEach((element) => {
        const markup = this._generateMarkup(element);
        this._itemsList.insertAdjacentHTML("afterbegin", markup);
      });

      // render summary
      this._renderSummary();
    }
  }

  _renderSummary() {
    const totalPrice = this._dataItems
      .map((e) => e.price * e.quantity)
      .reduce((acc, item) => acc + item, 0);

    const totalQuantity = this._dataItems.reduce(
      (acc, item) => acc + item.quantity,
      0,
    );
    this._summaryPrice.textContent = `${totalPrice}`;
    this._summaryDetails.innerHTML = `${totalQuantity} items | ${totalPrice / this._totalFriends} for each friend `;
  }

  updateSummary(newItemQuantity, updatedItemID) {
    //update the local data with new item quantity without rendering the items list
    const updateData = this._dataItems.map((item) => {
      return item.id === updatedItemID
        ? { ...item, quantity: newItemQuantity }
        : item;
    });
    this._dataItems = updateData;
    // render the summary with updated data
    this._renderSummary();
  }

  _setInputFocus(input) {
    // add focus on first input after rendering dialog js
    requestAnimationFrame(() => {
      input.focus();
    });
  }

  _clearInputValue(inputArr) {
    // clear values after closing dialog
    requestAnimationFrame(() => {
      inputArr.forEach((input) => {
        input.value = "";
      });
    });
  }
  _generateQtyButtonMarkup(type) {
    return `<button class="js-remove-button btn btn__control btn__control-${type}" type="button" data-behavior="${type}" aria-label="${type} item">
                <span class="material-symbols-outlined btn-icon btn-${type}">${type}</span>
            </button>`;
  }

  //   -- HANDLERS --

  addNewFriendHandler(handler) {
    const name = this._friendNameInput;
    const avatar = document.querySelector(
      'input[name="avatar"]:checked',
    )?.value;

    this._addNewFriendBtn.addEventListener("click", (e) => {
      this._addFriendDialog.showModal();
      this._setInputFocus(name);
    });

    this._submitFriendBtn.addEventListener("click", (e) => {
      handler(name.value, avatar);
    });

    this._addFriendDialog.addEventListener("submit", (e) => {
      this._friendFormField.reset();
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
      this._setInputFocus(this._productNameInput);
    });
    this._dialogQuantityHandler(this._quantityValueInput);
    this._updateDialogButton();
  }
  editItemHandler(handler) {
    let id;
    const name = this._editProductNameInput;
    const price = this._editProductPriceInput;
    const quantity = this._editQuantityValueInput;

    this._itemsList.addEventListener("click", (e) => {
      const header = e.target.closest(".grocery-item__header");
      if (!header) return;
      // filter the item by it's id
      const currItemID = e.target.closest(".grocery-item").dataset.id;
      const currItem = this._dataItems.filter(
        (item) => item.id === currItemID,
        0,
      )[0];
      // set the input values
      name.value = currItem.name;
      price.value = currItem.price;
      quantity.value = currItem.quantity;
      id = currItemID;

      this._dialogQuantityHandler(quantity);
      // opens dialog
      this._editItemDialog.showModal();
      this._setInputFocus(name);
    });
    // update the item's data
    this._submitEditedItemBtn.addEventListener("click", () =>
      handler(id, name.value, price.value, quantity.value),
    );
  }

  submitNewItemHandler(handler) {
    const name = this._productNameInput;
    const price = this._productPriceInput;
    const quantity = this._quantityValueInput;

    this._footerItemDialog.addEventListener("click", (e) => {
      if (e.target.type === "submit")
        handler(name.value, price.value, quantity.value);
    });

    this._formField.addEventListener("submit", (e) => {
      this._formField.reset();
      quantity.value = 1;
    });
  }

  deleteItemHandler(handler) {
    this._itemsList.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      const groceryItem = btn.closest(".grocery-item");
      const itemQuantity = document.querySelector(".js-item-quantity");
      if (btn.dataset.behavior === "delete") {
        handler(itemQuantity.value, groceryItem.dataset.id);
      }
    });
  }

  quantityControlHandler(updateItem, deleteItem) {
    this._itemsList.addEventListener("click", (e) => {
      // get the current elements
      const btn = e.target.closest("button");
      if (!btn) return;

      const groceryItem = btn.closest(".grocery-item");
      const itemQuantity = groceryItem.querySelector(".js-item-quantity");
      const itemTotalPrice = groceryItem.querySelector(".grocery-item__total");

      let quantity = +itemQuantity.value;
      const itemPrice = +groceryItem.querySelector(
        ".grocery-item__header-subtitle",
      ).textContent;

      // updates interface
      const buttonDynamicContainer =
        groceryItem.querySelector(".js-dynamic-button");

      if (btn.dataset.behavior === "remove") {
        quantity--;
        if (quantity <= 1)
          buttonDynamicContainer.innerHTML =
            this._generateQtyButtonMarkup("delete");
      }

      if (btn.dataset.behavior === "add") {
        quantity++;
        if (quantity === 2)
          buttonDynamicContainer.innerHTML =
            this._generateQtyButtonMarkup("remove");
      }

      itemQuantity.value = quantity;
      itemTotalPrice.textContent = itemPrice * quantity;

      // update database
      updateItem(groceryItem.dataset.id, quantity, itemPrice);
    });
  }
}

export default new ItemsView();
