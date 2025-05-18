import { AstroError } from "astro/errors";

interface LetterPosition {
  x: number;
  y: number;
  letter: string;
}

interface LetterInstance extends LetterPosition {
  timestamp: number;
  fadeout: number;
}

/**
 * PageBackground class
 */
class PageBackground {
  private LETTER_FADE_DURATION: [number, number] = [2, 7]; // Seconds

  private overlayCanvas: HTMLCanvasElement;

  private overlayCtx: CanvasRenderingContext2D;
  
  private width: number = document.body.clientWidth;
  private height: number = Math.max(
    document.body.scrollHeight, 
    document.body.offsetHeight, 
    document.documentElement.clientHeight,
    document.documentElement.offsetHeight 
  );
  private animationFrameId: null | number = null;

  private letterPositions: LetterPosition[] = [];
  private letterInstances: LetterInstance[] = [];

  private primaryRgb: string;

  /**
   * Initializes the background on the page.
   * @param overlayCanvas - The overlay canvas element. Used for animated letters.
   */
  constructor(overlayCanvas: HTMLCanvasElement) {
    // get context for 2D canvas

    const overlayCtx = overlayCanvas.getContext('2d');

    // If either context is null, throw an error
    if(!overlayCtx) {
      throw new AstroError('Unable to get 2D context.');
    }

    this.overlayCanvas = overlayCanvas;
    this.overlayCtx = overlayCtx;

    overlayCanvas.width = this.width;
    overlayCanvas.height = this.height;

    // Set the primary color to the first color in the theme
    this.primaryRgb = window.getComputedStyle(document.documentElement).getPropertyValue('--primary-rgb').trim();

    this.initBackground();
  
    this.animationFrameId = requestAnimationFrame(this.redrawBackground);
  }

  private configureContext = () => {
    this.overlayCtx.font = 'bold 28px Geist Mono';
    this.overlayCtx.textAlign = 'start';
    this.overlayCtx.textBaseline = 'top';
    this.overlayCtx.shadowBlur = 16;
  };

  /**
   * Sets up the background canvases. The text is decided based on the title of the page.
   */
  private initBackground = () => {
    const text: string = document.title.toLowerCase().split(' | ')[0] || 'spectre';

  
    // Letters are 17px wide and 35px tall
    const letters = Math.ceil(this.width / 17);
    const lines = Math.ceil(this.height / 35);
  
    // Loop through the lines and letters to initialise letter positions array
    for(let i = 0; i < lines; i++) {
      for(let j = 0; j < letters; j++) {
      
        this.letterPositions.push({
          x: j * 17,
          y: i * 35,
          letter: text[j % text.length]
        });
      }
    }
  
    // Randomly select 75% of the letters to animate
    const randomLetters = this.getRandomAmountFromArray<LetterPosition>(
      this.letterPositions,
      Number.parseInt((lines * 0.75).toFixed())
    );

    this.configureContext()
  
    // Draw the letters on the overlay canvas
    for(const letter of randomLetters) {
      this.overlayCtx.fillStyle = `rgba(${this.primaryRgb}, 0)`;
      this.overlayCtx.shadowColor = `rgba(${this.primaryRgb}, 0)`;
      this.overlayCtx.fillText(letter.letter, letter.x, letter.y);
  
      // Some number between LETTER_FADE_DURATION[0] and LETTER_FADE_DURATION[1] (in seconds)
      const animLength = this.LETTER_FADE_DURATION[0] + Math.random() * (this.LETTER_FADE_DURATION[1] - this.LETTER_FADE_DURATION[0]);
  
      this.letterInstances.push({
        x: letter.x,
        y: letter.y,
        letter: letter.letter,
        timestamp: Date.now(),
        fadeout: Date.now() + animLength * 1000
      });
    }
  }

