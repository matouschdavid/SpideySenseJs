const ServiceProvider = require("./service_provider");

module.exports.initEngine = function (app) {
  const fs = require("fs"); // this engine requires the fs module
  app.engine("page.built", render);

  app.set("views", "./public/views"); // specify the views directory
  app.set("view engine", "page.built"); // register the template engine
  let scriptLines = [];
  async function render(filePath, options, callback) {
    options = cleanUpParams(options);
    const pageName = getPageName(filePath);
    const pageObj = await createPageObject(pageName, options);
    let pageHtml = fs.readFileSync(filePath, "utf-8");
    pageHtml = processPage(pageHtml, pageObj);
    callback(null, pageHtml);
  }

  function cleanUpParams(options) {
    delete options.cache;
    delete options._locals;
    delete options.settings;
    return options;
  }

  function getPageName(filePath) {
    return filePath.split("\\").at(-1).split(".page")[0];
  }

  async function createPageObject(pageName, params) {
    const obj = ServiceProvider.createPage(pageName, params);
    const data = await obj.data();
    return {
      object: obj,
      data: data
    };
  }

  function processPage(html, pageObj) {
    html = addForsAndIfs(html, pageObj.data);
    return fillInVariableValues(html, pageObj.data);
  }

  function fillInVariableValues(html, data) {
    return html.replace(/{{\s*([\w.]+)\s*}}/g, function (_replacer, p1) {
      let currentData = data;
      p1.split(".").forEach((field) => {
        currentData = currentData[field];
      });
      if (currentData === undefined) currentData = p1;
      return currentData;
    });
  }

  function addForsAndIfs(html, data) {
    return html.replace(
      /<\w+[^>]* \*for="(\w+ in \w+)"[^]*>[^]+<\/\w+ \*endFor>/g,
      (replacer, p1) => {
        const tagData = replacer.replace(` *for="${p1}"`, "");
        const array = p1.split(" in ")[1];
        const loopVar = p1.split(" in ")[0];
        let output = "";
        data[array].forEach((element) => {
          processedTagData = tagData.replace(
            /{{\s*([\w.]+)\s*}}/g,
            function (replacer, p1) {
              if (p1.startsWith(loopVar)) {
                let currentData = element;
                p1.split(".")
                  .slice(1)
                  .forEach((field) => {
                    currentData = currentData[field];
                  });
                if (currentData === undefined) currentData = p1;
                return currentData;
              }
              return replacer;
            }
          );
          output += processedTagData;
        });
        return output;
      }
    ).replace(
      /<\w+[^>]* \*if="(\w+)"[^>]*>[^<]*<\/\w+>/g,
      function (replacer, p1) {
        const tagData = replacer.replace(` *if="${p1}"`, "");
        if (data[p1]) return tagData;
        return "";
      }
    )
  }

  function toHtml(content, pageData, routedPage) {
    if (content.startsWith("@IGNORE@")) {
      return content.replace("@IGNORE@", "");
    }
    formIds = [];
    const result = content
      .toString()
      .replace(
        /<\w+[^>]* \*for="(\w+ in \w+)"[^]*>[^]+<\/\w+ \*endFor>/g,
        function (replacer, p1) {
          const tagData = replacer.replace(` *for="${p1}"`, "");
          const array = p1.split(" in ")[1];
          const loopVar = p1.split(" in ")[0];
          let output = "";
          pageData[array].forEach((element) => {
            processedTagData = tagData.replace(
              /{{\s*([\w.]+)\s*}}/g,
              function (replacer, p1) {
                if (p1.startsWith(loopVar)) {
                  let data = element;
                  p1.split(".")
                    .slice(1)
                    .forEach((field) => {
                      data = data[field];
                    });
                  if (data === undefined) data = p1;
                  return data;
                }
                return replacer;
              }
            );
            output += processedTagData;
          });
          return output;
        }
      )

      .replace(
        /<\w+[^>]* \*if="(\w+)"[^>]*>[^<]*<\/\w+>/g,
        function (replacer, p1) {
          const tagData = replacer.replace(` *if="${p1}"`, "");
          if (pageData[p1]) return tagData;
          return "";
        }
      )

      .replace(/<\w+-component><\/\w+-component>/g, function (replacer) {
        return includeComponent(
          getComponentName(replacer),
          pageData,
          routedPage
        );
      })
      .replace(
        /<\w+-component data="(\w+)"><\/\w+-component>/g,
        function (replacer, p1) {
          return includeComponent(
            getComponentName(replacer),
            pageData[p1],
            routedPage
          );
        }
      );
    return result;
  }

  function includeComponent(newComponent, data, routedPage) {
    let content = routedPage;
    if (newComponent != "routing") {
      content = toHtml(getFileContents(newComponent), data);
    }
    let onClickEvents = "";
    content.replace(
      /<[^>]*(id="\w+")[^>]*onclick="{([^}]+)}"/g,
      (replacer, p1, p2) => {
        const id = getDataBetween(p1, '"', '"');
        const onClickContent = p2;
        onClickEvents += `shadow${newComponent}.getElementById('${id}').addEventListener('click', () => {${onClickContent.replace(
          /document/g,
          `shadow${newComponent}`
        )}});`;
        return "";
      }
    );
    content = content.replace(/onclick="{([^}]+)}"/g, "");
    const result = `<div id="${newComponent}"></div>`;
    scriptLines.push(`let shadow${newComponent} = document.querySelector('#${newComponent}').attachShadow({ mode: "open" });
shadow${newComponent}.innerHTML = \`${content}\`;
${onClickEvents}`);
    return result;
  }

  function getDataBetween(data, start, end) {
    return data.split(start)[1].split(end)[0].replace(/\s/g, "");
  }

  function getComponentName(component) {
    return getDataBetween(component, "<", "-component");
  }

  function getFileContents(component) {
    return fs.readFileSync(
      `views/${component}/${component}.component`,
      "utf-8"
    );
  }
};