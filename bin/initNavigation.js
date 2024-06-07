const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const matter = require('gray-matter');
const supportedIcons = require('./supportedIcons');
const dirInfo = require('./dirInfo');

let menusTree = []
const getNavigationMenu = () => {
  findFileTree(path.join(process.cwd(), 'pages/content'), '', menusTree)
  if (menusTree.length > 0) {
    formatNavigationMenu(menusTree)
  }
}

const formatNavigationMenu = (menusTree) => {
  for (let i = 0; i < menusTree.length; i++) {
    if (['images', 'image', 'img'].includes(menusTree[i].title.toLowerCase())) {
      copyMdImage(menusTree[i])
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
    if (supportedIcons[i].extensions.includes(filekey.toLowerCase())) {
      result = `/icons/Logos/file_type_${supportedIcons[i].icon}.svg`
      break;
    }
  }
  if (result) {
    console.log(result)
  }
  return result
}

const destinationFolder = path.join(process.cwd(), 'public/mdAssets')
function copyMdImage(data) {
  const filePath = path.join(process.cwd(), 'pages/content', data.link)
  fs.readdir(filePath, (err, files) => {
    if (err) {
      console.error('Error reading source folder:', err);
      return;
    }
    files.forEach(file => {
      const extname = path.extname(file).toLowerCase();
      if (extname === '.jpg' || extname === '.jpeg' || extname === '.png' || extname === '.gif') {
        // 构建源文件路径和目标文件路径
        const sourceFilePath = path.join(filePath, file);
        const destinationFilePath = path.join(destinationFolder, data.link, file);
        fs.copy(sourceFilePath, destinationFilePath, (err) => {
          if (err) {
            console.error('Error copying file:', err);
          } else {
            console.log('File copied successfully:', file);
          }
        })
      }
    })
  })
}

function findFileTree(dir, slug, parent) {
  parent = parent || [];
  const dirs = fs.readdirSync(dir, { withFileTypes: true });
  dirs.forEach((value, index) => {
    if (value.isDirectory()) {
      let slugPush = slug + '/' + value.name;
      const dirInfoData = dirInfo[value.name.toLowerCase()]
      let icon = findIcon(value.name);
      parent.push({
        id: uuidv4(),
        title: dirInfoData ? dirInfoData.title : value.name,
        icon: icon || "/icons/Logos/default_folder.svg",
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
        // title: value.name,
        title: name || 'index',
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

// const sortIndex = ['前端知识库']

fs.writeFileSync(
  path.join(process.cwd(), 'navigation.json'),
  JSON.stringify(menusTree)
);