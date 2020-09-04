import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import JSMpeg from 'jsmpeg-player';

@Component({
  selector: 'app-dialog-content',
  templateUrl: './dialog-content.component.html',
  styleUrls: ['./dialog-content.component.scss']
})
export class DialogContentComponent implements OnInit {

  player:any;

  paused: boolean;

  // url = "{data.component}"

  @ViewChild('streaming') streamingcanvas: ElementRef;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    // console.log(this.data.component);
    
    this.player = new JSMpeg.Player(this.data.component, {
        canvas: this.streamingcanvas.nativeElement, autoplay: true, audio: true, loop: true
      });
  }

}
