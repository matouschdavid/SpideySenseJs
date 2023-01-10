// See https://aka.ms/new-console-template for more information
var type = args[0].ToLower();
if (type == "run" || type == "r")
{
    var strCmdText = "/C node ../framework/index.js";
    System.Diagnostics.Process.Start("CMD.exe", strCmdText);
    return;
}
var name = args[1].ToLower();

if (type == "component" || type == "c")
{
    Directory.CreateDirectory($"./views/{name}");
    var fs = File.CreateText($"./views/{name}/{name}.component");
    fs.WriteLine($"<link rel=\"stylesheet\" href=\"/views/{name}/{name}.css\">\n<link rel=\"stylesheet\" type=\"text/css\" href=\"../../styles.css\">\n" + "<!-- TODO ADD YOUR MARKUP HERE -->");
    fs.Close();
    Console.WriteLine($"/views/{name}/{name}.component    ...    was created");
    fs = File.CreateText($"./views/{name}/{name}.css");
    fs.Close();
    Console.WriteLine($"/views/{name}/{name}.css    ...    was created");
    return;
}

if (type == "page" || type == "p")
{
    Directory.CreateDirectory($"./views/{name}");
    var fs = File.CreateText($"./views/{name}/{name}.page");
    fs.WriteLine($"<link rel=\"stylesheet\" href=\"/views/{name}/{name}.css\">\n<link rel=\"stylesheet\" type=\"text/css\" href=\"../../styles.css\">\n" + "<!-- TODO ADD YOUR MARKUP HERE -->\n<p>{{title}} works</p>");
    fs.Close();
    Console.WriteLine($"/views/{name}/{name}.page    ...    was created");

    fs = File.CreateText($"./views/{name}/{name}.css");
    fs.Close();
    Console.WriteLine($"/views/{name}/{name}.css    ...    was created");

    var nameWithUpper = char.ToUpper(name[0]) + name.Substring(1);
    fs = File.CreateText($"./views/{name}/{name}.js");
    fs.WriteLine("const ServiceProvider = require(\"../../../framework/service_provider\");\n" +
        $"module.exports = class {nameWithUpper} {{\n" +
        "constructor(params) { }\n" +
        "data() {\n" +
        "return {\n" +
        $"title: \"{nameWithUpper}\"\n" +
        "};\n" +
        "}\n" +
        "};");
    fs.Close();
    Console.WriteLine($"/views/{name}/{name}.js    ...    was created");

    var content = File.ReadAllText("./register.js");
    content = $"const {nameWithUpper} = require(\"./views/{name}/{name}\"); \n{content.Substring(0, content.Length - CharacterCountToEnd(content))} ServiceProvider.addScoped(\"{name}\", (params) => {{return new {nameWithUpper}(params);}});\n}};";
    File.WriteAllText("./register.js", content);
    Console.WriteLine($"/views/{name}/{name}.js    ...    was registered");
    content = File.ReadAllText("./routing.js");
    content = $"{content.Substring(0, content.Length - CharacterCountToEnd(content))} ,{{path: '/{name}', component: '{name}'}}\n];";
    File.WriteAllText("./routing.js", content);
    Console.WriteLine($"/views/{name}/{name}.js    ...    was added as a route /{name}");
    return;
}

if (type == "service" || type == "s")
{
    Directory.CreateDirectory($"./services/");
    var fs = File.CreateText($"./services/{name}_service.js");
    var nameWithUpper = char.ToUpper(name[0]) + name.Substring(1);

    fs.WriteLine($"module.exports = class {nameWithUpper}Service {{}}");
    fs.Close();
    Console.WriteLine($"/services/{name}_service.js    ...    was created");

    var content = File.ReadAllText("./register.js");
    content = $"const {nameWithUpper}Service = require(\"./services/{name}_service\"); \n{content.Substring(0, content.Length - CharacterCountToEnd(content))} ServiceProvider.addScoped(\"{name}Service\", () => {{return new {nameWithUpper}Service();}});\n}};";
    File.WriteAllText("./register.js", content);
    Console.WriteLine($"/services/{name}_service.js    ...    was registered");
    return;
}

int CharacterCountToEnd(string content)
{
    return content.Reverse().TakeWhile(x => x != ';' && x != ']' && x != '}').Count() + 2;
}