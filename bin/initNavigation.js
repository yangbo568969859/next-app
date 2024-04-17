const { glob } = require('glob');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const matter = require('gray-matter');
const supportedIcons = require('./supportedIcons');

let menusTree = []
const getNavigationMenu = () => {
  // const navigationPath = path.join(process.cwd() + '/src/content')

  // const getMarkdownFiles = async (root, cwd, ignore = []) => {
  //   const strings = await glob('**/*.{md,mdx}', { root, cwd, ignore })
  //   console.log(strings)
  // }

  findFileTree(path.join(process.cwd(), 'src/content'), 'content', menusTree)

  // getMarkdownFiles(process.cwd(), 'src/content')
}

const getMetaBySlug = (pathName) => {
  const fileContent = fs.readFileSync(pathName, 'utf-8');
  const { data } = matter(fileContent);
  return {
    meta: { ...data },
  };
};

function findIcon(filekey) {
  let result
  for (let i = 0; i < supportedIcons.length; i++) {
    if (supportedIcons[i].extensions.includes(filekey)) {
      result = `/icons/Logos/file_type_${supportedIcons[i].icon}.svg`
      break;
    }
  }
  return result
}

const excludeFileNames = ['image', 'images', 'img']
const excludeExtNames = ['jpg', 'png', 'jpeg', 'gif', 'svg', 'ico']
function findFileTree(dir, slug, parent) {
  parent = parent || [];
  const dirs = fs.readdirSync(dir, { withFileTypes: true });
  dirs.forEach((value, index) => {
    console.log(value)
    // if (excludeFileNames.includes(value.name.toLowerCase())) {
    //   return;
    // }
    const isImageDir = excludeFileNames.includes(value.name.toLowerCase())
    if (value.isDirectory()) {
      let slugPush = slug + '/' + value.name;
      parent.push({
        id: uuidv4(),
        title: value.name,
        icon: "/icons/Logos/default_folder.svg",
        ext: "",
        description: '',
        link: slugPush,
        path: value.path,
        isDir: true,
        children: [],
        meta: null,
      });
      findFileTree(
        path.join(value.path, value.name),
        slugPush,
        parent[index].children
      );
    } else if (value.isFile()) {
      let name = value.name.slice(0, value.name.lastIndexOf('.'));
      let ext = value.name.slice(value.name.lastIndexOf('.'));
      const { meta } = getMetaBySlug(path.join(value.path, value.name));
      
      let icon
      if (meta.type) {
        icon = findIcon(meta.type);
      }
      parent.push({
        id: uuidv4(),
        title: value.name,
        icon: icon || '',
        description: meta.spoiler,
        ext: ext,
        link: slug + '/' + name,
        path: value.path,
        isDir: false,
        meta: meta,
      });
    }
  });
}

getNavigationMenu()

fs.writeFileSync(
  path.join(process.cwd(), 'navigation.json'),
  JSON.stringify(menusTree)
);