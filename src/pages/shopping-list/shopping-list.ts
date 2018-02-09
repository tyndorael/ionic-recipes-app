import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {ShoppingListService} from "../../services/shopping-list";
import {Ingredient} from "../../models/ingredient";


@IonicPage()
@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {
  ingredients: Ingredient[];

  constructor(private shoppingListService: ShoppingListService) {}

  ionViewWillEnter() {
    this.loadIngredients();
  }

  onAddItem(form: NgForm) {
    this.shoppingListService.addItem(form.value.ingredientName, form.value.amount);
    form.reset();
    this.loadIngredients();
  }

  private loadIngredients() {
    this.ingredients = this.shoppingListService.getItems();
  }

  onRemoveItem(ingredient: Ingredient) {
    const position = this.ingredients.findIndex((ingredientEl: Ingredient) => {
      return ingredientEl.name == ingredient.name;
    });
    this.shoppingListService.removeItem(position);
    this.loadIngredients();
  }

}
