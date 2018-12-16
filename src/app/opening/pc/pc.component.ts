import {Component, ElementRef, OnInit} from '@angular/core';
import {MainService} from '../../service/main.service';

declare var PIXI: any;

@Component({
  selector   : 'app-opening-pc',
  templateUrl: './pc.component.html',
  styleUrls  : ['./pc.component.scss']
})
export class PcComponent implements OnInit {
  public app: any;
  public texts: Array = [];

  private _el: HTMLElement;

  constructor(
    el: ElementRef,
    private mainService: MainService
  ) {
    this._el = el.nativeElement;
  }

  ngOnInit() {
    // Set Event
    this.eventOfMode();

    // Set Mode - stage0
    this.mainService.setMode('stage0');
  }

  eventOfMode () {
    this.mainService.mode.subscribe((mode: string) => {
      switch (mode) {
        case 'stage0':
          this.openingInit();
          break;
        case 'stage1':
          break;
      }
    });
  }

  openingInit() {
    // Pixi.js
    this.app = new PIXI.Application({});
    this.app.renderer.view.style.position = 'absolute';
    this.app.renderer.view.style.display  = 'block';
    this.app.renderer.autoResize          = true;
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
    this.app.renderer.backgroundColor = 0xffffff;

    /** Initial message **/
    const button      = this.addText('METRONOME', {fontSize: '80px', fontFamily: 'brandon-grotesque', fontWeight: 'BOLD'});
    button.anchor.x   = 0.5;
    button.anchor.y   = 0.5;
    button.position.x = window.innerWidth * 0.5;
    button.position.y = window.innerHeight * 0.5;

    // ボタンをステージに追加
    this.app.stage.addChild(button);

    // Add the canvas that Pixi automatically created for you to the HTML document
    this._el.querySelector('#canvas-wrapper').appendChild(this.app.view);
  }

  /**
   * Add Texts
   */
  addText(string, style) {
    const text = new PIXI.Text(string, style);
    this.texts.push(text);

    return text;
  }
}
