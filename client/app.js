/*global require, console*/
///*jshint -W097*/
/*jshint browser: true*/
"use strict";
//let resources = import ('resources.js')

// Fundamental requires <3
var global = {
  // Keys and other mathematical constants
  KEY_ESC: 27,
  KEY_ENTER: 13,
  KEY_CHAT: 220,
  KEY_FIREFOOD: 119,
  KEY_SPLIT: 32,
  KEY_LEFT: 65,
  KEY_UP: 87,
  KEY_RIGHT: 68,
  KEY_DOWN: 83,
  KEY_LEFT_ARROW: 37,
  KEY_UP_ARROW: 38,
  KEY_RIGHT_ARROW: 39,
  KEY_DOWN_ARROW: 40,
  KEY_AUTO_SPIN: 67,
  KEY_AUTO_FIRE: 69,
  KEY_OVER_RIDE: 82,
  KEY_UPGRADE_ATK: 49,
  KEY_UPGRADE_HTL: 50,
  KEY_UPGRADE_SPD: 51,
  KEY_UPGRADE_STR: 52,
  KEY_UPGRADE_PEN: 53,
  KEY_UPGRADE_DAM: 54,
  KEY_UPGRADE_RLD: 55,
  KEY_UPGRADE_MOB: 56,
  KEY_UPGRADE_RGN: 57,
  KEY_UPGRADE_SHI: 48,
  KEY_MOUSE_0: 32,
  KEY_MOUSE_1: 86,
  KEY_MOUSE_2: 16,
  KEY_CHOOSE_1: 89,
  KEY_CHOOSE_2: 72,
  KEY_CHOOSE_3: 85,
  KEY_CHOOSE_4: 74,
  KEY_CHOOSE_5: 73,
  KEY_CHOOSE_6: 75,
  KEY_CHOOSE_7: 79,
  KEY_CHOOSE_8: 76,
  KEY_LEVEL_UP: 78,
  KEY_FUCK_YOU: 192,
  KEY_CLASS_TREE: 84,
  showTree: false,
  scrollX: 220,
  KEY_TP: 190,
  // Canvas
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
  gameWidth: 0,
  gameHeight: 0,
  xoffset: -0,
  yoffset: -0,
  gameStart: false,
  disconnected: false,
  died: false,
  kicked: false,
  continuity: false,
  startPingTime: 0,
  toggleMassState: 0,
  backgroundColor: '#f2fbff',
  lineColor: '#7022c9',
      // ===============================
    // Chat system.
    // ===============================
    isChatMode: false,
    // ===============================
};
var util = {};
util.submitToLocalStorage = name => {
  localStorage.setItem(name + 'Value', document.getElementById(name).value);
  localStorage.setItem(name + 'Checked', document.getElementById(name).checked);
  return false;
};
util.retrieveFromLocalStorage = name => {
  document.getElementById(name).value = localStorage.getItem(name + 'Value');
  document.getElementById(name).checked = localStorage.getItem(name + 'Checked') === 'true';
  return false;
};
util.handleLargeNumber = (a, cullZeroes = false) => {
  if (cullZeroes && a == 0) {
    return '';
  }

  if (a < Math.pow(10, 3)) {
    return '' + a.toFixed(0);
  }

  if (a < Math.pow(10, 6)) {
    return (a / Math.pow(10, 3)).toFixed(2) + "k";
  }

  if (a < Math.pow(10, 9)) {
    return (a / Math.pow(10, 6)).toFixed(2) + "m";
  }

  if (a < Math.pow(10, 12)) {
    return (a / Math.pow(10, 9)).toFixed(2) + "b";
  }

  if (a < Math.pow(10, 15)) {
    return (a / Math.pow(10, 12)).toFixed(2) + "t";
  }

  return (a / Math.pow(10, 15)).toFixed(2) + "q";

};
util.timeForHumans = x => {
  // ought to be in seconds
  let seconds = x % 60;
  x /= 60;
  x = Math.floor(x);
  let minutes = x % 60;
  x /= 60;
  x = Math.floor(x);
  let hours = x % 24;
  x /= 24;
  x = Math.floor(x);
  let days = x;
  let y = '';

  function weh(z, text) {
    if (z) {
      y = y + ((y === '') ? '' : ', ') + z + ' ' + text + ((z > 1) ? 's' : '');
    }
  }
  weh(days, 'day');
  weh(hours, 'hour');
  weh(minutes, 'minute');
  weh(seconds, 'second');
  if (y === '') {
    y = 'less than a second';
  }
  return y;
};
util.addArticle = string => {
  return (/[aeiouAEIOU]/.test(string[0])) ? 'an ' + string : 'a ' + string;
};
util.formatLargeNumber = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
util.pullJSON = filename => {
  let request = new XMLHttpRequest();
  let url = "/json/" + filename + ".json";
  // Set up the request
  console.log("Loading JSON from " + url);
  request.responseType = 'json';
  // Return a promise
  return new Promise((resolve, reject) => {
    request.open('GET', url);
    request.onload = () => {
      resolve(request.response);
      console.log('JSON load complete.');
    };
    request.onerror = () => {
      reject(request.statusText);
      console.log('JSON load failed.');
      console.log(request.statusText);
    };
    request.send();
  });
};
// ======================================================================
// Chat System.
// ======================================================================
const modifyOverlyLongName = (name, fontSize, maxLength) =>{
    let nameLength = measureText(name, fontSize);

    // Need to check the length of name in pixels, otherwise,
    // Arabic names tend to mess up the display.
    // Examples:
    // ﷽﷽﷽﷽﷽﷽﷽﷽﷽
    // ﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽
    if (nameLength >= maxLength){
        return 'a spoopy 👻';
    }
    else {
        return name;
    }
}; 
// ======================================================================

// Get color
var config = {
  graphical: {
    screenshotMode: false,
    borderChunk: 6,
    barChunk: 5,
    mininumBorderChunk: 3,
    deathBlurAmount: 3,
    darkBorders: false,
    fancyAnimations: true,
    colors: 'normal',
    pointy: true,
    fontSizeBoost: 1,
    neon: false,
  },
  gui: {
    expectedMaxSkillLevel: 9,
  },
  lag: {
    unresponsive: false,
    memory: 60,
  },
};
var color = {};
util.pullJSON('color').then(data => color = data);

// Color functions
let mixColors = (() => {
  /** https://gist.github.com/jedfoster/7939513 **/
  function d2h(d) {
    return d.toString(16);
  } // convert a decimal value to hex
  function h2d(h) {
    return parseInt(h, 16);
  } // convert a hex value to decimal
  return (color_2, color_1, weight = 0.5) => {
    if (weight === 1) return color_1;
    if (weight === 0) return color_2;
    var col = "#";
    for (var i = 1; i <= 6; i += 2) { // loop through each of the 3 hex pairs—red, green, and blue, skip the '#'
      var v1 = h2d(color_1.substr(i, 2)), // extract the current pairs
        v2 = h2d(color_2.substr(i, 2)),
        // combine the current pairs from each source color, according to the specified weight
        val = d2h(Math.floor(v2 + (v1 - v2) * weight));

      while (val.length < 2) {
        val = '0' + val;
      } // prepend a '0' if val results in a single digit
      col += val; // concatenate val to our new color string
    }
    return col; // PROFIT!
  };
})();

function getColor(colorNumber) {
  switch (colorNumber) {
    case 0:
      return color.teal;
    case 1:
      return color.lgreen;
    case 2:
      return color.orange;
    case 3:
      return color.yellow;
    case 4:
      return color.lavender;
    case 5:
      return color.pink;
    case 6:
      return color.vlgrey;
    case 7:
      return color.lgrey;
    case 8:
      return color.guiwhite;
    case 9:
      return color.black;
    case 10:
      return color.blue;
    case 11:
      return color.green;
    case 12:
      return color.red;
    case 13:
      return color.gold;
    case 14:
      return color.purple;
    case 15:
      return color.magenta;
    case 16:
      return color.grey;
    case 17:
      return color.dgrey;
    case 18:
      return color.white;
    case 19:
      return color.guiblack;
    case 20:
      return "#c3ff00"; //to use hex colors in the chat system.
    default:
      return '#FF0000';
  }
}

function getColorDark(givenColor) {
  let dark = (config.graphical.neon) ? color.white : color.black;
  if (config.graphical.darkBorders) return dark;
  return mixColors(givenColor, dark, color.border);
}

function getZoneColor(cell, real) {
  switch (cell) {
    case 'bas1':
      return color.blue;
    case 'bas2':
      return color.green;
    case 'bas3':
      return color.red;
    case 'bas4':
      return color.pink;
    case 'nest':
      return (real) ? color.purple : color.lavender;
    default:
      return (real) ? color.white : color.lgrey;
  }
}

function setColor(context, givenColor) {
  if (config.graphical.neon) {
    context.fillStyle = getColorDark(givenColor);
    context.strokeStyle = givenColor;
  } else {
    context.fillStyle = givenColor;
    context.strokeStyle = getColorDark(givenColor);
  }
}

// Get mockups <3
var mockups = [];
util.pullJSON('mockups').then(data => mockups = data);
// Mockup functions
function getEntityImageFromMockup(index, color = mockups[index].color) {
  try {
    let mockup = mockups[index];
    return {
      time: 0,
      index: index,
      x: mockup.x,
      y: mockup.y,
      vx: 0,
      vy: 0,
      size: mockup.size,
      realSize: mockup.realSize,
      color: color,
      render: {
        status: {
          getFade: () => {
            return 1;
          },
          getColor: () => {
            return '#FFFFFF';
          },
          getBlend: () => {
            return 0;
          },
          health: {
            get: () => {
              return 1;
            },
          },
          shield: {
            get: () => {
              return 1;
            },
          },
        },
      },
      facing: mockup.facing,
      shape: mockup.shape,
      name: mockup.name,
      score: 0,
      tiggle: 0,
      layer: mockup.layer,
      guns: {
        length: mockup.guns.length,
        getPositions: () => {
          let a = [];
          mockup.guns.forEach(() => a.push(0));
          return a;
        },
        update: () => {},
      },
      turrets: mockup.turrets.map((t) => {
        let o = getEntityImageFromMockup(t.index);
        o.realSize = o.realSize / o.size * mockup.size * t.sizeFactor;
        o.size = mockup.size * t.sizeFactor;
        o.angle = t.angle;
        o.offset = t.offset;
        o.direction = t.direction;
        o.facing = t.direction + t.angle;
        return o;
      }),
    };
  } catch (e) {
    global.mockupError = true;
  }
}

// Define clickable regions
global.clickables = (() => {
  let Region = (() => {
    // Protected classes
    function Clickable() {
      let region = {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
      };
      let active = false;
      return {
        set: (x, y, w, h) => {
          region.x = x;
          region.y = y;
          region.w = w;
          region.h = h;
          active = true;
        },
        check: target => {
          let dx = Math.round(target.x - region.x);
          let dy = Math.round(target.y - region.y);
          return active && dx >= 0 && dy >= 0 && dx <= region.w && dy <= region.h;
        },
        hide: () => {
          active = false;
        },
      };
    }
    // Return the constructor
    return (size) => {
      // Define the region
      let data = [];
      for (let i = 0; i < size; i++) {
        data.push(Clickable());
      }
      // Return the region methods
      return {
        place: (index, ...a) => {
          if (index >= data.length) {
            console.log(index);
            console.log(data);
            throw new Error('Trying to reference a clickable outside a region!');
          }
          data[index].set(...a);
        },
        hide: () => {
          data.forEach(r => r.hide());
        },
        check: x => {
          return data.findIndex(r => {
            return r.check(x);
          });
        }
      };
    };
  })();
  return {
    stat: Region(10),
    upgrade: Region(16),
    hover: Region(1),
    skipUpgrades: Region(1),
  };
})();
global.statHover = false;
global.upgradeHover = false;

// Prepare stuff
var player = { //Set up the player
  id: -1,
  x: global.screenWidth / 2,
  y: global.screenHeight / 2,
  vx: 0,
  vy: 0,
  renderx: global.screenWidth / 2,
  rendery: global.screenHeight / 2,
  renderv: 1,
  slip: 0,
  view: 1,
  time: 0,
  screenWidth: global.screenWidth,
  screenHeight: global.screenHeight,
  target: {
    x: global.screenWidth / 2,
    y: global.screenHeight / 2
  },
  nameColor: "#ffffff"
};
var entities = [],
  users = [],
  minimap = [],
  upgradeSpin = 0,
  messages = [],
    // ============================================================
    // Chat System.
    // ============================================================
    chatMessages = [],
    // ============================================================
  messageFade = 0,
  newMessage = 0,
  metrics = {
    latency: 0,
    lag: 0,
    rendertime: 0,
    updatetime: 0,
    lastlag: 0,
    lastrender: 0,
    rendergap: 0,
    lastuplink: 0,
  },
  lastPing = 0,
  renderTimes = 0,
  updateTimes = 0,
  target = {
    x: player.x,
    y: player.y
  },
  roomSetup = [
    ['norm']
  ],
  roomSpeed = 0;
var gui = {
  getStatNames: num => {
    switch (num) {
      case 1:
        return [
          'Body Damage',
          'Max Health',
          'Bullet Speed',
          'Bullet Health',
          'Bullet Penetration',
          'Bullet Damage',
          'Engine Acceleration',
          'Movement Speed',
          'Shield Regeneration',
          'Shield Capacity'
        ];
      case 2:
        return [
          'Body Damage',
          'Max Health',
          'Drone Speed',
          'Drone Health',
          'Drone Penetration',
          'Drone Damage',
          'Respawn Rate',
          'Movement Speed',
          'Shield Regeneration',
          'Shield Capacity'
        ];
      case 3:
        return [
          'Body Damage',
          'Max Health',
          'Drone Speed',
          'Drone Health',
          'Drone Penetration',
          'Drone Damage',
          'Max Drone Count',
          'Movement Speed',
          'Shield Regeneration',
          'Shield Capacity'
        ];
      case 4:
        return [
          'Body Damage',
          'Max Health',
          'Swarm Speed',
          'Swarm Health',
          'Swarm Penetration',
          'Swarm Damage',
          'Reload',
          'Movement Speed',
          'Shield Regeneration',
          'Shield Capacity'
        ];
      case 5:
        return [
          'Body Damage',
          'Max Health',
          'Placement Speed',
          'Trap Health',
          'Trap Penetration',
          'Trap Damage',
          'Reload',
          'Movement Speed',
          'Shield Regeneration',
          'Shield Capacity'
        ];
      case 6:
        return [
          'Body Damage',
          'Max Health',
          'Weapon Speed',
          'Weapon Health',
          'Weapon Penetration',
          'Weapon Damage',
          'Reload',
          'Movement Speed',
          'Shield Regeneration',
          'Shield Capacity'
        ];
      default:
        return [
          'Body Damage',
          'Max Health',
          'Bullet Speed',
          'Bullet Health',
          'Bullet Penetration',
          'Bullet Damage',
          'Reload',
          'Movement Speed',
          'Shield Regeneration',
          'Shield Capacity'
        ];
    }
  },
  skills: [{
    amount: 0,
    color: 'purple',
    cap: 1,
    softcap: 1,
  }, {
    amount: 0,
    color: 'pink',
    cap: 1,
    softcap: 1,
  }, {
    amount: 0,
    color: 'blue',
    cap: 1,
    softcap: 1,
  }, {
    amount: 0,
    color: 'lgreen',
    cap: 1,
    softcap: 1,
  }, {
    amount: 0,
    color: 'red',
    cap: 1,
    softcap: 1,
  }, {
    amount: 0,
    color: 'yellow',
    cap: 1,
    softcap: 1,
  }, {
    amount: 0,
    color: 'green',
    cap: 1,
    softcap: 1,
  }, {
    amount: 0,
    color: 'teal',
    cap: 1,
    softcap: 1,
  }, {
    amount: 0,
    color: 'gold',
    cap: 1,
    softcap: 1,
  }, {
    amount: 0,
    color: 'orange',
    cap: 1,
    softcap: 1,
  }],
  points: 0,
  upgrades: [],
  playerid: -1,
  __s: (() => {
    let truscore = 0;
    let levelscore = 0;
    let deduction = 0;
    let level = 0;
    let score = Smoothbar(0, 10);
    return {
      setScore: s => {
        if (s) {
          score.set(s);
          if (deduction > score.get()) {
            level = 0;
            deduction = 0;
          }
        } else {
          score = Smoothbar(0, 10);
          level = 0;
        }
      },
      update: () => {
        levelscore = Math.ceil(1.8 * Math.pow(level + 1, 1.8) - 2 * level + 1);
        if (score.get() - deduction >= levelscore) {
          deduction += levelscore;
          level += 1;
        }
      },
      getProgress: () => {
        return (levelscore) ? Math.min(1, Math.max(0, (score.get() - deduction) / levelscore)) : 0;
      },
      getScore: () => score.get(),
      getLevel: () => {
        return level;
      },
    };
  })(),
  type: 0,
  fps: 0,
  color: 0,
  accel: 0,
  topspeed: 1,
};
global.clearUpgrades = () => {
  gui.upgrades = [];
};
// Build the leaderboard object
var leaderboard = (() => {
  let entries = {};
  // Define a handler for a particular entry
  function Entry(name = '', bar = 0, color = 0) {
    // The data
    let index = 0,
      truscore = 0,
      score = Smoothbar(0, 10),
      nameColor = "#ffffff";
    // These are the io functions
    return {
      update: (i, s, nc) => {
        index = i;
        nameColor = nc;
        score.set(s);
      },
      publish: () => {
        // Return the data package
        let ref = mockups[index];
        return {
          image: getEntityImageFromMockup(index, color),
          position: ref.position,
          barcolor: getColor(bar),
          label: (name === '') ? ref.name : name + ' - ' + ref.name,
          score: score.get(),
          nameColor: nameColor
        };
      },
    };
  }
  // Return the leaderboard methods
  return {
    get: () => {
      let out = [],
        maxscore = 1;
      for (let e in entries) {
        if (!entries.hasOwnProperty(e)) continue;
        let data = entries[e].publish();
        out.push(data);
        if (data.score > maxscore) {
          maxscore = data.score;
        }
      }
      out.sort((a, b) => {
        return b.score - a.score;
      });
      return {
        data: out,
        max: maxscore,
      };
    },
    remove: (index) => {
      if (entries['_' + index] === undefined) {
        console.log('Warning: Asked to removed an unknown leaderboard entry.');
        return -1;
      }
      delete entries['_' + index];
    },
    add: (data) => {
      let newentry = Entry(data.name, data.barcolor, data.color);
      newentry.update(data.index, data.score, data.nameColor);
      entries['_' + data.id] = newentry;
    },
    update: (data) => {
      if (entries['_' + data.id] === undefined) {
        console.log('Warning: Asked to update an unknown leaderboard entry.');
        return -1;
      }
      entries['_' + data.id].update(data.index, data.score, data.nameColor);
    },
    purge: () => {
      entries = {};
    },
  };
})();
// The ratio finder
var getRatio = () => {
  return Math.max(global.screenWidth / player.renderv, global.screenHeight / player.renderv / 9 * 16);
};

