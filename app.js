const DB_NAME = "FrenchTrainerV1";
const DB_VERSION = 1;
const WORD_STORE = "words";
const META_STORE = "meta";

let db;
let words = [];
let state = { sessions: [], settings: { dailyNew: 10 }, categories: [] };
let currentSession = [];
let currentIndex = 0;
let currentExercise = null;
let currentFilter = "Todas";

const seed = [
  ["de","de, desde","Función"],["la","la","Función"],["et","y","Conector"],["le","el","Función"],["les","los, las","Función"],
  ["des","unos, unas","Función"],["à","a, en","Función"],["un","un, uno","Función"],["une","una","Función"],["en","en, dentro de","Función"],
  ["du","del","Función"],["que","que","Conector"],["qui","quien, que","Conector"],["dans","en, dentro de","Función"],["pour","para","Función"],
  ["pas","no","Función"],["sur","sobre, encima de","Función"],["avec","con","Función"],["ne","no","Función"],["se","se","Función"],
  ["ce","este, esto","Demostrativos"],["il","él","Pronombre"],["elle","ella","Pronombre"],["nous","nosotros","Pronombre"],["vous","vosotros, usted","Pronombre"],
  ["ils","ellos","Pronombre"],["elles","ellas","Pronombre"],["je","yo","Pronombre"],["tu","tú","Pronombre"],["me","me","Pronombre"],
  ["mon","mi","Posesivos"],["ton","tu","Posesivos"],["son","su","Posesivos"],["notre","nuestro","Posesivos"],["votre","vuestro, su","Posesivos"],
  ["leur","su, de ellos","Posesivos"],["ceci","esto","Demostrativos"],["cela","eso","Demostrativos"],["ça","eso, esto","Demostrativos"],["mais","pero","Conector"],
  ["ou","o","Conector"],["donc","por tanto","Conector"],["car","porque","Conector"],["comme","como","Conector"],["si","si","Conector"],
  ["oublier","olvidar","Verbos"],["être","ser, estar","Verbos"],["avoir","tener, haber","Verbos"],["faire","hacer","Verbos"],["aller","ir","Verbos"],
  ["venir","venir","Verbos"],["pouvoir","poder","Verbos"],["devoir","deber","Verbos"],["vouloir","querer","Verbos"],["savoir","saber","Verbos"],
  ["dire","decir","Verbos"],["voir","ver","Verbos"],["prendre","tomar, coger","Verbos"],["donner","dar","Verbos"],["mettre","poner","Verbos"],
  ["parler","hablar","Verbos"],["aimer","amar, gustar","Verbos"],["penser","pensar","Verbos"],["trouver","encontrar","Verbos"],["passer","pasar","Verbos"],
  ["regarder","mirar","Verbos"],["demander","preguntar, pedir","Verbos"],["répondre","responder","Verbos"],["comprendre","comprender","Verbos"],["connaître","conocer","Verbos"],
  ["croire","creer","Verbos"],["vivre","vivir","Verbos"],["arriver","llegar, suceder","Verbos"],["partir","partir, irse","Verbos"],["sortir","salir","Verbos"],
  ["tenir","sostener","Verbos"],["laisser","dejar","Verbos"],["rester","quedarse","Verbos"],["porter","llevar","Verbos"],["entrer","entrar","Verbos"],
  ["travailler","trabajar","Verbos"],["écrire","escribir","Verbos"],["lire","leer","Verbos"],["boire","beber","Verbos"],["manger","comer","Verbos"],
  ["grand","grande","Adjetivos"],["petit","pequeño","Adjetivos"],["bon","bueno","Adjetivos"],["mauvais","malo","Adjetivos"],["beau","bonito","Adjetivos"],
  ["nouveau","nuevo","Adjetivos"],["vieux","viejo","Adjetivos"],["jeune","joven","Adjetivos"],["long","largo","Adjetivos"],["court","corto","Adjetivos"],
  ["premier","primero","Adjetivos"],["dernier","último","Adjetivos"],["même","mismo","Adjetivos"],["autre","otro","Adjetivos"],["tout","todo","Adjetivos"],
  ["chaque","cada","Determinantes"],["quel","qué, cuál","Interrogativos"],["quelque","algún","Determinantes"],["beaucoup","mucho","Adverbios"],["plus","más","Adverbios"],
  ["moins","menos","Adverbios"],["très","muy","Adverbios"],["bien","bien","Adverbios"],["mal","mal","Adverbios"],["aussi","también","Adverbios"],
  ["encore","todavía, otra vez","Adverbios"],["déjà","ya","Adverbios"],["toujours","siempre","Adverbios"],["jamais","nunca","Adverbios"],["souvent","a menudo","Adverbios"],
  ["ici","aquí","Adverbios"],["là","ahí, allí","Adverbios"],["maintenant","ahora","Adverbios"],["aujourd'hui","hoy","Tiempo"],["demain","mañana","Tiempo"],
  ["hier","ayer","Tiempo"],["temps","tiempo","Sustantivos"],["jour","día","Sustantivos"],["an","año","Sustantivos"],["année","año","Sustantivos"],
  ["fois","vez","Sustantivos"],["heure","hora","Sustantivos"],["moment","momento","Sustantivos"],["homme","hombre","Sustantivos"],["femme","mujer","Sustantivos"],
  ["enfant","niño, niña","Sustantivos"],["personne","persona","Sustantivos"],["gens","gente","Sustantivos"],["ami","amigo","Sustantivos"],["maison","casa","Sustantivos"],
  ["ville","ciudad","Sustantivos"],["pays","país","Sustantivos"],["monde","mundo","Sustantivos"],["vie","vida","Sustantivos"],["chose","cosa","Sustantivos"],
  ["nom","nombre","Sustantivos"],["main","mano","Sustantivos"],["tête","cabeza","Sustantivos"],["œil","ojo","Sustantivos"],["eau","agua","Sustantivos"],
  ["pain","pan","Sustantivos"],["vin","vino","Sustantivos"],["café","café","Sustantivos"],["argent","dinero","Sustantivos"],["travail","trabajo","Sustantivos"],
  ["école","escuela","Sustantivos"],["livre","libro","Sustantivos"],["question","pregunta","Sustantivos"],["réponse","respuesta","Sustantivos"],["problème","problema","Sustantivos"],
  ["idée","idea","Sustantivos"],["besoin","necesidad","Sustantivos"],["raison","razón","Sustantivos"],["exemple","ejemplo","Sustantivos"],["partie","parte","Sustantivos"],
  ["après","después","Tiempo"],["avant","antes","Tiempo"],["pendant","durante","Tiempo"],["depuis","desde","Tiempo"],["entre","entre","Función"],
  ["sans","sin","Función"],["sous","debajo de","Función"],["chez","en casa de, donde","Función"],["vers","hacia","Función"],["contre","contra","Función"],
  ["après","después","Tiempo"],["avant","antes","Tiempo"],["quand","cuando","Conector"],["comment","cómo","Interrogativos"],["pourquoi","por qué","Interrogativos"],
  ["où","dónde","Interrogativos"],["quoi","qué","Interrogativos"],["combien","cuánto","Interrogativos"],["est-ce que","es que","Función"],["oui","sí","Básico"],
  ["non","no","Básico"],["merci","gracias","Básico"],["bonjour","hola, buenos días","Básico"],["bonsoir","buenas tardes/noches","Básico"],["salut","hola, adiós","Básico"],
  ["au revoir","adiós","Básico"],["s'il vous plaît","por favor","Básico"],["excusez-moi","perdone","Básico"],["pardon","perdón","Básico"],["bien sûr","por supuesto","Básico"],
  ["peut-être","quizá","Adverbios"],["vraiment","realmente","Adverbios"],["presque","casi","Adverbios"],["seulement","solamente","Adverbios"],["ensemble","juntos","Adverbios"],
  ["vite","rápido","Adverbios"],["tard","tarde","Tiempo"],["tôt","temprano","Tiempo"],["beaucoup","mucho","Adverbios"],["assez","bastante","Adverbios"],
  ["falloir","hacer falta","Verbos"],["croire","creer","Verbos"],["sembler","parecer","Verbos"],["devenir","convertirse","Verbos"],["commencer","empezar","Verbos"],
  ["finir","terminar","Verbos"],["jouer","jugar","Verbos"],["utiliser","utilizar","Verbos"],["essayer","intentar","Verbos"],["sentir","sentir","Verbos"],
  ["suivre","seguir","Verbos"],["entendre","oír, entender","Verbos"],["écouter","escuchar","Verbos"],["apprendre","aprender","Verbos"],["enseigner","enseñar","Verbos"],
  ["ouvrir","abrir","Verbos"],["fermer","cerrar","Verbos"],["acheter","comprar","Verbos"],["vendre","vender","Verbos"],["payer","pagar","Verbos"],
  ["chercher","buscar","Verbos"],["attendre","esperar","Verbos"],["rendre","devolver, hacer","Verbos"],["perdre","perder","Verbos"],["gagner","ganar","Verbos"],
  ["conduire","conducir","Verbos"],["dormir","dormir","Verbos"],["courir","correr","Verbos"],["marcher","caminar, funcionar","Verbos"],["montrer","mostrar","Verbos"],
  ["apporter","traer","Verbos"],["raconter","contar","Verbos"],["décider","decidir","Verbos"],["changer","cambiar","Verbos"],["continuer","continuar","Verbos"],
  ["important","importante","Adjetivos"],["possible","posible","Adjetivos"],["impossible","imposible","Adjetivos"],["facile","fácil","Adjetivos"],["difficile","difícil","Adjetivos"],
  ["vrai","verdadero","Adjetivos"],["faux","falso","Adjetivos"],["seul","solo","Adjetivos"],["plein","lleno","Adjetivos"],["libre","libre","Adjetivos"],
  ["fort","fuerte","Adjetivos"],["faible","débil","Adjetivos"],["propre","propio, limpio","Adjetivos"],["meilleur","mejor","Adjetivos"],["mieux","mejor","Adverbios"],
  ["grandir","crecer","Verbos"],["venir de","acabar de","Verbos"],["être en train de","estar haciendo","Verbos"],["avoir besoin de","necesitar","Verbos"],["avoir envie de","tener ganas de","Verbos"]
];

