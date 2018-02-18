import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {ShoppingListService} from "../../services/shopping-list";
import {Ingredient} from "../../models/ingredient";
import {SlOptionsPage} from "./sl-options/sl-options";
import {AuthService} from "../../services/auth";


@IonicPage()
@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {
  ingredients: Ingredient[];

  constructor(private shoppingListService: ShoppingListService,
              private popoverCtrl: PopoverController,
              private authService: AuthService) {}

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

  onCheckItem(index: number) {
    this.shoppingListService.removeItem(index);
    this.loadIngredients();
  }

  onShowOptions(event: MouseEvent) {
    const popover = this.popoverCtrl.create(SlOptionsPage);
    popover.present({
      ev: event
    });

    popover.onDidDismiss(data => {
      if (data.action == 'load') {
        this.authService.getActiveUser().getToken()
          .then((token: string) => {
            this.shoppingListService.fetchList(token)
              .subscribe(
                (list: Ingredient[]) => {
                  if(list) {
                    this.ingredients = list;
                  } else {
                    this.ingredients = [];
                  }
                },
                error => {
                  console.log(error);
                });
          });
      } else {
        this.authService.getActiveUser().getToken()
          .then((token: string) => {
            this.shoppingListService.storeList(token)
              .subscribe(() => {console.log('Success')},
                error => {
                console.log(error);
                });
          });
      }
    });
  }

}
