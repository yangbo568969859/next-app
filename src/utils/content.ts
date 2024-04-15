const path = require('path');
const fs = require('fs-extra');
const matter = require('gray-matter');
const pinyin = require('pinyin-pro');
const { isChinese } = require('@/src/utils/utils');
const { v4: uuidv4 } = require('uuid');
const { supportedIcons } = require('@/src/config/supportedIcons');

const rootDir = path.join(process.cwd(), 'src', 'content');
const configDir = path.join(process.cwd(), 'src', 'config');
const slug = 'content';

console.error('Reload Content');

interface ContentParam {
  id: string;
  title: string;
  icon: string;
  ext: string;
  description: string;
  link: string;
  path: string;
  children?: Array<ContentParam>;
  meta?: any;
  isDir: boolean;
}
let menuJson: Array<ContentParam> = [];

export const getMetaBySlug = (pathName: string) => {
  const fileContent = fs.readFileSync(pathName, 'utf-8');
  const { data } = matter(fileContent);
  return {
    meta: { ...data },
  };
};

let menus: Array<ContentParam> = [];
let menusTree: Array<ContentParam> = [];
let fileCount = 0;

function findFileTree(dir: string, slug: string, parent: Array<ContentParam>) {
  parent = parent || [];
  const dirs = fs.readdirSync(dir, { withFileTypes: true });
  dirs.forEach((value: any, index: number) => {
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
        parent[index].children as Array<ContentParam>
      );
    } else if (value.isFile()) {
      let name = value.name.slice(0, value.name.lastIndexOf('.'));
      let ext = value.name.slice(value.name.lastIndexOf('.'));
      const { meta } = getMetaBySlug(path.join(value.path, value.name));
      
      let icon
      if (meta.type) {
        icon = findIcon(meta.type);
      }
      menus.push({
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
  menuJson = menus;
}

function findIcon(filekey: string): string | undefined {
  let result
  for (let i = 0; i < supportedIcons.length; i++) {
    if (supportedIcons[i].extensions.includes(filekey)) {
      result = `/icons/Logos/file_type_${supportedIcons[i].icon}.svg`
      break;
    }
  }
  return result
}

findFileTree(rootDir, slug, menusTree);
fs.writeFileSync(path.join(configDir, 'menus.json'), JSON.stringify(menus));
fs.writeFileSync(
  path.join(configDir, 'menusTree.json'),
  JSON.stringify(menusTree)
);

export const getContentMenus = async () => {
  return menuJson;
};

export const getContentTreeMenus = async () => {
  return menusTree;
};

// @ts-ignore
function findIdInNestedArray(nestedArray, id) {
  for (let i = 0; i < nestedArray.length; i++) {
    if (nestedArray[i].link === id) {
      return nestedArray[i]
    }
    if (Array.isArray(nestedArray[i].children)) {
      // @ts-ignore
      const result = findIdInNestedArray(nestedArray[i].children, id);
      if (result) {
        return result;
      }
    }
  }
  return null
}
export const getContentTreeItems = async (key: string) => {
  let result
  if (menusTree.length) {
    result = findIdInNestedArray(menusTree, key)
  }
  if (result) {
    return result
  } else {
    throw new Error('not found');
    return '';
  }
};

export const getContentBySlug = async (pathName: string) => {
  let content;
  for (let i = 0; i < menuJson.length; i++) {
    if (menuJson[i].link === `content/${pathName}`) {
      content = menuJson[i];
      break;
    }
  }
  if (!content) {
    throw new Error('not found');
    return '';
  }
  const filePath = path.join(content.path, content.title);

  const fileContent = fs.readFileSync(filePath, 'utf-8');

  const { data } = matter(fileContent);
  // 如果文件名是中文，转成拼音
  const id = isChinese(content.title)
    ? pinyin(content.title, {
        toneType: 'none',
        separator: '-',
      })
    : content.title;
  return {
    meta: { ...data },
    content: fileContent,
  };
};
