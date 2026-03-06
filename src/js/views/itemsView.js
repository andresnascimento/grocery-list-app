class ItemsView {
  _itemsList = document.querySelector(".js-items__list");
  _formField = document.querySelector(".js-add-item-form");
  //   Inputs
  _productNameInput = document.querySelector("#productName");
  _productPriceInput = document.querySelector("#productPrice");
  _quantityValueInput = document.querySelector("#quantityValue");
  //   Dialog
  _addItemDialog = document.querySelector("#addItemDialog");
  _footerItemDialog = document.querySelector(".js-dialog-footer");
  //   Buttons
  _addItemBtn = document.querySelector(".js-add-item-button");
  _submitNewItemBtn = document.querySelector(".js-submit-new-item");
  _changeItemQuantityBtn = document.querySelectorAll(".js-btn-qty");

  _data;

  _generateMarkup(item) {
    return `<li class="grocery-item" data-id="${item.id}">
                <article>
                    <header class="grocery-item__header">
                        <h3 class="grocery-item__header-title">${item.name}</h3>
                        <p><span class="grocery-item__header-subtitle">${item.price}</span> / unit</p>
                    </header>
                    <div class="js-quantity-selector grocery-item__actions">
                        <button type="button" data-behavior="remove" aria-label="Remove one ${item.name}">
                        −
                        </button>
                        <output
                        aria-live="polite"
                        aria-label="Quantity of ${item.name}"
                        >
                        ${item.quantity}
                        </output>
                        <button type="button" data-behavior="add" aria-label="Add one ${item.name}">
                        +
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
      if (btn.dataset.behavior === "add") quantity++;
      if (btn.dataset.behavior === "remove" && quantity > 0) quantity--;

      itemQuantity.textContent = quantity;
      itemTotalPrice.textContent = itemPrice * quantity;

      // update database
      handler(groceryItemId, quantity);
    });
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

    this._data.forEach((element) => {
      const markup = this._generateMarkup(element);
      this._itemsList.insertAdjacentHTML("afterbegin", markup);
    });
  }

  //   -- HANDLERS --
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

  _dialogQuantityHandler() {
    this._changeItemQuantityBtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.behavior === "add") {
          this._quantityValueInput.value++;
        }
        if (
          btn.dataset.behavior === "remove" &&
          this._quantityValueInput.value >= 2
        ) {
          this._quantityValueInput.value--;
        }
      });
    });
  }

  addItemHandler() {
    this._addItemBtn.addEventListener("click", () => {
      this._addItemDialog.showModal();
    });
    this._dialogQuantityHandler();
    this._updateDialogButton();
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
}

export default new ItemsView();
