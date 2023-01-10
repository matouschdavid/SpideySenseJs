# SpideySenseJs

## Installation

Du benötigst [git](https://git-scm.com/downloads) und [node.js](https://nodejs.org/en/download/).
Die Standardeinstellungen der Installer müssen nicht geändert werden.

Navigiere anschließend in den Ordner in dem du das Projekt speichern willst. Öffne die **git bash** in dem du die Rechtemaustaste drückst und "Git Bash hier öffnen" drückst.
Führe anschließend diesen Befehl aus, um dir das Projekt zu klonen:

```cmd
git clone https://github.com/matouschdavid/SpideySenseJs.git
```

Anschließend müssen wir das SpideySense CLI Tool zum Pfad hinzufügen.
1. Suche nach "Systemumgebungsvariablen bearbeiten"
2. Klicke rechts unten auf "Umgebungsvariablen..."
3. Suche in der unteren Liste nach "Path" und doppelklicke diesen Eintrag
4. Kopiere dir den Pfad für den Ordner "\SpideySenseJs\SpideySense\SpideySense\bin\Debug\net6.0" (z.B: C:\Projects\SpideySenseJs\SpideySense\SpideySense\bin\Debug\net6.0)
5. Zurück im Umgebungsvariablenmenü klicke rechts auf neu und kopiere deinen Pfad hinein.

## Get Started

Öffne den "/src" Ordner dieses Projekts in einem Editor deiner Wahl.
Als erstes musst du alle Abhängigkeiten die dieses Projekt benötigt herunterladen:
```cmd
npm install
```
Um dieses Projekt zu starten, musst du den folgenden Befehl eingeben:

```cmd
spideysense start
```

Gehe anschließend auf die Url die angezeigt wird. Du solltest die Home-Seite sehen. Jede Seite besteht aus einer .page Datei, in der eine .css Datei verlinkt ist und in der du dynamisch Daten aus der .js Datei laden kannst.

### .css Datei

Dies ist eine ganz normale .css Datei wie du sie gewohnt bist.

### .js Datei

Hier findest du den größten Unterschied zu der Art und Weise, wie du bisher Webseiten entwickelt hast. Diese .js Datei führt Code nämlich am Server aus, nicht wie bisher auf dem Client. Dadurch ändern sich ein paar Sachen um die du dir jedoch noch keine Gedanken machen musst.

Die .js Datei ist simpel aufgebaut. Es ist nur eine Klasse mit einem Konstruktor und einer data() Methode. Die Data Methode gibt ein JsObject zurück und alle Felder dieses Objekts sind anschließend für deine .page Datei verfügbar. Du kannst jederzeit neue Funktionen hinzufügen zu dieser Klasse.

### .html Datei

Hier kannst du ganz normalen html Code schreiben. Zusätzlich dazu kannst du jedoch auch auf die Variablen deiner data() Funktion zugreifen. Auf Variablen zugreifen tust du, in dem du den Namen der Variable mit {{ }} umschließt.
```js
...
data() {
        return {
            title: "Calculator",
        };
    }
...

```
```html
...
<p>{{title}}</p>
...
```

Wenn du in deiner .js Datei ein Array an Werten hast, kannst du über diese Elemente iterieren und html Elemente erzeugen lassen.
```js
//calculator.js
...
data() {
        return {
            title: "Calculator",
            myValues: [
              'hello',
              'world',
              '!'
            ]
        };
    }
...

```
```html
<!-- calculator.page -->
...
<p *for="currentValue in myValues">{{currentValue}}</p *endFor>
...
```
Erzeugt werden 3 p Tags mit den Werten: hello, world und ! .

Auch ifs können erstellt werden, um Elemente nur in bestimmten Fällen anzuzeigen.
```js
//calculator.js
...
data() {
        return {
            title: "Calculator",
            shouldDisplay: false
        };
    }
...

```
```html
<!-- calculator.page -->
...
<p *if="shouldDisplay">Sometimes hidden</p>
...
```
Die Bedingung muss ein Feld in der data() Funktion sein.

Abschließend kannst du jedem Element ein Click Event mitgeben, wie im normalen html auch.
Der Unterschied ist jedoch, dass diese Funktion nun am Server ausgeführt wird. Also in deiner .js Datei und nicht am Client wie bisher.
```js

//calculator.js
...
addRegion(newRegion) {
        //Persist region in any way
    }
...
```
```html
<!-- calculator.page -->
...
<button id="newRegionBtn" (click)="addRegion('Linz')">Add new region</button>
...
```
Mit (click) kannst du eine Funktion angeben, die am Server ausgeführt werden soll. onclick Funktioniert weiterhin für Clientfunktionen.

**Das zu klickende Element muss! eine id vor dem Click zugewiesen bekommen**

Aktuell wird jedoch immer Linz hardgecoded übergeben. Um dies dynamisch zu gestalten, könntest du ein input Feld erzeugen und diesen Wert übergeben.
```html
<!-- calculator.page -->
...
<!-- normales input Feld -->
<input id="newRegion" name="newRegion"/>
<button id="newRegionBtn" (click)="addRegion(*newRegion)">Add new region</button>
...
```

Mit einem * vor der id eines inputFelds kann der eingegebene Wert dynamisch übergeben werden.

### Links

Links werden normal über den a Tag erstellt. Ein Link zu einer anderen Seite kann Parameter mitbekommen, die im Konstruktor der neuen Seite abrufbar sind.
html der "alten" Seite:
```html
<a href="/newsite/?myvalue={{valueFromOldSite}}">Click me</a>
```

js der "neuen" Seite
```js
//newsite.js
constructor(params) {
        console.log(params.myvalue);
    }
   ```
   
 ## CLI Tool
 
 Zu Beginn hast du eine Umgebungsvariable für das CLI Tool anlegen müssen, aber was kann dieses Tool?
 
 1. Projekt starten
    - spideysense start
 2. Page erstellen
    - spideysense page myNewPage
 3. Komponente erstellen (soon)
    - spideysense component myNewComponent

 Wenn du Änderungen hast, musst du den spideysense start Befehl mit Strg+C beenden und Neustarten. Wenn ein Fehler auftritt, wiederhole diese Schritte.
 Eine Komponente ist ein Teil einer Seite und kann mit \<nameOfComponent-component></nameOfComponent-component> eingebunden werden. Diese Komponente kann auf die selben Daten wie die Seite zugreifen.
 Um dies einzuschränken kannst du \<nameOfComponent-component data="mySmallerData"></nameOfComponent-component> einbinden. mySmallerData muss ein Javascript Objekt in der data Funktion sein.