global.target = target;
global.player = player;
// ============================================================
// Chat system.
// ============================================================
global.playersList = [];
global.playersListIndex = 0;
global.selectedPlayerId = 0;
// ============================================================
global.canUpgrade = false;
global.canSkill = false;
global.message = '';
global.time = 0;

// Window setup <3
global.mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
var serverName = 'Connected';
var provider = "Unknown";
window.onload = () => {
  // Server name stuff
  switch (true) {
    case window.location.hostname.includes("glitch"):
      provider = "Glitch";
      break;
    case window.location.hostname.includes("herokuapp"):
      provider = "Heroku";
      break;
    case window.location.hostname.includes("localhost"):
      provider = "Localhost";
      break;
  }
  document.getElementById('serverName').innerHTML = '<h4 class="nopadding">' + serverName + " - " + provider + '</h4>';
  // Save forms
  util.retrieveFromLocalStorage('playerNameInput');
  util.retrieveFromLocalStorage('playerKeyInput');
  util.retrieveFromLocalStorage('optScreenshotMode');
  util.retrieveFromLocalStorage('optPredictive');
  util.retrieveFromLocalStorage('optFancy');
  util.retrieveFromLocalStorage('optColors');
  util.retrieveFromLocalStorage('optNoPointy');
  util.retrieveFromLocalStorage('optBorders');
  // Set default theme
  if (document.getElementById('optColors').value === '') {
    document.getElementById('optColors').value = 'normal';
  }
  if (document.getElementById('optBorders').value === '') {
    document.getElementById('optBorders').value = 'normal';
  }
  // Game start stuff
  document.getElementById('startButton').onclick = () => startGame();
  document.onkeydown = e => {
    var key = e.which || e.keyCode;
    if (key === global.KEY_ENTER && (global.dead || !global.gameStart)) {
      startGame();
    }
  };
  // Resizing stuff
  window.addEventListener('resize', () => {
    player.screenWidth = c.width = global.screenWidth = window.innerWidth;
    player.screenHeight = c.height = global.screenHeight = window.innerHeight;
  });
};

// Prepare canvas stuff
class Canvas {
  constructor(params) {
    this.directionLock = false;
    this.target = global.target;
    this.reenviar = true;
    this.socket = global.socket;
    this.directions = [];
    var self = this;

    this.cv = document.getElementById('gameCanvas');
    this.cv.width = global.screenWidth;
    this.cv.height = global.screenHeight;
    this.cv.addEventListener('mousemove', this.gameInput, false);
    this.cv.addEventListener('keydown', this.keyboardDown, false);
    this.cv.addEventListener('keyup', this.keyboardUp, false);
    this.cv.addEventListener("mousedown", this.mouseDown, false);
    this.cv.addEventListener("mouseup", this.mouseUp, false);
    this.cv.parent = self;
    global.canvas = this;
  }

  keyboardDown(event) {
    switch (event.keyCode) {
      case 13:
        if (global.died) this.parent.socket.talk('s', global.playerName, 0);
        global.died = false;
        break; // Enter to respawn
         // ======================================================================
        // Chat system.
        // ======================================================================
        // H
        case 72:
            if (!global.died) {
                if (global.isChatMode === false) {
                    // Chat input textbox.
                    let chatInput = document.createElement('input');
                    chatInput.id = 'chatInput';
                    chatInput.tabindex = 4;
                    chatInput.style.font = 'bold 18px Ubuntu';
                    chatInput.maxlength = '200';
                    chatInput.placeholder = 'Enter to send.Esc to cancel.Введите,чтобы отправить.Esc,чтобы отменить.';

                    // =============================================
                    // Players list drop down list.
                    // =============================================
                    let playersDropDownList = document.createElement("select");
                    playersDropDownList.id = "playersList";
                    playersDropDownList.className = 'players-list';

                    // Add default option.
                    let allOption = document.createElement("option");
                    allOption.value = '0';
                    allOption.text = '-- All --';
                    playersDropDownList.appendChild(allOption);

                    try {
                        const players = global.playersList;

                        //Create and append the options
                        for (var i = 0; i < players.length; i+=2) {
                            var option = document.createElement("option");
                            option.value = players[i];
                            option.text = players[i+1];
                            playersDropDownList.appendChild(option);
                        }

                        // Try to set the value to previously selected player id.
                        playersDropDownList.value = global.selectedPlayerId;

                        // Player does not exist anymore?
                        if (playersDropDownList.value != global.selectedPlayerId){
                            // Change to default index.
                            playersDropDownList.selectedIndex = 0;
                        }
                    }
                    catch (error){
                        console.log(error);
                    }

                    // =============================================
                    // Chat input wrapper div.
                    let chatInputWrapper = document.createElement('div');
                    chatInputWrapper.style.position = 'absolute';
                    chatInputWrapper.style.width = '720px';

                    chatInputWrapper.style.left = '50%';
                    chatInputWrapper.style.bottom = '100px';
                    chatInputWrapper.style.transform = 'translate(-50%, -50%)';
                    chatInputWrapper.style.margin = '0 auto';
                    chatInputWrapper.style.visibility = 'hidden';

                    chatInputWrapper.appendChild(playersDropDownList);
                    chatInputWrapper.appendChild(chatInput);
                    document.body.appendChild(chatInputWrapper);

                    // Sending chat.
                    chatInput.addEventListener('keydown', function(event) {
                        if (event.key === 'Enter' || event.keyCode === 13) {
                            // ========================================================================
                            // Check again if the player died, otherwise, it hangs the client.
                            // There will be an error saying that "color is undefined" in app.js file.
                            // ========================================================================
                            // Death chat experiment.
                            if (global.died) {
                                global.socket.talk('s', global.playerName, 0);
                                global.died = false;
                            }
                            else {
                                let chatMessage = chatInput.value;

                                if (chatMessage) {
                                    let maxLen = 100;
                                    let trimmedMessage = chatMessage.length > maxLen ? chatMessage.substring(0, maxLen - 3) + "..." : chatMessage.substring(0, maxLen);

                                    const ddl = playersDropDownList;
                                    if (ddl){
                                        global.playersListIndex = ddl.selectedIndex;
                                        global.selectedPlayerId = ddl.options[ddl.selectedIndex].value;
                                    }

                                    global.socket.talk('h', trimmedMessage, global.selectedPlayerId);

                                    chatInputWrapper.removeChild(playersDropDownList);
                                    chatInputWrapper.removeChild(chatInput);
                                    document.body.removeChild(chatInputWrapper);

                                    let gameCanvas = document.getElementById('gameCanvas');
                                    gameCanvas.focus();

                                    global.isChatMode = false;
                                }
                            }
                        }
                    });

                    // Cancelling chat - pressing ESC in players dropdown list.
                    playersDropDownList.addEventListener('keydown', function(event) {
                        if (event.key === 'Esc' || event.keyCode === 27) {
                            chatInputWrapper.removeChild(playersDropDownList);
                            chatInputWrapper.removeChild(chatInput);
                            document.body.removeChild(chatInputWrapper);

                            const gameCanvas = document.getElementById('gameCanvas');
                            gameCanvas.focus();
                            global.isChatMode = false;
                        }
                    });

                    // Cancelling chat.
                    chatInput.addEventListener('keydown', function(event) {
                        if (event.key === 'Esc' || event.keyCode === 27) {
                            chatInputWrapper.removeChild(playersDropDownList);
                            chatInputWrapper.removeChild(chatInput);
                            document.body.removeChild(chatInputWrapper);

                            const gameCanvas = document.getElementById('gameCanvas');
                            gameCanvas.focus();
                            global.isChatMode = false;
                        }
                    });

                    global.isChatMode = true;

                    // To remove initial "i" letter.
                    setTimeout(() => {
                        chatInput.value = '';
                        chatInputWrapper.style.visibility = 'visible';
                        chatInput.focus();
                    }, 10);
                }
                else {   // Already in chat mode, focus the chat input textbox.
                    let existingChatInput = document.getElementById('chatInput');
                    if (existingChatInput) {
                        // Remove 'h' from the input.
                        let oldValue = existingChatInput.value;
                        existingChatInput.value = '';
                        existingChatInput.focus();
                        existingChatInput.value = oldValue;
                    }
                }
            }
            break;
        // ===========================================
      case global.KEY_UP_ARROW:
        if (!global.died && global.showTree) return global.scrollX = 0;
      case global.KEY_UP:
        this.parent.socket.cmd.set(0, true);
        break;
      case global.KEY_DOWN_ARROW:
        if (!global.died && global.showTree) return global.scrollX = 1;
      case global.KEY_DOWN:
        this.parent.socket.cmd.set(1, true);
        break;
      case global.KEY_LEFT_ARROW:
        if (!global.died && global.showTree) return global.scrollX -= global.scrollX <= 0 ? 0 : .0045;
      case global.KEY_LEFT:
        this.parent.socket.cmd.set(2, true);
        break;
      case global.KEY_RIGHT_ARROW:
        if (!global.died && global.showTree) return global.scrollX += global.scrollX >= 1 ? 0 : .0045;
      case global.KEY_RIGHT:
        this.parent.socket.cmd.set(3, true);
        break;
      case global.KEY_MOUSE_0:
        this.parent.socket.cmd.set(4, true);
        break;
      case global.KEY_MOUSE_1:
        this.parent.socket.cmd.set(5, true);
        break;
      case global.KEY_MOUSE_2:
        this.parent.socket.cmd.set(6, true);
        break;
      case global.KEY_LEVEL_UP:
        this.parent.socket.talk('L');
        break;
      case global.KEY_FUCK_YOU:
        this.parent.socket.talk('0');
        break;
      case global.KEY_TP:
        this.parent.socket.talk('K');
        break;
    }
    if (!event.repeat) {
      switch (event.keyCode) {
        case global.KEY_AUTO_SPIN:
          this.parent.socket.talk('t', 0);
          break;
        case global.KEY_AUTO_FIRE:
          this.parent.socket.talk('t', 1);
          break;
        case global.KEY_OVER_RIDE:
          this.parent.socket.talk('t', 2);
          break;
        case global.KEY_CLASS_TREE:
          global.showTree = !global.showTree;
          break;
      }
      if (global.canSkill) {
        switch (event.keyCode) {
          case global.KEY_UPGRADE_ATK:
            this.parent.socket.talk('x', 0);
            break;
          case global.KEY_UPGRADE_HTL:
            this.parent.socket.talk('x', 1);
            break;
          case global.KEY_UPGRADE_SPD:
            this.parent.socket.talk('x', 2);
            break;
          case global.KEY_UPGRADE_STR:
            this.parent.socket.talk('x', 3);
            break;
          case global.KEY_UPGRADE_PEN:
            this.parent.socket.talk('x', 4);
            break;
          case global.KEY_UPGRADE_DAM:
            this.parent.socket.talk('x', 5);
            break;
          case global.KEY_UPGRADE_RLD:
            this.parent.socket.talk('x', 6);
            break;
          case global.KEY_UPGRADE_MOB:
            this.parent.socket.talk('x', 7);
            break;
          case global.KEY_UPGRADE_RGN:
            this.parent.socket.talk('x', 8);
            break;
          case global.KEY_UPGRADE_SHI:
            this.parent.socket.talk('x', 9);
            break;
        }
      }
      if (global.canUpgrade) {
        switch (event.keyCode) {
          case global.KEY_CHOOSE_1:
            this.parent.socket.talk('U', 0);
            break;
          case global.KEY_CHOOSE_2:
            this.parent.socket.talk('U', 1);
            break;
          case global.KEY_CHOOSE_3:
            this.parent.socket.talk('U', 2);
            break;
          case global.KEY_CHOOSE_4:
            this.parent.socket.talk('U', 3);
            break;
          case global.KEY_CHOOSE_5:
            this.parent.socket.talk('U', 4);
            break;
          case global.KEY_CHOOSE_6:
            this.parent.socket.talk('U', 5);
            break;
          case global.KEY_CHOOSE_7:
            this.parent.socket.talk('U', 6);
            break;
          case global.KEY_CHOOSE_8:
            this.parent.socket.talk('U', 7);
            break;
        }
      }
    }
  }
  keyboardUp(event) {
    switch (event.keyCode) {
      case global.KEY_UP_ARROW:
      case global.KEY_UP:
        this.parent.socket.cmd.set(0, false);
        break;
      case global.KEY_DOWN_ARROW:
      case global.KEY_DOWN:
        this.parent.socket.cmd.set(1, false);
        break;
      case global.KEY_LEFT_ARROW:
      case global.KEY_LEFT:
        this.parent.socket.cmd.set(2, false);
        break;
      case global.KEY_RIGHT_ARROW:
      case global.KEY_RIGHT:
        this.parent.socket.cmd.set(3, false);
        break;
      case global.KEY_MOUSE_0:
        this.parent.socket.cmd.set(4, false);
        break;
      case global.KEY_MOUSE_1:
        this.parent.socket.cmd.set(5, false);
        break;
      case global.KEY_MOUSE_2:
        this.parent.socket.cmd.set(6, false);
        break;
    }
  }
  mouseDown(mouse) {
    switch (mouse.button) {
      case 0:
        let mpos = {
          x: mouse.clientX,
          y: mouse.clientY,
        };
        let statIndex = global.clickables.stat.check(mpos);
        if (statIndex !== -1) this.parent.socket.talk('x', statIndex);
        else if (global.clickables.skipUpgrades.check(mpos) !== -1) global.clearUpgrades();
        else {
          let upgradeIndex = global.clickables.upgrade.check(mpos);
          if (upgradeIndex !== -1) this.parent.socket.talk('U', upgradeIndex);
          else this.parent.socket.cmd.set(4, true);
        }
        break;
      case 1:
        this.parent.socket.cmd.set(5, true);
        break;
      case 2:
        this.parent.socket.cmd.set(6, true);
        break;
    }
  }
  mouseUp(mouse) {
    switch (mouse.button) {
      case 0:
        this.parent.socket.cmd.set(4, false);
        break;
      case 1:
        this.parent.socket.cmd.set(5, false);
        break;
      case 2:
        this.parent.socket.cmd.set(6, false);
        break;
    }
  }
  // Mouse location (we send target information in the heartbeat)
  gameInput(mouse) {
    this.parent.target.x = mouse.clientX - this.width / 2;
    this.parent.target.y = mouse.clientY - this.height / 2;
    global.target = this.parent.target;
    global.statHover = global.clickables.hover.check({
      x: mouse.clientX,
      y: mouse.clientY,
    }) === 0;
  }

}
window.canvas = new Canvas();
var c = window.canvas.cv;
var ctx = c.getContext('2d');
var c2 = document.createElement('canvas');
var ctx2 = c2.getContext('2d');
ctx2.imageSmoothingEnabled = false;