  /**
   * Simple sine easing function. Used for fading in and out letters.
   * @param timestamp - The current timestamp.
   * @param start - The start timestamp of a letter.
   * @param end - The end timestamp of a letter.
   */
  private easeInOutSine = (timestamp: number, start: number, end: number) => {
    const totalDuration = end - start;
    
    // If the current timestamp is before the start, return 0
    if (timestamp < start) {
      return 0;
    }
    
    // If the current timestamp is after the end, return 0
    if (timestamp > end) {
      const elapsedAfterEnd = timestamp - end;
      const progressAfterEnd = elapsedAfterEnd / (totalDuration / 2);
      
      return Math.sin(progressAfterEnd * Math.PI);
    }
    
    const progress = (timestamp - start) / totalDuration;
    
    return Math.max(0, 0.5 - 0.5 * Math.cos(progress * Math.PI));
  }

  /**
   * Grabs n random elements from an array.
   * @param arr - The array to grab elements from.
   * @param n - The number of elements to grab.
   * @returns - An array of n elements.
   */
  private getRandomAmountFromArray = <T>(arr: Array<T>, n = 20): Array<T> => {
    let len = arr.length;

    // Initialize arrays beforehand
    const result = new Array(n);
    const taken = new Array(len);
    
    if(n > len) {
      throw new AstroError("getRandomAmountFromArray: more elements taken than available");
    }

    while(n--) {
      const x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }

    return result;
  }

  /**
   * Redraws the overlay canvas and animates the letters.
   */
  private redrawBackground = () => {
    // Clear the overlay canvas
    this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
    const now = Date.now()
    for(const letter of this.letterInstances) {
      if (letter.fadeout > now) continue;

      const alpha = this.easeInOutSine(now, letter.timestamp, letter.fadeout);

      if(alpha <= 0 && now > letter.fadeout) {
        this.letterInstances.splice(this.letterInstances.indexOf(letter), 1);
        const randomLetter = this.getRandomAmountFromArray<LetterPosition>(this.letterPositions, 1);

        this.letterInstances.push({
          x: randomLetter[0].x,
          y: randomLetter[0].y,
          letter: randomLetter[0].letter,
          timestamp: now,
          fadeout: now + (this.LETTER_FADE_DURATION[0] + Math.random() * (this.LETTER_FADE_DURATION[1] - this.LETTER_FADE_DURATION[0])) * 1000
        });
      }
      
      this.overlayCtx.fillStyle = `rgba(${this.primaryRgb}, ${alpha})`;
      this.overlayCtx.shadowColor = `rgba(${this.primaryRgb}, ${alpha})`;
      this.overlayCtx.fillText(letter.letter, letter.x, letter.y);
    }
    this.animationFrameId = requestAnimationFrame(this.redrawBackground);
  }

  /**
   * Resizes the background canvases.
   */
  public resizeBackground = () => {
    this.width = document.body.clientWidth;
    this.height = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.offsetHeight
    );


    this.overlayCanvas.width = this.width;
    this.overlayCanvas.height = this.height;
    
    this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);

    this.letterInstances = [];
    this.letterPositions = [];

    this.initBackground();
  }

  /**
   * Cleanup method to cancel animation frame when no longer needed
   */
  public destroy = () => {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}

/**
 * Loads the Geist Mono font. We have to do this asynchronously because the font is not preloaded.
 */
async function loadFont() {
  const font = new FontFace('Geist Mono', 'url(/fonts/GeistMono.woff2)');

  await font.load();
  
  document.fonts.add(font);
}

/**
 * First loads the Geist Mono font, then initializes the background.
 */
async function initializeBackground() {
  await loadFont();

  const overlayCanvas = document.getElementById('overlay-canvas') as HTMLCanvasElement;

  const background = new PageBackground(overlayCanvas);

  const observer = new ResizeObserver(() => {

    background.resizeBackground();
  });

  observer.observe(document.body);

  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    background.destroy();
    observer.disconnect();
  });
}

initializeBackground();