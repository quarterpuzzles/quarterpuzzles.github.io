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

answers = ["fa028af5b8dea224e94d9b7ea1963805c875111cbe3421aea38dd49780623923ebd3049ccd1a798afb92dfbd26d0a33a30012dd468044250adfc1a42b22e50e1",
  "68396ffe556e71d175f35e0fc8f0eac545ac23b845071e7b3b7c85032ad25e457fedd7f2863a49af4d70eb88645942705a6b4c7a7a2e6ce428028dad9818882d"
];
salts = ["back on my bullshit: salting these as if",
  "there is any chance you will check a hacking dictionary",
];

master_salt = "another salt for a masterpass";
master_pass = "6843b9b6759769bfe8276c5c962a8aac46d8d75b66f2045e29052040be17b255bd32d68a8d16ec088fb7860e8da301de868ae284f2b519be2b3de4d33412dd07";

puzzes = ['<p class="congrats">FIRST SOLVE!! Halfway there!</p><h3>Puzzle <sup>2</sup>&frasl;<sub>2</sub></h3><p id = "connections"><iframe width="560" height="890" src="https://connections.swellgarfo.com/game/-O8e8G5BI3eJ8YWPIxH_" frameborder="0" allowfullscreen></iframe></p><p> Answer:<input type="text" id="2" value="answer 2"/></p>',
  '<h4 id="win">YOU WIN!! <3 <br>Because we are hopefully still in person, the prize is kisses: mwah!</h4>'
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