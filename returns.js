const $=selector=>document.querySelector(selector);
const safe=value=>String(value??"").replace(/[&<>'"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[char]);

let me;
let policy;
let cases=[];
let orders=[];
let queueFilter="active";

async function api(url,options={}){
  const response=await fetch(url,{...options,headers:{"Content-Type":"application/json",...(options.headers||{})}});
  const data=await response.json();
  if(response.status===401){location.href="auth.html";throw Error("Sign in required")}
  if(!response.ok)throw Error(data.error||"Request failed");
  return data;
}

function utcDate(value){return value?new Date(value.endsWith("Z")?value:`${value}Z`):null}
function dateTime(value){const date=utcDate(value);return date&&!Number.isNaN(date.valueOf())?date.toLocaleString():"—"}
function money(amount,currency){return `${currency} ${Number(amount||0).toLocaleString()}`}
function isClosed(item){return ["refunded","rejected"].includes(item.status)}
function needsAttention(item){return ["escalated","return_overdue","merchant_responded","return_in_transit"].includes(item.status)||item.priority==="urgent"}
function deadline(item){
  const value=item.status==="awaiting_return"?item.return_due_at:item.response_due_at;
  if(!value||isClosed(item)||["merchant_responded","return_in_transit"].includes(item.status))return "—";
  const remaining=utcDate(value)-Date.now();
  if(remaining<=0)return "Overdue";
  const hours=Math.ceil(remaining/3600000);
  return hours>24?`${Math.ceil(hours/24)} days remaining`:`${hours} hours remaining`;
}

async function load(){
  me=await api("/api/me");
  $("#dashboard").href=me.user.role==="buyer"?"account.html":me.user.role==="merchant"?"merchant.html":"admin.html";
  [policy,cases]=await Promise.all([api("/api/returns/policy"),api("/api/returns")]);
  $("#policyText").textContent=`Returns may be reported within ${policy.return_window_days} days. Merchants have ${policy.merchant_response_hours} hours to respond before automatic escalation.`;
  $("#newCase").hidden=me.user.role==="admin";
  if(me.user.role!=="admin")orders=await api(me.user.role==="buyer"?"/api/buyer/orders":"/api/merchant/orders");
  if(me.user.role==="admin")renderPolicy();
  render();
}

function queueBar(){
  const active=cases.filter(item=>!isClosed(item)).length;
  const attention=cases.filter(needsAttention).length;
  const overdue=cases.filter(item=>["escalated","return_overdue"].includes(item.status)).length;
  return `<section class="queue-bar"><div><span>Active</span><strong>${active}</strong></div><div><span>Needs review</span><strong>${attention}</strong></div><div class="${overdue?"danger":""}"><span>SLA breaches</span><strong>${overdue}</strong></div><label>Queue<select id="queueFilter"><option value="active" ${queueFilter==="active"?"selected":""}>Active cases</option><option value="attention" ${queueFilter==="attention"?"selected":""}>Needs review</option><option value="unassigned" ${queueFilter==="unassigned"?"selected":""}>Unassigned</option><option value="closed" ${queueFilter==="closed"?"selected":""}>Closed</option><option value="all" ${queueFilter==="all"?"selected":""}>All cases</option></select></label></section>`;
}

function visibleCases(){
  if(queueFilter==="attention")return cases.filter(needsAttention);
  if(queueFilter==="unassigned")return cases.filter(item=>!isClosed(item)&&!item.assigned_admin_id);
  if(queueFilter==="closed")return cases.filter(isClosed);
  if(queueFilter==="all")return cases;
  return cases.filter(item=>!isClosed(item));
}

function eventHistory(item){
  if(!item.events?.length)return "";
  return `<details class="history"><summary>Case history (${item.events.length})</summary>${item.events.map(event=>`<div class="history-row"><time>${dateTime(event.created_at)}</time><p><strong>${safe(event.event_type.replaceAll("_"," "))}</strong>${safe(event.message)}</p><span>${safe(event.actor_name||"Soko automation")}</span></div>`).join("")}</details>`;
}

function caseCard(item){
  const dueValue=item.status==="awaiting_return"?item.return_due_at:item.response_due_at;
  const evidence=item.evidence.length?item.evidence.map(file=>`<span><a href="${safe(file.url)}" target="_blank" rel="noopener">${safe(file.label)}${file.original_name?` · ${safe(file.original_name)}`:""} ↗</a><small>${safe(file.uploader_name)} · ${dateTime(file.created_at)}</small></span>`).join(""):"<span>No evidence attached yet.</span>";
  const canRespond=me.user.role==="merchant"&&["open","merchant_responded","escalated"].includes(item.status);
  const canTrack=me.user.role==="buyer"&&["awaiting_return","return_overdue"].includes(item.status);
  return `<article class="case ${needsAttention(item)?"attention-case":""}"><div class="case-head"><div><span class="kicker">CASE #${item.id} · ORDER ${safe(item.order_id)}</span><h2>${safe(item.case_type.replaceAll("_"," "))}</h2><p class="muted">${safe(item.reason)}</p></div><div class="badges"><span class="priority ${safe(item.priority)}">${safe(item.priority)}</span><span class="status ${safe(item.status)}">${safe(item.status.replaceAll("_"," "))}</span></div></div><div class="case-grid"><div>Buyer<strong>${safe(item.customer_name)}</strong></div><div>Merchant<strong>${safe(item.store_name)}</strong></div><div>Requested refund<strong>${money(item.requested_product_refund+item.requested_delivery_refund,item.currency)}</strong></div><div>Deadline<strong class="${deadline(item)==="Overdue"?"overdue":""}">${deadline(item)}</strong><small>${dateTime(dueValue)}</small></div></div>${me.user.role==="admin"?`<div class="ownership"><span>Owner: <strong>${safe(item.assigned_admin_name||"Unassigned")}</strong></span><span>Payout: <strong>${isClosed(item)?"Released or refunded":"On hold"}</strong></span></div>`:""}${item.merchant_response?`<p><strong>Merchant response:</strong> ${safe(item.merchant_response)}</p>`:""}${item.admin_note?`<p><strong>Soko decision:</strong> ${safe(item.admin_note)}</p>`:""}${item.return_tracking?`<p><strong>Return tracking:</strong> ${safe(item.return_carrier)} · ${safe(item.return_tracking)}</p>`:""}<div class="evidence">${evidence}</div>${eventHistory(item)}<div class="actions">${!isClosed(item)?`<button data-evidence="${item.id}">Add evidence</button>`:""}${canRespond?`<button data-respond="${item.id}">Respond</button>`:""}${canTrack?`<button data-tracking="${item.id}">Add return tracking</button>`:""}${me.user.role==="admin"&&!isClosed(item)?`<button data-assign="${item.id}">${item.assigned_admin_id?"Update ownership":"Claim case"}</button><button class="primary" data-decide="${item.id}">Make decision</button>`:""}</div></article>`;
}

function render(){const list=visibleCases();$("#cases").innerHTML=`${me.user.role==="admin"?queueBar():""}<div id="caseList">${list.length?list.map(caseCard).join(""):`<div class="panel empty">No cases in this queue.</div>`}</div>`;bind()}
function bind(){
  $("#queueFilter")?.addEventListener("change",event=>{queueFilter=event.target.value;render()});
  document.querySelectorAll("[data-evidence]").forEach(button=>button.onclick=()=>evidenceForm(button.dataset.evidence));
  document.querySelectorAll("[data-respond]").forEach(button=>button.onclick=()=>responseForm(button.dataset.respond));
  document.querySelectorAll("[data-tracking]").forEach(button=>button.onclick=()=>trackingForm(button.dataset.tracking));
  document.querySelectorAll("[data-assign]").forEach(button=>button.onclick=()=>assignmentForm(button.dataset.assign));
  document.querySelectorAll("[data-decide]").forEach(button=>button.onclick=()=>decisionForm(button.dataset.decide));
}

function open(html){$("#modal").innerHTML=html;$("#backdrop").classList.add("open")}
function close(){$("#backdrop").classList.remove("open")}

$("#newCase").onclick=()=>{
  const eligible=orders.filter(order=>!cases.some(item=>item.order_id===order.id));
  open(`<span class="kicker">PAYOUT-PROTECTED REQUEST</span><h2>Open a request</h2>${eligible.length?`<form class="form" id="caseForm"><label class="wide">Order<select name="orderId" required>${eligible.map(order=>`<option value="${order.id}">${order.id} · ${safe(order.status)}</option>`).join("")}</select></label><label>Request type<select name="type">${me.user.role==="buyer"?'<option value="buyer_cancellation">Cancel before preparation</option><option value="return">Damaged, incorrect or missing item</option>':'<option value="merchant_cancellation">Cannot fulfil order</option>'}</select></label><label>Product refund requested<input name="productRefund" type="number" min="0" value="0"></label><label>Delivery refund requested<input name="deliveryRefund" type="number" min="0" value="0"></label><label class="wide">Reason<textarea name="reason" required minlength="10"></textarea></label><button class="primary">Open request and hold payout</button></form>`:'<p class="muted">There are no eligible paid orders without an existing case.</p>'}`);
  $("#caseForm")?.addEventListener("submit",async event=>{event.preventDefault();await submit("/api/returns","POST",Object.fromEntries(new FormData(event.target)),"Request opened; payout is on hold")});
};

function evidenceForm(id){
  open(`<h2>Add evidence</h2><p class="muted">Files are encrypted and only visible to the buyer, merchant, and Soko trust team. Maximum 5 MB.</p><form class="form" id="evidenceForm"><label class="wide">Description<input name="label" required minlength="3"></label><label class="wide">Upload file<input name="file" type="file" accept="image/jpeg,image/png,image/webp,application/pdf,video/mp4"></label><label class="wide">Or evidence link<input name="url" type="url" placeholder="https://"></label><button class="primary">Attach evidence</button></form>`);
  $("#evidenceForm").onsubmit=async event=>{event.preventDefault();const form=new FormData(event.target),file=form.get("file"),payload={label:form.get("label"),url:form.get("url")};if(file?.size){if(file.size>5*1024*1024)return toast("Evidence must be smaller than 5 MB");payload.name=file.name;payload.mimeType=file.type;payload.base64=await fileBase64(file)}if(!payload.base64&&!payload.url)return toast("Upload a file or provide a link");await submit(`/api/returns/${id}/evidence`,"POST",payload,"Evidence added securely")};
}

function fileBase64(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(",")[1]);reader.onerror=reject;reader.readAsDataURL(file)})}
function responseForm(id){open(`<h2>Respond to case</h2><form class="form" id="responseForm"><label class="wide">Merchant response<textarea name="response" required minlength="10"></textarea></label><button class="primary">Send response</button></form>`);$("#responseForm").onsubmit=async event=>{event.preventDefault();await submit(`/api/merchant/returns/${id}/respond`,"PATCH",Object.fromEntries(new FormData(event.target)),"Response recorded")}}
function trackingForm(id){open(`<h2>Return tracking</h2><form class="form" id="trackingForm"><label>Carrier<input name="carrier" required minlength="2"></label><label>Tracking number<input name="tracking" required minlength="4"></label><button class="primary">Save tracking</button></form>`);$("#trackingForm").onsubmit=async event=>{event.preventDefault();await submit(`/api/returns/${id}/tracking`,"PATCH",Object.fromEntries(new FormData(event.target)),"Return tracking saved")}}
function assignmentForm(id){const item=cases.find(value=>String(value.id)===String(id));open(`<h2>Case ownership</h2><p class="muted">Claim this case and set its place in the trust-team queue.</p><form class="form" id="assignmentForm"><label>Priority<select name="priority"><option value="normal" ${item.priority==="normal"?"selected":""}>Normal</option><option value="high" ${item.priority==="high"?"selected":""}>High</option><option value="urgent" ${item.priority==="urgent"?"selected":""}>Urgent</option></select></label><button class="primary">Assign to me</button></form>`);$("#assignmentForm").onsubmit=async event=>{event.preventDefault();await submit(`/api/admin/returns/${id}/assign`,"PATCH",Object.fromEntries(new FormData(event.target)),"Case assigned")}}
function decisionForm(id){const item=cases.find(value=>String(value.id)===String(id));open(`<h2>Decide case #${item.id}</h2><p class="muted">Product refunds reverse proportional commission. Requiring a return gives the buyer seven days to add tracking.</p><form class="form" id="decisionForm"><label>Decision<select name="decision"><option value="awaiting_return">Require return first</option><option value="approved_refund">Approve refund</option><option value="rejected">Reject request</option></select></label><label>Product refund<input name="productRefund" type="number" min="0" max="${item.subtotal}" value="${item.requested_product_refund}"></label><label>Delivery refund<input name="deliveryRefund" type="number" min="0" max="${item.delivery_fee}" value="${item.requested_delivery_refund}"></label><label class="wide">Decision note<textarea name="note" required minlength="3"></textarea></label><button class="primary">Record decision</button></form>`);$("#decisionForm").onsubmit=async event=>{event.preventDefault();await submit(`/api/admin/returns/${id}/decision`,"PATCH",Object.fromEntries(new FormData(event.target)),"Decision recorded")}}

function renderPolicy(){$("#adminPolicy").hidden=false;$("#adminPolicy").innerHTML=`<h2>Marketplace policy</h2><form class="form" id="policyForm"><label>Return window (days)<input name="returnWindowDays" type="number" min="1" max="60" value="${policy.return_window_days}"></label><label>Merchant response deadline (hours)<input name="merchantResponseHours" type="number" min="1" max="168" value="${policy.merchant_response_hours}"></label><button class="primary">Save policy</button></form>`;$("#policyForm").onsubmit=async event=>{event.preventDefault();await submit("/api/admin/returns/policy","PUT",Object.fromEntries(new FormData(event.target)),"Policy updated")}}
async function submit(url,method,body,message){try{await api(url,{method,body:JSON.stringify(body)});close();await load();toast(message)}catch(error){toast(error.message)}}
$("#close").onclick=close;
$("#backdrop").onclick=event=>{if(event.target===$("#backdrop"))close()};
$("#logout").onclick=async()=>{await api("/api/auth/logout",{method:"POST"});location.href="auth.html"};
let toastTimer;
function toast(text){$("#toast").textContent=text;$("#toast").classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>$("#toast").classList.remove("show"),3000)}
load().catch(error=>toast(error.message));