// Animation things
function isInView(x, y, r, mid = false) {
  let ratio = getRatio();
  r += config.graphical.borderChunk;
  if (mid) {
    ratio *= 2;
    return x > -global.screenWidth / ratio - r &&
      x < global.screenWidth / ratio + r &&
      y > -global.screenHeight / ratio - r &&
      y < global.screenHeight / ratio + r;
  }
  return x > -r && x < global.screenWidth / ratio + r && y > -r && y < global.screenHeight / ratio + r;
}

function Smoothbar(value, speed, sharpness = 3) {
  let time = Date.now();
  let display = value;
  let oldvalue = value;
  return {
    set: val => {
      if (value !== val) {
        oldvalue = display;
        value = val;
        time = Date.now();
      }
    },
    get: () => {
      let timediff = (Date.now() - time) / 1000;
      display = (timediff < speed) ? oldvalue + (value - oldvalue) * Math.pow(timediff / speed, 1 / sharpness) : value;
      return display;
    },
  };
}

// Some stuff we need before we can set up the socket
var sync = [];
var clockDiff = 0;
var serverStart = 0;
var lag = (() => {
  let lags = [];
  return {
    get: () => {
      if (!lags.length) return 0;
      var sum = lags.reduce(function(a, b) {
        return a + b;
      });
      return sum / lags.length;
    },
    add: l => {
      lags.push(l);
      if (lags.length > config.lag.memory) {
        lags.splice(0, 1);
      }
    }
  };
})();
var getNow = () => {
  return Date.now() - clockDiff - serverStart;
};
var player = {
  vx: 0,
  vy: 0,
  lastvx: 0,
  lastvy: 0,
  renderx: player.x,
  rendery: player.y,
  lastx: player.x,
  lasty: player.y,
  target: window.canvas.target,
  name: '',
  lastUpdate: 0,
  time: 0,
  nameColor: "#ffffff"
};

// Jumping the gun on motion
var moveCompensation = (() => {
  let xx = 0,
    yy = 0,
    vx = 0,
    vy = 0;
  return {
    reset: () => {
      xx = 0;
      yy = 0;
    },
    get: () => {
      if (config.lag.unresponsive) {
        return {
          x: 0,
          y: 0,
        };
      }
      return {
        x: xx,
        y: yy,
      };
    },
    iterate: (g) => {
      if (global.died || global.gameStart) return 0;
      // Add motion
      let damp = gui.accel / gui.topSpeed,
        len = Math.sqrt(g.x * g.x + g.y * g.y);
      vx += gui.accel * g.x / len;
      vy += gui.accel * g.y / len;
      // Dampen motion
      let motion = Math.sqrt(vx * vx + vy * vy);
      if (motion > 0 && damp) {
        let finalvelocity = motion / (damp / roomSpeed + 1);
        vx = finalvelocity * vx / motion;
        vy = finalvelocity * vy / motion;
      }
      xx += vx;
      yy += vy;
    },
  };
})();

