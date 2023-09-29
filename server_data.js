let data = {
"gateway_event_messages": {
"welcome_message": "[user] has joined! Welcome him in #general. We now have [members] members.",
"leave_message": "[user] has left! :( We now have [members] members."
}, 
  "server_settings": {
    "toggle_welcome_msg": true
  }
};

let accounts = {
"attacker": {
"username": "attacker",
"hash": "1FA05D80B876250379EFA51404C9C7F78B51E54022D40B6AF9ED3F0E296E475D"
  }
};
let usernames = ["attacker"];
module.exports = data;
module.exports.accounts = accounts;
module.exports.usernames = usernames;