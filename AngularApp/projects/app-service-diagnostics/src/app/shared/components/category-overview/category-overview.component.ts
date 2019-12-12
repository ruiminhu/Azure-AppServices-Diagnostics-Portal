import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../shared-v2/services/category.service';
import { Category } from '../../../shared-v2/models/category';


@Component({
  selector: 'category-overview',
  templateUrl: './category-overview.component.html',
  styleUrls: ['./category-overview.component.scss']
})
export class CategoryOverviewComponent implements OnInit {

  categoryId: string = "";
  category: Category;
  constructor(private _activatedRoute: ActivatedRoute, private _router: Router, private _categoryService: CategoryService) {

    // this._activatedRoute.paramMap.subscribe(params => {
    //     console.log("category params", params);
    //     this.categoryId = params.get('category');
    //   });
  }

  ngOnInit() {
    this.categoryId = this._activatedRoute.parent.snapshot.params.category;
    this._categoryService.categories.subscribe(categorys => {
      this.category = categorys.find(category => this.categoryId === category.id);
    });
    console.log("routes", this._activatedRoute.parent);
    console.log("categoryId", this.categoryId);
  }
}