// Prepare the websocket for definition
const socketInit = (() => {
  // Inital setup stuff
  window.WebSocket = window.WebSocket || window.MozWebSocket;
  const protocol = {};

  function checkEndian() {
    var arrayBuffer = new ArrayBuffer(2);
    var uint8Array = new Uint8Array(arrayBuffer);
    var uint16array = new Uint16Array(arrayBuffer);
    uint8Array[0] = 0xAA; // set first byte
    uint8Array[1] = 0xBB; // set second byte
    if (uint16array[0] === 0xBBAA) return 0;
    if (uint16array[0] === 0xAABB) return 1;
    else throw new Error("Something crazy just happened");
  }

  /*var isBigEndian = new Uint8Array(new Uint32Array([0x12345678]).buffer)[0] === 0x12;
  var isLittleEndian = new Uint8Array(new Uint32Array([0x12345678]).buffer)[0] === 0x78;*/

  protocol.encode = (() => {
    // unsigned 8-bit integer
    var arrUint8 = new Uint8Array(1);
    // unsigned 16-bit integer
    var arrUint16 = new Uint16Array(1);
    var charUint16 = new Uint8Array(arrUint16.buffer);
    // unsigned 32-bit integer
    var arrUint32 = new Uint32Array(1);
    var charUint32 = new Uint8Array(arrUint32.buffer);
    // 32-bit float
    var arrFloat32 = new Float32Array(1);
    var charFloat32 = new Uint8Array(arrFloat32.buffer);
    // build some useful internal functions
    var typeEncoder = (type, number) => {
      let output = '';
      switch (type) {
        case 'RawUint8':
          arrUint8[0] = number;
          return String.fromCharCode(arrUint8[0]);
        case 'RawUint16':
          arrUint16[0] = number;
          return String.fromCharCode(charUint16[0], charUint16[1]);
        case 'Uint8':
          arrUint8[0] = number;
          return '0' + String.fromCharCode(arrUint8[0]);
        case 'Uint16':
          arrUint16[0] = number;
          return '1' + String.fromCharCode(charUint16[0], charUint16[1]);
        case 'Uint32':
          arrUint32[0] = number;
          return '2' + String.fromCharCode(charUint32[0], charUint32[1], charUint32[2], charUint32[3]);
        case 'Sint8':
          arrUint8[0] = -1 - number;
          return '3' + String.fromCharCode(arrUint8[0]);
        case 'Sint16':
          arrUint16[0] = -1 - number;
          return '4' + String.fromCharCode(charUint16[0], charUint16[1]);
        case 'Sint32':
          arrUint32[0] = -1 - number;
          return '5' + String.fromCharCode(charUint32[0], charUint32[1], charUint32[2], charUint32[3]);
        case 'Float32':
          arrFloat32[0] = number;
          return '6' + String.fromCharCode(charFloat32[0], charFloat32[1], charFloat32[2], charFloat32[3]);
        case 'String8':
          return '7' + typeEncoder('RawUint16', number.length) + number;
        case 'String16':
          for (let i = 0, strLen = number.length; i < strLen; i++) {
            output += typeEncoder('RawUint16', number.charCodeAt(i));
          }
          return '8' + typeEncoder('RawUint16', output.length) + output;
        default:
          throw new Error('Unknown encoding type.');
      }
    };
    var findType = (value) => {
      if (typeof value === 'string') {
        for (var i = 0; i < value.length; i++) {
          if (value.charCodeAt(i) > 255) return 'String16';
        }
        return 'String8';
      }
      if (typeof value === 'boolean') return 'Uint8';
      if (typeof value !== 'number') {
        throw new Error('Unencodable data type');
      }
      if (value != Math.round(value)) return 'Float32';
      if (value < 0) {
        if (value >= -256) return 'Sint8';
        if (value >= -65535) return 'Sint16';
        if (value >= -4294967295) return 'Sint32';
      } else {
        if (value < 256) return 'Uint8';
        if (value < 65535) return 'Uint16';
        if (value < 4294967295) return 'Uint32';
      }
      return 'Float32';
    };
    // build the function
    return (arr, verbose = false) => {
      let output = arr.splice(0, 1)[0];
      if (typeof output !== 'string') throw new Error('No identification code!');
      arr.forEach((value) => {
        output += typeEncoder(findType(value), value);
      });
      let len = output.length;
      let buffer = new ArrayBuffer(len);
      let integerView = new Uint8Array(buffer);
      for (let i = 0; i < len; i++) {
        integerView[i] = output.charCodeAt(i);
      }
      if (verbose) {
        console.log('OUTPUT: ' + integerView);
        console.log('RAW OUTPUT: ' + output);
        console.log('SIZE: ' + len);
      }
      return buffer;
    };
  })();

  protocol.decode = (() => {
    // unsigned 8-bit integer (none needed)
    // unsigned 16-bit integer
    var arrUint16 = new Uint16Array(1);
    var charUint16 = new Uint8Array(arrUint16.buffer);
    // unsigned 32-bit integer
    var arrUint32 = new Uint32Array(1);
    var charUint32 = new Uint8Array(arrUint32.buffer);
    // 32-bit float
    var arrFloat32 = new Float32Array(1);
    var charFloat32 = new Uint8Array(arrFloat32.buffer);
    // build a useful internal function
    var typeDecoder = (str, type, offset) => {
      switch (type) {
        case 'Uint8':
          return str.charCodeAt(offset++);
        case 'Uint16':
          for (let i = 0; i < 2; i++) {
            charUint16[i] = str.charCodeAt(offset++);
          }
          return arrUint16[0];
        case 'Uint32':
          for (let i = 0; i < 4; i++) {
            charUint32[i] = str.charCodeAt(offset++);
          }
          return arrUint32[0];
        case 'Sint8':
          return -1 - str.charCodeAt(offset++);
        case 'Sint16':
          for (let i = 0; i < 2; i++) {
            charUint16[i] = str.charCodeAt(offset++);
          }
          return -1 - arrUint16[0];
        case 'Sint32':
          for (let i = 0; i < 4; i++) {
            charUint32[i] = str.charCodeAt(offset++);
          }
          return -1 - arrUint32[0];
        case 'Float32':
          for (let i = 0; i < 4; i++) {
            charFloat32[i] = str.charCodeAt(offset++);
          }
          return arrFloat32[0];
        default:
          throw new Error('Unknown decoding type.');
      }
    };
    // actually decode it
    return raw => {
      try {
        let intView = new Uint8Array(raw);
        let str = '';
        for (let i = 0, len = intView.length; i < len; i++) {
          str += String.fromCharCode(intView[i]);
        }
        let offset = 1;
        let output = [str.charAt(0)];
        while (offset < str.length) {
          switch (str[offset++]) {
            case '0':
              output.push(typeDecoder(str, 'Uint8', offset));
              offset++;
              break;
            case '1':
              output.push(typeDecoder(str, 'Uint16', offset));
              offset += 2;
              break;
            case '2':
              output.push(typeDecoder(str, 'Uint32', offset));
              offset += 4;
              break;
            case '3':
              output.push(typeDecoder(str, 'Sint8', offset));
              offset++;
              break;
            case '4':
              output.push(typeDecoder(str, 'Sint16', offset));
              offset += 2;
              break;
            case '5':
              output.push(typeDecoder(str, 'Sint32', offset));
              offset += 4;
              break;
            case '6':
              output.push(typeDecoder(str, 'Float32', offset));
              offset += 4;
              break;
            case '7': { // String8
              let len = typeDecoder(str, 'Uint16', offset);
              offset += 2;
              output.push(str.slice(offset, offset + len));
              offset += len;
            }
            break;
          case '8': { // String16
            let len = typeDecoder(str, 'Uint16', offset);
            offset += 2;
            let arr = str.slice(offset, offset + len);
            let buf = new Uint16Array(len / 2);
            for (let i = 0; i < len; i += 2) {
              buf[i / 2] = typeDecoder(arr, 'Uint16', i);
            }
            output.push(String.fromCharCode.apply(null, buf));
            offset += len;
          }
          break;
          default:
            offset = str.length;
            throw new Error('Unknown decoding command. Decoding exited.');
          }
        }
        return output;
      } catch (err) {
        console.log(err);
        return -1;
      };
    }
  })();
  // This is what we use to figure out what the hell the server is telling us to look at
  const convert = (() => {
    // Make a data crawler
    const get = (() => {
      let index = 0,
        crawlData = [];
      return {
        next: () => {
          if (index >= crawlData.length) {
            console.log(crawlData);
            throw new Error('Trying to crawl past the end of the provided data!');
          } else {
            return crawlData[index++];
          }
        },
        set: (data) => {
          crawlData = data;
          index = 0;
        },
      };
    })();
    // Return our handlers
    return {
      begin: data => get.set(data),
      // Make a data convertor
      data: (() => {
        // Make a converter
        const process = (() => {
          // Some status manager constructors
          const GunContainer = (() => {
            function physics(g) {
              g.isUpdated = true;
              if (g.motion || g.position) {
                // Simulate recoil
                g.motion -= 0.2 * g.position;
                g.position += g.motion;
                if (g.position < 0) { // Bouncing off the back
                  g.position = 0;
                  g.motion = -g.motion;
                }
                if (g.motion > 0) {
                  g.motion *= 0.5;
                }
              }
            }
            return (n) => {
              let a = [];
              for (let i = 0; i < n; i++) {
                a.push({
                  motion: 0,
                  position: 0,
                  isUpdated: true,
                });
              }
              return {
                getPositions: () => a.map(g => {
                  return g.position;
                }),
                update: () => a.forEach(physics),
                fire: (i, power) => {
                  if (a[i].isUpdated) a[i].motion += Math.sqrt(power) / 20;
                  a[i].isUpdated = false;
                },
                length: a.length,
              };
            };
          })();

          function Status() {
            let state = 'normal',
              time = getNow();
            return {
              set: val => {
                if (val !== state || state === 'injured') {
                  if (state !== 'dying') time = getNow();
                  state = val;
                }
              },
              getFade: () => {
                return (state === 'dying' || state === 'killed') ? 1 - Math.min(1, (getNow() - time) / 300) : 1;
              },
              getColor: () => {
                return '#FFFFFF';
              },
              getBlend: () => {
                let o = (state === 'normal' || state === 'dying') ? 0 : 1 - Math.min(1, (getNow() - time) / 80);
                if (getNow() - time > 500 && state === 'injured') {
                  state = 'normal';
                }
                return o;
              }
            };
          }
          // Return our function
          return (z = {}) => {
            let isNew = z.facing == null; // For whatever reason arguments.length is uglified poorly...
            // Figure out what kind of data we're looking at
            let type = get.next();
            // Handle it appropiately
            if (type & 0x01) { // issa turret
              z.facing = get.next();
              z.layer = get.next();
            } else { // issa something real
              z.interval = metrics.rendergap;
              z.id = get.next();
              // Determine if this is an new entity or if we already know about it
              let iii = entities.findIndex(x => x.id === z.id);
              if (iii !== -1) {
                // remove it if needed (this way we'll only be left with the dead/unused entities)
                z = entities.splice(iii, 1)[0];
              }
              // Change the use of the variable
              isNew = iii === -1;
              // If it's not new, save the memory data
              if (!isNew) {
                z.render.draws = true; // yay!!
                z.render.lastx = z.x;
                z.render.lasty = z.y;
                z.render.lastvx = z.vx;
                z.render.lastvy = z.vy;
                z.render.lastf = z.facing;
                z.render.lastRender = player.time;
              }
              // Either way, keep pulling information
              z.index = get.next();
              z.x = get.next();
              z.y = get.next();
              z.vx = get.next();
              z.vy = get.next();
              z.size = get.next();
              z.facing = get.next();
              z.vfacing = get.next();
              z.twiggle = get.next();
              z.layer = get.next();
              z.color = get.next();
                // =============================================
                            // Chat System.
                            // =============================================
                            z.roleColorIndex = get.next();
                            // =============================================
              // Update health, flagging as injured if needed
              if (isNew) {
                z.health = get.next() / 255;
                z.shield = get.next() / 255;
              } else {
                let hh = z.health,
                  ss = z.shield;
                z.health = get.next() / 255;
                z.shield = get.next() / 255;
                // Update stuff
                if (z.health < hh || z.shield < ss) {
                  z.render.status.set('injured');
                } else if (z.render.status.getFade() !== 1) {
                  // If it turns out that we thought it was dead and it wasn't
                  z.render.status.set('normal');
                }
              }
              z.alpha = get.next() / 255;
              z.drawsHealth = !!(type & 0x02); // force to boolean
              // Nameplates
              if (type & 0x04) { // has a nameplate
                z.name = get.next();
                z.score = get.next();
              }
              z.nameplate = type & 0x04;
              // If it's new, give it rendering information
              if (isNew) {
                z.render = {
                  draws: false,
                  expandsWithDeath: z.drawsHealth,
                  lastRender: player.time,
                  x: z.x,
                  y: z.y,
                  lastx: z.x - metrics.rendergap * config.roomSpeed * (1000 / 30) * z.vx,
                  lasty: z.y - metrics.rendergap * config.roomSpeed * (1000 / 30) * z.vy,
                  lastvx: z.vx,
                  lastvy: z.vy,
                  lastf: z.facing,
                  f: z.facing,
                  h: z.health,
                  s: z.shield,
                  interval: metrics.rendergap,
                  slip: 0,
                  status: Status(),
                  health: Smoothbar(z.health, 0.5, 5),
                  shield: Smoothbar(z.shield, 0.5, 5),
                };
              }
              // Update the rendering healthbars
              z.render.health.set(z.health);
              z.render.shield.set(z.shield);
              // Figure out if the class changed (and if so, refresh the guns and turrets)
              if (!isNew && z.oldIndex !== z.index) isNew = true;
              z.oldIndex = z.index;
            }
            // If it needs to have a gun container made, make one
            let gunnumb = get.next();
            if (isNew) {
              z.guns = GunContainer(gunnumb);
            } else if (gunnumb !== z.guns.length) {
              throw new Error('Mismatch between data gun number and remembered gun number!');
            }
            // Decide if guns need to be fired one by one
            for (let i = 0; i < gunnumb; i++) {
              let time = get.next(),
                power = get.next();
              if (time > player.lastUpdate - metrics.rendergap) { // shoot it
                z.guns.fire(i, power);
              }
            }
            // Update turrets
            let turnumb = get.next();
            if (turnumb) {
              let b = 1;
            }
            if (isNew) {
              z.turrets = [];
              for (let i = 0; i < turnumb; i++) {
                z.turrets.push(process());
              }
            } else {
              if (z.turrets.length !== turnumb) {
                throw new Error('Mismatch between data turret number and remembered turret number!');
              }
              z.turrets.forEach(tur => {
                tur = process(tur);
              });
            }
            // Return our monsterous creation
            return z;
          };
        })();
        // And this is the function we return that crawls some given data and reports it
        return () => {
          // Set up the output thingy+
          let output = [];
          // Get the number of entities and work through them
          for (let i = 0, len = get.next(); i < len; i++) {
            output.push(process());
          }
          // Handle the dead/leftover entities
          entities.forEach(e => {
            // Kill them
            e.render.status.set((e.health === 1) ? 'dying' : 'killed');
            // And only push them if they're not entirely dead and still visible
            if (e.render.status.getFade() !== 0 && isInView(e.render.x - player.renderx, e.render.y - player.rendery, e.size, true)) {
              output.push(e);
            } else {
              if (e.render.textobjs != null) e.render.textobjs.forEach(o => o.remove());
            }
          });
          // Save the new entities list
          entities = output;
          entities.sort((a, b) => {
            let sort = a.layer - b.layer;
            if (!sort) sort = b.id - a.id;
            if (!sort) throw new Error('tha fuq is up now');
            return sort;
          });
        };
      })(),
      // Define our gui convertor
      gui: () => {
        let index = get.next(),
          // Translate the encoded index
          indices = {
            topspeed: index & 0x0100,
            accel: index & 0x0080,
            skills: index & 0x0040,
            statsdata: index & 0x0020,
            upgrades: index & 0x0010,
            points: index & 0x0008,
            score: index & 0x0004,
            label: index & 0x0002,
            fps: index & 0x0001,
          };
        // Operate only on the values provided
        if (indices.fps) {
          gui.fps = get.next();
        }
        if (indices.label) {
          gui.type = get.next();
          gui.color = get.next();
          gui.playerid = get.next();
        }
        if (indices.score) {
          gui.__s.setScore(get.next());
        }
        if (indices.points) {
          gui.points = get.next();
        }
        if (indices.upgrades) {
          gui.upgrades = [];
          for (let i = 0, len = get.next(); i < len; i++) {
            gui.upgrades.push(get.next());
          }
        }
        if (indices.statsdata) {
          for (let i = 9; i >= 0; i--) {
            gui.skills[i].name = get.next();
            gui.skills[i].cap = get.next();
            gui.skills[i].softcap = get.next();
          }
        }
        if (indices.skills) {
          let skk = parseInt(get.next(), 36).toString(16);
          skk = '0000000000'.substr(skk.length) + skk;
          gui.skills[0].amount = parseInt(skk.slice(0, 1), 16);
          gui.skills[1].amount = parseInt(skk.slice(1, 2), 16);
          gui.skills[2].amount = parseInt(skk.slice(2, 3), 16);
          gui.skills[3].amount = parseInt(skk.slice(3, 4), 16);
          gui.skills[4].amount = parseInt(skk.slice(4, 5), 16);
          gui.skills[5].amount = parseInt(skk.slice(5, 6), 16);
          gui.skills[6].amount = parseInt(skk.slice(6, 7), 16);
          gui.skills[7].amount = parseInt(skk.slice(7, 8), 16);
          gui.skills[8].amount = parseInt(skk.slice(8, 9), 16);
          gui.skills[9].amount = parseInt(skk.slice(9, 10), 16);
        }
        if (indices.accel) {
          gui.accel = get.next();
        }
        if (indices.topspeed) {
          gui.topspeed = get.next();
        }
      },
      // Make a minimap convertor
      minimap: (() => {
        let loop = (() => {
          // A test function
          function challenge(value, challenger) {
            return value[0] === challenger[0] &&
              value[1] === challenger[1] &&
              value[2] === challenger[2];
          }
          // The loop function definition
          return () => {
            // Pull the update order
            let type = get.next(),
              x = get.next() * global.gameWidth / 255,
              y = get.next() * global.gameHeight / 255,
              color = get.next();
            // Fufill the order
            switch (type) {
              case -1: { // removal
                let index = minimap.findIndex(e => challenge(e, [x, y, color]));
                if (index === -1) {
                  console.log('Warning: Remove request for a minimap node we were not aware of.');
                } else {
                  minimap.splice(index, 1);
                }
              }
              break;
            case 1: { //insertion
              minimap.push([x, y, color]);
            }
            break;
            default:
              console.log('Unknown minimap update request.');
            }
          };
        })();
        // The update function
        return () => {
          for (let i = 0, len = get.next(); i < len; i++) {
            loop();
          }
        };
      })(),
      // Define our leaderboard convertor
      leaderboard: () => {
        let whoopswedesynced = false;
        // First crawl the remove orders
        let first = get.next();
        if (first === -1) { // o shit its a full refresh, nuke it and start over
          leaderboard.purge();
        } else { // Remove things normally
          for (let i = 0, len = first; i < len; i++) {
            leaderboard.remove(get.next());
          }
        }
        // Then do the next things
        for (let i = 0, len = get.next(); i < len; i++) {
          let next = get.next();
          if (next < 0) { // It's an add index!
            let toadd = {
              id: -next,
              score: get.next(),
              index: get.next(),
              name: get.next(),
              color: get.next(),
              barcolor: get.next(),
              nameColor: get.next()
            };
            leaderboard.add(toadd);
          } else { // It's an update index!=
            let w = leaderboard.update({
              id: next,
              score: get.next(),
              index: get.next(),
              nameColor: get.next()
            });
            if (w === -1) whoopswedesynced = true;
          }
        }
        return whoopswedesynced;
      },
    };
  })();
  // The initialization function (this is returned)
  return port => {
    let WSLINK = window.location.hostname.includes("localhost") ? `ws://${window.location.hostname}:3000` : 'wss://' + window.location.hostname;
    let socket = new WebSocket(WSLINK);
    // Set up our socket
    socket.binaryType = 'arraybuffer';
    socket.open = false;
    // Handle commands
    socket.cmd = (() => {
      let flag = false;
      let commands = [
        false, // up
        false, // down
        false, // left
        false, // right
        false, // lmb
        false, // mmb
        false, // rmb
        false,
      ];
      return {
        set: (index, value) => {
          if (commands[index] !== value) {
            commands[index] = value;
            flag = true;
          }
        },
        talk: () => {
          flag = false;
          let o = 0;
          for (let i = 0; i < 8; i++) {
            if (commands[i]) o += Math.pow(2, i);
          }
          let ratio = getRatio();
          socket.talk('C',
            Math.round(window.canvas.target.x / ratio),
            Math.round(window.canvas.target.y / ratio),
            o
          );
        },
        check: () => {
          return flag;
        },
        getMotion: () => {
          return {
            x: commands[3] - commands[2],
            y: commands[1] - commands[0],
          };
        },
      };
    })();
    // Learn how to talk
    socket.talk = (...message) => {
      // Make sure the socket is open before we do anything
      if (!socket.open) return 1;
      socket.send(protocol.encode(message));
    };
    // Websocket functions for when stuff happens
    // This is for when the socket first opens
    socket.onopen = function socketOpen() {
      socket.open = true;
      global.message = '[arras-tx test server]: Invalid Token!';
      socket.talk('k', global.playerKey);
      console.log('Token submitted to the server for validation.');
      // define a pinging function
      socket.ping = (payload) => {
        socket.talk('p', payload);
      };
      socket.commandCycle = setInterval(() => {
        if (socket.cmd.check()) socket.cmd.talk();
      });
    };
    // Handle incoming messages
    socket.onmessage = function socketMessage(message) {
      // Make sure it looks legit.
      let m = protocol.decode(message.data);
      if (m === -1) {
        throw new Error('Malformed packet.');
      }
      // Decide how to interpret it
      switch (m.splice(0, 1)[0]) {
        case 'w': { // welcome to the game
          if (m[0]) { // Ask to spawn
            console.log('The server has welcomed us to the game room. Sending spawn request.');
            socket.talk('s', global.playerName, 1);
            global.message = '';
          }
        }
        break;
           // =============================================================
            // Chat System.
            // =============================================================
            // Receive player id.
            case 'I':
            {
                if (global.player) {
                    console.log('Player id received: ' + m[0]);
                    player.id = m[0];
                    global.player.id = m[0];
                }
            } break;

            // Receive player name.
            case 'N': {
                if (global.player) {
                    console.log('Player name received: ' + m[0]);
                    global.playerName = player.name = m[0];
                }
            } break;

            // Receive players list.
            case 'L': {
                // ==================================================
                // The array contains alternate id and name.
                // For example:
                // m[0] => Player Id
                // m[1] => Player Name
                // m[2] => Player Id
                // m[3] => Player Name
                // ==================================================
                global.playersList += player.id;
              global.playersList = m;
            } break;
            // =============================================================
      case 'R': { // room setup
        global.gameWidth = m[0];
        global.gameHeight = m[1];
        roomSetup = JSON.parse(m[2]);
        serverStart = JSON.parse(m[3]);
        config.roomSpeed = m[4];
        console.log('Room data recieved. Commencing syncing process.');
        // Start the syncing process
        socket.talk('S', getNow());
      }
      break;
                case 'M': 
                {
                  global.gameWidth = m[0];
                  global.gameHeight = m[1];
                  minimap.splice(0, minimap.length);
                }
                break;
      case 'c': { // force camera move
        player.renderx = player.x = m[0];
        player.rendery = player.y = m[1];
        player.renderv = player.view = m[2];
        player.nameColor = m[3];
        console.log('Camera moved!');
      }
      break;
      case 'S': { // clock syncing
        let clientTime = m[0],
          serverTime = m[1],
          laten = (getNow() - clientTime) / 2,
          delta = getNow() - laten - serverTime;
        // Add the datapoint to the syncing data
        sync.push({
          delta: delta,
          latency: laten,
        });
        // Do it again a couple times
        if (sync.length < 10) {
          // Wait a bit just to space things out
          setTimeout(() => {
            socket.talk('S', getNow());
          }, 10);
          global.message = "Starting the server, do not tab away. " + sync.length + "/10...";
        } else {
          // Calculate the clock error
          sync.sort((e, f) => {
            return e.latency - f.latency;
          });
          let median = sync[Math.floor(sync.length / 2)].latency;
          let sd = 0,
            sum = 0,
            valid = 0;
          sync.forEach(e => {
            sd += Math.pow(e.latency - median, 2);
          });
          sd = Math.sqrt(sd / sync.length);
          sync.forEach(e => {
            if (Math.abs(e.latency - median) < sd) {
              sum += e.delta;
              valid++;
            }
          });
          clockDiff = Math.round(sum / valid);
          // Start the game
          console.log(sync);
          console.log('Syncing complete, calculated clock difference ' + clockDiff + 'ms. Beginning game.');
          global.gameStart = true;
          global.message = '';
        }
      }
      break;
          //original
          /*
      case 'm': { // message
        messages.push({
          text: m[0],
          status: 2,
          alpha: 0,
          time: Date.now(),
        });
      }
      break; */
            // =============================================================================
            // Chat System.
            // =============================================================================
            case 'm':
            { // message
                messages.push({
                    text: m[0],
                    status: 2,
                    alpha: 0,
                    time: Date.now(),
                    colorIndex: m[1],
                });
            } break;

            case 'h':
            { // Chat message
                chatMessages.push({
                    status: 2,
                    alpha: 0,
                    time: Date.now(),
                    playerName: m[0],
                    text: m[1],
                    colorIndex: m[2],
                });
            } break;
            // =============================================================================
      case 'u': { // uplink
        // Pull the camera info
        let camtime = m[0],
          camx = m[1],
          camy = m[2],
          camfov = m[3],
          camvx = m[4],
          camvy = m[5],
          // We'll have to do protocol decoding on the remaining data
          theshit = m.slice(6);
        // Process the data
        if (camtime > player.lastUpdate) { // Don't accept out-of-date information.
          // Time shenanigans
          lag.add(getNow() - camtime);
          player.time = camtime + lag.get();
          metrics.rendergap = camtime - player.lastUpdate;
          if (metrics.rendergap <= 0) {
            console.log('yo some bullshit is up wtf');
          }
          player.lastUpdate = camtime;
          // Convert the gui and entities
          convert.begin(theshit);
          convert.gui();
          convert.data();
          // Save old physics values
          player.lastx = player.x;
          player.lasty = player.y;
          player.lastvx = player.vx;
          player.lastvy = player.vy;
          // Get new physics values
          player.x = camx;
          player.y = camy;
          player.vx = global.died ? 0 : camvx;
          player.vy = global.died ? 0 : camvy;
          // Figure out where we're rendering if we don't yet know
          if (isNaN(player.renderx)) {
            player.renderx = player.x;
          }
          if (isNaN(player.rendery)) {
            player.rendery = player.y;
          }
          moveCompensation.reset();
          // Fov stuff
          player.view = camfov;
          if (isNaN(player.renderv) || player.renderv === 0) {
            player.renderv = 2000;
          }
          // Metrics
          metrics.lastlag = metrics.lag;
          metrics.lastuplink = getNow();
        } else {
          console.log("Old data! Last given time: " + player.time + "; offered packet timestamp: " + camtime + ".");
        }
        // Send the downlink and the target
        socket.talk('d', Math.max(player.lastUpdate, camtime));
        socket.cmd.talk();
        updateTimes++; // metrics
      }
      break;
      case 'b': { // broadcasted minimap
        convert.begin(m);
        convert.minimap();
        if (convert.leaderboard()) {
          // Request an update because of desync
          socket.talk('z');
          minimap.splice(0, minimap.length)
        }
      }
      break;
      case 'p': { // ping
        metrics.latency = global.time - m[0];
      }
      break;
      case 'F': { // to pay respects
        global.finalScore = Smoothbar(0, 4);
        global.finalScore.set(m[0]);
        global.finalLifetime = Smoothbar(0, 5);
        global.finalLifetime.set(m[1]);
        global.finalKills = [Smoothbar(0, 3), Smoothbar(0, 4.5), Smoothbar(0, 2.5)];
        global.finalKills[0].set(m[2]);
        global.finalKills[1].set(m[3]);
        global.finalKills[2].set(m[4]);
        global.finalKillers = [];
        for (let i = 0; i < m[5]; i++) {
          global.finalKillers.push(m[6 + i]);
        }
        global.died = true;
        window.onbeforeunload = () => {
          return false;
        };
      }
      break;
      case 'K': { // kicked
        window.onbeforeunload = () => {
          return false;
        };
      }
      break;
      default:
        throw new Error('Unknown message index.');
      }
    };
    // Handle closing
    socket.onclose = function socketClose() {
      socket.open = false;
      global.disconnected = true;
      clearInterval(socket.commandCycle);
      window.onbeforeunload = () => {
        return false;
      };
      console.log('Socket closed.');
    };
    // Notify about errors
    socket.onerror = function socketError(error) {
      console.log('WebSocket error: ' + error);
      global.message = 'Socket error. Maybe another server will work.';
    };
    // Gift it to the rest of the world
    return socket;
  };
})();

