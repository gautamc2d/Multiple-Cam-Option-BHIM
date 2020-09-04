import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderService } from '../../shared/Loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  public isLoading: Subject<boolean> = this.loaderService.isLoading;
  // public color: string = 'primary';
  // public mode: string = 'indeterminate';
  // public value: number = 50;
  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
  }

}
