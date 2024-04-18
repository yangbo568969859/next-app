// import { remark } from 'remark'
// import remarkParse  from 'remark-parse'
// import { visit } from 'unist-util-visit'

// const markdown = `
// # Title

// Some content.
// `;

// remark()
//   .use(remarkParse)
//   .process(markdown, function (err, file) {
//     console.log('remark', file)
//     if (err) throw err;
//     visit(file, 'text', (node) => {
//       console.log('node', node)
//       if (node.depth === 1) {
//         const title = node.children[0].value;
//         console.log(title);  // 输出标题
//       }
//     });
//   });

// import {fromMarkdown} from 'mdast-util-from-markdown'
import {visit} from 'unist-util-visit'
import matter from "gray-matter";
import { remark } from 'remark'
import fs from 'fs'
import path from 'path'

// const tree = fromMarkdown('Some *emphasis*, **strong**, and `code`.')

// console.log(tree)
// visit(tree, 'text', function (node, index, parent) {
//   console.log([node.value, parent ? parent.type : index])
// })

function headingTree() {
  return (node, file) => {
    file.data.headings = getHeadings(node);
  };
}

function getHeadings(root) {
  const nodes = {};
  const output = [];
  const indexMap = {};
  console.log(root)
  visit(root, "heading", (node) => {
    addID(node, nodes);
    transformNode(node, output, indexMap);
  })
  return output;
}

function addID(node, nodes) {
  const id = node.children.map((c) => c.value).join("");
  nodes[id] = (nodes[id] || 0) + 1;
  node.data = node.data || {
    hProperties: {
      id: `${id}${nodes[id] > 1 ? ` ${nodes[id] - 1}` : ""}`
        .replace(/[^a-zA-Z\d\s-]/g, "")
        .split(" ")
        .join("-")
        .toLowerCase(),
    },
  };
}

function transformNode(node, output, indexMap) {
  const transformedNode = {
    value: toString(node.children[0].value),
    depth: node.depth,
    data: node.data,
    children: [],
  };

  if (node.depth === 2) {
    output.push(transformedNode);
    indexMap[node.depth] = transformedNode;
  } else {
    const parent = indexMap[node.depth - 1];
    if (parent) {
      parent.children.push(transformedNode);
      indexMap[node.depth] = transformedNode;
    }
  }
}

const getHeadings1 = async (id) => {
  const fileContents = fs.readFileSync(path.join(process.cwd(), 'TEMPLATE.md'), "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);
  console.log('matterResult', matterResult.content)
  // Use remark to convert Markdown into HTML string
  const processedContent = await remark()
    .use(headingTree)
    .process(matterResult.content);
  return processedContent.data.headings;
}

getHeadings1(1)
// fs.writeFileSync(path.join(process.cwd(), '111.json'), getHeadings1(1));