// This starts the game and sets up the websocket
function startGame() {
  // Get options
  util.submitToLocalStorage('optScreenshotMode');
  config.graphical.screenshotMode = document.getElementById('optScreenshotMode').checked;
  util.submitToLocalStorage('optFancy');
  config.graphical.pointy = !document.getElementById('optNoPointy').checked;
  util.submitToLocalStorage('optNoPointy');
  config.graphical.fancyAnimations = !document.getElementById('optFancy').checked;
  util.submitToLocalStorage('optPredictive');
  config.lag.unresponsive = document.getElementById('optPredictive').checked;
  util.submitToLocalStorage('optBorders');
  switch (document.getElementById('optBorders').value) {
    case 'normal':
      config.graphical.darkBorders = config.graphical.neon = false;
      break;
    case 'dark':
      config.graphical.darkBorders = true;
      config.graphical.neon = false;
      break;
    case 'glass':
      config.graphical.darkBorders = false;
      config.graphical.neon = true;
      break;
    case 'neon':
      config.graphical.darkBorders = config.graphical.neon = true;
      break;
  }
  util.submitToLocalStorage('optColors');
  let a = document.getElementById('optColors').value;
  color = color[(a === '') ? 'normal' : a];
  // Other more important stuff
  let playerNameInput = document.getElementById('playerNameInput');
  let playerKeyInput = document.getElementById('playerKeyInput');
  // Name and keys
  util.submitToLocalStorage('playerNameInput');
  util.submitToLocalStorage('playerKeyInput');
  global.playerName = player.name = playerNameInput.value;
  global.playerKey = playerKeyInput.value.replace(/(<([^>]+)>)/ig, '').substring(0, 64);
  // Change the screen
  global.screenWidth = window.innerWidth;
  global.screenHeight = window.innerHeight;
  document.getElementById('startMenuWrapper').style.maxHeight = '0px';
  document.getElementById('gameAreaWrapper').style.opacity = 1;
  // Set up the socket
  if (!global.socket) {
    global.socket = socketInit(3000);
  }
  if (!global.animLoopHandle) {
    animloop();
  }
  window.canvas.socket = global.socket;
  minimap = [];
  setInterval(() => moveCompensation.iterate(global.socket.cmd.getMotion()), 1000 / 30);
  document.getElementById('gameCanvas').focus();
  window.onbeforeunload = () => {
    return true;
  };
}

// Background clearing
function clearScreen(clearColor, alpha) {
  ctx.fillStyle = clearColor;
  ctx.globalAlpha = alpha;
  ctx.fillRect(0, 0, global.screenWidth, global.screenHeight);
  ctx.globalAlpha = 1;
}

// Text functions
const measureText = (() => {
  let div = document.createElement('div');
  document.body.appendChild(div);
  return (text, fontSize, twod = false) => {
    fontSize += config.graphical.fontSizeBoost;
    var w, h;
    div.style.font = 'bold ' + fontSize + 'px Ubuntu';
    div.style.padding = '0';
    div.style.margin = '0';
    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    div.textContent = text; //anti XSS with the name, chat etcetera. change from innerHTML to textContent to prevent XSS.
    w = div.clientWidth;
    h = div.clientHeight;
    return (twod) ? {
      width: w,
      height: h
    } : w;
  };
})();
const TextObj = (() => {
  // A thing
  let floppy = (value = null) => {
    let flagged = true;
    // Methods
    return {
      update: newValue => {
        let eh = false;
        if (value == null) {
          eh = true;
        } else {
          if (typeof newValue != typeof value) {
            eh = true;
          }
          // Decide what to do based on what type it is
          switch (typeof newValue) {
            case 'number':
            case 'string': {
              if (newValue !== value) {
                eh = true;
              }
            }
            break;
          case 'object': {
            if (Array.isArray(newValue)) {
              if (newValue.length !== value.length) {
                eh = true;
              } else {
                for (let i = 0, len = newValue.length; i < len; i++) {
                  if (newValue[i] !== value[i]) eh = true;
                }
              }
              break;
            }
          } // jshint ignore:line
          default:
            console.log(newValue);
            throw new Error('Unsupported type for a floppyvar!');
          }
        }
        // Update if neeeded
        if (eh) {
          flagged = true;
          value = newValue;
        }
      },
      publish: () => {
        return value;
      },
      check: () => {
        if (flagged) {
          flagged = false;
          return true;
        }
        return false;
      },
    };
  };
  // An index
  let index = 0;
  return () => {
    let textcanvas = document.createElement('canvas');
    let canvasId = 'textCanvasNo' + index++;
    textcanvas.setAttribute('id', canvasId);
    let tctx = textcanvas.getContext('2d');
    tctx.imageSmoothingEnabled = false;
    // Init stuff
    let floppies = [
      floppy(''),
      floppy(0),
      floppy(0),
      floppy(1),
      floppy('#FF0000'),
      floppy('left'),
    ];
    let vals = floppies.map(f => f.publish());
    let xx = 0;
    let yy = 0;
    return {
      draw: (text, x, y, size, fill, align = 'left', center = false, fade = 1) => {
        size += config.graphical.fontSizeBoost;
        // Update stuff
        floppies[0].update(text);
        floppies[1].update(x);
        floppies[2].update(y);
        floppies[3].update(size);
        floppies[4].update(fill);
        floppies[5].update(align);
        // Check stuff
        if (floppies.some(f => f.check())) {
          // Get text dimensions and resize/reset the canvas
          let offset = Math.max(3, size / 5);
          let dim = measureText(text, size - config.graphical.fontSizeBoost, true);
          tctx.canvas.height = dim.height + 2 * offset;
          tctx.canvas.width = dim.width + 2 * offset;
          // Redraw it
          switch (align) {
            case 'left':
            case 'start':
              xx = offset;
              break;
            case 'center':
              xx = tctx.canvas.width / 2;
              break;
            case 'right':
            case 'end':
              xx = tctx.canvas.width - offset;
              break;
          }
          yy = tctx.canvas.height / 2;
          // Draw it
          tctx.lineWidth = offset;
          tctx.font = 'bold ' + size + 'px Ubuntu';
          tctx.textAlign = align;
          tctx.textBaseline = 'middle';
          tctx.strokeStyle = color.black;
          tctx.fillStyle = fill;
          tctx.lineCap = 'round';
          tctx.lineJoin = 'round';
          tctx.strokeText(text, xx, yy);
          tctx.fillText(text, xx, yy);
        }
        // Draw the cached text
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(tctx.canvas, x - xx, y - yy * (1.05 + !center * 0.45));
        ctx.restore();
      },
      remove: () => {
        var element = document.getElementById(canvasId);
        if (element != null) element.parentNode.removeChild(element);
      },
    };
  };
})();

// Gui drawing functions
function drawGuiRect(x, y, length, height, stroke = false) {
  switch (stroke) {
    case true:
      ctx.strokeRect(x, y, length, height);
      break;
    case false:
      ctx.fillRect(x, y, length, height);
      break;
  }
}

function drawGuiLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.lineTo(Math.round(x1) + 0.5, Math.round(y1) + 0.5);
  ctx.lineTo(Math.round(x2) + 0.5, Math.round(y2) + 0.5);
  ctx.closePath();
  ctx.stroke();
}

function drawBar(x1, x2, y, width, color) {
  ctx.beginPath();
  ctx.lineTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.closePath();
  ctx.stroke();
}

// Entity drawing (this is a function that makes a function)
const drawEntity = (() => {
  // Sub-drawing functions
  function drawPoly(context, centerX, centerY, radius, sides, angle = 0, fill = true) {
    angle += (sides % 2) ? 0 : Math.PI / sides;
    // Start drawing
    context.beginPath();
    if (!sides) { // Circle
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    } else if (sides < 0) { // Star
      if (config.graphical.pointy) context.lineJoin = 'miter';
      else radius *= 1.25;
      let dip = 1 - (6 / sides / sides);
      sides = -sides;
      context.moveTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
      for (let i = 0; i < sides; i++) {
        var theta = (i + 1) / sides * 2 * Math.PI;
        var htheta = (i + 0.5) / sides * 2 * Math.PI;
        var c = {
          x: centerX + radius * dip * Math.cos(htheta + angle),
          y: centerY + radius * dip * Math.sin(htheta + angle),
        };
        var p = {
          x: centerX + radius * Math.cos(theta + angle),
          y: centerY + radius * Math.sin(theta + angle),
        };
        context.quadraticCurveTo(c.x, c.y, p.x, p.y);
      }
    } else if (sides === 600) {
      for (let i = 0; i < 6; i++) {
        let theta = (i / 6) * 2 * Math.PI,
          x = centerX + radius * 1.1 * Math.cos(180 / 6 + theta + angle + 0.385),
          y = centerY + radius * 1.1 * Math.sin(180 / 6 + theta + angle + 0.385);
        context.lineTo(x, y);
      }
    } else if (sides > 0) { // Polygon
      for (let i = 0; i < sides; i++) {
        let theta = (i / sides) * 2 * Math.PI;
        let x = centerX + radius * Math.cos(theta + angle);
        let y = centerY + radius * Math.sin(theta + angle);
        context.lineTo(x, y);
      }
    }
    context.closePath();
    context.stroke();
    if (fill) {
      context.fill();
    }
    context.lineJoin = 'round';
  }

  function drawTrapezoid(context, x, y, length, height, aspect, angle) {
    let h = [];
    h = (aspect > 0) ? [height * aspect, height] : [height, -height * aspect];
    let r = [
      Math.atan2(h[0], length),
      Math.atan2(h[1], length)
    ];
    let l = [
      Math.sqrt(length * length + h[0] * h[0]),
      Math.sqrt(length * length + h[1] * h[1])
    ];

    context.beginPath();
    context.lineTo(x + l[0] * Math.cos(angle + r[0]), y + l[0] * Math.sin(angle + r[0]));
    context.lineTo(x + l[1] * Math.cos(angle + Math.PI - r[1]), y + l[1] * Math.sin(angle + Math.PI - r[1]));
    context.lineTo(x + l[1] * Math.cos(angle + Math.PI + r[1]), y + l[1] * Math.sin(angle + Math.PI + r[1]));
    context.lineTo(x + l[0] * Math.cos(angle - r[0]), y + l[0] * Math.sin(angle - r[0]));
    context.closePath();
    context.stroke();
    context.fill();
  }
  // The big drawing function
  return (x, y, instance, ratio, alpha = 1, scale = 1, rot = 0, turretsObeyRot = false, assignedContext = false, turretInfo = false, render = instance.render) => {
    try {
      let context = (assignedContext) ? assignedContext : ctx;
      let fade = turretInfo ? 1 : render.status.getFade(),
        drawSize = scale * ratio * instance.size,
        m = mockups[instance.index],
        xx = x,
        yy = y,
        source = (turretInfo === false) ? instance : turretInfo;
      if (fade === 0 || alpha === 0) return;
      if (render.expandsWithDeath) drawSize *= (1 + 0.5 * (1 - fade));
      if (config.graphical.fancyAnimations && assignedContext != ctx2 && (fade !== 1 || alpha !== 1)) {
        context = ctx2;
        context.canvas.width = context.canvas.height = drawSize * m.position.axis + ratio * 20;
        xx = context.canvas.width / 2 - drawSize * m.position.axis * m.position.middle.x * Math.cos(rot) / 4;
        yy = context.canvas.height / 2 - drawSize * m.position.axis * m.position.middle.x * Math.sin(rot) / 4;
      } else {
        if (fade * alpha < 0.5) return;
      }
      context.lineCap = 'round';
      context.lineJoin = 'round';
      // Draw turrets beneath us
      if (source.turrets.length === m.turrets.length) {
        for (let i = 0; i < m.turrets.length; i++) {
          let t = m.turrets[i];
          if (t.layer === 0) {
            let ang = t.direction + t.angle + rot,
              len = t.offset * drawSize;
            drawEntity(
              xx + len * Math.cos(ang),
              yy + len * Math.sin(ang),
              t, ratio, alpha, drawSize / ratio / t.size * t.sizeFactor,
              source.turrets[i].facing + turretsObeyRot * rot,
              turretsObeyRot, context, source.turrets[i], render
            );
          }
        }
      } else {
        throw new Error("Mismatch turret number with mockup.");
      }
      // Draw guns
      source.guns.update();
      context.lineWidth = Math.max(config.graphical.mininumBorderChunk, ratio * config.graphical.borderChunk);
      setColor(context, mixColors(color.grey, render.status.getColor(), render.status.getBlend()));
      if (source.guns.length === m.guns.length) {
        let positions = source.guns.getPositions();
        for (let i = 0; i < m.guns.length; i++) {
          let g = m.guns[i],
            position = positions[i] / ((g.aspect === 1) ? 2 : 1),
            gx =
            g.offset * Math.cos(g.direction + g.angle + rot) +
            (g.length / 2 - position) * Math.cos(g.angle + rot),
            gy =
            g.offset * Math.sin(g.direction + g.angle + rot) +
            (g.length / 2 - position) * Math.sin(g.angle + rot);
          drawTrapezoid(
            context,
            xx + drawSize * gx,
            yy + drawSize * gy,
            drawSize * (g.length / 2 - ((g.aspect === 1) ? position * 2 : 0)),
            drawSize * g.width / 2,
            g.aspect,
            g.angle + rot
          );
        }
      } else {
        throw new Error("Mismatch gun number with mockup.");
      }
      // Draw body
      context.globalAlpha = 1;
      setColor(context, mixColors(getColor(instance.color), render.status.getColor(), render.status.getBlend()));
      drawPoly(context, xx, yy, drawSize / m.size * m.realSize, m.shape, rot);
      // ==============================================================================
// Spaceball Shooter.
// ==============================================================================
/*
//maybe i need to delete this because glitch is bald

resources.load([    
    '',    
]);

let spaceBallSpriteInfo = {
        url: './index1.jpg', 
        width: 93,
        height: 100,        
        frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]
    }; //this is the image loader >3
    
// ==============================================================================
       // ===========================================================================
        // Spaceball Shooter bullet.
        // ===========================================================================
      //might yeet this again...
      let Sprite = require('app/client/js/Sprite.js');
        if (instance.layer === 20)
        {           
            if (!instance.spaceBallSprite)
            {
                let animationInfo = spaceBallSpriteInfo;
                let destWidth = scale * ratio * animationInfo.width;
                let destHeight = scale * ratio * animationInfo.height;

                instance.spaceBallSprite = new Sprite(animationInfo.url, 
                                            [0, 0], // Position
                                            [animationInfo.width, animationInfo.height], // Source size 
                                            [destWidth, destHeight], // Destination size
                                            24, // Animation speed
                                            animationInfo.frames, // Frames
                                            null, // Direction (default is horizontal)
                                            false); // Play once                   
            }
           
            var now = getNow();
            var dt = instance.spaceBallTime ? (now - instance.spaceBallTime) / 1000.0 : 0;
            
            // Add 90 degrees to align with the rotation of the bullet.
            let rotation = rot + 180 * (Math.PI / 180);
            let alpha = instance.render.status.getFade();
            
            // dt, destX, destY, destXOffset, destYOffset,  rotation, alpha
            instance.spaceBallSprite.update(dt, x, y, 0,0, rotation, alpha);
            instance.spaceBallSprite.render(ctx);   

            instance.spaceBallTime = now;                           
        }
        */
        // ===========================================================================
      // Draw turrets above us
      if (source.turrets.length === m.turrets.length) {
        for (let i = 0; i < m.turrets.length; i++) {
          let t = m.turrets[i];
          if (t.layer === 1) {
            let ang = t.direction + t.angle + rot,
              len = t.offset * drawSize;
            drawEntity(
              xx + len * Math.cos(ang),
              yy + len * Math.sin(ang),
              t, ratio, alpha, drawSize / ratio / t.size * t.sizeFactor,
              source.turrets[i].facing + turretsObeyRot * rot,
              turretsObeyRot, context, source.turrets[i], render
            );
          }
        }
      } else {
        throw new Error("Mismatch turret number with mockup.");
      }
      if (assignedContext == false && context != ctx) {
        ctx.save();
        ctx.globalAlpha = alpha * fade;
        ctx.imageSmoothingEnabled = false;
        //ctx.globalCompositeOperation = "overlay";
        ctx.filter = 'blur(' + Math.round(config.graphical.deathBlurAmount - config.graphical.deathBlurAmount * fade) + 'px)';
        ctx.drawImage(context.canvas, x - xx, y - yy);
        ctx.restore();
        //ctx.globalCompositeOperation = "source-over";
      }
    } catch (e) {
      global.mockupError = true;
    };
  }
})();

