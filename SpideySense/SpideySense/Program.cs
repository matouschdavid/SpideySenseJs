// See https://aka.ms/new-console-template for more information
var type = args[0].ToLower();
if (type == "start")
{
    var strCmdText = "/C node ../framework/index.js";
    System.Diagnostics.Process.Start("CMD.exe", strCmdText);
    return;
}
var name = args[1].ToLower();

if(type == "component")
{
    Directory.CreateDirectory($"./views/{name}");
    var fs = File.CreateText($"./views/{name}/{name}.component");
    fs.WriteLine("<!-- TODO ADD YOUR MARKUP HERE -->");
    fs.Close();
    return;
}

if(type == "page")
{
    Directory.CreateDirectory($"./views/{name}");
    var fs = File.CreateText($"./views/{name}/{name}.page");
    fs.WriteLine($"<link rel=\"stylesheet\" href=\"/views/{name}/{name}.css\">\n" + "<!-- TODO ADD YOUR MARKUP HERE -->\n<p>{{title}} works</p>");
    fs.Close();

    fs = File.CreateText($"./views/{name}/{name}.css");
    fs.Close();

    var nameWithUpper = char.ToUpper(name[0]) + name.Substring(1);
    fs = File.CreateText($"./views/{name}/{name}.js");
    fs.WriteLine($"module.exports = class {nameWithUpper} {{" +
        "constructor(params) { }" +
        "data() {" +
        "return {" +
        $"title: \"{nameWithUpper}\"" +
        "};" +
        "}" +
        "}; ");
    fs.Close();

    var content = File.ReadAllText("./register.js");
    content = $"const {nameWithUpper} = require(\"./views/{name}/{name}\"); \n{content.Substring(0, content.Length - CharacterCountToEnd(content))} ServiceProvider.register(\"{name}\", (params) => {{return new {nameWithUpper}(params);}});\n}};";
    File.WriteAllText("./register.js", content);

    content = File.ReadAllText("./routing.js");
    content = $"{content.Substring(0, content.Length - CharacterCountToEnd(content))} ,{{path: '/{name}', component: '{name}'}}\n];";
    File.WriteAllText("./routing.js", content);
    return;
}

if(type == "service")
{
    Directory.CreateDirectory($"./services/");
    var fs = File.CreateText($"./services/{name}_service.js");
    var nameWithUpper = char.ToUpper(name[0]) + name.Substring(1);

    fs.WriteLine($"module.exports = class {nameWithUpper}Service {{}}");
    fs.Close();

    var content = File.ReadAllText("./register.js");
    content = $"const {nameWithUpper}Service = require(\"./services/{name}_service\"); \n{content.Substring(0, content.Length - CharacterCountToEnd(content))} ServiceProvider.register(\"{name}Service\", () => {{return new {nameWithUpper}Service();}});\n}};";
    File.WriteAllText("./register.js", content);
    return;
}

int CharacterCountToEnd(string content)
{
    return content.Reverse().TakeWhile(x => x != ';' && x != ']' && x != '}').Count() + 2;
}