import { Component, OnInit, Input, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../shared/shared.service';
import { AuthService } from '../../shared/Authentication/AuthService';

@Component({
	selector: 'app-user-menu',
	templateUrl: './user-menu.component.html',
	styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
	isOpen = false;

	@Input() currentUser = null;
	@HostListener('document:click', ['$event', '$event.target'])
	onClick(event: MouseEvent, targetElement: HTMLElement) {
		if (!targetElement) {
			return;
		}

		const clickedInside = this.elementRef.nativeElement.contains(targetElement);
		if (!clickedInside) {
			this.isOpen = false;
		}
	}


	constructor(private elementRef: ElementRef,
		private router: Router,
		private shared: SharedService,
		public authService: AuthService) {
		this.shared.svgRegistry('exit', '../../assets/images/exit.svg');
	}


	ngOnInit() {
	}

	public logOut() {
		localStorage.clear();
		this.authService.logout();
		this.router.navigate(['login']);
	}

}
