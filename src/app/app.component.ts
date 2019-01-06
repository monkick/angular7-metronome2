import { Component } from '@angular/core';
import {MainService} from './service/main.service';
import {PixiService} from './service/pixi.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [],
  providers: [
    MainService,
    PixiService
  ]
})
export class AppComponent {

  handleMediaQuery(event) {
    /**
     * 初回時に２回反応する。
     * emit側は１回しか呼ばれていない
     */
    console.log('queryMatch', event);
  }
}
