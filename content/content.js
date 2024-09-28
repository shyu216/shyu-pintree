function bookmarkToStructuredData(e){const{id:t,title:n,dateAdded:r,children:o}=e,a={type:o?"folder":"link",addDate:r,title:n};return o?a.children=o.map(bookmarkToStructuredData):(a.icon=`https://logo.clearbit.com/${new URL(e.url).hostname}`,a.url=e.url),a}async function fetchBookmarks(){return new Promise((e=>{chrome.bookmarks.getTree((t=>{const n=t[0].children.map(bookmarkToStructuredData);e(n)}))}))}function searchBookmarks(e){fetchBookmarks().then((t=>{const n=searchInData(t,e.toLowerCase());renderBookmarks(n,[{title:chrome.i18n.getMessage("searchResults"),children:n}])})).catch((e=>console.error(`${chrome.i18n.getMessage("errorSearchBookmark")}:`,e)))}function searchInData(e,t){let n=[];return e.forEach((e=>{if(e.title.toLowerCase().includes(t)&&n.push(e),e.children){const r=searchInData(e.children,t);r.length>0&&(n=n.concat(r))}})),n}function clearSearchResults(){fetchBookmarks().then((e=>{const t=e;renderNavigation(t,document.getElementById("navigation")),renderBookmarks(t,[{title:"Bookmark",children:t}]),document.getElementById("searchInput").value="",document.getElementById("clearSearchButton").classList.add("hidden")})).catch((e=>console.error(`${chrome.i18n.getMessage("errorSearch")}:`,e)))}function searchBookmarks(e){fetchBookmarks().then((t=>{const n=searchInData(t,e.toLowerCase());renderBookmarks(n,[{title:chrome.i18n.getMessage("searchResults"),children:n}]),document.getElementById("clearSearchButton").classList.remove("hidden")})).catch((e=>console.error(`${chrome.i18n.getMessage("errorSearchBookmark")}:`,e)))}function createCard(e,t,n){const r=document.createElement("div");r.className="cursor-pointer flex items-center hover:shadow-sm transition-shadow p-4 bg-white shadow-sm ring-1 ring-gray-900/5 dark:pintree-ring-gray-800 rounded-lg hover:bg-gray-100 dark:pintree-bg-gray-900 dark:hover:pintree-bg-gray-800",r.onclick=()=>window.open(t,"_blank");const o=document.createElement("img");o.src=n||"assets/default-icon.svg",o.alt=e,o.className="w-8 h-8 mr-4 rounded-full flex-shrink-0 card-icon-bg",o.onerror=()=>{o.src="assets/default-icon.svg"};const a=document.createElement("div");a.className="flex flex-col overflow-hidden";const c=document.createElement("h2");c.className="text-sm font-medium mb-1 truncate dark:text-gray-400",c.innerText=e;const d=t.replace(/^https?:\/\//,"").replace(/\/$/,""),s=document.createElement("p");return s.className="text-xs text-gray-400 dark:text-gray-600 dark:hover:text-gray-400 truncate",s.innerText=d,a.appendChild(c),a.appendChild(s),r.appendChild(o),r.appendChild(a),r}function createFolderCard(e,t,n){const r=document.createElement("div");r.className="folder-card text-gray rounded-lg cursor-pointer flex flex-col items-center",r.onclick=()=>{const r=n.concat({title:e,children:t});renderBookmarks(t,r),updateSidebarActiveState(r)};const o=document.createElement("div");o.innerHTML='\n      <svg viewBox="0 0 100 80" class="folder__svg">\n        <rect x="0" y="0" width="100" height="80" class="folder__back" />\n        <rect x="15" y="8" width="70" height="60" class="paper-1" />\n        <rect x="10" y="18" width="80" height="50" class="paper-2" />\n        <rect x="0" y="10" width="100" height="70" class="folder__front" />\n        <rect x="0" y="10" width="100" height="70" class="folder__front right" />\n      </svg>\n    ',o.className="mb-2";const a=document.createElement("h2");return a.className="text-xs font-normal text-center w-full truncate dark:text-gray-400",a.innerText=e,r.appendChild(o),r.appendChild(a),r}function renderNavigation(e,t,n=!1,r=[]){t.innerHTML="",e.forEach(((e,o)=>{if("folder"===e.type){const a=document.createElement("li");a.className="items-center group flex justify-between gap-x-3 rounded-md p-2 text-gray-700 dark:text-gray-400 hover:text-main-500 hover:bg-gray-50 dark:hover:pintree-bg-gray-800 bg-opacity-50";const c=document.createElement("div");c.className="flex items-center space-x-2 truncate";const d=document.createElement("span");d.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7a2 2 0 012-2h4l2 2h7a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" /></svg>';const s=document.createElement("a");s.className="flex text-sm leading-6 font-semibold dark:text-gray-400",s.innerText=e.title,c.appendChild(d),c.appendChild(s);const i=document.createElement("span");if(i.className="ml-2 transform transition-transform",i.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>',a.appendChild(c),e.children&&e.children.length>0&&a.appendChild(i),t.appendChild(a),e.children&&e.children.length>0){const c=document.createElement("ul");c.className="ml-4 space-y-2 hidden",renderNavigation(e.children,c,!1,r.concat({title:e.title,children:e.children})),t.appendChild(c),n&&0===o&&(c.classList.remove("hidden"),i.classList.add("rotate-90")),a.onclick=t=>{t.stopPropagation(),document.querySelectorAll("#navigation .sidebar-active").forEach((e=>e.classList.remove("sidebar-active"))),a.classList.add("sidebar-active"),c.classList.toggle("hidden"),c.children.length>0&&i.classList.toggle("rotate-90"),renderBookmarks(e.children,r.concat({title:e.title,children:e.children}))}}else a.onclick=t=>{t.stopPropagation(),document.querySelectorAll("#navigation .sidebar-active").forEach((e=>e.classList.remove("sidebar-active"))),a.classList.add("sidebar-active"),renderBookmarks(e.children,r.concat({title:e.title,children:e.children}))}}}))}function renderBreadcrumbs(e){const t=document.getElementById("breadcrumbs-path");t.innerHTML="",e.forEach(((n,r)=>{const o=document.createElement("span");if(o.className="cursor-pointer hover:underline",o.innerText=n.title,o.onclick=()=>{const t=e.slice(0,r+1);renderBookmarks(n.children,t),updateSidebarActiveState(t),document.getElementById("clearSearchButton").classList.add("hidden")},t.appendChild(o),r<e.length-1){const e=document.createElement("span");e.innerText=" > ",t.appendChild(e)}}))}function updateSidebarActiveState(e){document.querySelectorAll("#navigation .sidebar-active").forEach((e=>e.classList.remove("sidebar-active")));let t=document.getElementById("navigation");e.forEach(((n,r)=>{t.querySelectorAll("li").forEach((o=>{const a=o.querySelector("a");if(a&&a.innerText===n.title&&(r===e.length-1&&o.classList.add("sidebar-active"),r<e.length-1)){const e=o.querySelector("ul");e&&(e.classList.remove("hidden"),t=e)}}))}))}function showNoResultsMessage(){const e=document.getElementById("bookmarks");e.innerHTML="";const t=document.createElement("div");t.className="flex flex-col items-center justify-center h-full";const n=document.createElement("svg");n.setAttribute("xmlns","http://www.w3.org/2000/svg"),n.setAttribute("class","h-16 w-16 text-gray-500"),n.setAttribute("fill","none"),n.setAttribute("viewBox","0 0 24 24"),n.setAttribute("stroke","currentColor"),n.innerHTML='<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m9-3a9 9 0 11-18 0 9 9 0 0118 0z" />';const r=document.createElement("h2");r.className="text-gray-500 text-xl font-semibold mt-4",r.textContent=chrome.i18n.getMessage("nope");const o=document.createElement("p");o.className="text-gray-500 mt-2",o.textContent=chrome.i18n.getMessage("searchTips"),t.appendChild(n),t.appendChild(r),t.appendChild(o),e.appendChild(t)}function renderBookmarks(e,t){const n=document.getElementById("bookmarks");n.innerHTML="",renderBreadcrumbs(t);const r=e.filter((e=>"folder"===e.type)),o=e.filter((e=>"link"===e.type));if(0!==r.length||0!==o.length){if(r.length>0){const e=document.createElement("div");e.className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-8 2xl:grid-cols-12 gap-6",r.forEach((n=>{const r=createFolderCard(n.title,n.children,t);e.appendChild(r)})),n.appendChild(e)}if(r.length>0&&o.length>0){const e=document.createElement("hr");e.className="my-1 border-t-1 border-gray-200 dark:pintree-border-gray-800",n.appendChild(e)}if(o.length>0){const e=document.createElement("div");e.className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-6",o.forEach((t=>{const n=createCard(t.title,t.url,t.icon);e.appendChild(n)})),n.appendChild(e)}updateSidebarActiveState(t)}else showNoResultsMessage()}document.addEventListener("DOMContentLoaded",(()=>{i18n(),openLinkInNewTab()})),document.addEventListener("DOMContentLoaded",(()=>{const e=document.getElementById("open-sidebar-button"),t=document.getElementById("close-sidebar-button"),n=document.getElementById("off-canvas-menu"),r=document.getElementById("off-canvas-backdrop"),o=document.getElementById("off-canvas-content"),a=()=>{r.classList.remove("opacity-100"),o.classList.remove("translate-x-0"),setTimeout((()=>{n.classList.add("hidden")}),300)};e?.addEventListener("click",(()=>{n.classList.remove("hidden"),setTimeout((()=>{r.classList.add("opacity-100"),o.classList.add("translate-x-0")}),10)})),t.addEventListener("click",a),r.addEventListener("click",a)})),document.getElementById("searchButton").addEventListener("click",(()=>{const e=document.getElementById("searchInput").value;searchBookmarks(e)})),document.getElementById("clearSearchButton").addEventListener("click",clearSearchResults),fetchBookmarks().then((e=>{const t=e;if(renderNavigation(t,document.getElementById("navigation"),!0),renderBookmarks(t,[{title:"Bookmark",children:t}]),t.length>0){const e=t[0];updateSidebarActiveState([{title:e.title,children:e.children}]),renderBookmarks(e.children,[{title:"Bookmark",children:t},{title:e.title,children:e.children}])}})).catch((e=>console.error(`${chrome.i18n.getMessage("errorLoadingBookmarks")}`,e))),document.getElementById("searchInput").addEventListener("keydown",(function(e){if("Enter"===e.key){const t=e.target.value;searchBookmarks(t)}})),document.getElementById("searchButton").addEventListener("click",(function(){const e=document.getElementById("searchInput").value;searchBookmarks(e)}));const themeToggleButton=document.getElementById("themeToggleButton"),sunIcon=document.getElementById("sunIcon"),moonIcon=document.getElementById("moonIcon");function applyDarkTheme(){document.documentElement.classList.add("dark"),sunIcon.classList.add("hidden"),moonIcon.classList.remove("hidden")}function applyLightTheme(){document.documentElement.classList.remove("dark"),sunIcon.classList.remove("hidden"),moonIcon.classList.add("hidden")}function toggleTheme(){document.documentElement.classList.contains("dark")?applyLightTheme():applyDarkTheme()}function applyColorTheme(e){"dark"===e?applyDarkTheme():applyLightTheme()}document.addEventListener("DOMContentLoaded",(()=>{fetchBookmarks().then((e=>{document.getElementById("loading-spinner").style.display="none";const t=e;if(renderNavigation(t,document.getElementById("navigation"),!0),renderBookmarks(t,[{title:"Bookmark",children:t}]),t.length>0){const e=t[0];updateSidebarActiveState([{title:e.title,children:e.children}]),renderBookmarks(e.children,[{title:"Bookmark",children:t},{title:e.title,children:e.children}])}})).catch((e=>{console.error(`${chrome.i18n.getMessage("errorLoadingBookmarks")}`,e),document.getElementById("loading-spinner").style.display="none"}))})),themeToggleButton.addEventListener("click",toggleTheme);const prefersDarkTheme=window.matchMedia("(prefers-color-scheme: dark)").matches;function openLinkInNewTab(){const e=document.getElementById("NewTabCheckbox");chrome.storage.sync.get("openInNewTab",(t=>{t.openInNewTab?e.checked=!0:e.checked=!1})),e.onclick=()=>{e.checked?chrome.storage.sync.set({openInNewTab:!0}):chrome.storage.sync.set({openInNewTab:!1})}}function i18n(){document.getElementById("setNewTab_i18n").textContent=chrome.i18n.getMessage("setNewTab"),[...document.getElementsByClassName("appName_i18n")].forEach((e=>{e.textContent=chrome.i18n.getMessage("appName")})),document.getElementById("searchInput").setAttribute("placeholder",chrome.i18n.getMessage("search")),document.getElementById("clear_i18n").textContent=chrome.i18n.getMessage("clear"),document.getElementById("closeSidebar_i18n").textContent=chrome.i18n.getMessage("closeSidebar")}applyColorTheme(prefersDarkTheme?"dark":"light"),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",(e=>{applyColorTheme(e.matches?"dark":"light")})),document.getElementById("open-sidebar-button")?.addEventListener("click",(function(){var e=document.getElementById("navigation").cloneNode(!0);document.getElementById("sidebar-2").appendChild(e)})),document.addEventListener("DOMContentLoaded",(e=>{const t=document.getElementById("modal");document.getElementById("open").onclick=()=>{t.classList.remove("hidden")},t.onclick=e=>{e.target===t&&t.classList.add("hidden")}})),document.addEventListener("DOMContentLoaded",(e=>{const t=document.getElementById("currentYear"),n=(new Date).getFullYear();t.textContent=n}));