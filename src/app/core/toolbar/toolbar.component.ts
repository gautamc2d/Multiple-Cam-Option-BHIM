import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToolbarHelpers } from './toolbar.helpers';
import { SharedService } from '../../shared/shared.service';

@Component({
	selector: 'app-toolbar',
	templateUrl: './toolbar.component.html',
	styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

	@Input() sidenav;
	@Input() sidebar;
	@Input() drawer;
	@Input() matDrawerShow;
	public toolbarHelpers: any = ToolbarHelpers;
	public item = { msg1: '', msg2: '' };
	public hideSearchBar: boolean = true;
	public levels: Array<any> = [];
	public selectedLeval: any;
	constructor(private shared: SharedService) { }

	ngOnInit() {
		this.shared.title.subscribe(updatedTitle => {
			this.item = updatedTitle;
		});
		this.shared.hideSearchBar.subscribe(hide => {
			this.hideSearchBar = hide;
		});
		const levelData = this.shared.accessLevels();
		this.levels = levelData['data'];
		this.selectedLeval = levelData['level'];
	}

	/**
	 * Applys filter
	 * @param val
	 */
	public applyFilter(val) {
		this.shared.setFilter(val);
	}
}
