// from https://www.linuxscrew.com/javascript-hash-string
function generateHash(str, algorithm = "SHA-512") {
  // Create an array buffer for the supplied string - this buffer contains an integer representation of the string which can be used to generate the hash
  let strBuffer = new TextEncoder().encode(str);
  // use SubtleCrypto to generate the hash using the specified algorithm
  return crypto.subtle.digest(algorithm, strBuffer)
      .then(hash => {
          // The resulting hash is an arrayBuffer, and should be converted to its hexadecimal representation
          // Initialize the result as an empty string - the hexadecimal characters for the values in the array buffer will be appended to it
          let result = '';
          // The DataView view provides an interface for reading number types from the ArrayBuffer
          const view = new DataView(hash);
          // Iterate over each value in the arrayBuffer and append the converted hexadecimal value to the result
          for (let i = 0; i < hash.byteLength; i += 4) {
              result += ('00000000' + view.getUint32(i).toString(16)).slice(-8);
          }
          return result;
      });
}

answers = ["7728450b5400b9d6c7d74e5c86fe626b0748c13e64d2b1f7c1a88d6b2dd6c0c5bf36cff8c066eb2c3dc094347cfc47e86d0e09b1c39bda759ff3779f88e4e8ef",
  "29c065394f6d14e13e3b6d7c59c3988eb6c7631189050dac48cf1c3cd832d4fadee23581de7342fe194572ec22b73feedb6c5cad75d44fb8ec84a6b86da08a53",
  "eb34c931ea857dce82abffd824808c9e39218bd04a384e7cfc202fe4960d9d39205fc5c413af67786135b7c2a66dc976e01ebe4c94edc83e80719ab8ce3a7b16",
  "b0e72bcb4b6320f869f6360cee333589354c2470b346d9e84a28cf648fd1dcfb4dcb675633c9ca297ff80bc7bfc9af1de7343a9fb99f5245d4d02529698041ee"
];
salts = ["here is the first salt! :)",
  "and another salt!!! so salty!!",
  "crazy that this is still the same security properties",
  "and finally, the last salt <3"
];

master_salt = "another salt for a masterpass";
master_pass = "6843b9b6759769bfe8276c5c962a8aac46d8d75b66f2045e29052040be17b255bd32d68a8d16ec088fb7860e8da301de868ae284f2b519be2b3de4d33412dd07";

puzzes = ['<p class="congrats">CONGRATS! You solved the first puzzle! Excellent work! :*</p><h3>Puzzle <sup>2</sup>&frasl;<sub>4</sub></h3><p>New puzzle - function time!</p><p class="math">|x| - 0.802 for |x| &lt; 1<br>|<sup>1</sup>&frasl;<sub>2</sub> sin(πx)| + 0.198 for |x| &lt 1</p><p> Answer: <input type="text" id="2" value="answer 2"/></p>',
  '<p class="congrats">Another fantastic job! You are becoming very good at these!<br><br>Mini-prize: more graphs! Highly don\'t recommend doing these in your head but I will be very impressed when you do :P</p><p class="congrats math">r &le; cos(4.2&#952;)<br>r &le; 0.5*cos(3.5&#952;)<br><br>x = 0 for -2 &lt y &lt -0.95<br>x<sup>2</sup> - 2 for |x| &lt; 1<br>-(x - 1)<sup>2</sup> - 1 for 0 &lt; x &lt; 1<br>-(x + 1)<sup>2</sup> - 1 for -1 &lt; x &lt; 0</p><h3>Puzzle <sup>3</sup>&frasl;<sub>4</sub></h3><p>Hot Springs, Yellowstone, Yosemite, Grand Canyon, Glacier, Olympic, Hawaii volcanoes, Denali, Great Basin, Great Smoky Mountains, Shenandoah, Arches, Great Sand Dunes, Everglades, Theodore Roosevelt, Voyageurs, American Samoa.</p><p> Answer:<input type="text" id="3" value="answer 3"/></p>',
  '<p class="congrats">Heheheh! Almost there!!</p><p class="center congrats">┏(･o･)┛ ♪ ┗ (･o･) ┓ ♪ ┏(･o･)┛ ♪ ┗ (･o･) ┓</p><p class="congrats">Dancing guy! Positive reinforcement!!</p><h3>Puzzle <sup>4</sup>&frasl;<sub>4</sub></h3><p>Another puzzle! This time with a visual aid!</p><p><img src="image.png"></p><p> Answer: <input type="text" id="4" value="answer 4"/></p>',
  '<h4 id="win">YOU WIN!! <3 <br>There is currently no prize, feel free to think of something you\'d like ;)</h4>'
]




function answerIn(event) {
  let current = document.getElementById(event.target.id);
  let id = Number(event.target.id);

  generateHash(current.value.trim().toLowerCase() + salts[id - 1]).then(hash => {
      // if the hash is correct, reveal the next puzzle
      if (hash == answers[id - 1]) {
          var myDiv = document.createElement("div");
          myDiv.innerHTML = puzzes[id - 1];
          if (puzzes[id - 1] != '') document.body.appendChild(myDiv);
          puzzes[id - 1] = '';

          // add new event listener
          if (id < 4) {
              document.getElementById(String(id + 1)).addEventListener("input", answerIn, true);
          }
      }
  });

  // check mater password, override and print everything
  generateHash(current.value.trim().toLowerCase() + master_salt).then(hash => {
      console.log(hash)
      if (hash == master_pass) {
          for (let i = 0; i < 4; i++) {
              var myDiv = document.createElement("div");
              myDiv.innerHTML = puzzes[i];
              if (puzzes[i] != '') document.body.appendChild(myDiv);
              puzzes[i] = '';
          }
      }
  });
}

document.getElementById("1").addEventListener("input", answerIn, true);
