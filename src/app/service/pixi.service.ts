import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

declare var PIXI: any;

export class PixiConfig {
  value: string;
}

export class PixiStyle {
  private _fontSize: string;
  private _fontWeight: string;
  private _fontFamily: string;
  private _color: string;
  private _align: string;
  private _width: number;
  private _height: number;

  set color(value: string) {
    this._color = value;
  }

  get color() {
    return this._color || '0x000000';
  }

  set fontWeight(value: string) {
    this._fontWeight = value;
  }

  get fontWeight() {
    return this._fontWeight;
  }

  set fontSize(value: string) {
    this._fontSize = value;
  }

  get fontSize() {
    return this._fontSize;
  }

  set fontFamily(value: string) {
    this._fontFamily = value;
  }

  get fontFamily() {
    return this._fontFamily || 'brandon-grotesque';
  }

  get align() {
    return this._align || 'left';
  }

  set align(value: string) {
    this._align = value;
  }

  get height(): number {
    return this._height;
  }

  set height(value: number) {
    this._height = value;
  }

  get width(): number {
    return this._width;
  }

  set width(value: number) {
    this._width = value;
  }
}

export class PixiAnimationBase {
  private _from: number;
  private _to: number;

  constructor() {
  }

  get from(): number {
    return this._from;
  }

  set from(value: number) {
    this._from = value;
  }

  get to(): number {
    return this._to;
  }

  set to(value: number) {
    this._to = value;
  }
}

export class PixiAnimationAlpha extends PixiAnimationBase {
  constructor() {
    super();
    this.from = 1;
    this.to   = 1;
  }
}

export class PixiAnimationBlur extends PixiAnimationBase {
  constructor() {
    super();
    this.from = 0;
    this.to   = 0;
  }
}

export class PixiAnimationPositionX extends PixiAnimationBase {
  constructor() {
    super();
    this.from = 0;
    this.to   = 0;
  }
}

export class PixiAnimationPositionY extends PixiAnimationBase {
  constructor() {
    super();
    this.from = 0;
    this.to   = 0;
  }
}

export class PixiAnimationPosition {
  private _x: PixiAnimationPositionX;
  private _y: PixiAnimationPositionY;

  constructor() {
    this._x = new PixiAnimationPositionX();
    this._y = new PixiAnimationPositionY();
  }

  get y(): PixiAnimationPositionY {
    return this._y;
  }

  get x(): PixiAnimationPositionX {
    return this._x;
  }
}

export class PixiPosition {
  _x: number;
  _y: number;

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  set x(value: number) {
    this._x = value;
  }

  set y(value: number) {
    this._y = value;
  }
}

export class PixiAnchor {
  _x: number;
  _y: number;

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  set x(value: number) {
    this._x = value;
  }

  set y(value: number) {
    this._y = value;
  }
}

export class PixiAnimation {
  _alpha: PixiAnimationAlpha;
  _blur: PixiAnimationBlur;
  _position: PixiAnimationPosition;
  _duration: number;
  _delay: number;

  constructor() {
    this._alpha    = new PixiAnimationAlpha();
    this._blur     = new PixiAnimationBlur();
    this._position = new PixiAnimationPosition();
    this._delay    = 0;
  }

  get alpha() {
    return this._alpha;
  }

  get blur() {
    return this._blur;
  }

  get duration() {
    return this._duration;
  }

  set duration(value: number) {
    this._duration = value;
  }

  get delay() {
    return this._delay;
  }

  set delay(value: number) {
    this._delay = value;
  }

  get position() {
    return this._position;
  }
}

/** methods **/

export class PixiMethodBase {
  _position: PixiPosition;
  _style: PixiStyle;
  _animation: PixiAnimation;

  constructor(
    private _pixiService: PixiService
  ) {
    this._style     = new PixiStyle();
    this._animation = new PixiAnimation();
    this._position  = new PixiPosition();
  }

  get pixiService() {
    return this._pixiService;
  }

  get style() {
    return this._style;
  }

  get position() {
    return this._position;
  }

  get animation() {
    return this._animation;
  }

  fps(ticker: any) {
    return ticker.FPS;
  }

  delay(fps: number) {
    return this.animation.delay * (fps / 1000);
  }

  FPSDuration(fps: number) {
    return this.animation.duration * (fps / 1000);
  }
}

export class PixiRect extends PixiMethodBase {

  constructor(pixiService: PixiService) {
    super(pixiService);
  }

