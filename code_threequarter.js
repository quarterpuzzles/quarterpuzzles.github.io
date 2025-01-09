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

answers = ["91dbfed309b2e2db32cd2d52ac02d954f20d949e93568748ee994e2e7922d2d1ac9e804e3ffd8be2f00e84d1c5ad4d8797100c89fb012ae8c360752752277314",
  "2559977c566ffee9fd4077ab5c6bb86f61d12114bac9a6611e0bdfbb12ad0942b78285eb3bf97be41dfe5c933310bd365d641cb2563856f37cd2784ae60c2bf4",
  "327493e2ac2ee1aed3268f1586b3757eb3db2289c1ad201fd348bb3cc49ba5e64563eb6f810874654db89d3abeec0ab33699bdb6b000a14f24d5d5e3a7e9237d"
];
salts = ["one day I will remember to show these to you darling",
  "they are silly",
  "but they make me laugh"
];

master_salt = "another salt for a masterpass";
master_pass = "6843b9b6759769bfe8276c5c962a8aac46d8d75b66f2045e29052040be17b255bd32d68a8d16ec088fb7860e8da301de868ae284f2b519be2b3de4d33412dd07";

puzzes = ['<p class="congrats">CONGRATS! and you definately already are, this is just the funniest combonations of these letters I could find besides the obvious: moom. </p><div><h3>Puzzle <sup>2</sup>&frasl;<sub>3</sub></h3><p>Hi love, we are back to math puzzles after 6 months off :)</p><p class="math">x<sup>4</sup> - 54x<sup>3</sup> + 1019x<sup>2</sup> - 7830x + 19800.75</p><p> Answer: <input type="text" id="2" value="answer 2"/></div>',
  '<p class="congrats">Hiiii!! You are doing great! Please please say you did not do this one in your head</p><div><h3>Puzzle <sup>3</sup>&frasl;<sub>3</sub></h3><p><table><tbody><tr><td></td><td>APEX</td><td>BACH</td><td>SILK</td><td></td></tr><tr><td>SING</td><td></td><td></td><td></td><td>PAIR</td></tr><tr><td>AIŌN</td><td></td><td>🌓</td><td></td><td>HYPE</td></tr><tr><td>CUTE</td><td></td><td></td><td></td><td>FAST</td></tr><tr><td></td><td>YOGA</td><td>WINK</td><td>COIL</td><td></td></tr></tbody></table></p><p> Answer: <input type="text" id="3" value="answer 3"/></div>',
  '<h4 id="win">YOU WIN!! <br>Your prize is: so so much love &lt3</h4>'
]




function answerIn(event) {
  let current = document.getElementById(event.target.id);
  let id = Number(event.target.id);

  generateHash(current.value.trim().toLowerCase() + salts[id - 1]).then(hash => {
    console.log(hash)
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