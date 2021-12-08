import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Pagination } from './pagination.model';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: [ './paginator.component.css' ]
})
export class Paginator {
  @Input('pagination') public pagination: Pagination;

  @Input('availablePageSizes') public availablePageSizes: Array<number> = [ 5, 25, 50, 100 ];

  @Output('goToPage') public goToPageEmitter: EventEmitter<number> = new EventEmitter();
  @Output('changePageSize') public changePageSizeEmitter: EventEmitter<number> = new EventEmitter();

  public goToPage(pageIndex: number): void {
    this.goToPageEmitter.emit(pageIndex);
  }

  public changePageSize(pageSizeString: string) {
    const selectedPageSize = Number(pageSizeString) || this.availablePageSizes[0];
    this.changePageSizeEmitter.emit(selectedPageSize);
  }
}