  put(stage) {
    const graphics = new PIXI.Graphics();

    graphics.beginFill(this.style.color);

    const rect = graphics.drawRect(
      this.position.x,
      this.position.y,
      this.style.width,
      this.style.height
    );

    // Add Stage
    stage.addChild(rect);
  }

  ended(stage) {
    // 終了イベントの発火
    this.pixiService.setMode(`${stage}_ended`);
  }

  run(stage, ticker: any) {
    const fps = this.fps(ticker);
    let delay = this.delay(fps);

    let renderedFPS = 0;
    ticker.add((deltaTime) => {
      const durationFPS = this.FPSDuration(fps);

      if (renderedFPS >= durationFPS) {
        ticker.stop();

        renderedFPS = 0;

        this.ended(stage);
        return;
      }


      // Delay
      if (delay > 0) {
        delay--;
        return;
      }

      renderedFPS++;
    });
  }
}

export class PixiText extends PixiMethodBase {
  _config: PixiConfig;
  _anchor: PixiAnchor;
  private _instanceText: any;
  private _instanceBlur: any;
  private _isTickerCreated: boolean;

  _value: string;

  constructor(pixiService: PixiService) {
    super(pixiService);

    this._config = {
      'value': '',
    };

    this._isTickerCreated = false;

    this._anchor = new PixiAnchor();
  }

  get pixiText() {
    return this._instanceText;
  }

  set value (value: string) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  set text (value: string) {
    this._value = value;
  }

  get anchor() {
    return this._anchor;
  }

  put(stage) {
    const style = {
      'fontSize'  : this.style.fontSize,
      'fontWeight': this.style.fontWeight,
      'fontFamily': this.style.fontFamily,
      'align'     : this.style.align,
      'fill'      : this.style.color,
    };
    const text = new PIXI.Text(this.value, style);

    text.position.x = this.position.x;
    text.position.y = this.position.y;

    text.anchor.x = this.anchor.x;
    text.anchor.y = this.anchor.y;

    text.alpha = this.animation.alpha.from;

    // Blur
    const filterBlur = new PIXI.filters.BlurFilter();
    filterBlur.blur = this.animation.blur.from;
    text.filters = [filterBlur];

    // Add Stage
    stage.addChild(text);

    // Save instance
    this._instanceText = text;
    this._instanceBlur = filterBlur;
  }

  run(stage, ticker: any) {
    const fps = this.fps(ticker);
    let delay = this.delay(ticker.FPS);

    ticker.start();

    /**
     * ticker.add()は、初回のみにするため
     * stage2では、stage1で止めたtickerをstart()するだけでよい
     */
    if (this._isTickerCreated === false) {

      // ticker addしました
      this._isTickerCreated = true;

      let renderedFPS = 0;
      ticker.add((deltaTime) => {
        const durationFPS = this.animation.duration * (fps / 1000);
        const alpha       = Math.abs(this.animation.alpha.from - this.animation.alpha.to) / durationFPS;
        const blur        = Math.abs(this.animation.blur.from - this.animation.blur.to) / durationFPS;

        // Duration
        if (renderedFPS >= durationFPS) {
          ticker.stop();

          renderedFPS = 0;

          // 終了イベントの発火
          this.pixiService.setMode(`${stage}_ended`);
          return;
        }

        // Delay
        if (delay > 0) {
          delay--;
          return;
        }

        // Animation Alpha
        if (this._instanceText.alpha <= this.animation.alpha.to) {
          this._instanceText.alpha += alpha;
        }

        if (this._instanceText.alpha > this.animation.alpha.to) {
          this._instanceText.alpha -= alpha;
        }

        // Animation Blur
        if (this._instanceBlur.blur > this.animation.blur.to) {
          this._instanceBlur.blur -= blur;
        }

        if (this._instanceBlur.blur <= this.animation.blur.to) {
          this._instanceBlur.blur += blur;
        }

        renderedFPS++;
      });
    }

  }
}

@Injectable({
  providedIn: 'root'
})
export class PixiService {
  private _mode: Subject<any>;
  public mode: Observable<any>;

  constructor() {
    this._mode = new Subject();
    this.mode = this._mode.asObservable();
  }

  setMode(value: string) {
    this._mode.next(value);
  }

  text (): PixiText {
    return new PixiText(this);
  }

  rect(): PixiRect {
    return new PixiRect(this);
  }
}
