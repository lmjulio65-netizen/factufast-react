const fs = require('fs');
const path = require('path');

const exts = ['.js', '.jsx', '.css', '.html', '.json', '.md'];
const root = path.join(__dirname, '..', 'src');

async function walk(dir){
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for(const e of entries){
    const full = path.join(dir, e.name);
    if(e.isDirectory()) await walk(full);
    else if(exts.includes(path.extname(e.name))) await processFile(full);
  }
}

async function processFile(file){
  try{
    const data = await fs.promises.readFile(file, 'utf8');
    let out = data;
    // remove trailing spaces/tabs
    out = out.replace(/[ \t]+$/gm, '');
    // collapse 3+ newlines into 2
    out = out.replace(/\n{3,}/g, '\n\n');
    // write only if changed
    if(out !== data){
      await fs.promises.copyFile(file, file + '.bak');
      await fs.promises.writeFile(file, out, 'utf8');
      console.log('Fixed:', file);
    }
  }catch(err){
    console.error('Err:', file, err.message);
  }
}

walk(root).then(()=>console.log('Done')).catch(err=>console.error(err));
