import axios from 'axios';

export class AnimationBuilder {
  api_url: string;
  canvas_id: string;
  image_urls: string[];
  images: HTMLImageElement[];
  playing: boolean;
  intervalID: ReturnType<typeof setInterval> | null;
  frame: number;
  lastFrameTime: number;

  width: number;
  height: number;

  IMAGE_BASE_URL = "https://services.swpc.noaa.gov";
  FRAME_DELAY = 100;
  DWELL_TIME = 500;
  RELOAD_INTERVAL = 60001;

  constructor(url: string, canvas_id: string, width: number, height: number) {
    this.api_url = url;
    this.canvas_id = canvas_id;
    this.image_urls = [];
    this.images = [];
    this.playing = false;
    this.intervalID = null;
    this.frame = -1;
    this.lastFrameTime = 0;
    this.width = width;
    this.height = height;
  }

  populateImages = () => {
    // Get JSON data for URls of each frame image
    axios.get(this.api_url).then((res) => {
      // Check that returned data is an array with at least one image
      if (Array.isArray(res.data) && res.data.length > 0) {
        // Create an array of the URLs
        const new_image_urls = res.data.map((image: {url: string}) => this.IMAGE_BASE_URL + image.url);
        // Only proceed if data has changed since previous update
        if (JSON.stringify(new_image_urls) !== JSON.stringify(this.image_urls)) {
          console.log("Reloading image animation");
          this.image_urls = new_image_urls;
          this.pause();
          this.frame = -1;
          this.loadImages();
        }
      }
    })
  }

  loadImages = () => {
    // Clear existing images from array
    // Only load new images that have changed (shifting the same number of images out);
    this.images = [];
    for (let i = 0; i < this.image_urls.length; i++) {
      let newImage = new Image();
      newImage.src = this.image_urls[i];
      newImage.onerror = () => {
        console.error("Error loading image " + i);
      }
      this.images.push(newImage);
    }
    console.log("Number of images displaying: " + this.images.length);
    this.play();
  }

  nextFrame = () => {
    // Increment current frame and handle looping back to start
    this.frame++;
    if (this.frame === this.images.length) this.frame = 0;
    // Draw image on canvas here
    this.drawImageOnCanvas(document.getElementById(`${this.canvas_id}`) as HTMLCanvasElement, this.images[this.frame]);
  }

  drawImageOnCanvas = (canvas: (HTMLCanvasElement | null), image: HTMLImageElement) => {
    if (canvas ) {
      try {
        let context = canvas.getContext('2d');
        if (image.complete) {
          context?.drawImage(image, 0, 0, this.width, this.height);
        } else {
          console.warn("Image is not properly loaded or incomplete, skipping...");
        }
      } catch (ex) {
        console.error("Exception while drawing image: ", ex);
      }
    } else {
      console.error("Error finding canvas element for: " + this.api_url);
    }
  }

  loop = (timestamp: number) => {
    // Set the delay time to dwell time if last frame
    let delay = this.FRAME_DELAY;
    if (this.frame === this.images.length - 1) {
      delay = this.DWELL_TIME;
    }

    // Change image if delay time has been exceeded
    if (timestamp - this.lastFrameTime >= delay) {
      this.lastFrameTime = timestamp;
      this.nextFrame();
    }

    // Continue looping while playing
    if (this.playing) {
      requestAnimationFrame(this.loop);
    }
  }

  play = () => {
    // Set the state to playing
    this.playing = true;
    // Begin the animation loop
    requestAnimationFrame(this.loop);
    // Begin the interval loop to auto-update
    if (this.intervalID === null) {
      let interval = setInterval(() => {
        this.populateImages();
      }, this.RELOAD_INTERVAL)
      this.intervalID = interval;
    }
  }

  pause = () => {
    if (this.playing) {
      if (this.intervalID !== null) {
        clearInterval(this.intervalID);
        this.intervalID = null;
      }
      this.playing = false;
    }
  }

  resize = (width: number, height: number) => {
    this.width = width;
    this.height = height;
  }
}