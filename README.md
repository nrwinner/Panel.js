# Panel.js
Panel.js is a vanilla JavaScript plugin for creating and managing panels that slide from either the left or the right side.
 The PanelManager keeps track of panels as they're added and removed.
 
# Initializing
Import the panel.js file into your HTML.

In your javascript, initialize the plugin:
```Javascript
var panelManager = new PanelManager("../helpers/panel.css", false);
panelManager.setAlignment("right");
```

The first argument of ```PanelManager``` points to the css file, the second argument sets collapsed mode on/off. By default, collapsed mode is off. Disclaimer, collasped mode is in DEVELOPMENT and is not currently stable. Recommended to keep that feature off.

The second line sets the alignment, which is the side from which the panels will come. Can be either ```right``` or ```left```

# Adding a panel in Panel.js
To add a panel, you can do
```Javascript
panelManager.addPanel("divId", 450);
```

The first argument is the ID of an existing DOM element, the second element is the width of the panel in pixels.

You can add multiple panels by using the ```addPanels``` function and passing a nested array like
```Javascript
panelManager.addPanels({{id: "panelID", width: 450}, {id: "anotherPanelId", 500}});
```

# Deleting a panel in Panel.js
Panel.js has several ways of deleting panels. You can delete any panel with
```Javascript
panelManager.closePanel(1);
```

Note: ```closePanel``` can close any open panel, regardless of it's position in the stack, and takes an index, not a panel id. To close the most recently added, do
```Javascript
panelManager.pop();
```

You can also close all open panels with
```Javascript
panelManager.closeAll();
```

# Utility functions
You can search for a panels position in the PanelManager array 
```Javascript
panelManager.getPanel("panelID")
```
