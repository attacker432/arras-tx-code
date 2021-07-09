
(function() {
    function Sprite(url, pos, sourceSize, destSize, speed, frames, dir, once) {
        this.pos = pos;
        this.sourceSize = sourceSize;        
        this.speed = typeof speed === 'number' ? speed : 0;
        this.frames = frames;
        this._index = 0;
        this.url = url;
        this.dir = dir || 'horizontal';
        this.once = once;

        // Added.
        // =======================
        this.alpha = 1;
        this.rotation = 0;
        this.destX = 0;
        this.destY = 0;
        this.destXOffset = 0;
        this.destYOffset = 0;
        this.destWidth = destSize[0];
        this.destHeight = destSize[1];
        // =======================
    };

    Sprite.prototype = {
        update: function(dt, destX, destY, destXOffset, destYOffset,  rotation, alpha) {
            this._index += this.speed*dt;

            // Added.
            // ========================
            this.destX = destX;
            this.destY = destY;
            this.destXOffset = destXOffset;
            this.destYOffset = destYOffset;
            this.rotation = rotation;
            this.alpha = alpha;
            // ========================
        },
        
        render: function(ctx) {
            var frame;

            if(this.speed > 0) {
                var max = this.frames.length;
                var idx = Math.floor(this._index);
                frame = this.frames[idx % max];

                if(this.once && idx >= max) {
                    this.done = true;
                    return;
                }
            }
            else {
                frame = 0;
            }


            var x = this.pos[0];
            var y = this.pos[1];

            if(this.dir == 'vertical') {
                y += frame * this.sourceSize[1];
            }
            else {
                x += frame * this.sourceSize[0];
            }
                       
            // ===========================
            // Refactored.
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.translate(this.destX, this.destY);

            // http://creativejs.com/2012/01/day-10-drawing-rotated-images-into-canvas/index.html
            ctx.rotate(this.rotation);   

            try 
            {
                ctx.drawImage(resources.get(this.url),
                      x, y,
                      this.sourceSize[0], 
                      this.sourceSize[1],
                      -(this.destWidth/2) + this.destXOffset, 
                      -(this.destHeight/2) + this.destYOffset,
                      this.destWidth, 
                      this.destHeight);           

            }
            catch(error) 
            {
              console.error(error);              
              // Note - error messages will vary depending on browser
            }         
            
            ctx.restore();  
            // ===========================
        }
    };

    window.Sprite = Sprite;
})();