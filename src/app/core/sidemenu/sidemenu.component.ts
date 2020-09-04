import { Component, OnInit, Input } from '@angular/core';
import { menus } from './menu-element';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit {

  @Input() iconOnly = false;
  public menus = menus;

  constructor() { }

  /**
   * on init
   */
  ngOnInit() {
    let menuArr = {};
    const newMenu = JSON.parse(JSON.stringify(menus));
    const menuID = window.location.pathname.split('/');
    newMenu.filter((x, index) => {
      if (x.link.includes(menuID[2])) {
        menuArr = newMenu[index];
      }
    });
    this.openMenu(menuArr);
  }

  /**
   * Opens menu
   * @param evt
   */
  public openMenu(evt) {
    if (evt.hasOwnProperty('name')) {
      const newMenu = JSON.parse(JSON.stringify(menus));
      const index = newMenu.findIndex(x => x.name === evt.name);
      newMenu.filter(x => x.open = false);
      newMenu[index]['open'] = true;
      this.menus = newMenu;
    }
  }
}
