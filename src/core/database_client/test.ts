import Sync from "sync";

function aSync () {
  return 5;
}

console.log(Sync.sync(aSync()));
