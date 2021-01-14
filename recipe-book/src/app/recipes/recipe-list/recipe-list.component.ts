import { Component, OnInit } from '@angular/core';

import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [
    new Recipe('Chicken Curry', 'A delicious Indian dish', 'https://hips.hearstapps.com/del.h-cdn.co/assets/17/31/1501791674-delish-chicken-curry-horizontal.jpg?crop=1xw:1xh;center,top&resize=768:*'),
    new Recipe('Pudim', 'A tasty Brazilian dessert', 'https://img.itdg.com.br/tdg/images/recipes/000/031/593/318825/318825_original.jpg?mode=crop&width=710&height=400')
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
