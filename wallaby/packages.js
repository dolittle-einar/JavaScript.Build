const importMap = document.createElement('script');
importMap.type = 'systemjs-packagemap';
importMap.src = '/packagemap.json'
document.currentScript.after(importMap);
