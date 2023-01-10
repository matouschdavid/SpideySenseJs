const pageToBuild = process.argv[2];
const publicPath = "./public";
const fs = require("fs");

const pageHtml = fs.readFileSync(
  `./views/${pageToBuild}/${pageToBuild}.page`,
  "utf-8"
);

buildPage(pageHtml, pageToBuild);

function buildPage(html, routedPage) {
  let indexHtml = fs.readFileSync("./index.html", "utf-8");
  indexHtml = includeComponent(indexHtml, "routing", html);
  indexHtml = processPage(indexHtml, routedPage);
  saveBuiltHtml(indexHtml);
}

function includeComponent(html, componentName, componentHtml) {
  let cssName = componentName;
  if (cssName == "routing") cssName = pageToBuild;
  componentHtml =
    `<link rel="stylesheet" href="${publicPath}/stylings/${cssName}.css">` +
    componentHtml;

  componentHtml = addCssPrefixes(componentHtml, cssName);
  return html.replaceAll(
    `<${componentName}-component><\/${componentName}-component>`,
    componentHtml
  );
}

function addCssPrefixes(html, cssName) {
  html = html.replace(/class="([*\w\s-_]*)"/g, (_replacer, classes) => {
    return `class="${classes
      .split(" ")
      .map((c) => c.replaceAll(" ", ""))
      .map((c) => addPrefix(cssName, c))
      .join(" ")}"`;
  });

  if (!fs.existsSync(`${publicPath}/views`)) {
    fs.mkdirSync(`${publicPath}/views`);
  }

  const prefixedCssContent = fs
    .readFileSync(`./views/${cssName}/${cssName}.css`, "utf-8")
    .replace(/\.([\w-_>\["'\]]*)\s*{/g, (_replacer, className) => {
      return `.${cssName}_${className} {`;
    });

  if (!fs.existsSync(`${publicPath}/stylings`)) {
    fs.mkdirSync(`${publicPath}/stylings`);
  }

  fs.writeFileSync(`${publicPath}/stylings/${cssName}.css`, prefixedCssContent);

  return html;
}

function addPrefix(cssName, c) {
  if (c.startsWith("*")) {
    return `global_${c.substring(1)}`;
  }
  return `${cssName}_${c}`;
}

function processPage(html, routedPage) {
  html = parseHtml(html, routedPage);
  return html;
}

function parseHtml(html, routedPage) {
  const formIds = [];
  return html
    .replace(
      /<(\w+)-component><\/\w+-component>/g,
      (replacer, componentName) => {
        return includeComponent(
          replacer,
          componentName,
          getComponentHtml(componentName)
        );
      }
    )
    .replace(
      /<\w+[^>]* \(click\)="(\w+\((\*?[^<>]+\s*,?\s*)*\))"[^>]*>[^<]*<\/\w+>/g,
      (replacer, p1, params) => {
        let paramsList = "";
        let clientParams = [];
        params.split(",").forEach((element) => {
          element = element.replaceAll(" ", "");
          let value = "";
          if (element.startsWith("*")) {
            value = `tbd`;
            clientParams.push(element);
            startIndex = 1;
          } else {
            value = element.replaceAll("'", "").replaceAll('"', "");
            startIndex = 0;
          }
          paramsList += `<input hidden id="${element}_${
            p1.split("(")[0]
          }" name="${element.substring(startIndex)}" value="${value}" />\n`;
        });
        let clientParamsText = "";
        clientParams.forEach((param) => {
          clientParamsText += `document.getElementById('${param}_${
            p1.split("(")[0]
          }').value = document.getElementById('${param.substring(1)}').value;`;
        });
        formIds.push(p1.split("(")[0]);
        const nr = formIds.filter((x) => x == p1.split("(")[0]).length;
        const tagData = replacer.replace(
          `\(click\)="${p1}"`,
          `onclick="{
                ${clientParamsText}
                document.getElementById('${
                  p1.split("(")[0]
                }Form${nr}').submit();}"`
        );
        p1 = p1.split("(")[0];

        const result = `  <form id="${p1}Form${nr}" action="/${routedPage}" method="post">
                                <input hidden name="onclick" value="${p1}" />
                                <input hidden name="params" value="${params}" />
                                ${paramsList}
                                ${tagData}
                            </form>`;
        return result;
      }
    );
}

function getComponentHtml(name) {
  return fs.readFileSync(`views/${name}/${name}.component`, "utf-8");
}

function saveBuiltHtml(html) {
  fs.mkdirSync("../public/views/", {
    recursive: true,
  });
  fs.writeFileSync(`${publicPath}/views/${pageToBuild}.page.built`, html);
}