function drawHealth(x, y, instance, ratio) {
  try {
    // Draw health bar
    ctx.globalAlpha = Math.pow(instance.render.status.getFade(), 2);
    let size = instance.size * ratio;
    let m = mockups[instance.index];
    let realSize = size / m.size * m.realSize;
    // Draw health
    if (instance.drawsHealth) {
      let health = instance.render.health.get();
      let shield = instance.render.shield.get();
      if (health < 1 || shield < 1) {
        let yy = y + 1.1 * realSize + 15;
        drawBar(x - size, x + size, yy, 3 + config.graphical.barChunk, color.black);
        drawBar(x - size, x - size + 2 * size * health, yy, 3, color.lgreen);
        if (shield) {
          ctx.globalAlpha = 0.3 + shield * 0.3;
          drawBar(x - size, x - size + 2 * size * shield, yy, 3, color.teal);
          ctx.globalAlpha = 1;
        }
      }
    }
    // Draw label
    if (instance.nameplate && instance.id !== gui.playerid) {
      if (instance.render.textobjs == null) instance.render.textobjs = [TextObj(), TextObj()];
      if (instance.name !== '\u0000') {
        
        var name = instance.name.substring(7, instance.name.length + 1);
        var namecolor = instance.name.substring(0, 7);
        // ================================================================================
            // Chat System.
            // ================================================================================
            let nameColor = color.guiwhite;
            let colorIndex = instance.roleColorIndex;

            if (colorIndex){
                nameColor = getColor(colorIndex);
            }

            let playerNameFontSize = 16;
            let playerName = modifyOverlyLongName(instance.name, playerNameFontSize, 600);

            // Draw other players' names.
            instance.render.textobjs[0].draw(
                playerName,
                x, y - realSize - 30,
                playerNameFontSize, nameColor, 'center'
            );
            // ================================================================================
        /*
        instance.render.textobjs[0].draw(
          name,
          x, y - realSize - 30, 16, namecolor, 'center'
        ); */
        instance.render.textobjs[1].draw(
          util.handleLargeNumber(instance.score, true),
          x, y - realSize - 16, 8, namecolor, 'center'
        );
      } else {
        instance.render.textobjs[0].draw(
          'a spoopy 👻',
          x, y - realSize - 30, 16, color.lavender, 'center'
        );
        instance.render.textobjs[1].draw(
          util.handleLargeNumber(instance.score, true),
          x, y - realSize - 16, 8, color.lavender, 'center'
        );
      }
    }
  } catch (e) {
    global.mockupError = true;
  };
}

// Start animation
window.requestAnimFrame = (() => {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      //window.setTimeout(callback, 1000 / 60);
    };
})();
window.cancelAnimFrame = (() => {
  return window.cancelAnimationFrame ||
    window.mozCancelAnimationFrame;
})();