function makeSeedWords() {
  // The first V1 includes a representative core. The app supports importing a full 1000-word CSV.
  // To keep the starter lightweight, repeated seed entries are removed.
  const seen = new Set();
  return seed.map((x, i) => ({id: "seed-"+i, word:x[0], translation:x[1], category:x[2], status:"new", recognition:0, production:0, repetitions:0, correct:0, incorrect:0, lastReview:null, nextReview:null}))
    .filter(w => { if(seen.has(w.word)) return false; seen.add(w.word); return true; });
}

function reqToPromise(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function initDB() {
  db = await new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = e => {
      const d = e.target.result;
      if (!d.objectStoreNames.contains(WORD_STORE)) d.createObjectStore(WORD_STORE, {keyPath:"id"});
      if (!d.objectStoreNames.contains(META_STORE)) d.createObjectStore(META_STORE, {keyPath:"key"});
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  const storedWords = await reqToPromise(db.transaction(WORD_STORE,"readonly").objectStore(WORD_STORE).getAll());
  const storedState = await reqToPromise(db.transaction(META_STORE,"readonly").objectStore(META_STORE).get("state"));
  if (!storedWords.length) {
    words = makeSeedWords();
    await saveAllWords();
  } else words = storedWords;
  if (storedState?.value) state = storedState.value;
  updateUI();
}

async function saveAllWords() {
  const tx = db.transaction(WORD_STORE,"readwrite");
  const store = tx.objectStore(WORD_STORE);
  words.forEach(w => store.put(w));
  await new Promise((resolve,reject)=>{tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});
}
async function saveState() {
  const tx = db.transaction(META_STORE,"readwrite");
  tx.objectStore(META_STORE).put({key:"state",value:state});
  await new Promise((resolve,reject)=>{tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  document.querySelectorAll(".nav-item").forEach(n => n.classList.toggle("active", n.dataset.screen === id));
  if(id === "vocabularyScreen") renderVocabulary();
  if(id === "progressScreen") renderProgress();
  if(id === "homeScreen") updateUI();
}

function todayKey() { return new Date().toISOString().slice(0,10); }
function isDue(w) { return !w.nextReview || new Date(w.nextReview) <= new Date(); }
function studiedToday() { return state.sessions.filter(s=>s.date===todayKey()).reduce((a,s)=>a+s.count,0); }
function allReviews() { return words.reduce((a,w)=>a+w.repetitions,0); }
function allCorrect() { return words.reduce((a,w)=>a+w.correct,0); }
function allIncorrect() { return words.reduce((a,w)=>a+w.incorrect,0); }

function updateUI() {
  const learned = words.filter(w=>w.status==="mastered").length;
  const due = words.filter(w=>isDue(w) && w.repetitions>0).length;
  document.getElementById("learnedCount").textContent = learned;
  document.getElementById("overallProgress").style.width = `${Math.min(100, learned/Math.max(words.length,1)*100)}%`;
  document.getElementById("progressText").textContent = `${learned} / ${words.length}`;
  document.getElementById("todayStudied").textContent = studiedToday();
  document.getElementById("dueCount").textContent = due;
  const c=allCorrect(), i=allIncorrect();
  document.getElementById("accuracy").textContent = c+i ? Math.round(c/(c+i)*100)+"%" : "—";
  document.getElementById("streak").textContent = calculateStreak();
}

function calculateStreak() {
  const days = new Set(state.sessions.map(s=>s.date));
  let streak=0, d=new Date();
  while(days.has(d.toISOString().slice(0,10))) {
    streak++;
    d.setDate(d.getDate()-1);
  }
  return streak;
}

function renderVocabulary() {
  const q = document.getElementById("searchInput").value.toLowerCase().trim();
  const cats = ["Todas", ...new Set(words.map(w=>w.category).filter(Boolean))];
  document.getElementById("categoryFilters").innerHTML = cats.map(c=>`<button class="chip ${currentFilter===c?"active":""}" data-cat="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join("");
  document.querySelectorAll(".chip").forEach(b=>b.onclick=()=>{currentFilter=b.dataset.cat;renderVocabulary();});
  const list = words.filter(w => (currentFilter==="Todas" || w.category===currentFilter) && (!q || `${w.word} ${w.translation}`.toLowerCase().includes(q)));
  document.getElementById("vocabularyList").innerHTML = list.map(w=>`
    <div class="word">
      <div><strong>${escapeHtml(w.word)}</strong><small>${escapeHtml(w.translation)}</small></div>
      <span class="status">${statusLabel(w.status)}</span>
    </div>`).join("") || `<div class="card muted">No hay palabras que coincidan.</div>`;
}
function statusLabel(s){ return ({new:"Nueva",learning:"Aprendiendo",familiar:"Familiar",mastered:"Dominada"})[s]||s; }
function escapeHtml(x){ return String(x).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m])); }

function startSession(review=false) {
  let pool = review ? words.filter(w=>isDue(w)) : words.filter(w=>w.status==="new");
  if(review) pool = pool.filter(w=>w.repetitions>0).sort((a,b)=>(new Date(a.nextReview)-new Date(b.nextReview)));
  else pool = pool.slice(0, Math.max(10,state.settings.dailyNew||10));
  if(!pool.length) {
    alert(review ? "No tienes palabras pendientes de repaso." : "No tienes palabras nuevas. Añade o importa vocabulario.");
    return;
  }
  currentSession = shuffle(pool).slice(0,10);
  currentIndex = 0;
  document.getElementById("exerciseMode").textContent = review ? "Repaso" : "Aprendizaje";
  showScreen("exerciseScreen");
  renderExercise();
}

function shuffle(arr){ return [...arr].sort(()=>Math.random()-0.5); }

function renderExercise() {
  if(currentIndex >= currentSession.length){ finishSession(); return; }
  const w=currentSession[currentIndex];
  const mode = currentIndex%3===0 ? "mc" : currentIndex%3===1 ? "reverse" : "write";
  currentExercise={word:w,mode};
  document.getElementById("exerciseCounter").textContent=`${currentIndex+1} / ${currentSession.length}`;
  document.getElementById("sessionProgress").style.width=`${currentIndex/currentSession.length*100}%`;
  const card=document.getElementById("exerciseCard");
  document.getElementById("feedback").classList.add("hidden");

  if(mode==="mc"){
    const distractors=shuffle(words.filter(x=>x.id!==w.id)).slice(0,3).map(x=>x.translation);
    const options=shuffle([w.translation,...distractors]);
    card.innerHTML=`<div class="prompt-label">¿Qué significa?</div><div class="prompt">${escapeHtml(w.word)}</div><div class="options">${options.map(o=>`<button class="option" data-answer="${escapeHtml(o)}">${escapeHtml(o)}</button>`).join("")}</div>`;
    card.querySelectorAll(".option").forEach(b=>b.onclick=()=>answer(b.dataset.answer,w.translation));
  } else if(mode==="reverse"){
    card.innerHTML=`<div class="prompt-label">¿Cómo se dice en francés?</div><div class="prompt">${escapeHtml(w.translation)}</div><div class="options">${shuffle(words.filter(x=>x.id!==w.id)).slice(0,3).concat(w).sort(()=>Math.random()-.5).map(x=>`<button class="option" data-answer="${escapeHtml(x.word)}">${escapeHtml(x.word)}</button>`).join("")}</div>`;
    card.querySelectorAll(".option").forEach(b=>b.onclick=()=>answer(b.dataset.answer,w.word));
  } else {
    card.innerHTML=`<div class="prompt-label">Escribe la palabra en francés</div><div class="prompt">${escapeHtml(w.translation)}</div><input id="answerInput" class="answer-input" autocomplete="off" autocapitalize="none"><button id="checkAnswer" class="check">Comprobar</button>`;
    document.getElementById("checkAnswer").onclick=()=>answer(document.getElementById("answerInput").value.trim(),w.word);
    document.getElementById("answerInput").addEventListener("keydown",e=>{if(e.key==="Enter")document.getElementById("checkAnswer").click()});
    setTimeout(()=>document.getElementById("answerInput")?.focus(),50);
  }
}

function normalize(s){ return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[’']/g,"'").trim(); }

async function answer(given, correct) {
  const w=currentExercise.word;
  const isCorrect=normalize(given)===normalize(correct);
  w.repetitions++;
  if(isCorrect) w.correct++; else w.incorrect++;
  const now=new Date();
  if(isCorrect){
    w.status = w.repetitions>=5 ? "mastered" : w.repetitions>=2 ? "familiar" : "learning";
    const intervals=[1,3,7,14,30,60];
    const days=intervals[Math.min(w.repetitions-1,intervals.length-1)];
    w.nextReview=new Date(now.getTime()+days*86400000).toISOString();
  } else {
    w.status="learning";
    w.nextReview=new Date(now.getTime()+10*60000).toISOString();
  }
  w.lastReview=now.toISOString();
  await saveAllWords();
  const fb=document.getElementById("feedback");
  fb.classList.remove("hidden");
  fb.innerHTML=isCorrect ? "✅ <strong>Correcto</strong>" : `❌ <strong>Incorrecto</strong><br>Respuesta: <b>${escapeHtml(correct)}</b>`;
  setTimeout(()=>{currentIndex++;renderExercise();},900);
}

async function finishSession() {
  state.sessions.push({date:todayKey(),count:currentSession.length,at:new Date().toISOString()});
  await saveState();
  updateUI();
  document.getElementById("exerciseCard").innerHTML=`<div class="prompt">🎉 Sesión terminada</div><p>Has practicado ${currentSession.length} palabras.</p><button id="finishBtn" class="check">Volver al inicio</button>`;
  document.getElementById("feedback").classList.add("hidden");
  document.getElementById("sessionProgress").style.width="100%";
  document.getElementById("finishBtn").onclick=()=>showScreen("homeScreen");
}

function renderProgress(){
  const c=allCorrect(),i=allIncorrect(),total=c+i;
  document.getElementById("totalReviews").textContent=total;
  document.getElementById("masteredCount").textContent=words.filter(w=>w.status==="mastered").length;
  document.getElementById("accuracyDetail").textContent=total?Math.round(c/total*100)+"%":"—";
  const statuses=["new","learning","familiar","mastered"];
  document.getElementById("statusBars").innerHTML=statuses.map(s=>{
    const n=words.filter(w=>w.status===s).length;
    const pct=words.length?n/words.length*100:0;
    return `<div class="bar-row"><div><span>${statusLabel(s)}</span><span>${n}</span></div><div class="progress"><div class="progress-fill" style="width:${pct}%"></div></div></div>`;
  }).join("");
}

function download(name,text,type){
  const blob=new Blob([text],{type});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=name; a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}

function exportBackup(){
  download("french-trainer-backup.json",JSON.stringify({version:1,exportedAt:new Date().toISOString(),words,state},null,2),"application/json");
}

async function importBackup(file){
  try{
    const data=JSON.parse(await file.text());
    if(!Array.isArray(data.words)) throw new Error("Formato no válido");
    words=data.words; state=data.state||state;
    await saveAllWords(); await saveState(); updateUI(); alert("Backup restaurado correctamente.");
  }catch(e){alert("No se pudo importar el backup: "+e.message);}
}

async function importCSV(file){
  const text=await file.text();
  const lines=text.split(/\r?\n/).filter(Boolean);
  const header=lines.shift().split(",").map(x=>x.trim().toLowerCase());
  const wi=header.indexOf("english")>=0?header.indexOf("english"):header.indexOf("francais")>=0?header.indexOf("francais"):0;
  const ti=header.indexOf("spanish")>=0?header.indexOf("spanish"):header.indexOf("espanol")>=0?header.indexOf("espanol"):1;
  const ci=header.indexOf("category");
  let added=0;
  for(const line of lines){
    const cols=line.split(",").map(x=>x.trim());
    if(!cols[wi]||!cols[ti]) continue;
    const word={id:"csv-"+crypto.randomUUID(),word:cols[wi],translation:cols[ti],category:ci>=0?(cols[ci]||"Importado"):"Importado",status:"new",recognition:0,production:0,repetitions:0,correct:0,incorrect:0,lastReview:null,nextReview:null};
    words.push(word);added++;
  }
  await saveAllWords(); updateUI(); renderVocabulary(); alert(`Se han importado ${added} palabras.`);
}

document.querySelectorAll(".nav-item").forEach(n=>n.onclick=()=>showScreen(n.dataset.screen));
document.getElementById("learnBtn").onclick=()=>startSession(false);
document.getElementById("reviewBtn").onclick=()=>startSession(true);
document.getElementById("exitExercise").onclick=()=>showScreen("homeScreen");
document.getElementById("searchInput").oninput=renderVocabulary;
document.getElementById("exportBtn").onclick=exportBackup;
document.getElementById("backupBtn").onclick=exportBackup;
document.getElementById("backupInput").onchange=e=>e.target.files[0]&&importBackup(e.target.files[0]);
document.getElementById("csvInput").onchange=e=>e.target.files[0]&&importCSV(e.target.files[0]);
document.getElementById("resetBtn").onclick=async()=>{
  if(confirm("¿Borrar todo el progreso? Tus palabras se conservarán.")){
    words.forEach(w=>{w.status="new";w.repetitions=0;w.correct=0;w.incorrect=0;w.lastReview=null;w.nextReview=null;});
    state.sessions=[]; await saveAllWords();await saveState();updateUI();alert("Progreso borrado.");
  }
};

initDB();
