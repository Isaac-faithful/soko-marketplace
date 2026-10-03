const base=(process.argv[2]||process.env.SOKO_BASE_URL||"http://localhost:4173").replace(/\/$/,"");
const checks=[
  ["homepage","/",r=>r.status===200&&r.text.includes("Shop Africa")],
  ["web app","/app/",r=>r.status===200&&r.text.includes("marketplace")],
  ["health","/api/health",r=>r.status===200&&r.json.ok===true],
  ["authentication page","/app/auth.html",r=>r.status===200&&r.text.includes("Create account")],
  ["legacy shop redirect","/shop",r=>r.status===308&&r.headers.get("location")==="/app/"],
  ["legacy app redirect","/auth.html",r=>r.status===308&&r.headers.get("location")==="/app/auth.html"],
  ["public-page redirect","/app/policies.html",r=>r.status===308&&r.headers.get("location")==="/policies.html"],
  ["help centre","/help.html",r=>r.status===200&&r.text.toLowerCase().includes("soko help centre")],
  ["hero video","/assets/video/soko-hero.mp4",r=>r.status===200&&r.headers.get("content-type")?.includes("video/mp4")],
  ["hero video range","/assets/video/soko-hero.mp4",r=>r.status===206&&Boolean(r.headers.get("content-range")),{Range:"bytes=0-1023"}]
];
let failed=0;
for(const [name,path,ok,headers={}] of checks){try{const response=await fetch(base+path,{headers,redirect:"manual"});const contentType=response.headers.get("content-type")||"";const text=contentType.includes("text/html")?await response.text():"";let json={};if(path==="/api/health")json=await response.json();const pass=ok({status:response.status,text,json,headers:response.headers});console.log(`${pass?"PASS":"FAIL"} ${name} (${response.status})`);if(!pass)failed++}catch(error){console.log(`FAIL ${name}: ${error.message}`);failed++}}
if(failed){console.error(`\n${failed} smoke check(s) failed.`);process.exit(1)}console.log(`\nAll ${checks.length} smoke checks passed for ${base}.`);
