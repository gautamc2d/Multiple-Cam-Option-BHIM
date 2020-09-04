import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { WebApiURL } from '../../shared/WebApiNames';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../shared/dataAdapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';

/**
 * Component
 */
@Component({
	selector: 'app-add-location-form',
	templateUrl: './add-location-form.component.html',
	styleUrls: ['./add-location-form.component.scss'],
	providers: [
		{
			provide: DateAdapter, useClass: AppDateAdapter
		},
		{
			provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
		}
	]
})

export class AddLocationFormComponent implements OnInit {
	public addLocationForm: FormGroup;
	public sessionData: any;
	public mode: string;
	public locID: string;
	public locationFormData: Object = {};
	public cities: any[] = [
		{ value: 'Bangalore', label: 'Bangalore' }
	];
	public states: any[] = [
		{ value: 'Karnataka', label: 'Karnataka' }
	];
	public countries: any[] = [
		{ value: 'India', label: 'India' }
	];


	constructor(private shared: SharedService,
		private acRoute: ActivatedRoute) { }

	/**
	 * on init
	 */
	ngOnInit() {
		this.sessionData = this.shared.getSessionData();
		this.initForm();
		this.acRoute.params.subscribe(data => {
			this.mode = data['mode'];
			this.locID = data['LocID'];
		});
		if (this.mode === 'Edit') {
			this.getLocationDetails();
		}
		this.shared.setTitle({ msg1: 'Add New Location' });
	}

	/**
	 * Inits form
	 */
	public initForm() {
		this.addLocationForm = new FormGroup({
			UserID: new FormControl(this.sessionData['UserID'] ? this.sessionData['UserID'] : ''),
			location_id: new FormControl(this.locID),
			location_name: new FormControl('', [Validators.required]),
			address1: new FormControl('', [Validators.required]),
			address2: new FormControl('', [Validators.required]),
			city: new FormControl(null, [Validators.required]),
			state: new FormControl(null, [Validators.required]),
			country: new FormControl('india', [Validators.required]),
			installed_on: new FormControl(null, [Validators.required]),
			totalloadcap: new FormControl('', [Validators.required]),
			location_manager: new FormControl('', [Validators.required]),
			manager_mobile: new FormControl('', [Validators.required]),
			manager_email: new FormControl('', [Validators.required, Validators.email]),
			noofbatteries: new FormControl('', [Validators.required])
		});
	}

	/**
	 * Cancels add location form component
	 */
	cancel() {
		if (this.mode === 'Edit' && this.locationFormData) {
			this.addLocationForm.patchValue(this.locationFormData);
		} else {
			this.addLocationForm.reset();
		}
	}

	/**
	 * Saves location
	 */
	saveLocation() {
		let apiUrl;
		const payload = JSON.parse(JSON.stringify(this.addLocationForm['value']));
		payload['installed_on'] = this.shared.changeDateFormat(2, payload['installed_on'], '/');
		this.mode === 'Edit' ? apiUrl = WebApiURL.dashBoard.editLocation : apiUrl = WebApiURL.dashBoard.addLocation;
		if (this.mode === 'Add') {
			delete payload['location_id'];
		}
		this.shared.send(apiUrl, payload).subscribe((res) => {
			console.log(res);
			if (res.length === 0) {
				this.shared.toasterMessage('success', 'Saved Successfully');
			} else {
				this.shared.toasterMessage('error', 'Something Wrong!');
			}
		}, (error) => {
			console.log(error);
			this.shared.toasterMessage('error', error.statusText);
		});
	}

	/**
	 * Gets location details
	 */
	private getLocationDetails() {
		const payload = {
			'LocationID': this.locID
		};
		this.shared.send(WebApiURL.dashBoard.location, payload).subscribe((res) => {
			console.log(res);
			this.locationFormData = res[0];
			if (this.locationFormData) {
				this.addLocationForm.patchValue(this.locationFormData);
				const tabTitle = `${this.mode} Location- ${this.locationFormData['location_name']}`;
				this.shared.setTitle({ msg1: tabTitle });
			} else {
				this.addLocationForm.reset();
				this.shared.toasterMessage('info', 'No Details Available');
			}
		}, (error) => {
			console.log(error);
			this.shared.toasterMessage('error', error.statusText);
		});
	}
}
