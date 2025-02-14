interface ILanguage {
  ids: string | string[];
  defaultExtension: string; // this is only used for exampleGenerator, so it can know which extension to use.
}

export interface INativeLanguageCollection {
  bat: ILanguage;
  c: ILanguage;
  ceylon: ILanguage;
  clojure: ILanguage;
  clojurescript: ILanguage;
  coffeescript: ILanguage;
  cpp: ILanguage;
  css: ILanguage;
  csv: ILanguage;
  diff: ILanguage;
  dockerfile: ILanguage;
  fsharp: ILanguage;
  git: ILanguage;
  go: ILanguage;
  goctl: ILanguage;
  groovy: ILanguage;
  handlebars: ILanguage;
  hlsl: ILanguage;
  html: ILanguage;
  ini: ILanguage;
  java: ILanguage;
  javascript: ILanguage;
  javascriptreact: ILanguage;
  json: ILanguage;
  jsonc: ILanguage;
  jsonl: ILanguage;
  less: ILanguage;
  lua: ILanguage;
  makefile: ILanguage;
  markdown: ILanguage;
  objectivec: ILanguage;
  objectivecpp: ILanguage;
  perl: ILanguage;
  perl6: ILanguage;
  php: ILanguage;
  plaintext: ILanguage;
  powershell: ILanguage;
  properties: ILanguage;
  pug: ILanguage;
  python: ILanguage;
  r: ILanguage;
  razor: ILanguage;
  restructuredtext: ILanguage;
  ruby: ILanguage;
  rust: ILanguage;
  scss: ILanguage;
  shaderlab: ILanguage;
  shellscript: ILanguage;
  sql: ILanguage;
  swift: ILanguage;
  typescript: ILanguage;
  typescriptreact: ILanguage;
  vb: ILanguage;
  xml: ILanguage;
  xsl: ILanguage;
  yaml: ILanguage;
  yarnlock: ILanguage;
}
