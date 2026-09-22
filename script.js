const tables = [
  20000,30000,40000,50000,50000,
  60000,70000,80000,90000,100000
];

let wallet = 1000000;
let currentTable = null;
let bank = 0;
let round = 1;
let players = [];
let cards = [];

const deck = ["6","7","8","9","10","J","Q","K","A"];

const $ = id => document.getElementById(id);
const money = n => n.toLocaleString("fa-IR");

function renderTables(){
  $("tables").innerHTML = tables.map((base,i)=>{
    const min = base*4;
    const allowed = wallet >= min;
    return `
      <article class="table-card">
        <h3>میز ${i+1}</h3>
        <div class="amount">${money(base)} تومان</div>
        <div class="meta">
          حداقل موجودی: ${money(min)} تومان<br>
          ظرفیت: ۲ تا ۶ نفر
        </div>
        <button class="join" ${allowed ? "" : "disabled"} onclick="joinTable(${i})">
          ${allowed ? "ورود به میز" : "موجودی کافی نیست"}
        </button>
      </article>`;
  }).join("");
  $("wallet").textContent = money(wallet);
}

function joinTable(index){
  currentTable=index;
  const base=tables[index];
  bank=base*3;
  round=1;
  cards=[];
  players=[{name:"شما",banker:true}];
  $("modalTitle").textContent=`میز ${index+1}`;
  $("tableInfo").textContent=`مبلغ پایه: ${money(base)} تومان | بانکت اولیه: ${money(bank)} تومان`;
  $("modal").classList.remove("hidden");
  renderGame();
  log("میز باز شد. در نسخه نهایی، انتخاب بانکدار با قرعه Ace انجام می‌شود.");
}

function renderGame(){
  $("bankAmount").textContent=money(bank);
  $("playerList").innerHTML=players.map((p,i)=>
    `<li>${p.name} ${p.banker ? "👑 بانکدار" : ""}</li>`).join("");
}

function log(msg){
  $("gameLog").innerHTML = msg + "<br>" + $("gameLog").innerHTML;
}

function drawCard(){
  const card=deck[Math.floor(Math.random()*deck.length)];
  cards.push(card);
  log(`کارت بعدی: <strong>${card}</strong>`);
}

$("bankBtn").onclick=()=>{
  log("بانکت انتخاب شد؛ بازیکن باید کارت بعدی را درخواست کند.");
};
$("nextCardBtn").onclick=drawCard;

$("reduceBtn").onclick=()=>{
  if(!currentTable && currentTable!==0)return;
  const base=tables[currentTable];
  const input=prompt(`مبلغ کم و کسر را وارد کنید (حداکثر ${money(bank)} تومان):`);
  const amount=Number(String(input||"").replaceAll(",",""));
  if(!amount || amount<0 || amount>bank){
    log("مبلغ کم و کسر معتبر نیست.");
    return;
  }
  bank-=amount;
  wallet+=amount;
  log(`بانکدار ${money(amount)} تومان کم و کسر کرد.`);
  renderGame(); renderTables();
};

$("nextRoundBtn").onclick=()=>{
  round++;
  if(round>3){
    log("۳ دور بانکداری تمام شد؛ در نسخه نهایی نفر بعدی بانکدار می‌شود.");
    round=1;
  }else{
    log(`دور ${round} شروع شد.`);
  }
};

$("closeModal").onclick=()=>$("modal").classList.add("hidden");
$("modal").addEventListener("click",e=>{
  if(e.target===$("modal")) $("modal").classList.add("hidden");
});

renderTables();
