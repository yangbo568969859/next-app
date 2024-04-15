const path = require('path');
const fs = require('fs-extra');
const matter = require('gray-matter');
const pinyin = require('pinyin-pro');
const { isChinese } = require('@/src/utils/utils');

const rootDir = path.join(process.cwd(), 'src', 'content');
const slug = 'content';

interface ContentParam {
  name: string;
  path: string;
  slug: string;
  slugNoExt: string;
  nameNoExt: string;
}
let menuJson: Array<ContentParam> = [];

let menus: Array<ContentParam> = [];
function findFile(dir: string, slug: string) {
  const dirs = fs.readdirSync(dir, { withFileTypes: true });
  dirs.forEach((value: any) => {
    if (value.isDirectory()) {
      let slugPush = slug + '/' + value.name;
      findFile(path.join(value.path, value.name), slugPush);
    } else {
      let name = value.name.slice(0, value.name.lastIndexOf('.'));
      let slugPush = slug + '/' + value.name;
      if (value.isFile()) {
        menus.push({
          ...value,
          slug: slugPush,
          slugNoExt: slug + '/' + name,
          nameNoExt: name,
        });
      }
    }
  });
  menuJson = menus;
}
findFile(rootDir, slug);
fs.writeFileSync(path.join(rootDir, 'menus.json'), JSON.stringify(menus));

export const getAllContentsMeta = async () => {
  // 获取app/content下所有文件
  const dirs = fs
    .readdirSync(rootDir, { withFileTypes: true })
    .filter((entry: any) => entry.isDirectory())
    .map((entry: any) => {
      // console.log(entry);
      return entry.name;
    });

  // let datas = await Promise.all(
  //   dirs.map(async (dir: string) => {
  //     const { meta, content } = await getContentBySlug(dir);
  //     return {
  //       meta,
  //       content,
  //     };
  //   })
  // );

  // datas.sort((a, b) => {
  //   return Date.parse(b.meta.date) - Date.parse(a.meta.date) ? 1 : -1;
  // });

  // return datas;
};

export const getContentMenus = async () => {
  // const filePath = path.join(process.cwd(), 'src', pathName);
  // console.log(filePath);
  return menuJson;
};

export const getContentBySlug = async (pathName: string) => {
  let content;
  console.log(pathName);
  for (let i = 0; i < menuJson.length; i++) {
    if (menuJson[i].slugNoExt === `content/${pathName}`) {
      content = menuJson[i];
      break;
    }
  }
  if (!content) {
    throw new Error('not found');
  }
  // const filePath = path.join(rootDir, dir, 'index.mdx');
  const filePath = path.join(content.path, content.name);
  console.log(filePath);

  const fileContent = fs.readFileSync(filePath, 'utf-8');

  const { data } = matter(fileContent);
  // 如果文件名是中文，转成拼音
  const id = isChinese(content.nameNoExt)
    ? pinyin(content.nameNoExt, {
        toneType: 'none',
        separator: '-',
      })
    : content.nameNoExt;
  console.log(id);
  return {
    meta: { ...data, slug: content.slug, id },
    content: fileContent,
  };
};

// export const getContent = async (slug: string) => {
//   const posts = await getAllContentsMeta();
//   if (!slug) throw new Error('not found');
//   const post = posts.find((post) => post.meta.slug === slug);
//   if (!post) {
//     throw new Error('not found');
//   }
//   return post;
// };
