const ServiceProvider = require("./service_provider");

module.exports.initEngine = function (app) {
  const fs = require("fs"); // this engine requires the fs module
  app.engine("page", render);

  app.set("views", "./views"); // specify the views directory
  app.set("view engine", "page"); // register the template engine

  async function render(filePath, options, callback) {
    delete options.cache;
    delete options._locals;
    delete options.settings;
    const pageName = filePath.split("\\").at(-1).split(".page")[0];
    const obj = ServiceProvider.createPage(pageName, options);
    const content = fs.readFileSync(filePath, "utf-8");
    const data = await obj.data();
    let rendered = "";
    if (content.startsWith("@IGNORE@")) {
      rendered = toHtml(content, data, pageName);
      callback(null, rendered);
      return;
    } else {
      rendered = toHtml(content, data, pageName);
    }
    const indexContent = fs.readFileSync("./index.html", "utf-8");
    const indexRendered = toHtml(indexContent, data, rendered);

    callback(null, indexRendered);
  }

  function toHtml(content, pageData, routedPage) {
    if (content.startsWith("@IGNORE@")) {
      return content.replace("@IGNORE@", "");
    }
    const result = content
      .toString()
      .replace(
        /<\w+[^>]* \(click\)="(\w+\((\*?[^<>]+\s*,?\s*)*\))"[^>]*>[^<]*<\/\w+>/g,
        function (replacer, p1) {
          const params = getDataBetween(p1, "(", ")");
          let paramsList = "";
          let clientParams = [];
          params.split(",").forEach((element) => {
            let value = "";
            if (element.startsWith("*")) {
              value = `tbd`;
              clientParams.push(element);
              startIndex = 1;
            } else {
              value = element.replaceAll("'", "").replaceAll('"', "");
              startIndex = 0;
            }
            paramsList += `<input hidden id="${element}" name="${element.substring(
              startIndex
            )}" value="${value}" />`;
          });
          let clientParamsText = "";
          clientParams.forEach((param) => {
            clientParamsText += `document.getElementById('${param}').value = document.getElementById('${param.substring(
              1
            )}').value;`;
          });

          const tagData = replacer.replace(
            `\(click\)="${p1}"`,
            `onclick="{
                ${clientParamsText}
                document.getElementById('${p1.split("(")[0]}Form').submit();}"`
          );
          p1 = p1.split("(")[0];
          const result = `  <form id="${p1}Form" action="/${routedPage}" method="post">
                                <input hidden name="onclick" value="${p1}" />
                                <input hidden name="params" value="${params}" />
                                ${paramsList}
                                ${tagData}
                            </form>`;
          return result;
        }
      )
      .replace(
        /<\w+[^>]* \*for="(\w+ in \w+)"[^>]*>[^<]*<\/\w+>/g,
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
      .replace(/{{\s*([\w.]+)\s*}}/g, function (replacer, p1) {
        let data = pageData;
        p1.split(".").forEach((field) => {
          data = data[field];
        });
        if (data === undefined) data = p1;
        return data;
      })
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
    const result = `<div id="${newComponent}"></div><script>
    let shadow${newComponent} = document.querySelector('#${newComponent}').attachShadow({ mode: "open" });
    shadow${newComponent}.innerHTML = \`${content}\`;
    ${onClickEvents}
</script>`;
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