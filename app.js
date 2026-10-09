(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const today = new Date();
  const dateISO = d => d.toISOString().slice(0,10);
  const offsetDate = n => { const d=new Date(); d.setDate(d.getDate()+n); return dateISO(d); };
  const formatDate = value => value ? new Date(value + 'T12:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short'}) : '—';
  const formatMoney = value => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(Number(value)||0);
  const safe = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const initials = name => String(name||'RF').trim().split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase();
  const seed = {
    doctors:[
      {id:1,name:'Dr. Ananya Sharma',specialty:'General Physician',clinic:'Sharma Clinic',city:'Dehradun',phone:'',lastVisit:offsetDate(-8),nextFollow:offsetDate(0),status:'Follow-up due',notes:'Discussed portfolio overview.'},
      {id:2,name:'Dr. Vikram Singh',specialty:'Orthopaedics',clinic:'Singh Bone & Joint',city:'Dehradun',phone:'',lastVisit:offsetDate(-4),nextFollow:offsetDate(2),status:'Scheduled',notes:'Requested product literature.'},
      {id:3,name:'Dr. Meera Joshi',specialty:'Gynaecology',clinic:'Joshi Women’s Care',city:'Rishikesh',phone:'',lastVisit:offsetDate(-13),nextFollow:offsetDate(-2),status:'Overdue',notes:'Follow up on approved product information.'},
      {id:4,name:'Dr. Arjun Rawat',specialty:'General Physician',clinic:'Rawat Health Centre',city:'Dehradun',phone:'',lastVisit:offsetDate(-6),nextFollow:offsetDate(1),status:'Scheduled',notes:'Regular follow-up.'},
      {id:5,name:'Dr. Neha Kapoor',specialty:'Dermatology',clinic:'Kapoor Skin Clinic',city:'Haridwar',phone:'',lastVisit:offsetDate(-10),nextFollow:offsetDate(0),status:'Follow-up due',notes:'Share verified portfolio details.'},
      {id:6,name:'Dr. Sameer Bhandari',specialty:'Paediatrics',clinic:'Little Steps Clinic',city:'Dehradun',phone:'',lastVisit:offsetDate(-3),nextFollow:offsetDate(5),status:'Scheduled',notes:'Introductory visit.'}
    ],
    products:[
      {id:1,name:'Product One',composition:'Add generic composition',category:'Category to confirm',price:0,stock:0,active:true},
      {id:2,name:'Product Two',composition:'Add generic composition',category:'Category to confirm',price:0,stock:0,active:true},
      {id:3,name:'Product Three',composition:'Add generic composition',category:'Category to confirm',price:0,stock:0,active:true},
      {id:4,name:'Product Four',composition:'Add generic composition',category:'Category to confirm',price:0,stock:0,active:true},
      {id:5,name:'Product Five',composition:'Add generic composition',category:'Category to confirm',price:0,stock:0,active:true},
      {id:6,name:'Product Six',composition:'Add generic composition',category:'Category to confirm',price:0,stock:0,active:true}
    ],
    followups:[
      {id:1,doctorId:1,doctor:'Dr. Ananya Sharma',date:offsetDate(0),type:'Product discussion',status:'Due',notes:'Review product information.'},
      {id:2,doctorId:3,doctor:'Dr. Meera Joshi',date:offsetDate(-2),type:'Follow-up visit',status:'Overdue',notes:'Follow up on previous visit.'},
      {id:3,doctorId:5,doctor:'Dr. Neha Kapoor',date:offsetDate(0),type:'Product literature',status:'Due',notes:'Share approved product literature.'},
      {id:4,doctorId:2,doctor:'Dr. Vikram Singh',date:offsetDate(2),type:'Follow-up visit',status:'Scheduled',notes:'Regular follow-up.'}
    ],
    sales:[
      {id:1,date:offsetDate(-20),productId:1,product:'Product One',units:20,amount:0,source:'Opening demo entry'},
      {id:2,date:offsetDate(-13),productId:2,product:'Product Two',units:12,amount:0,source:'Opening demo entry'},
      {id:3,date:offsetDate(-7),productId:3,product:'Product Three',units:8,amount:0,source:'Opening demo entry'}
    ]
  };
  const load = () => { try { const saved=localStorage.getItem('ransarDeskData'); return saved ? JSON.parse(saved) : structuredClone(seed); } catch { return structuredClone(seed); } };
  let data = load();
  let currentView = 'overview';
  let nextId = () => Math.max(0,...Object.values(data).flat().map(x=>Number(x.id)||0))+1;
  const persist = () => { try { localStorage.setItem('ransarDeskData',JSON.stringify(data)); } catch {} };
  const toast = message => { const el=$('#toast'); el.textContent=message; el.classList.add('show'); clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.classList.remove('show'),2800); };
  const dueStatus = f => f.status==='Complete' ? 'Complete' : f.date < dateISO(today) ? 'Overdue' : f.date===dateISO(today) ? 'Due' : 'Scheduled';
  const getDoctor = id => data.doctors.find(d=>Number(d.id)===Number(id));
  const getProduct = id => data.products.find(p=>Number(p.id)===Number(id));
  const statusClass = status => ({'Due':'status-due','Follow-up due':'status-due','Scheduled':'status-scheduled','Complete':'status-complete','Overdue':'status-overdue'}[status]||'status-scheduled');
  const metric = (label,value,foot,icon) => `<article class="metric"><div class="metric-top"><span>${label}</span><span class="metric-icon">${icon}</span></div><div class="metric-value">${value}</div><div class="metric-foot">${foot}</div></article>`;
  const panel = (title,subtitle,body,action='',actionView='') => `<section class="panel"><div class="panel-head"><div><h3>${title}</h3><p>${subtitle}</p></div>${action ? `<button class="panel-action" data-go="${actionView}">${action} →</button>` : ''}</div>${body}</section>`;
  const followRow = f => `<div class="follow-row"><span class="initials">${safe(initials(f.doctor))}</span><div><strong>${safe(f.doctor)}</strong><small>${safe(f.type)} · ${safe(f.notes||'No notes')}</small></div><span class="follow-date ${f.status==='Complete'?'done':''}">${f.status==='Complete'?'Done':formatDate(f.date)}</span></div>`;
  const activity = (icon,title,desc,time) => `<div class="activity-row"><span class="activity-icon">${icon}</span><div><strong>${title}</strong><p>${desc}</p><time>${time}</time></div></div>`;
  function renderOverview(){
    const due=data.followups.filter(f=>f.status!=='Complete'&&f.date<=dateISO(today));
    const month=data.sales.filter(s=>s.date?.slice(0,7)===dateISO(today).slice(0,7));
    const revenue=month.reduce((n,s)=>n+Number(s.amount||0),0);
    const units=month.reduce((n,s)=>n+Number(s.units||0),0);
    const upcoming=data.followups.filter(f=>f.status!=='Complete').sort((a,b)=>a.date.localeCompare(b.date)).slice(0,4);
    const recent=data.sales.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,4);
    const bars=Array.from({length:6},(_,i)=>{const d=new Date();d.setMonth(d.getMonth()-(5-i));const key=dateISO(new Date(d.getFullYear(),d.getMonth(),1)).slice(0,7);return {label:d.toLocaleDateString('en-IN',{month:'short'}),value:data.sales.filter(s=>s.date?.slice(0,7)===key).reduce((n,s)=>n+Number(s.amount||0),0)};});
    const max=Math.max(1,...bars.map(b=>b.value));
    const chart=`<div class="panel-body"><div class="bar-chart">${bars.map((b,i)=>`<div class="bar-col"><div class="bar ${i===5?'current':''}" style="height:${Math.max(4,b.value/max*100)}%" title="${safe(formatMoney(b.value))}"></div><span>${b.label}</span></div>`).join('')}</div><div class="chart-legend"><span>Recorded revenue · last 6 months</span><strong>${formatMoney(revenue)}</strong></div><p class="tiny-note">Demo values are placeholders. Enter real amounts to use this chart.</p></div>`;
    const recentBody=recent.length?recent.map(s=>activity('↗',safe(s.product),`${Number(s.units)||0} units · ${formatMoney(s.amount)}`,formatDate(s.date))).join(''):'<div class="empty-state">No sales recorded yet.</div>';
    $('#viewPanel').innerHTML=`<div class="metrics">${metric('Doctors in directory',data.doctors.length,'Your relationship list','♙')}${metric('Follow-ups to action',due.length,due.some(f=>f.status==='Overdue')?'<strong>Needs attention</strong>':'Due today or earlier','◷')}${metric('Revenue this month',formatMoney(revenue),`${units} units recorded`,'₹')}${metric('Products in portfolio',data.products.length,'Edit product details','▤')}</div><div class="desk-grid"><div>${panel('Follow-ups to action','Your next conversations',`<div class="panel-body">${upcoming.length?upcoming.map(f=>followRow({...f,status:dueStatus(f)})).join(''):'<div class="empty-state"><strong>All caught up</strong>No follow-ups scheduled.</div>'}</div>`,'View follow-ups','followups')}${panel('Sales snapshot','Revenue entered into your tracker',chart,'View sales','sales')}</div><div>${panel('Recent sales','Latest recorded entries',`<div class="panel-body">${recentBody}</div>`,'All sales','sales')}${panel('Quick actions','Keep daily work moving',`<div class="panel-body quick-actions"><button data-add="doctor"><span>＋</span><div><strong>Add a doctor</strong><small>Grow your relationship directory</small></div><b>→</b></button><button data-add="followup"><span>◷</span><div><strong>Schedule follow-up</strong><small>Keep the next visit on track</small></div><b>→</b></button><button data-add="sale"><span>↗</span><div><strong>Record a sale</strong><small>Track products and revenue</small></div><b>→</b></button></div>`)}</div></div>`;
  }
  function renderDoctors(){
    const rows=data.doctors.map(d=>`<tr><td><div class="table-person"><span class="initials">${safe(initials(d.name))}</span><div><strong>${safe(d.name)}</strong><small class="table-sub">${safe(d.specialty||'Specialty not added')}</small></div></div></td><td>${safe(d.clinic||'—')}</td><td>${safe(d.city||'—')}</td><td>${formatDate(d.lastVisit)}</td><td><span class="status ${statusClass(d.status)}">${safe(d.status||'Scheduled')}</span></td><td><button class="table-action" data-follow-doctor="${d.id}">Follow up +</button></td></tr>`).join('');
    $('#viewPanel').innerHTML=`<div class="panel"><div class="search-row"><input class="search-input" id="doctorSearch" placeholder="Search name, specialty or clinic…"><button class="btn btn-dark btn-small" data-add="doctor">＋ Add doctor</button></div><div class="table-wrap"><table><thead><tr><th>Doctor</th><th>Clinic</th><th>City</th><th>Last visit</th><th>Relationship status</th><th>Action</th></tr></thead><tbody id="doctorRows">${rows||'<tr><td colspan="6" class="empty-state">No doctors added yet.</td></tr>'}</tbody></table></div></div><p class="tiny-note">Use only appropriate professional contact information and keep records secure.</p>`;
    $('#doctorSearch').addEventListener('input',e=>{$$('#doctorRows tr').forEach(tr=>tr.hidden=!tr.textContent.toLowerCase().includes(e.target.value.toLowerCase()));});
  }
  function renderFollowups(){
    const rows=data.followups.slice().sort((a,b)=>a.date.localeCompare(b.date)).map(f=>`<tr><td><div class="table-person"><span class="initials">${safe(initials(f.doctor))}</span><div><strong>${safe(f.doctor)}</strong><small class="table-sub">${safe(f.notes||'')}</small></div></div></td><td>${safe(f.type)}</td><td>${formatDate(f.date)}</td><td><span class="status ${statusClass(dueStatus(f))}">${safe(dueStatus(f))}</span></td><td>${f.status==='Complete'?'<span class="status status-complete">Done</span>':`<button class="table-action" data-complete="${f.id}">Mark done ✓</button>`}</td></tr>`).join('');
    $('#viewPanel').innerHTML=`<div class="panel"><div class="panel-head"><div><h3>Follow-up planner</h3><p>Plan professional visits and track outstanding reminders.</p></div><button class="btn btn-dark btn-small" data-add="followup">＋ Add follow-up</button></div><div class="table-wrap"><table><thead><tr><th>Doctor</th><th>Purpose</th><th>Due date</th><th>Status</th><th>Action</th></tr></thead><tbody>${rows||'<tr><td colspan="5" class="empty-state">No follow-ups. Add your first reminder.</td></tr>'}</tbody></table></div></div><p class="tiny-note">This prototype does not send notifications. Add a backend and reminder service for live alerts.</p>`;
  }
  function renderProducts(){
    $('#viewPanel').innerHTML=`<div class="panel"><div class="panel-head"><div><h3>Product portfolio</h3><p>Maintain your catalogue, product composition and optional stock notes.</p></div><button class="btn btn-dark btn-small" data-add="product">＋ Add product</button></div><div class="panel-body"><div class="product-desk-grid">${data.products.map(p=>`<article class="desk-product"><div class="desk-product-top"><span class="product-avatar">${safe(initials(p.name))}</span><span class="stock-badge">${p.active===false?'Inactive':'Active'}</span></div><h3>${safe(p.name)}</h3><p>${safe(p.composition||'Composition not added')}</p><div class="prod-meta"><span>${safe(p.category||'Category')}</span><strong>${p.price?formatMoney(p.price):'Price not set'}</strong></div><div class="prod-meta"><span>Stock note</span><strong>${p.stock||0} units</strong></div><button class="table-action" data-edit-product="${p.id}" style="margin-top:12px">Edit product details →</button></article>`).join('')}</div></div></div><p class="tiny-note">Only publish verified product details and approved claims on the public website.</p>`;
  }
  function renderSales(){
    const total=data.sales.reduce((n,s)=>n+Number(s.amount||0),0), units=data.sales.reduce((n,s)=>n+Number(s.units||0),0);
    const rows=data.sales.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(s=>`<tr><td>${formatDate(s.date)}</td><td><strong>${safe(s.product)}</strong></td><td>${Number(s.units)||0}</td><td>${formatMoney(s.amount)}</td><td>${safe(s.source||'Manual entry')}</td></tr>`).join('');
    $('#viewPanel').innerHTML=`<div class="metrics">${metric('Recorded revenue',formatMoney(total),'All entered records','₹')}${metric('Units recorded',units,'Across all products','▤')}${metric('Sales entries',data.sales.length,'Manually entered','↗')}${metric('Average entry',formatMoney(data.sales.length?total/data.sales.length:0),'Per sales record','◷')}</div><div class="panel"><div class="panel-head"><div><h3>Sales tracker</h3><p>Record revenue and units by product and date.</p></div><button class="btn btn-dark btn-small" data-add="sale">＋ Record sale</button></div><div class="table-wrap"><table><thead><tr><th>Date</th><th>Product</th><th>Units</th><th>Revenue</th><th>Note</th></tr></thead><tbody>${rows||'<tr><td colspan="5" class="empty-state">No sales entries yet.</td></tr>'}</tbody></table></div></div><p class="tiny-note">Revenue and unit values are only as accurate as your entries. Seeded demo entries have zero revenue.</p>`;
  }
  const views={
    overview:{title:'Good morning, team',sub:'Here’s your business at a glance. Keep your next conversations moving.',render:renderOverview},
    doctors:{title:'Doctor directory',sub:'A simple workspace to organise professional relationships and visit history.',render:renderDoctors},
    followups:{title:'Follow-up planner',sub:'Keep reminders visible so the next professional conversation does not get missed.',render:renderFollowups},
    productsDesk:{title:'Product portfolio',sub:'Maintain one reliable source for product names, compositions and internal notes.',render:renderProducts},
    sales:{title:'Sales tracker',sub:'Build a clearer picture of product movement and recorded revenue over time.',render:renderSales}
  };
  function renderView(view){
    currentView=views[view]?view:'overview';
    const v=views[currentView];
    $('#viewTitle').innerHTML=safe(v.title)+(currentView==='overview'?' <span>✳</span>':'');
    $('#viewSubtitle').textContent=v.sub;
    $('#viewCrumb').textContent=v.title;
    $$('.side-link').forEach(b=>b.classList.toggle('active',b.dataset.view===currentView));
    $('#doctorCount').textContent=data.doctors.length;
    $('#followCount').textContent=data.followups.filter(f=>f.status!=='Complete'&&f.date<=dateISO(today)).length;
    v.render();
  }
  function openDesk(view='overview'){
    $('#publicSite').hidden=true;$('.footer').hidden=true;$('.announcement').hidden=true;$('.header').hidden=true;$('#businessDesk').hidden=false;document.body.classList.add('desk-open');renderView(view);window.scrollTo(0,0);
  }
  function closeDesk(){ $('#businessDesk').hidden=true;$('#publicSite').hidden=false;$('.footer').hidden=false;$('.announcement').hidden=false;$('.header').hidden=false;document.body.classList.remove('desk-open');window.scrollTo(0,0); }
  $('#openDesk').addEventListener('click',()=>openDesk());
  $('#footerDesk').addEventListener('click',()=>openDesk());
  $('#backToSite').addEventListener('click',closeDesk);
  $('#deskBrand').addEventListener('click',e=>{e.preventDefault();renderView('overview')});
  $('#mobileSide').addEventListener('click',()=>$('#businessDesk').classList.toggle('sidebar-open'));
  $$('.side-link').forEach(b=>b.addEventListener('click',()=>{renderView(b.dataset.view);$('#businessDesk').classList.remove('sidebar-open')}));
  $('#viewPanel').addEventListener('click',e=>{
    const go=e.target.closest('[data-go]');if(go)return renderView(go.dataset.go);
    const add=e.target.closest('[data-add]');if(add)return openForm(add.dataset.add);
    const done=e.target.closest('[data-complete]');if(done){const f=data.followups.find(x=>x.id===Number(done.dataset.complete));if(f){f.status='Complete';persist();renderView(currentView);toast('Follow-up marked complete.');}return;}
    const follow=e.target.closest('[data-follow-doctor]');if(follow){const d=getDoctor(follow.dataset.followDoctor);openForm('followup',{doctorId:d.id,doctor:d.name});return;}
    const edit=e.target.closest('[data-edit-product]');if(edit){openForm('product',getProduct(edit.dataset.editProduct));}
  });
  const dialog=$('#recordDialog'), fields=$('#dialogFields');
  const input=(name,label,type='text',value='',required=false,extra='')=>`<div class="field"><label for="f-${name}">${label}</label><input id="f-${name}" name="${name}" type="${type}" value="${safe(value)}" ${required?'required':''} ${extra}></div>`;
  const select=(name,label,options,value='')=>`<div class="field"><label for="f-${name}">${label}</label><select id="f-${name}" name="${name}" required>${options.map(o=>`<option value="${safe(o.value)}" ${String(o.value)===String(value)?'selected':''}>${safe(o.label)}</option>`).join('')}</select></div>`;
  const textarea=(name,label,value='')=>`<div class="field"><label for="f-${name}">${label}</label><textarea id="f-${name}" name="${name}" rows="3">${safe(value)}</textarea></div>`;
  let activeForm={type:'',record:null};
  function openForm(type,record=null){
    activeForm={type,record};const edit=!!record;
    const config={
      doctor:{title:edit?'Edit doctor':'Add a doctor',html:input('name','Doctor name', 'text',record?.name||'',true)+input('specialty','Specialty','text',record?.specialty||'')+input('clinic','Clinic / hospital','text',record?.clinic||'')+input('city','City','text',record?.city||'Dehradun')+input('phone','Professional contact (optional)','tel',record?.phone||'')+input('lastVisit','Last visit','date',record?.lastVisit||'')+input('nextFollow','Next follow-up','date',record?.nextFollow||offsetDate(3))+textarea('notes','Internal notes',record?.notes||'')},
      followup:{title:'Schedule a follow-up',html:select('doctorId','Doctor',data.doctors.map(d=>({value:d.id,label:d.name})),record?.doctorId||data.doctors[0]?.id)+select('type','Purpose',[{value:'Follow-up visit',label:'Follow-up visit'},{value:'Product discussion',label:'Product discussion'},{value:'Product literature',label:'Product literature'},{value:'Other',label:'Other'}],record?.type||'Follow-up visit')+input('date','Due date','date',record?.date||offsetDate(1),true)+textarea('notes','Reminder notes',record?.notes||'')},
      product:{title:edit?'Edit product':'Add a product',html:input('name','Product / brand name','text',record?.name||'',true)+input('composition','Generic composition / strength','text',record?.composition||'')+input('category','Category','text',record?.category||'')+input('price','Selling / reference price (₹)','number',record?.price||0,false,'min="0" step="0.01"')+input('stock','Stock note (units)','number',record?.stock||0,false,'min="0" step="1"')+select('active','Status',[{value:'true',label:'Active'},{value:'false',label:'Inactive'}],String(record?.active!==false))},
      sale:{title:'Record a sale',html:input('date','Sale date','date',offsetDate(0),true)+select('productId','Product',data.products.map(p=>({value:p.id,label:p.name})),record?.productId||data.products[0]?.id)+input('units','Units','number',record?.units||1,true,'min="1" step="1"')+input('amount','Revenue amount (₹)','number',record?.amount||0,true,'min="0" step="0.01"')+input('source','Note / source','text',record?.source||'Manual entry')}
    }[type];
    if(!config){toast('Unknown record type');return;}
    $('#dialogTitle').textContent=config.title;fields.innerHTML=config.html;dialog.showModal();
  }
  $('#quickAdd').addEventListener('click',()=>openForm(currentView==='doctors'?'doctor':currentView==='followups'?'followup':currentView==='productsDesk'?'product':currentView==='sales'?'sale':'doctor'));
  $('#recordForm').addEventListener('submit',e=>{
    e.preventDefault();const fd=new FormData(e.currentTarget);const v=Object.fromEntries(fd.entries());const type=activeForm.type;const rec=activeForm.record;
    if(type==='doctor'){
      const obj={id:rec?.id||nextId(),...v,status:v.nextFollow?(v.nextFollow<dateISO(today)?'Overdue':v.nextFollow===dateISO(today)?'Follow-up due':'Scheduled'):'Scheduled'};
      if(rec)data.doctors=data.doctors.map(d=>d.id===rec.id?obj:d);else data.doctors.push(obj);
      toast(rec?'Doctor updated.':'Doctor added to directory.');
    }else if(type==='followup'){
      const d=getDoctor(v.doctorId);const obj={id:nextId(),doctorId:Number(v.doctorId),doctor:d?.name||'Unknown doctor',date:v.date,type:v.type,status:'Scheduled',notes:v.notes};
      data.followups.push(obj);if(d){d.nextFollow=v.date;d.status=v.date<dateISO(today)?'Overdue':v.date===dateISO(today)?'Follow-up due':'Scheduled';}
      toast('Follow-up scheduled.');
    }else if(type==='product'){
      const obj={id:rec?.id||nextId(),name:v.name,composition:v.composition,category:v.category,price:Number(v.price)||0,stock:Number(v.stock)||0,active:v.active==='true'};
      if(rec)data.products=data.products.map(p=>p.id===rec.id?obj:p);else data.products.push(obj);
      toast(rec?'Product updated.':'Product added.');
    }else if(type==='sale'){
      const p=getProduct(v.productId);data.sales.push({id:nextId(),date:v.date,productId:Number(v.productId),product:p?.name||'Unknown product',units:Number(v.units)||0,amount:Number(v.amount)||0,source:v.source||'Manual entry'});
      toast('Sales entry recorded.');
    }
    persist();dialog.close();renderView(currentView);
  });
  $('#showAll').addEventListener('click',()=>{const show=$('#products').classList.toggle('show-all');$('#showAll').innerHTML=show?'Show fewer products <b>↑</b>':'View all products <b>↓</b>';});
  $$('.product-request').forEach(b=>b.addEventListener('click',()=>{ $('#interest').value='Product information';$('#message').value=`I would like to request information about ${b.dataset.product}.`;$('#contact').scrollIntoView({behavior:'smooth'});$('#name').focus({preventScroll:true});}));
  $('#menuBtn').addEventListener('click',()=>{const open=$('#navLinks').classList.toggle('open');$('#menuBtn').setAttribute('aria-expanded',String(open));$('#menuBtn').textContent=open?'×':'☰';});
  $$('#navLinks a').forEach(a=>a.addEventListener('click',()=>{$('#navLinks').classList.remove('open');$('#menuBtn').textContent='☰';$('#menuBtn').setAttribute('aria-expanded','false');}));
  $('#contactForm').addEventListener('submit',e=>{
    e.preventDefault();const fd=new FormData(e.currentTarget);
    // Replace with the official Ransar email or a backend endpoint before production.
    const companyEmail='REPLACE_WITH_OFFICIAL_EMAIL';
    if(companyEmail==='REPLACE_WITH_OFFICIAL_EMAIL'){ $('#formHint').textContent='Thanks — the form UI is working, but submissions are not sent yet. Add the official email or connect a backend before publishing.';toast('Demo form submitted locally; no message was sent.');return; }
    const subject=encodeURIComponent(`Ransar Formulation enquiry — ${fd.get('interest')}`);
    const body=encodeURIComponent(`Name: ${fd.get('name')}\nOrganisation: ${fd.get('org')}\nContact: ${fd.get('contactValue')}\nEnquiry: ${fd.get('interest')}\n\nMessage:\n${fd.get('message')}`);
    location.href=`mailto:${companyEmail}?subject=${subject}&body=${body}`;
  });
  $('#exportData').addEventListener('click',()=>{
    const rows=[['record_type','id','date','name','detail','status','amount','units']];
    data.doctors.forEach(d=>rows.push(['doctor',d.id,d.lastVisit,d.name,`${d.specialty||''} | ${d.clinic||''} | ${d.city||''}`,d.status||'', '', '']));
    data.followups.forEach(f=>rows.push(['follow-up',f.id,f.date,f.doctor,`${f.type||''} | ${f.notes||''}`,f.status||'', '', '']));
    data.products.forEach(p=>rows.push(['product',p.id,'',p.name,`${p.composition||''} | ${p.category||''}`,p.active?'active':'inactive',p.price||0,p.stock||0]));
    data.sales.forEach(s=>rows.push(['sale',s.id,s.date,s.product,s.source||'', '',s.amount||0,s.units||0]));
    const csv=rows.map(row=>row.map(cell=>`"${String(cell??'').replace(/"/g,'""')}"`).join(',')).join('\r\n');
    const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='ransar-business-export.csv';a.click();URL.revokeObjectURL(url);toast('CSV export downloaded.');
  });
  $('#todayLabel').textContent=today.toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'}).toUpperCase();
  $('#year').textContent=today.getFullYear();
  renderView('overview');
})();