// Drawing states
const gameDraw = (() => {
  const statMenu = Smoothbar(0, 0.7, 1.5);
  const upgradeMenu = Smoothbar(0, 2, 3);
  // Define the graph constructor
  function graph() {
    var data = [];
    return (point, x, y, w, h, col) => {
      // Add point and push off old ones
      data.push(point);
      while (data.length > w) {
        data.splice(0, 1);
      }
      // Get scale
      let min = Math.min(...data),
        max = Math.max(...data),
        range = max - min;
      // Draw zero
      if (max > 0 && min < 0) {
        drawBar(x, x + w, y + h * max / range, 2, color.guiwhite);
      }
      // Draw points
      ctx.beginPath();
      let i = -1;
      data.forEach((p) => {
        if (!++i) {
          ctx.moveTo(x, y + h * (max - p) / range);
        } else {
          ctx.lineTo(x + i, y + h * (max - p) / range);
        }
      });
      ctx.lineWidth = 1;
      ctx.strokeStyle = col;
      ctx.stroke();
    };
  }
  // Lag compensation functions
  const compensation = (() => {
    // Protected functions
    function interpolate(p1, p2, v1, v2, ts, tt) {
      let k = Math.cos((1 + tt) * Math.PI);
      return 0.5 * (((1 + tt) * v1 + p1) * (k + 1) + (-tt * v2 + p2) * (1 - k));
    }

    function extrapolate(p1, p2, v1, v2, ts, tt) {
      return p2 + (p2 - p1) * tt; /*v2 + 0.5 * tt * (v2 - v1) * ts*/
    }
    // Useful thing
    function angleDifference(sourceA, targetA) {
      let mod = function(a, n) {
        return (a % n + n) % n;
      };
      let a = targetA - sourceA;
      return mod(a + Math.PI, 2 * Math.PI) - Math.PI;
    }
    // Constructor
    return () => {
      // Protected vars
      let timediff = 0,
        t = 0,
        tt = 0,
        ts = 0;
      // Methods
      return {
        set: (time = player.time, interval = metrics.rendergap) => {
          t = Math.max(getNow() - time - 80, -interval);
          if (t > 150 && t < 1000) {
            t = 150;
          }
          if (t > 1000) {
            t = 1000 * 1000 * Math.sin(t / 1000 - 1) / t + 1000;
          }
          tt = t / interval;
          ts = config.roomSpeed * 30 * t / 1000;
        },
        predict: (p1, p2, v1, v2) => {
          return (t >= 0) ? extrapolate(p1, p2, v1, v2, ts, tt) : interpolate(p1, p2, v1, v2, ts, tt);
        },
        predictFacing: (f1, f2) => {
          return f1 + (1 + tt) * angleDifference(f1, f2);
        },
        getPrediction: () => {
          return t;
        },
      };
    };
  })();
  // Make graphs
  const timingGraph = graph(),
    lagGraph = graph(),
    gapGraph = graph();
  // The skill bar dividers
  const ska = (() => {
    function make(x) {
      return Math.log(4 * x + 1) / Math.log(5);
    }
    let a = [];
    for (let i = 0; i < config.gui.expectedMaxSkillLevel * 2; i++) {
      a.push(make(i / config.gui.expectedMaxSkillLevel));
    }
    // The actual lookup function
    return x => {
      return a[x];
    };
  })();
  // Text objects
  const text = {
    skillNames: [
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
    ],
    skillKeys: [
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
    ],
    skillValues: [
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
    ],
    skillPoints: TextObj(),
    score: TextObj(),
    name: TextObj(),
    class: TextObj(),
    debug: [
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
    ],
    lbtitle: TextObj(),
    leaderboard: [
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
    ],
    upgradeNames: [
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
    ],
    upgradeKeys: [
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
      TextObj(),
    ],
    skipUpgrades: TextObj(),
  };
  // The drawing loop
  return ratio => {
    //lag.set();
    let GRAPHDATA = 0;
    // Prep stuff
    renderTimes++;

    let px, py; { // Move the camera
      let motion = compensation();
      motion.set();
      let smear = {
        x: 0,
        y: 0,
      }; // moveCompensation.get();
      GRAPHDATA = motion.getPrediction();
      // Don't move the camera if you're dead. This helps with jitter issues
      player.renderx =
        motion.predict(player.lastx, player.x, player.lastvx, player.vx) +
        smear.x;
      player.rendery =
        motion.predict(player.lasty, player.y, player.lastvy, player.vy) +
        smear.y;
      //player.renderx += (desiredx - player.renderx) / 5;
      //player.rendery += (desiredy - player.rendery) / 5;
      px = ratio * player.renderx;
      py = ratio * player.rendery;
    }

    { // Clear the background + draw grid
      clearScreen(color.white, 1);
      clearScreen(color.guiblack, 0.1);

      let W = roomSetup[0].length,
        H = roomSetup.length,
        i = 0;
      roomSetup.forEach((row) => {
        let j = 0;
        row.forEach((cell) => {
          let left = Math.max(0, ratio * j * global.gameWidth / W - px + global.screenWidth / 2),
            top = Math.max(0, ratio * i * global.gameHeight / H - py + global.screenHeight / 2),
            right = Math.min(global.screenWidth, (ratio * (j + 1) * global.gameWidth / W - px) + global.screenWidth / 2),
            bottom = Math.min(global.screenHeight, (ratio * (i + 1) * global.gameHeight / H - py) + global.screenHeight / 2);
          ctx.globalAlpha = 1;
          ctx.fillStyle = (config.graphical.screenshotMode) ? color.guiwhite : color.white;
          ctx.fillRect(left, top, right - left, bottom - top);
          ctx.globalAlpha = 0.3;
          ctx.fillStyle = (config.graphical.screenshotMode) ? color.guiwhite : getZoneColor(cell, true);
          ctx.fillRect(left, top, right - left, bottom - top);
          j++;
        });
        i++;
      });
      ctx.lineWidth = 1;
      ctx.strokeStyle = (config.graphical.screenshotMode) ? color.guiwhite : color.guiblack;
      ctx.globalAlpha = 0.04;
      ctx.beginPath();
      let gridsize = 30 * ratio;
      for (let x = (global.screenWidth / 2 - px) % gridsize; x < global.screenWidth; x += gridsize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, global.screenHeight);
      }
      for (let y = (global.screenHeight / 2 - py) % gridsize; y < global.screenHeight; y += gridsize) {
        ctx.moveTo(0, y);
        ctx.lineTo(global.screenWidth, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    { // Draw things
      entities.forEach(function entitydrawingloop(instance) {
        if (!instance.render.draws) {
          return 1;
        }
        let motion = compensation();
        if (instance.render.status.getFade() === 1) {
          motion.set();
        } else {
          motion.set(instance.render.lastRender, instance.render.interval);
        }
        instance.render.x = motion.predict(instance.render.lastx, instance.x, instance.render.lastvx, instance.vx);
        instance.render.y = motion.predict(instance.render.lasty, instance.y, instance.render.lastvy, instance.vy);
        instance.render.f = (instance.id === gui.playerid && !instance.twiggle) ?
          Math.atan2(target.y, target.x) :
          motion.predictFacing(instance.render.lastf, instance.facing);
        let x = (instance.id === gui.playerid) ? 0 : ratio * instance.render.x - px,
          y = (instance.id === gui.playerid) ? 0 : ratio * instance.render.y - py;
        x += global.screenWidth / 2;
        y += global.screenHeight / 2;
        drawEntity(x, y, instance, ratio, instance.id === gui.playerid || global.showInvisible ? instance.alpha ? instance.alpha * 0.6 + 0.4 : 0.25 : instance.alpha, 1.1, instance.render.f);
      });
      if (!config.graphical.screenshotMode) {
        entities.forEach(function entityhealthdrawingloop(instance) {
          let x = (instance.id === gui.playerid) ? 0 : ratio * instance.render.x - px,
            y = (instance.id === gui.playerid) ? 0 : ratio * instance.render.y - py;
          x += global.screenWidth / 2;
          y += global.screenHeight / 2;
          drawHealth(x, y, instance, ratio);
        });
      }
    }

    // Draw GUI
    let alcoveSize = 200 / Math.max(global.screenWidth, global.screenHeight * 16 / 9);
    let spacing = 20;
    gui.__s.update();
    let lb = leaderboard.get();
    let max = lb.max;

    {
      do {
        if (!global.showTree) break;
        if (global.died) {
          global.showTree = false;
          global.scrollX = 0;
        }
        //socket.talk('[')
        let basic = mockups.find(r => r.name === "Basic");
        if (!basic) {
          console.log("No basic");
          break;
        }
        let tiles = [],
          branches = [],
          measureSize = (x, y, colorIndex, {
            index,
            tier = 0
          }) => {
            tiles.push({
              x,
              y,
              colorIndex,
              index
            });
            let {
              upgrades
            } = mockups[index];
            switch (tier) {
              case 3:
                return {
                  width: 1,
                    height: 1
                };
              case 2:
                upgrades.forEach((u, i) => measureSize(x, y + 2 + i, i, u));
                branches.push([{
                  x,
                  y
                }, {
                  x,
                  y: y + 1 + upgrades.length
                }]);
                return {
                  width: 1,
                    height: 2 + upgrades.length
                };
                //case 2:
              case 1:
              case 0: {
                let xStart = x,
                  us = upgrades.map((u, i) => {
                    let spacing = 2 * (u.tier - tier),
                      measure = measureSize(x, y + spacing, i, u);
                    branches.push([{
                        x,
                        y: y + (i === 0 ? 0 : 1)
                      },
                      {
                        x,
                        y: y + spacing
                      }
                    ]);
                    if (i + 1 === upgrades.length)
                      branches.push([{
                          x: xStart,
                          y: y + 1
                        },
                        {
                          x,
                          y: y + 1
                        }
                      ]);
                    x += measure.width;
                    return measure;
                  });
                return {
                  width: us.map(r => r.width).reduce((a, b) => a + b, 0),
                  height: 2 + Math.max(...us.map(r => r.height))
                };
              }
            }
          },
          full = measureSize(0, 0, 0, {
            index: basic.index
          }),
          tileDiv = true ? 1 : 1.25,
          tileSize =
          Math.min(
            ((global.screenWidth * 0.9) / full.width) * 55,
            (global.screenHeight * 0.9) / full.height
          ) / tileDiv,
          size = tileSize - 4;
        for (let [start, end] of branches) {
          let sx =
            global.screenWidth / 2 +
            (start.x - full.width * global.scrollX) * tileSize +
            1 +
            0.5 * size,
            sy =
            global.screenHeight / 2 +
            (start.y - full.height / 2) * tileSize +
            1 +
            0.5 * size,
            ex =
            global.screenWidth / 2 +
            (end.x - full.width * global.scrollX) * tileSize +
            1 +
            0.5 * size,
            ey =
            global.screenHeight / 2 +
            (end.y - full.height / 2) * tileSize +
            1 +
            0.5 * size;
          ctx.strokeStyle = color.black;
          ctx.lineWidth = 2;
          drawGuiLine(sx, sy, ex, ey);
        }
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = color.guiwhite;
        ctx.fillRect(0, 0, innerWidth, innerHeight);
        let text = "Use the arrow keys to navigate the class tree. Press T again to close it.";
        ctx.font = "20px Ubuntu";
        let w = ctx.measureText(text).width;
        ctx.globalAlpha = 1;
        ctx.lineWidth = 1;
        ctx.fillStyle = color.red;
        ctx.strokeStyle = color.black;
        ctx.fillText(text, (innerWidth / 2) - (w / 2), innerHeight * 0.04);
        ctx.strokeText(text, (innerWidth / 2) - (w / 2), innerHeight * 0.04);
        ctx.globalAlpha = 1;
        for (let {
            x,
            y,
            colorIndex,
            index
          } of tiles) {
          let ax =
            global.screenWidth / 2 +
            (x - full.width * global.scrollX) * tileSize,
            ay = global.screenHeight / 2 + (y - full.height / 2) * tileSize,
            size = tileSize;
          if (ax < -50 || ax + size - 50 > global.screenWidth) continue;
          ctx.globalAlpha = 0.75;
          ctx.fillStyle = getColor(10);
          drawGuiRect(ax, ay, size, size);
          ctx.globalAlpha = 0.15;
          ctx.fillStyle = getColor(0);
          drawGuiRect(ax, ay, size, size * 0.6);
          ctx.fillStyle = color.black;
          drawGuiRect(ax, ay + size * 0.6, size, size * 0.4);
          ctx.globalAlpha = 1;
          let angle = -Math.PI / 4,
            picture = getEntityImageFromMockup(index, 10),
            position = mockups[index].position,
            scale = (0.8 * size) / position.axis,
            xx =
            ax + 0.5 * size - scale * position.middle.x * Math.cos(angle),
            yy =
            ay + 0.5 * size - scale * position.middle.x * Math.sin(angle);
          drawEntity(
            xx,
            yy,
            picture,
            0.5,
            1,
            (scale / picture.size) * 2,
            angle,
            true
          );
          ctx.strokeStyle = color.black;
          ctx.globalAlpha = 1;
          ctx.lineWidth = 2;
          drawGuiRect(ax, ay, size, size, true);
        }
      } while (false);
    }

    { // Draw messages
      if (global.showTree) return;
      let vspacing = 4;
      let len = 0;
      let height = 18;
      let x = global.screenWidth / 2;
      let y = spacing;
      // Draw each message
      for (let i = messages.length - 1; i >= 0; i--) {
        let msg = messages[i],
          txt = msg.text,
          text = txt; //txt[0].toUpperCase() + txt.substring(1);
        // Give it a textobj if it doesn't have one
        if (msg.textobj == null) msg.textobj = TextObj();
        if (msg.len == null) msg.len = measureText(text, height - 4);
        // Draw the background
        ctx.globalAlpha = 0.5 * msg.alpha;
        drawBar(x - msg.len / 2, x + msg.len / 2, y + height / 2, height, color.black);
        // Draw the text
        ctx.globalAlpha = Math.min(1, msg.alpha);
     //   msg.textobj.draw(text, x, y + height / 2, height - 4, color.guiwhite, 'center', true);
           // ==================================================================================
                // Chat System.
                // ==================================================================================
                let chatColor = getColor(msg.colorIndex);
                msg.textobj.draw(text, x, y + height/2, height-4, chatColor, 'center', true);
                // ==================================================================================
        // Iterate and move
        y += (vspacing + height);
        if (msg.status > 1) {
          y -= (vspacing + height) * (1 - Math.sqrt(msg.alpha));
        }
        if (msg.status > 1) {
          msg.status -= 0.05;
          msg.alpha += 0.05;
        } else if (i === 0 && (messages.length > 5 || Date.now() - msg.time > 10000)) {
          msg.status -= 0.05;
          msg.alpha -= 0.05;
          // Remove
          if (msg.alpha <= 0) {
            messages[0].textobj.remove();
            messages.splice(0, 1);
          }
        }
      }
      ctx.globalAlpha = 1;
    }
    // ==============================================================================
        // Chat System.
        // ==============================================================================
        { // Draw chat messages
            let vspacing = 4;
            let height = 22;
            let x = 50;
            let y = (global.screenHeight / 3) + spacing;

            ctx.save();
            ctx.lineCap = 'miter';
            ctx.lineJoin = 'miter';

            // Draw each message
            for (let i = chatMessages.length - 1; i >= 0; i--) {
                let chatMessageObj = chatMessages[i];
                let playerName = chatMessageObj.playerName;
                let message = chatMessageObj.text;

                let tmpPlayerName = playerName;
                let tmpMessage = message;

                // Give it a textobj if it doesn't have one
                if (chatMessageObj.textobj == null) {
                    chatMessageObj.textobj = TextObj();
                }

                if (chatMessageObj.playerNameDrawWidth == null) {
                    chatMessageObj.playerNameDrawWidth = measureText(tmpPlayerName, height - 4);
                }

                if (chatMessageObj.messageDrawWidth == null) {
                    chatMessageObj.messageDrawWidth = measureText(tmpMessage, height - 4);
                }

                const totalDrawWidth = chatMessageObj.playerNameDrawWidth + chatMessageObj.messageDrawWidth;

                if (totalDrawWidth < 1000) {
                    // Player name.
                    const playerNameX1 = x - 4;
                    const playerNameX2 = x + chatMessageObj.playerNameDrawWidth + 4;

                    // Chat message.
                    const chatX1 = playerNameX2;// + 10;
                    const chatX2 = chatX1 + chatMessageObj.messageDrawWidth + 12;
                    ctx.globalAlpha = 1.0;
                    drawBar(chatX1, chatX2, y + height / 2, height, color.black);

                    const messageColor = getColor(chatMessageObj.colorIndex);
                    chatMessageObj.textobj.draw(tmpMessage, chatX1 + 2, y + (height / 2) + 1, height - 4, messageColor, 'left', true);

                    // Draw player name and background on top of the message.
                    ctx.globalAlpha = 0.6;
                    drawBar(playerNameX1, playerNameX2, y + height / 2, height, color.black);

                    const playerNameColor = getColor(chatMessageObj.colorIndex);
                    ctx.globalAlpha = 0.8;
                    chatMessageObj.textobj.draw(tmpPlayerName, playerNameX1, y + (height / 2) + 1, height - 4, playerNameColor, 'left', true);

                    // Iterate and move
                    y += (vspacing + height);
                }
            }
            ctx.restore();

            ctx.globalAlpha = 1;
        }
        // ==============================================================================

    
    { // Draw skill bars
      if (global.showTree) return;
      global.canSkill = !!gui.points;
      statMenu.set(0 + (global.canSkill || global.died || global.statHover));
      global.clickables.stat.hide();

      let vspacing = 4;
      let height = 15;
      let gap = 35;
      let len = alcoveSize * global.screenWidth; // The 30 is for the value modifiers
      let save = len;
      let x = -spacing - 2 * len + statMenu.get() * (2 * spacing + 2 * len);
      let y = global.screenHeight - spacing - height;
      let ticker = 11;
      let namedata = gui.getStatNames(mockups[gui.type].statnames || -1);
      gui.skills.forEach(function drawASkillBar(skill) { // Individual skill bars
        ticker--;
        let name = namedata[ticker - 1],
          level = skill.amount,
          col = color[skill.color],
          cap = skill.softcap,
          maxLevel = skill.cap;
        if (cap) {
          len = save;
          let max = config.gui.expectedMaxSkillLevel,
            extension = cap > max,
            blocking = cap < maxLevel;
          if (extension) {
            max = cap;
          }
          drawBar(x + height / 2, x - height / 2 + len * ska(cap), y + height / 2, height - 3 + config.graphical.barChunk, color.black);
          drawBar(x + height / 2, x + height / 2 + (len - gap) * ska(cap), y + height / 2, height - 3, color.grey);
          drawBar(x + height / 2, x + height / 2 + (len - gap) * ska(level), y + height / 2, height - 3.5, col);
          // Blocked-off area
          if (blocking) {
            ctx.lineWidth = 1;
            ctx.strokeStyle = color.grey;
            for (let j = cap + 1; j < max; j++) {
              drawGuiLine(
                x + (len - gap) * ska(j), y + 1.5,
                x + (len - gap) * ska(j), y - 3 + height
              );
            }
          }
          // Vertical dividers
          ctx.strokeStyle = color.black;
          ctx.lineWidth = 1;
          for (let j = 1; j < level + 1; j++) {
            drawGuiLine(
              x + (len - gap) * ska(j), y + 1.5,
              x + (len - gap) * ska(j), y - 3 + height
            );
          }
          // Skill name
          len = save * ska(max);
          let textcolor = (level == maxLevel) ? col : (!gui.points || (cap !== maxLevel && level == cap)) ? color.grey : color.guiwhite;
          text.skillNames[ticker - 1].draw(
            name,
            Math.round(x + len / 2) + 0.5, y + height / 2,
            height - 5, textcolor, 'center', true
          );
          // Skill key
          text.skillKeys[ticker - 1].draw(
            '[' + (ticker % 10) + ']',
            Math.round(x + len - height * 0.25) - 1.5, y + height / 2,
            height - 5, textcolor, 'right', true
          );
          if (textcolor === color.guiwhite) { // If it's active
            global.clickables.stat.place(ticker - 1, x, y, len, height);
          }
          // Skill value
          if (level) {
            text.skillValues[ticker - 1].draw(
              (textcolor === col) ? 'MAX' : '+' + level,
              Math.round(x + len + 4) + 0.5, y + height / 2,
              height - 5, col, 'left', true
            );
          }
          // Move on
          y -= height + vspacing;
        }
      });
      global.clickables.hover.place(0, 0, y, 0.8 * len, 0.8 * (global.screenHeight - y));
      if (gui.points !== 0) { // Draw skillpoints to spend
        text.skillPoints.draw('x' + gui.points, Math.round(x + len - 2) + 0.5, Math.round(y + height - 4) + 0.5, 20, color.guiwhite, 'right');
      }
    }

    { // Draw name, exp and score bar
      if (global.showTree) return;
      let vspacing = 4;
      let len = 1.65 * alcoveSize * global.screenWidth;
      let height = 25;
      let x = (global.screenWidth - len) / 2;
      let y = global.screenHeight - spacing - height;

      ctx.lineWidth = 1;
      // Handle exp
      // Draw the exp bar
      drawBar(x, x + len, y + height / 2, height - 3 + config.graphical.barChunk, color.black);
      drawBar(x, x + len, y + height / 2, height - 3, color.grey);
      drawBar(x, x + len * gui.__s.getProgress(), y + height / 2, height - 3.5, color.gold);
      // Draw the class type
      text.class.draw(
        'Level ' + gui.__s.getLevel() + ' ' + mockups[gui.type].name,
        x + len / 2, y + height / 2,
        height - 4, color.guiwhite, 'center', true
      );
      height = 14;
      y -= height + vspacing;
      // Draw the %-of-leader bar
      drawBar(x + len * 0.1, x + len * 0.9, y + height / 2, height - 3 + config.graphical.barChunk, color.black);
      drawBar(x + len * 0.1, x + len * 0.9, y + height / 2, height - 3, color.grey);
      drawBar(x + len * 0.1, x + len * (0.1 + 0.8 * ((max) ? Math.min(1, gui.__s.getScore() / max) : 1)), y + height / 2, height - 3.5, color.green);
      // Draw the score
      text.score.draw(
        'Score: ' + util.handleLargeNumber(gui.__s.getScore()),
        x + len / 2, y + height / 2,
        height - 2, color.guiwhite, 'center', true
      );
      // Draw the name
      ctx.lineWidth = 4;
      text.name.draw(
        player.name,
        Math.round(x + len / 2) + 0.5, Math.round(y - 10 - vspacing) + 0.5,
        32, player.nameColor, 'center'
      );
    }

    { // Draw minimap and FPS monitors
      if (global.showTree) return;
      let len = alcoveSize * global.screenWidth;
      let height = len;
      let x = global.screenWidth - len - spacing;
      let y = global.screenHeight - height - spacing;

      ctx.globalAlpha = 0.5;
      let W = roomSetup[0].length,
        H = roomSetup.length,
        i = 0;
      roomSetup.forEach((row) => {
        let j = 0;
        row.forEach((cell) => {
          ctx.fillStyle = getZoneColor(cell, false);
          drawGuiRect(x + (j++) * len / W, y + i * height / H, len / W, height / H);
        });
        i++;
      });
      ctx.fillStyle = color.grey;
      drawGuiRect(x, y, len, height);
      minimap.forEach(o => {
        if (o[2] === 17) {
          ctx.fillStyle = mixColors(getColor(o[2]), color.black, 0.5);
          ctx.globalAlpha = 0.8;
          drawGuiRect(x + (o[0] / global.gameWidth) * len, y + (o[1] / global.gameHeight) * height, 2, 2);
        } else {
          ctx.fillStyle = mixColors(getColor(o[2]), color.black, 0.5);
          ctx.lineWidth = 1;
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(x + (o[0] / global.gameWidth) * len - 1, y + (o[1] / global.gameWidth) * height - 1, 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fill();
          ctx.lineWidth = 3;
        }
      });
      ctx.globalAlpha = 1;
      ctx.lineWidth = 1;
      ctx.fillStyle = color.black;
      ctx.beginPath();
      ctx.arc(x + (player.x / global.gameWidth) * len - 1, y + (player.y / global.gameWidth) * height - 1, 3, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = color.black;
      drawGuiRect(x, y, len, height, true); // Border

      drawGuiRect(x, y - 40, len, 30);
      lagGraph(lag.get(), x, y - 40, len, 30, color.teal);
      gapGraph(metrics.rendergap, x, y - 40, len, 30, color.pink);
      timingGraph(GRAPHDATA, x, y - 40, len, 30, color.yellow);
      // Text
      text.debug[5].draw(
        'Prediction: ' + Math.round(GRAPHDATA) + 'ms',
        x + len, y - 50 - 5 * 14,
        10, color.guiwhite, 'right'
      );
      text.debug[4].draw(
        'Update Rate: ' + metrics.updatetime + 'Hz',
        x + len, y - 50 - 4 * 14,
        10, color.guiwhite, 'right'
      );
      text.debug[3].draw(
        'Latency: ' + metrics.latency + 'ms',
        x + len, y - 50 - 3 * 14,
        10, color.guiwhite, 'right'
      );
      text.debug[2].draw(
        'Client FPS: ' + metrics.rendertime,
        x + len, y - 50 - 2 * 14,
        10, color.guiwhite, 'right'
      );
      text.debug[1].draw(
        'Server Speed: ' + (100 * gui.fps).toFixed(2) + '%' + ((gui.fps === 1) ? '' : ' OVERLOADED!'),
        x + len, y - 50 - 1 * 14,
        10, (gui.fps === 1) ? color.guiwhite : color.orange, 'right'
      );
      text.debug[0].draw(
        serverName,
        x + len, y - 50,
        10, color.guiwhite, 'right'
      );
    }

    { // Draw leaderboard
      if (global.showTree) return;
      let vspacing = 4;
      let len = alcoveSize * global.screenWidth;
      let height = 14;
      let x = global.screenWidth - len - spacing;
      let y = spacing + height + 7;
      text.lbtitle.draw(
        'Leaderboard:', Math.round(x + len / 2) + 0.5,
        Math.round(y - 6) + 0.5,
        height + 4, color.guiwhite, 'center'
      );
      let i = 0;
      lb.data.forEach(entry => {
        drawBar(x, x + len, y + height / 2, height - 3 + config.graphical.barChunk, color.black);
        drawBar(x, x + len, y + height / 2, height - 3, color.grey);
        let shift = Math.min(1, entry.score / max);
        drawBar(x, x + len * shift, y + height / 2, height - 3.5, entry.barcolor);
          // ==============================================================
                // Chat System.
                // ==============================================================
                let leaderboardNameFontSize = height - 5;
                let leaderboardName = modifyOverlyLongName(entry.label, leaderboardNameFontSize, 200);
                // ==============================================================
        // Leadboard name + score
        text.leaderboard[i++].draw(
          entry.label + ': ' + util.handleLargeNumber(Math.round(entry.score)),
          x + len / 2, y + height / 2,
          height - 5, entry.nameColor, 'center', true
        );
        // Mini-image
        let scale = height / entry.position.axis,
          xx = x - 1.5 * height - scale * entry.position.middle.x * 0.707,
          yy = y + 0.5 * height + scale * entry.position.middle.x * 0.707;
        drawEntity(xx, yy, entry.image, 1 / scale, 1, scale * scale / entry.image.size, -Math.PI / 4, true);
        // Move down
        y += vspacing + height;
      });
    }

    { // Draw upgrade menu
      if (global.showTree) return;
      upgradeMenu.set(0 + (global.canUpgrade || global.upgradeHover));
      let glide = upgradeMenu.get();
      global.clickables.upgrade.hide();
      if (gui.upgrades.length > 0) {
        global.canUpgrade = true;
        var getClassUpgradeKey = function(number) {
          switch (number) {
            case 0:
              return 'y';
            case 1:
              return 'h';
            case 2:
              return 'u';
            case 3:
              return 'j';
            case 4:
              return 'i';
            case 5:
              return 'k';
            case 6:
              return 'o';
            case 7:
              return 'l';
            default:
              return "N/A";
          }
        };
        let internalSpacing = 8;
        let len = alcoveSize * global.screenWidth / 2 * 1;
        let height = len;
        let x = glide * 2 * spacing - spacing;
        let y = spacing;
        let xStart = x;
        let xo = x;
        let xxx = 0;
        let yo = y;
        let ticker = 0;
        upgradeSpin += 0.01;
        let colorIndex = 10;
        let i = 0;
        gui.upgrades.forEach(function drawAnUpgrade(model) {
          if (y > yo) yo = y;
          xxx = x;
          global.clickables.upgrade.place(i++, x, y, len, height);
          // Draw box
          ctx.globalAlpha = 0.5;
          ctx.fillStyle = getColor((colorIndex > 15 ? colorIndex - 16 : colorIndex));
          drawGuiRect(x, y, len, height);
          ctx.globalAlpha = 0.1;
          ctx.fillStyle = getColor(-10 + colorIndex++);
          drawGuiRect(x, y, len, height * 0.6);
          ctx.fillStyle = color.black;
          drawGuiRect(x, y + height * 0.6, len, height * 0.4);
          ctx.globalAlpha = 1;
          // Find offset location with rotation
          let picture = getEntityImageFromMockup(model, gui.color),
            position = mockups[model].position,
            scale = 0.6 * len / position.axis,
            xx = x + 0.5 * len - scale * position.middle.x * Math.cos(upgradeSpin),
            yy = y + 0.5 * height - scale * position.middle.x * Math.sin(upgradeSpin);
          drawEntity(xx, yy, picture, 1, 1, scale / picture.size, upgradeSpin, true);
          // Tank name
          text.upgradeNames[i - 1].draw(
            picture.name,
            x + 0.9 * len / 2, y + height - 6,
            height / 8 - 3, color.guiwhite, 'center'
          );
          // Upgrade key
          text.upgradeKeys[i - 1].draw(
            '[' + getClassUpgradeKey(ticker) + ']',
            x + len - 4, y + height - 6,
            height / 8 - 3, color.guiwhite, 'right'
          );
          ctx.strokeStyle = color.black;
          ctx.globalAlpha = 1;
          ctx.lineWidth = 3;
          drawGuiRect(x, y, len, height, true); // Border
          if (++ticker % 3 === 0) {
            x = xStart;
            y += height + internalSpacing;
          } else {
            x += glide * (len + internalSpacing);
          }
        });
        // Draw box
        let h = 14,
          msg = "Don't Upgrade",
          m = measureText(msg, h - 3) + 10;
        let xx = xo + (xxx + len + internalSpacing - xo) / 2,
          yy = yo + height + internalSpacing;
        drawBar(xx - m / 2, xx + m / 2, yy + h / 2, h + config.graphical.barChunk, color.black);
        drawBar(xx - m / 2, xx + m / 2, yy + h / 2, h, color.white);
        text.skipUpgrades.draw(msg, xx, yy + h / 2, h - 2, color.guiwhite, 'center', true);
        global.clickables.skipUpgrades.place(0, xx - m / 2, yy, m, h);
      } else {
        global.canUpgrade = false;
        global.clickables.upgrade.hide();
        global.clickables.skipUpgrades.hide();
      }
    }

    metrics.lastrender = getNow();
  };
})();

const gameDrawDead = (() => {
  let text = {
    taunt: TextObj(),
    level: TextObj(),
    score: TextObj(),
    time: TextObj(),
    kills: TextObj(),
    death: TextObj(),
    playagain: TextObj(),
  };
  let getKills = () => {
    let finalKills = [Math.round(global.finalKills[0].get()), Math.round(global.finalKills[1].get()), Math.round(global.finalKills[2].get())];
    let b = finalKills[0] + 0.5 * finalKills[1] + 3 * finalKills[2];
    return ((b === 0) ? '🌼' :
        (b < 4) ? '🎯' :
        (b < 8) ? '💥' :
        (b < 15) ? '💢' :
        (b < 25) ? '🔥' :
        (b < 50) ? '💣' :
        (b < 75) ? '👺' :
        (b < 100) ? '🌶️' : '💯') +
      ((finalKills[0] || finalKills[1] || finalKills[2]) ?
        ' ' +
        ((finalKills[0]) ? finalKills[0] + ' kills' : '') +
        ((finalKills[0] && finalKills[1]) ? ' and ' : '') +
        ((finalKills[1]) ? finalKills[1] + ' assists' : '') +
        (((finalKills[0] || finalKills[1]) && finalKills[2]) ? ' and ' : '') +
        ((finalKills[2]) ? finalKills[2] + ' visitors defeated' : '') :
        ' A true pacifist') +
      '.';
  };
  let getDeath = () => {
    let txt = '';
    if (global.finalKillers.length) {
      txt = '🔪 Succumbed to';
      global.finalKillers.forEach(e => {
        txt += ' ' + util.addArticle(mockups[e].name) + ' and';
      });
      txt = txt.slice(0, -4) + '.';
    } else {
      txt += '🤷 Well that was kinda dumb huh';
    }
    return txt;
  };
  return () => {
    clearScreen(color.black, 0.25);
    let x = global.screenWidth / 2,
      y = global.screenHeight / 2 - 50;
    let picture = getEntityImageFromMockup(gui.type, gui.color),
      len = 140,
      position = mockups[gui.type].position,
      scale = len / position.axis,
      xx = global.screenWidth / 2 - scale * position.middle.x * 0.707,
      yy = global.screenHeight / 2 - 35 + scale * position.middle.x * 0.707;
    drawEntity(xx - 190 - len / 2, yy - 10, picture, 1.5, 1, 0.5 * scale / picture.realSize, -Math.PI / 4, true);
    text.taunt.draw(
      'lol you died', x, y - 80, 8, color.guiwhite, 'center'
    );
    text.level.draw(
      'Level ' + gui.__s.getLevel() + ' ' + mockups[gui.type].name + '.',
      x - 170, y - 30, 24, color.guiwhite
    );
    text.score.draw(
      'Final score: ' + util.formatLargeNumber(Math.round(global.finalScore.get())),
      x - 170, y + 25, 50, color.guiwhite
    );
    text.time.draw(
      '⌚ Survived for ' + util.timeForHumans(Math.round(global.finalLifetime.get())) + '.',
      x - 170, y + 55, 16, color.guiwhite
    );
    text.kills.draw(
      getKills(), x - 170, y + 77, 16, color.guiwhite
    );
    text.death.draw(
      getDeath(), x - 170, y + 99, 16, color.guiwhite
    );
    text.playagain.draw(
      'Press enter to play again!', x, y + 125, 16, color.guiwhite, 'center'
    );
  };
})();

const gameDrawBeforeStart = (() => {
  let text = {
    connecting: TextObj(),
    message: TextObj(),
  };
  return () => {
    clearScreen(color.white, 0.5);
    text.connecting.draw('Connecting...', global.screenWidth / 2, global.screenHeight / 2, 30, color.guiwhite, 'center');
    text.message.draw(global.message, global.screenWidth / 2, global.screenHeight / 2 + 30, 15, color.lgreen, 'center');
  };
  let snowAmount = 1;
let aeff = 1;
let cool = 0;
let counter = 0;
let counter2 = 0;
if (snowAmount) {
  let snowCanvas = document.createElement("canvas");
  snowCanvas.style.position = "absolute";
  snowCanvas.style.top = "0";
  document.body.insertBefore(snowCanvas, document.body.firstChild);

  let ctx = snowCanvas.getContext("2d");
  let snow = [];
  let updateSnow = () => {
    if (snowCanvas.width !== window.innerWidth)
      snowCanvas.width = window.innerWidth;
    if (snowCanvas.height !== window.innerHeight)
      snowCanvas.height = window.innerHeight;
    ctx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
    for (let p of snow) {
      p.vel2++;
      p.x += p.vel * Math.cos(p.dir);
      p.y += p.vel * Math.sin(p.dir);
      let a = Math.min(1, 1 - p.y / snowCanvas.height) * 2;
      if (a > 0) {
        ctx.globalAlpha = a;
        let s = p.type
        ctx.beginPath();
        ctx.arc(p.x + (-2) * p.vel * Math.cos(p.dir), p.y + (-2) * p.vel * Math.sin(p.dir), p.r, 0, 2 * Math.PI);
        ctx.fillStyle = "#ffffff";
        ctx.lineWidth = p.r / 5;
        ctx.fill();
      } else if (
        p.x < 20 ||
        p.x > window.innerWidth + 20 ||
        p.y < -25 ||
        a < 0 ||
        global.gameStart
      ) {
        p.gone = true;
      }
    }
    if (snowAmount > Math.random()) {
      if (!global.gameStart) {
        let aeef = -1;
        let aee = snowCanvas.width * (1 - 2 * Math.random());
        if (counter % 43) counter2++;
        counter++;
        cool += aeff;
        if (counter % 1440 == 0) aeff *= -1;
        if (counter % 1 == 0 && Math.random() > 0.9) {
          for (let i = 0; i < 360; i += 360 / 1) {
            let x = snowCanvas.width / 2 + aee;
            let r = 5 + Math.floor(Math.random() * 10);
            let dir =
              Math.PI / 2 +
              (10 * (1 - 2 * Math.random()) * Math.PI) / 180 +
              (30 * Math.sin((0.3 * counter * Math.PI) / 180) * Math.PI) / 180;
            let vel = 5 + 7 * Math.random();
            let color = "#0fa";
            snow.push({
              x,
              y: aeef,
              r,
              dir,
              vel,
              color
            });
          }
        }
      }
    }
    if (global.onclose) snowCanvas.remove();
    else requestAnimationFrame(updateSnow);
  };
  setInterval(() => {
    snow = snow.filter(r => !r.gone);
  }, 2000);
  updateSnow();
}

})();

const gameDrawMockupLoad = (() => {
  let text = {
    connecting: TextObj(),
    message: TextObj(),
  };
  return () => {
    clearScreen(color.white, 0.5);
    text.connecting.draw('Loading Mockups...', global.screenWidth / 2, global.screenHeight / 2, 30, color.lgreen, 'center');
  };
})();

const gameDrawDisconnected = (() => {
  let text = {
    disconnected: TextObj(),
    message: TextObj(),
  };
  return () => {
    clearScreen(mixColors(color.red, color.guiblack, 0.3), 0.25);
    text.disconnected.draw('💀 Disconnected. 💀', global.screenWidth / 2, global.screenHeight / 2, 30, color.guiwhite, 'center');
    text.message.draw(global.message, global.screenWidth / 2, global.screenHeight / 2 + 30, 15, color.orange, 'center');
  };
})();
// ===============================================================
// Chat System.
// ===============================================================
setInterval(cleanUpChatMessages, 9000);

function cleanUpChatMessages(){
    try {
        if (chatMessages){
            if (chatMessages.length >= 8){
                while (chatMessages.length >= 8){
                    chatMessages[0].textobj.remove();
                    chatMessages.splice(0, 1);
                }
            }
            else {
                if (chatMessages.length > 0){
                    // Display chat for at most 8 seconds.
                    if (Date.now() - chatMessages[0].time >= 8000){
                        chatMessages[0].textobj.remove();
                        chatMessages.splice(0, 1);
                    }
                }
            }
        }
    }
    catch (error){
        console.log('[cleanUpChatMessages()]');
        console.log(error);
    }
}
// ===============================================================
// The main function
function animloop() {
  global.animLoopHandle = window.requestAnimFrame(animloop);
  player.renderv += (player.view - player.renderv) / 30;
  var ratio = (config.graphical.screenshotMode) ? 2 : getRatio();
  // Set the drawing style
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.filter = 'none';
  // Draw the game
  if (global.gameStart && !global.disconnected) {
    global.time = getNow();
    if (global.time - lastPing > 1000) { // Latency
      // Do ping.
      global.socket.ping(global.time);
      lastPing = global.time;
      // Do rendering speed.
      metrics.rendertime = renderTimes;
      renderTimes = 0;
      // Do update rate.
      metrics.updatetime = updateTimes;
      updateTimes = 0;
    }
    metrics.lag = global.time - player.time;
  }
  if (global.gameStart) {
    gameDraw(ratio);
  } else if (!global.disconnected) {
    gameDrawBeforeStart();
  }
  if (global.died) {
    gameDrawDead();
  }
  if (global.disconnected) {
    gameDrawDisconnected();
  }
  if (global.mockupError) {
    gameDrawMockupLoad();
  }
  global.mockupError = false;
}


let snowAmount = 1;
let aeff = 1;
let cool = 0;
let counter = 0;
let counter2 = 0;
if (snowAmount) {
  let snowCanvas = document.createElement("canvas");
  snowCanvas.style.position = "absolute";
  snowCanvas.style.top = "0";
  document.body.insertBefore(snowCanvas, document.body.firstChild);

  let ctx = snowCanvas.getContext("2d");
  let snow = [];
  let updateSnow = () => {
    if (snowCanvas.width !== window.innerWidth)
      snowCanvas.width = window.innerWidth;
    if (snowCanvas.height !== window.innerHeight)
      snowCanvas.height = window.innerHeight;
    ctx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
    for (let p of snow) {
      p.vel2++;
      p.x += p.vel * Math.cos(p.dir);
      p.y += p.vel * Math.sin(p.dir);
      let a = Math.min(1, 1 - p.y / snowCanvas.height) * 2;
      if (a > 0) {
        ctx.globalAlpha = a;
        let s = p.type
        ctx.beginPath();
        ctx.arc(p.x + (-2) * p.vel * Math.cos(p.dir), p.y + (-2) * p.vel * Math.sin(p.dir), p.r, 0, 2 * Math.PI);
        ctx.fillStyle = "#ffffff";
        ctx.lineWidth = p.r / 5;
        ctx.fill();
      } else if (
        p.x < 20 ||
        p.x > window.innerWidth + 20 ||
        p.y < -25 ||
        a < 0 ||
        global.gameStart
      ) {
        p.gone = true;
      }
    }
    if (snowAmount > Math.random()) {
      if (!global.gameStart) {
        let aeef = -1;
        let aee = snowCanvas.width * (1 - 2 * Math.random());
        if (counter % 43) counter2++;
        counter++;
        cool += aeff;
        if (counter % 1440 == 0) aeff *= -1;
        if (counter % 1 == 0 && Math.random() > 0.9) {
          for (let i = 0; i < 360; i += 360 / 1) {
            let x = snowCanvas.width / 2 + aee;
            let r = 5 + Math.floor(Math.random() * 10);
            let dir =
              Math.PI / 2 +
              (10 * (1 - 2 * Math.random()) * Math.PI) / 180 +
              (30 * Math.sin((0.3 * counter * Math.PI) / 180) * Math.PI) / 180;
            let vel = 5 + 7 * Math.random();
            let color = "#0fa";
            snow.push({
              x,
              y: aeef,
              r,
              dir,
              vel,
              color
            });
          }
        }
      }
    }
    if (global.gameStart) snowCanvas.remove();
    else requestAnimationFrame(updateSnow);
  };
  setInterval(() => {
    snow = snow.filter(r => !r.gone);
  }, 2000);
  updateSnow();
}
