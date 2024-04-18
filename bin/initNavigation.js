const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const matter = require('gray-matter');
const supportedIcons = require('./supportedIcons');
const dirInfo = require('./dirInfo');

let menusTree = []
const getNavigationMenu = () => {
  findFileTree(path.join(process.cwd(), 'src/content'), '', menusTree)
  if (menusTree.length > 0) {
    formatNavigationMenu(menusTree)
  }
}

const formatNavigationMenu = (menusTree) => {
  for (let i = 0; i < menusTree.length; i++) {
    if (['images', 'image', 'img'].includes(menusTree[i].title.toLowerCase())) {
      menusTree.splice(i, 1)
      continue;
    }
    if (menusTree[i].children && menusTree[i].children.length > 0) {
      formatNavigationMenu(menusTree[i].children)
    }
  }
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

function findFileTree(dir, slug, parent) {
  parent = parent || [];
  const dirs = fs.readdirSync(dir, { withFileTypes: true });
  dirs.forEach((value, index) => {
    if (value.isDirectory()) {
      let slugPush = slug + '/' + value.name;
      const dirInfoData = dirInfo[value.name.toLowerCase()]
      parent.push({
        id: uuidv4(),
        title: dirInfoData ? dirInfoData.title : value.name,
        icon: "/icons/Logos/default_folder.svg",
        description: dirInfoData ? dirInfoData.description : '',
        link: slugPush,
        isDir: true,
        children: []
      });
      findFileTree(
        path.join(value.path, value.name),
        slugPush,
        parent[index].children
      );
    } else if (value.isFile()) {
      let name = value.name.slice(0, value.name.lastIndexOf('.'));
      if (name === 'index') {
        name = ''
      }
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
        link: slug + (name ? ('/' + name) : ''),
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