import{j as e}from"./index-BCMFv3iT.js";import{r as o,L as I}from"./vendor-COMJun3p.js";import{S as $}from"./SEO-gVj_harH.js";import"./firebase-DZ9VvTiY.js";const T={en:{back:"Back to Portal",badge:"INVESTMENT TOOL",title:"ROI Calculator",subtitle:"Estimate your return on investment for premium real estate properties. Adjust the parameters below to see projected returns.",propPrice:"Property Price",downPayment:"Down Payment",annualRent:"Annual Rental Income",appreciation:"Annual Appreciation",holdYears:"Investment Period",years:"years",calculate:"Calculate ROI",results:"Investment Projection",totalInvested:"Total Invested",propertyValueEnd:"Property Value",totalRentalIncome:"Total Rental Income",totalReturn:"Total Return",netProfit:"Net Profit",roi:"ROI",annualRoi:"Annual ROI",breakdownTitle:"Year-by-Year Breakdown",year:"Year",value:"Property Value",rentCum:"Cumulative Rent",totalVal:"Total Value",disclaimer:"This calculator provides estimates for informational purposes only. Actual returns may vary based on market conditions, taxes, maintenance costs, and other factors. Consult a financial advisor before making investment decisions.",currency:"$",unitTypes:"Unit Type",penthouse:"Penthouse",standard:"Standard Residence",studio:"Studio Apartment",custom:"Custom"},ar:{back:"العودة إلى البوابة",badge:"أداة استثمارية",title:"حاسبة العائد على الاستثمار",subtitle:"قدّر عائد استثمارك في العقارات الفاخرة. عدّل المعطيات أدناه لعرض العوائد المتوقعة.",propPrice:"سعر العقار",downPayment:"الدفعة المقدمة",annualRent:"الإيجار السنوي",appreciation:"التقدير السنوي",holdYears:"فترة الاستثمار",years:"سنوات",calculate:"احسب العائد",results:"توقعات الاستثمار",totalInvested:"إجمالي المستثمر",propertyValueEnd:"قيمة العقار",totalRentalIncome:"إجمالي الإيجار",totalReturn:"إجمالي العائد",netProfit:"صافي الربح",roi:"العائد على الاستثمار",annualRoi:"العائد السنوي",breakdownTitle:"التفصيل السنوي",year:"السنة",value:"قيمة العقار",rentCum:"الإيجار التراكمي",totalVal:"القيمة الإجمالية",disclaimer:"هذه الحاسبة تقدم تقديرات لأغراض إعلامية فقط. قد تختلف العوائد الفعلية بناءً على ظروف السوق والضرائب وتكاليف الصيانة وعوامل أخرى. استشر مستشاراً مالياً قبل اتخاذ قرارات الاستثمار.",currency:"$",unitTypes:"نوع الوحدة",penthouse:"بنتهاوس",standard:"سكن عادي",studio:"استوديو",custom:"مخصص"}},A=[{key:"penthouse",price:45e5,down:25,rent:28e4,appr:8.2},{key:"standard",price:18e5,down:20,rent:12e4,appr:7.5},{key:"studio",price:75e4,down:15,rent:55e3,appr:6.8}],Y=`
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');

.roi-page {
  min-height: 100vh; font-family: 'Outfit', sans-serif;
  background: linear-gradient(170deg, #0a0a0f 0%, #12121a 40%, #0d1117 100%);
  color: #e8e8ec; padding-bottom: 4rem;
  -webkit-font-smoothing: antialiased;
}
.roi-page * { margin: 0; padding: 0; box-sizing: border-box; }

.roi-nav {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.25rem 2.5rem; border-bottom: 1px solid rgba(255,255,255,0.06);
  backdrop-filter: blur(20px); position: sticky; top: 0; z-index: 50;
  background: rgba(10,10,15,0.8);
}
.roi-nav-logo { height: 48px; width: auto; }
.roi-nav-back {
  display: inline-flex; align-items: center; gap: 0.5rem;
  color: rgba(255,255,255,0.5); text-decoration: none; font-size: 0.8rem;
  font-weight: 500; transition: color 0.2s; border: 1px solid rgba(255,255,255,0.1);
  padding: 0.5rem 1rem; border-radius: 8px; background: rgba(255,255,255,0.03);
}
.roi-nav-back:hover { color: #fff; border-color: rgba(255,255,255,0.2); }
.roi-nav-back svg { width: 16px; height: 16px; }
.roi-lang { display: flex; gap: 3px; }
.roi-lang button {
  width: 34px; height: 30px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.04); cursor: pointer; font-size: 0.72rem; font-weight: 600;
  color: rgba(255,255,255,0.4); transition: all 0.2s; font-family: 'Outfit', sans-serif;
}
.roi-lang button.active { background: rgba(184,134,11,0.15); border-color: rgba(184,134,11,0.3); color: #b8860b; }
.roi-nav-right { display: flex; align-items: center; gap: 0.75rem; }

.roi-container { max-width: 960px; margin: 0 auto; padding: 3rem 2rem; }

.roi-header { text-align: center; margin-bottom: 3rem; }
.roi-badge {
  display: inline-block; font-size: 0.6rem; font-weight: 700; letter-spacing: 0.2em;
  color: #b8860b; margin-bottom: 1rem; padding: 0.35rem 1rem; border-radius: 50px;
  background: rgba(184,134,11,0.08); border: 1px solid rgba(184,134,11,0.15);
}
.roi-title {
  font-family: 'Playfair Display', serif; font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 500; margin-bottom: 0.75rem;
  background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.roi-subtitle { font-size: 0.9rem; line-height: 1.7; color: rgba(255,255,255,0.4); max-width: 560px; margin: 0 auto; }

/* Presets */
.roi-presets { display: flex; gap: 0.75rem; justify-content: center; margin-bottom: 2.5rem; flex-wrap: wrap; }
.roi-preset {
  padding: 0.6rem 1.25rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.5); font-size: 0.78rem;
  font-weight: 500; cursor: pointer; transition: all 0.25s; font-family: 'Outfit', sans-serif;
}
.roi-preset:hover { border-color: rgba(184,134,11,0.3); color: #b8860b; }
.roi-preset.active { background: rgba(184,134,11,0.1); border-color: rgba(184,134,11,0.3); color: #b8860b; }

/* Form */
.roi-form {
  display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
  border-radius: 20px; padding: 2rem; margin-bottom: 2.5rem;
}
.roi-field { display: flex; flex-direction: column; gap: 0.4rem; }
.roi-field.full { grid-column: 1 / -1; }
.roi-label {
  font-size: 0.72rem; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.08em; color: rgba(255,255,255,0.4);
}
.roi-input-wrap { position: relative; }
.roi-input {
  width: 100%; padding: 0.75rem 1rem; border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04);
  color: #fff; font-size: 1rem; font-family: 'Outfit', sans-serif;
  font-weight: 500; outline: none; transition: border-color 0.2s;
}
.roi-input:focus { border-color: rgba(184,134,11,0.4); }
.roi-input-suffix {
  position: absolute; right: 1rem; top: 50%; transform: translateY(-50%);
  font-size: 0.78rem; color: rgba(255,255,255,0.3); pointer-events: none;
}
.roi-slider-val {
  display: flex; justify-content: space-between; align-items: center; margin-top: 0.35rem;
}
.roi-slider-num { font-size: 1.1rem; font-weight: 600; color: #b8860b; }
.roi-slider {
  width: 100%; -webkit-appearance: none; appearance: none; height: 4px;
  border-radius: 2px; background: rgba(255,255,255,0.08); outline: none; margin-top: 0.5rem;
}
.roi-slider::-webkit-slider-thumb {
  -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%;
  background: #b8860b; cursor: pointer; border: 2px solid #0a0a0f;
  box-shadow: 0 0 8px rgba(184,134,11,0.4);
}

/* Results */
.roi-results {
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
  border-radius: 20px; padding: 2rem; margin-bottom: 2rem;
}
.roi-results-title {
  font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 500;
  margin-bottom: 1.5rem; color: #fff;
}
.roi-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
.roi-metric {
  padding: 1.25rem; border-radius: 14px;
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
  text-align: center;
}
.roi-metric-val {
  font-size: 1.35rem; font-weight: 700; display: block; margin-bottom: 0.2rem;
}
.roi-metric-val.gold { color: #b8860b; }
.roi-metric-val.green { color: #2a9d5c; }
.roi-metric-val.blue { color: #457b9d; }
.roi-metric-val.red { color: #e63946; }
.roi-metric-lbl {
  font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.08em;
  color: rgba(255,255,255,0.35);
}

/* Table */
.roi-table-wrap { overflow-x: auto; }
.roi-table-title {
  font-size: 0.85rem; font-weight: 600; margin-bottom: 1rem; color: rgba(255,255,255,0.6);
}
.roi-table {
  width: 100%; border-collapse: collapse; font-size: 0.8rem;
}
.roi-table th {
  text-align: left; padding: 0.6rem 1rem; font-size: 0.68rem; text-transform: uppercase;
  letter-spacing: 0.06em; color: rgba(255,255,255,0.3); border-bottom: 1px solid rgba(255,255,255,0.06);
  font-weight: 600;
}
.roi-table td {
  padding: 0.6rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.04);
  color: rgba(255,255,255,0.7);
}
.roi-table tr:last-child td { border-bottom: none; font-weight: 600; color: #b8860b; }

/* ROI Bar */
.roi-bar-wrap { margin-top: 1.5rem; }
.roi-bar-label { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
.roi-bar-text { font-size: 0.72rem; color: rgba(255,255,255,0.4); }
.roi-bar-pct { font-size: 0.85rem; font-weight: 700; color: #2a9d5c; }
.roi-bar-track {
  height: 8px; border-radius: 4px; background: rgba(255,255,255,0.06); overflow: hidden;
}
.roi-bar-fill {
  height: 100%; border-radius: 4px;
  background: linear-gradient(90deg, #b8860b, #2a9d5c);
  transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
}

.roi-disclaimer {
  font-size: 0.7rem; line-height: 1.6; color: rgba(255,255,255,0.25);
  text-align: center; max-width: 600px; margin: 2rem auto 0;
  padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.04);
}

/* Responsive */
@media (max-width: 700px) {
  .roi-form { grid-template-columns: 1fr; }
  .roi-metrics { grid-template-columns: 1fr 1fr; }
  .roi-nav { padding: 1rem 1.25rem; }
  .roi-container { padding: 2rem 1.25rem; }
}
@media (max-width: 480px) {
  .roi-metrics { grid-template-columns: 1fr; }
}
`;function s(t){return t>=1e6?`$${(t/1e6).toFixed(2)}M`:t>=1e3?`$${(t/1e3).toFixed(0)}K`:`$${t.toFixed(0)}`}function M(){return(navigator.language||navigator.userLanguage||"en").startsWith("ar")?"ar":"en"}function H(){const[t,g]=o.useState(M),S=t==="ar",a=r=>T[t]?.[r]||T.en[r]||r,[h,c]=o.useState("penthouse"),[i,x]=o.useState(45e5),[m,f]=o.useState(25),[p,v]=o.useState(28e4),[d,j]=o.useState(8.2),[n,O]=o.useState(5),V=r=>{c(r.key),x(r.price),f(r.down),v(r.rent),j(r.appr)},l=o.useMemo(()=>{const r=i*(m/100),y=r,w=[];let u=0;for(let b=1;b<=n;b++){const C=i*Math.pow(1+d/100,b);u+=p,w.push({year:b,propVal:C,cumRent:u,total:C+u-i+r})}const N=i*Math.pow(1+d/100,n),k=p*n,P=N+k,R=P-i,z=R/y*100,E=z/n;return{totalInvested:y,finalPropVal:N,totalRental:k,totalReturn:P,netProfit:R,roi:z,annualRoi:E,rows:w}},[i,m,p,d,n]);return e.jsxs("div",{className:"roi-page",dir:S?"rtl":"ltr",children:[e.jsx($,{title:"ROI Calculator",description:"Calculate real estate investment returns with adjustable parameters.",path:"/roi-calculator"}),e.jsx("style",{children:Y}),e.jsxs("nav",{className:"roi-nav",children:[e.jsx(I,{to:"/",children:e.jsx("img",{src:"/assets/images/logo.png",alt:"DynamicNFC",className:"roi-nav-logo"})}),e.jsxs("div",{className:"roi-nav-right",children:[e.jsxs("div",{className:"roi-lang",children:[e.jsx("button",{className:t==="en"?"active":"",onClick:()=>g("en"),children:"EN"}),e.jsx("button",{className:t==="ar"?"active":"",onClick:()=>g("ar"),children:"ع"})]}),e.jsxs(I,{to:"/enterprise/crmdemo/khalid",className:"roi-nav-back",children:[e.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M19 12H5M12 19l-7-7 7-7"})}),a("back")]})]})]}),e.jsxs("div",{className:"roi-container",children:[e.jsxs("div",{className:"roi-header",children:[e.jsx("span",{className:"roi-badge",children:a("badge")}),e.jsx("h1",{className:"roi-title",children:a("title")}),e.jsx("p",{className:"roi-subtitle",children:a("subtitle")})]}),e.jsxs("div",{className:"roi-presets",children:[A.map(r=>e.jsx("button",{className:`roi-preset${h===r.key?" active":""}`,onClick:()=>V(r),children:a(r.key)},r.key)),e.jsx("button",{className:`roi-preset${h==="custom"?" active":""}`,onClick:()=>c("custom"),children:a("custom")})]}),e.jsxs("div",{className:"roi-form",children:[e.jsxs("div",{className:"roi-field",children:[e.jsx("label",{className:"roi-label",children:a("propPrice")}),e.jsx("div",{className:"roi-input-wrap",children:e.jsx("input",{type:"number",className:"roi-input",value:i,onChange:r=>{x(Number(r.target.value)||0),c("custom")},min:0,step:5e4})})]}),e.jsxs("div",{className:"roi-field",children:[e.jsx("label",{className:"roi-label",children:a("annualRent")}),e.jsx("div",{className:"roi-input-wrap",children:e.jsx("input",{type:"number",className:"roi-input",value:p,onChange:r=>{v(Number(r.target.value)||0),c("custom")},min:0,step:5e3})})]}),e.jsxs("div",{className:"roi-field",children:[e.jsx("label",{className:"roi-label",children:a("downPayment")}),e.jsx("input",{type:"range",className:"roi-slider",min:10,max:100,value:m,onChange:r=>{f(Number(r.target.value)),c("custom")}}),e.jsxs("div",{className:"roi-slider-val",children:[e.jsxs("span",{className:"roi-slider-num",children:[m,"%"]}),e.jsx("span",{style:{fontSize:"0.78rem",color:"rgba(255,255,255,0.35)"},children:s(i*m/100)})]})]}),e.jsxs("div",{className:"roi-field",children:[e.jsx("label",{className:"roi-label",children:a("appreciation")}),e.jsx("input",{type:"range",className:"roi-slider",min:0,max:20,step:.1,value:d,onChange:r=>{j(Number(r.target.value)),c("custom")}}),e.jsxs("div",{className:"roi-slider-val",children:[e.jsxs("span",{className:"roi-slider-num",children:[d,"%"]}),e.jsxs("span",{style:{fontSize:"0.78rem",color:"rgba(255,255,255,0.35)"},children:[s(i*d/100)," / yr"]})]})]}),e.jsxs("div",{className:"roi-field full",children:[e.jsx("label",{className:"roi-label",children:a("holdYears")}),e.jsx("input",{type:"range",className:"roi-slider",min:1,max:15,value:n,onChange:r=>O(Number(r.target.value))}),e.jsx("div",{className:"roi-slider-val",children:e.jsxs("span",{className:"roi-slider-num",children:[n," ",a("years")]})})]})]}),e.jsxs("div",{className:"roi-results",children:[e.jsx("h2",{className:"roi-results-title",children:a("results")}),e.jsxs("div",{className:"roi-metrics",children:[e.jsxs("div",{className:"roi-metric",children:[e.jsx("span",{className:"roi-metric-val blue",children:s(l.totalInvested)}),e.jsx("span",{className:"roi-metric-lbl",children:a("totalInvested")})]}),e.jsxs("div",{className:"roi-metric",children:[e.jsx("span",{className:"roi-metric-val gold",children:s(l.finalPropVal)}),e.jsx("span",{className:"roi-metric-lbl",children:a("propertyValueEnd")})]}),e.jsxs("div",{className:"roi-metric",children:[e.jsx("span",{className:"roi-metric-val green",children:s(l.netProfit)}),e.jsx("span",{className:"roi-metric-lbl",children:a("netProfit")})]}),e.jsxs("div",{className:"roi-metric",children:[e.jsxs("span",{className:"roi-metric-val red",children:[l.roi.toFixed(1),"%"]}),e.jsx("span",{className:"roi-metric-lbl",children:a("roi")})]})]}),e.jsxs("div",{className:"roi-bar-wrap",children:[e.jsxs("div",{className:"roi-bar-label",children:[e.jsx("span",{className:"roi-bar-text",children:a("annualRoi")}),e.jsxs("span",{className:"roi-bar-pct",children:[l.annualRoi.toFixed(1),"%"]})]}),e.jsx("div",{className:"roi-bar-track",children:e.jsx("div",{className:"roi-bar-fill",style:{width:`${Math.min(l.annualRoi*2,100)}%`}})})]}),e.jsxs("div",{className:"roi-table-wrap",style:{marginTop:"2rem"},children:[e.jsx("div",{className:"roi-table-title",children:a("breakdownTitle")}),e.jsxs("table",{className:"roi-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:a("year")}),e.jsx("th",{children:a("value")}),e.jsx("th",{children:a("rentCum")}),e.jsx("th",{children:a("netProfit")})]})}),e.jsx("tbody",{children:l.rows.map(r=>e.jsxs("tr",{children:[e.jsx("td",{children:r.year}),e.jsx("td",{children:s(r.propVal)}),e.jsx("td",{children:s(r.cumRent)}),e.jsx("td",{children:s(r.propVal-i+r.cumRent)})]},r.year))})]})]})]}),e.jsx("p",{className:"roi-disclaimer",children:a("disclaimer")})]})]})}export{H as default};
